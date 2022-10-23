export const RecordModelNames = [
  "school",
  "class",
  "student",
  "admin",
  "test",
  "testResult",
] as const;

export type RecordModel = typeof RecordModelNames[number];

export const RecordModelPluralDisplayNames = {
  school: "Okullar",
  class: "Sınıflar",
  student: "Öğrenciler",
  admin: "Yöneticiler",
  test: "Denemeler",
  testResult: "Sonuçlar",
};
