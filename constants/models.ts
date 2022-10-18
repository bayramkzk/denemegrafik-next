export const RecordModels = {
  organization: "organization",
  group: "group",
  profile: "profile",
  user: "user",
  test: "test",
  testResult: "testResult",
};

export type RecordModel = keyof typeof RecordModels;

export const RecordModelPluralDisplayNames = {
  [RecordModels.organization]: "Okullar",
  [RecordModels.group]: "Sınıflar",
  [RecordModels.profile]: "Öğrenciler",
  [RecordModels.user]: "Kullanıcılar",
  [RecordModels.test]: "Denemeler",
  [RecordModels.testResult]: "Sonuçlar",
};
