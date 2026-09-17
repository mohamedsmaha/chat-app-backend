import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

import { WsException } from '@nestjs/websockets';

@Catch()
export class WsExceptionFilter implements ExceptionFilter {

  catch(exception: any, host: ArgumentsHost) {

    const client = host.switchToWs().getClient();

    let message = 'Internal server error';

    if (exception instanceof WsException) {

      const error = exception.getError();

      if (typeof error === 'string') {
        message = error;
      } else {
        const wsError = error as {
          message?: string;
        };

        message =
          wsError.message ?? 'WebSocket error';
      }

    } else if (exception?.response?.message) {

      message = Array.isArray(exception.response.message)
        ? exception.response.message.join(', ')
        : exception.response.message;

    } else if (exception?.message) {

      message = exception.message;
    }

    client.emit('ws_error', {
      message,
    });
  }
}