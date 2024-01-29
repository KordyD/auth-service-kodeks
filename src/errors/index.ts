import { ValidationError } from 'express-validator';

export class APIError extends Error {
  public status;
  public errors;
  constructor(status: number, message: string, errors: ValidationError[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new APIError(401, 'User is not authorized');
  }
  static BadRequestError(message: string, errors: ValidationError[] = []) {
    return new APIError(403, message, errors);
  }
}
