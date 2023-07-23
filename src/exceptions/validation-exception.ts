import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor() {
    super('Failed validation', HttpStatus.BAD_REQUEST);
  }
}
