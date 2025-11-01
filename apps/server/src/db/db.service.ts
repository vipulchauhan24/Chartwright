import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { POSTGRES_ERROR_CODES } from '../lib/constants';

@Injectable()
export class DBService {
  validatePostgresError(error: { code: string | number }) {
    switch (error?.code) {
      case POSTGRES_ERROR_CODES.DUPLICATE_KEY:
        // Handle unique constraint violation (duplicate key)
        throw new ConflictException('Found dulicate entries.');
      case POSTGRES_ERROR_CODES.INVALID_VALUE:
        // Handle unique constraint violation (duplicate key)
        throw new BadRequestException('Found invalid input value.');

      default:
        break;
    }
  }
}
