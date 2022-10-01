const generateError = (code: string, message: string) => ({
  error: { code, message },
});

export const METHOD_NOT_ALLOWED = generateError(
  "Method not allowed",
  "method_not_allowed"
);

export const INVALID_CREDENTIALS = generateError(
  "Invalid credentials",
  "invalid_credentials"
);

export const DUPLICATE_CITIZEN_ID = generateError(
  "The citizen ID is already in use",
  "duplicate_citizen_id"
);

export const NO_STUDENT_FOUND = generateError(
  "No student found with the given citizen ID",
  "no_student_found"
);

export const INTERNAL_SERVER_ERROR = generateError(
  "Internal server error",
  "internal_server_error"
);
