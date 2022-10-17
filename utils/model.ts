import {
  DatabaseModel,
  DatabaseModelPluralDisplayNames,
} from "@/constants/models";

type Querystring = string | string[] | undefined;

export const validateModelQuery = (modelQueryString: Querystring) => {
  const model = modelQueryString as string | undefined;

  if (model && Object.keys(DatabaseModelPluralDisplayNames).includes(model)) {
    return model as DatabaseModel;
  }

  return null;
};
