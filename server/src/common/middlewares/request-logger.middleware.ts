import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;

      this.logger.log({
        message: 'HTTP Request',
        meta: {
          method: req.method,
          url: req.originalUrl,
          status: statusCode,
          contentLength: parseInt(res.get('content-length') || '0'),
          responseTime,
          userAgent,
          ip: req.ip,
          timestamp: new Date().toISOString(),
        },
      });
    });

    next();
  }
}
