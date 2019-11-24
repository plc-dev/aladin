class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.message = message;
  }
}

class PermissionError extends Error {
  constructor(message) {
    super(message);
    this.name = "PermissionError";
    this.message = message;
  }
}

module.exports = {
  ValidationError,
  PermissionError
};
