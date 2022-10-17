import { AuthCustomErrorResponse } from "@/types/auth";

const generateError = (
  code: string,
  message: string
): AuthCustomErrorResponse => ({
  error: { code, message },
  success: false,
});

export const METHOD_NOT_ALLOWED = generateError(
  "method_not_allowed",
  "Metod geçerli değil."
);

export const INVALID_CREDENTIALS = generateError(
  "invalid_credentials",
  "Kimlik bilgileri geçersiz."
);

export const DUPLICATE_CITIZEN_ID = generateError(
  "duplicate_citizen_id",
  "Kimlik numarası zaten kullanımda."
);

export const NO_STUDENT_FOUND = generateError(
  "no_student_found",
  "Verilen kimlik numarasına ait öğrenci bulunamadı."
);

export const INTERNAL_SERVER_ERROR = generateError(
  "internal_server_error",
  "Bilinmeyen bir sunucu hatası oluştu."
);

export const UNAUTHORIZED = generateError(
  "unauthorized",
  "Bu işlemi gerçekleştirmek için yetkiniz yok."
);

export const INVALID_MODEL_NAME = generateError(
  "invalid_model",
  "Geçersiz veri tabanı modeli adı!"
);
