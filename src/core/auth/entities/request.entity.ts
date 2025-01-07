import { Request as RequestExpress } from 'express';
import { JwtPayload } from './payload.entity';

export interface Request extends RequestExpress {
  user: JwtPayload;
}
