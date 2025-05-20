/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import { catchError, firstValueFrom, map } from 'rxjs';
interface FreeImageHostSuccessResponse {
  status_code: number; // Typically 200 for success
  // image might be nested
  image: {
    name: string;
    extension: string;
    size: number;
    width: number;
    height: number;
    date: string;
    expiration: string | null;
    adult: number;
    status: string;
    filename: string;
    url: string; // This is likely what you want
    url_short: string;
    url_viewer: string;
    url_viewer_thumb: string;
    url_viewer_medium: string;
    thumb: {
      filename: string;
      name: string;
      url: string;
      // ... other thumb properties
    };
    medium?: {
      // Medium might be optional
      filename: string;
      name: string;
      url: string;
      // ... other medium properties
    };
    display_url?: string; // Often an alias or specific URL for embedding
    // ... any other fields they return
  };
  // ... any other top-level fields
}

// Define the structure of an error response (if they have a consistent one)
interface FreeImageHostErrorResponse {
  status_code: number;
  status_txt?: string;
  error?: {
    message: string;
    code: number;
  };
  // ... any other error fields
}

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly API_KEY: string;
  private readonly UPLOAD_URL = 'https://freeimage.host/api/1/upload';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.API_KEY = this.configService.get('IMAGE_UPLOAD_API_KEY') as string;
  }
  private async _uploadSingleFileToHost(
    file: Express.Multer.File,
    attempt: number = 1,
  ): Promise<string> {
    if (!this.API_KEY) {
      this.logger.error(
        'Attempted to upload image without FREEIMAGEHOST_API_KEY configured.',
      );
      throw new InternalServerErrorException(
        'Image upload service is not configured.',
      );
    }

    const form = new FormData();
    form.append('source', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    form.append('key', this.API_KEY);

    this.logger.log(
      `Uploading ${file.originalname} (Attempt ${attempt}) to ${this.UPLOAD_URL}`,
    );

    try {
      const response = await firstValueFrom(
        this.httpService
          .post<FreeImageHostSuccessResponse | FreeImageHostErrorResponse>(
            this.UPLOAD_URL,
            form,
            {
              headers: { ...form.getHeaders() },
              timeout: 20000, // Increased timeout for potentially slower uploads
            },
          )
          .pipe(
            map((axiosResponse) => axiosResponse.data),
            catchError((error) => {
              this.logger.error(
                `Axios error uploading ${file.originalname}: ${error.message}`,
                error.stack?.substring(0, 500),
              );
              if (error.response?.data) {
                this.logger.error(
                  'Error response data from host:',
                  error.response.data,
                );
                const errorData = error.response
                  .data as FreeImageHostErrorResponse;
                const errorMessage =
                  errorData.error?.message ||
                  errorData.status_txt ||
                  'Unknown error from image host.';
                // Do not throw BadRequestException here directly, let the caller decide based on context (single vs bulk)
                throw new Error(
                  `Image host error: ${errorMessage} (Status: ${error.response.status || 'N/A'})`,
                );
              }
              throw new Error(
                'Image upload failed due to a network or server error with the image host.',
              );
            }),
          ),
      );

      const data = response as FreeImageHostSuccessResponse; // Assume success structure first
      this.logger.log(
        `Response for ${file.originalname}: Status ${data.status_code}`,
      );

      if (data.status_code !== 200 || !data.image || !data.image.url) {
        this.logger.error(
          `Upload of ${file.originalname} failed or missing URL in response.`,
          data,
        );
        const errorMessage =
          (response as FreeImageHostErrorResponse).error?.message ||
          (response as FreeImageHostErrorResponse).status_txt ||
          'Upload reported as failed by image host.';
        throw new Error(
          `Image upload failed: ${errorMessage} (API Status: ${data.status_code || 'N/A'})`,
        );
      }

      return data.image.display_url || data.image.url; // Return the chosen URL
    } catch (error) {
      // This error is now either from the catchError pipe or the explicit throws above
      this.logger.error(
        `_uploadSingleFileToHost failed for ${file.originalname}: ${error.message}`,
      );
      throw error; // Re-throw the processed error
    }
  }
  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      this.logger.error('uploadImage called with no file or empty buffer.');
      throw new BadRequestException('No file content provided for upload.');
    }
    try {
      const imageUrl = await this._uploadSingleFileToHost(file);
      this.logger.log(
        `Successfully uploaded ${file.originalname}. URL: ${imageUrl}`,
      );
      return imageUrl;
    } catch (error) {
      // Convert generic errors from _uploadSingleFileToHost to specific HTTP exceptions for controller
      this.logger.error(
        `uploadImage public method caught error for ${file.originalname}: ${error.message}`,
      );
      if (
        error.message.includes('Image host error') ||
        error.message.includes('Image upload failed')
      ) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during image upload.',
      );
    }
  }

  /**
   * Public method to upload multiple images.
   * It calls uploadImage for each file.
   * Returns an array of objects with original filename and its URL or error.
   */
  async bulkUploadImages(
    files: Array<Express.Multer.File>,
  ): Promise<Array<{ originalName: string; url?: string; error?: string }>> {
    if (!files || files.length === 0) {
      this.logger.warn('bulkUploadImages called with no files.');
      return [];
    }

    this.logger.log(`Starting bulk upload for ${files.length} images.`);

    const uploadResults = await Promise.allSettled(
      files.map((file) => this.uploadImage(file)), // Use the public uploadImage for consistent error handling
    );

    return files.map((file, index) => {
      const result = uploadResults[index];
      if (result.status === 'fulfilled') {
        this.logger.log(
          `Bulk: Successfully uploaded ${file.originalname}. URL: ${result.value}`,
        );
        return { originalName: file.originalname, url: result.value };
      } else {
        // result.reason is the error thrown by uploadImage
        this.logger.error(
          `Bulk: Failed to upload ${file.originalname}: ${result.reason.message || result.reason}`,
        );
        return {
          originalName: file.originalname,
          error: result.reason.message || 'Unknown upload error',
        };
      }
    });
  }
}
