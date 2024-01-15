class api_error extends Error {
  constructor(
    status_code,
    message = "Something went wrong",
    error = [],
    stack = ""
  ) {
    super(message);
    this.status_code = status_code;
    this.data = null;
    this.message = message;
    this.success = false;
    this.error= error;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export { api_error };
