import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { Logger } from '@nestjs/common';
export interface IErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter<Error> {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    // console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response<IErrorResponse>>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let exceptionName = 'UnknownException';

    // Handle HTTP exceptions (including ValidationPipe errors)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      // Extract detailed validation messages from class-validator
      if (typeof errorResponse === 'object' && 'message' in errorResponse) {
        message = Array.isArray(errorResponse.message)
          ? errorResponse.message.join('; ')
          : (errorResponse.message as string);
      } else {
        message = exception.message;
      }

      exceptionName = exception.constructor.name;
    }
    // Handle generic errors
    else if (exception instanceof Error) {
      message = exception.message;
      exceptionName = exception.constructor.name;
    }

    this.logger.error(
      `Exception: ${exceptionName} - ${message}\n` +
        `Path: ${request.url}\n` +
        `Stack: ${exception instanceof Error ? exception.stack : 'No stack trace'}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    } satisfies IErrorResponse);
  }
}
