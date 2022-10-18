import { RecordModel, RecordModelPluralDisplayNames } from "@/constants/models";

type Querystring = string | string[] | undefined;

export const validateModelQuery = (modelQueryString: Querystring) => {
  const model = modelQueryString as string | undefined;

  if (model && Object.keys(RecordModelPluralDisplayNames).includes(model)) {
    return model as RecordModel;
  }

  return null;
};
