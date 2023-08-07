class GenericError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly needsTranslation: boolean = false,
  ) {
    super();
    this.message = message;
    this.code = code;
  }
}

export default GenericError;
