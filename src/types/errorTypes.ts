export type ApiError = {
  code: number;
  message: string;
  json: {
    reason: string;
  };
};

export const isApiError = (err: unknown): err is ApiError => {
  return (err as ApiError).json !== undefined;
};
