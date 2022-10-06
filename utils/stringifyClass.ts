import { Class } from "@prisma/client";

const stringifyClass = (cls: Class) => `${cls.grade} / ${cls.branch}`;

export default stringifyClass;
