export class OperationResult<TResult> {
  public static fromError(error: any): OperationResult<any> {
    return {
      success: false,
      errorType: error.name,
      errorDescription: error.message,
    };
  }

  public success: boolean;
  public result?: TResult;
  public errorType?: string;
  public errorDescription?: string;
}
