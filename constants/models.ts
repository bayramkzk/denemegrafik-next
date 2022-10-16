export const DatabaseModels = {
  organization: "organization",
  group: "group",
  profile: "profile",
  user: "user",
  test: "test",
  testResult: "testResult",
};

export type DatabaseModel = keyof typeof DatabaseModels;

export const DatabaseModelPluralDisplayNames = {
  [DatabaseModels.organization]: "Okullar",
  [DatabaseModels.group]: "Sınıflar",
  [DatabaseModels.profile]: "Öğrenciler",
  [DatabaseModels.user]: "Kullanıcılar",
  [DatabaseModels.test]: "Deneme sınavları",
  [DatabaseModels.testResult]: "Deneme sonuçları",
};
