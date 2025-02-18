import { Catch, BadRequestException, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(BadRequestException)
export class WsBadRequestFilter extends BaseWsExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const properException = new WsException(exception.getResponse());
    super.catch(properException, host);
  }
}
