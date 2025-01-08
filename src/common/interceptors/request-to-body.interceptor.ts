import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'src/core/auth/entities/request.entity';

@Injectable()
export class RequestToBodyInterceptor implements NestInterceptor {
  constructor(
    private requestAttribute: string,
    private bodyAttribute: string
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest() as Request;

    const requestAttributeValue = this.getNestedValues(
      request,
      this.requestAttribute
    );

    if (requestAttributeValue) {
      request.body[this.bodyAttribute] = requestAttributeValue;
    }

    return next.handle();
  }

  private getNestedValues(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }
}
