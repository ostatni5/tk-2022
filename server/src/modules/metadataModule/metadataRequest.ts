import { deserialize } from "bson";
import MetadataOptions from "./metadataOptions";

export default class MetadataRequest {
    paths: string[];
    options: MetadataOptions;

    constructor(buffer: Buffer) {
        const { paths, options } = deserialize(buffer);
        
        this.paths = paths;
        this.options = options;
    }
}
