import { serialize, deserialize } from "bson";
import axios from "axios";
import { ModuleConfig } from "../classes/moduleConfig";

export default function fetchPictures(route: string, data: {paths:string[], options: ModuleConfig}): Promise<string[]> {
    return axios({
        method: 'post',
        url: route,
        data: serialize(data),
        headers: {
            'Content-Type': 'application/octet-stream'
        }
    }).then(res => {
        let bson = Buffer.from( res.data );
        const bsonObj = deserialize(bson);
        return bsonObj.pictures;
    })
}