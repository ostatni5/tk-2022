import supertest from 'supertest';
import { serialize, deserialize } from 'bson';
import metadata from '../src/modules/metadataModule/metadata';

const testRequests = [
    // Test case 1 - test if has exif
    {
        testRequest: {
            paths: [
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/bike.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/bus.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/feather.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/fish.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/flower1.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/flower2.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard1.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard2.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard3.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/ptsd.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/trees.jpg',
            ],
            options: {},
        },
        testResponse: {
            pictures: [
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/bike.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/bus.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/feather.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/fish.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/flower1.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/flower2.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard1.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard2.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/trees.jpg',
            ],
        },
    },
    // Test case 2 - Test before
    {
        testRequest: {
            paths: [
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/bike.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/bus.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/feather.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/fish.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/flower1.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/flower2.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard1.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard2.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard3.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/ptsd.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/trees.jpg',
            ],
            options: {
                dateBefore: new Date('2005-01-01T00:00:00'),
            },
        },
        testResponse: {
            pictures: [
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/bike.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/flower1.jpg',
            ],
        },
    },
    // Test case 3 - Test after
    {
        testRequest: {
            paths: [
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/bike.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/bus.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/feather.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/fish.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/flower1.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/flower2.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard1.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard2.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard3.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/ptsd.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/trees.jpg',
            ],
            options: {
                dateAfter: new Date('2007-01-01T00:00:00'),
            },
        },
        testResponse: {
            pictures: [
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/bus.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/flower2.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard1.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/trees.jpg',
            ],
        },
    },
    // Test case 4 - Test between
    {
        testRequest: {
            paths: [
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/bike.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/bus.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/feather.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/fish.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/flower1.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/flower2.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard1.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard2.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard3.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/ptsd.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/trees.jpg',
            ],
            options: {
                dateBefore: new Date('2009-01-01T00:00:00'),
                dateAfter: new Date('2006-01-01T00:00:00'),
            },
        },
        testResponse: {
            pictures: [
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/bus.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/feather.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/fish.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/flower2.jpg',
                'C:/Users/krzys/Documents/Repos/tk-2022/server/resources/exampleImages/lizard1.jpg',
            ],
        },
    },
];

describe('Test default path', () => {
    // fs.writeFileSync('metadataTest1.bson', serialize(testRequests[0]))

    for(const {testRequest, testResponse} of testRequests){
	    test('It should response with status 200 and filtered paths', (done) => {
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
                    expect(response).toEqual(testResponse);
                    done();
                });
	    });
    }
});
