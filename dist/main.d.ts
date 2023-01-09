/// <reference types="node" />
import { Config, PdfRequest } from "./types.js";
declare const initialise: (additionalConfig?: Config) => Promise<({ document, data }: PdfRequest) => Promise<Buffer>>;
export default initialise;
