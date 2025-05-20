import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { Logger } from '@nestjs/common';
import { IErrorResponse } from './global-exception.filter';
import {
  MongoServerError,
  MongoError,
  MongoNetworkError,
  MongoServerSelectionError,
} from 'mongodb';

@Catch(
  Error.ValidationError,
  Error.CastError,
  Error.DocumentNotFoundError,
  MongoServerError,
  MongoError,
  MongoNetworkError,
)
export class MongooseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MongooseExceptionFilter.name);

  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response<IErrorResponse>>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    if (exception instanceof MongoServerError && exception.code === 11000) {
      status = HttpStatus.CONFLICT;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const field = Object.keys(exception.keyValue)[0];
      message = `A document with this ${field} already exists!`;
    } else if (exception instanceof Error.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.handleValidationError(exception);
    } else if (exception instanceof Error) {
      switch (exception.name) {
        case 'CastError':
          status = HttpStatus.BAD_REQUEST;
          message = 'Invalid data format';
          break;
        case 'DocumentNotFoundError':
          status = HttpStatus.NOT_FOUND;
          message = 'Resource not found';
          break;
      }
    } else if (exception instanceof MongoServerSelectionError) {
      message = 'Database connection error';
    }

    this.logger.error(
      `Mongoose Error: ${exception.name} - ${message}\n` +
        `Path: ${request.url}\n` +
        `Stack: ${exception.stack}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    } satisfies IErrorResponse);
  }

  private handleValidationError(error: Error.ValidationError): string {
    const messages = Object.values(error.errors).map((err) => err.message);
    return `Validation failed: ${messages.join(', ')}`;
  }
}
