import { readFileSync } from "fs"

const readFile = (fullPath: string): string =>
  readFileSync(fullPath, "utf-8");

const encodeToBase64 = (data: string): string => {
  return Buffer.from(data).toString("base64");
};

export {
  readFile,
  encodeToBase64
};
