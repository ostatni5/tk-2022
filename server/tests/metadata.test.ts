import supertest from 'supertest';
import { serialize, deserialize } from 'bson';
import metadata from '../src/modules/metadataModule/metadata';
import fs from 'fs';

const testRequests = [
    {
        paths: [
            'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/cat1.jpg',
            'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/cat2.jpg',
            'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/cat3.jpg',
            'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/cat4.jpg',
            'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/cat5.jpg',
        ],
        options: {}
    },
    {
        paths: [
            'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/cat1.jpg',
            'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/cat2.jpg',
            'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/cat3.jpg',
            'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/cat4.jpg',
            'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/cat5.jpg',
        ],
        options: {
            dateBefore: new Date()
        }
    },
];

describe('Test default path', () => {
    // fs.writeFileSync('metadataTest1.bson', serialize(testRequests[0]))

    for(const testRequest of testRequests){
	    test('It should response with status 200', (done) => {
            const chunks: Buffer[] = [];
		    supertest(metadata)
			    .post('/')
                .set('Content-Type', 'application/octet-stream')
                .send(serialize(testRequest))
                .expect(200)
                .expect('Content-Type', /octet-stream/)
                .buffer()
                .parse((res, callback) => {
                    res.on('data', chunk => {
                        chunks.push(Buffer.from(chunk));
                    })
                    res.on('end', () => {
                        callback(null, null);
                    })
                })
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }

                    const response = deserialize(Buffer.concat(chunks));
                    expect(response).toBeDefined();
                    console.log('response', response);
                    done();
                });
	    });
    }
});
