import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = file.originalname.split('.').pop();
          const filename = `${uniqueSuffix}.${extension}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
