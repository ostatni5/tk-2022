import { serialize, deserialize } from 'bson';

export interface ImagesRequest {
    path: string;
    moduleOptions: { name: string }[];
}
export interface ImagesResponse {
    pictures: string[];
}

export const sendRequest = (
    request: ImagesRequest,
    callback: (response: ImagesResponse) => void,
) => {
    let chunks: Uint8Array = new Uint8Array();
    fetch('http://127.0.0.1:8082/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        body: serialize(request),
    })
        .then(async (res) => {
            const reader = res.body.getReader();

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                chunks = new Uint8Array([...chunks, ...value]);
            }
        })
        .then(() => {
            const arrayBuffer = chunks.buffer.slice(
                chunks.byteOffset,
                chunks.byteLength + chunks.byteOffset,
            );
            const response: ImagesResponse = deserialize(arrayBuffer) as ImagesResponse;
            callback(response);
        });
};
