export function NotFoundException() {};

export class ValidationException {
  constructor(errors) {
    this.errors = errors;
  }
};