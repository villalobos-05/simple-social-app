import { UUID } from 'crypto';
import { Request } from '../entities/request.entity';

export interface RefreshDto extends Request {
  headers: Request['headers'] & { 'x-refresh-token': UUID };
}
