import supertest from 'supertest';
import { serialize, deserialize } from 'bson';
import metadata from '../src/modules/metadataModule/metadata';

const rootPath = process.cwd();

const testRequests = [
    // Test case 1 - test if has exif
    {
        testRequest: {
            paths: [
                `${rootPath}\\server\\resources\\exampleImages\\bike.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\bus.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\feather.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\fish.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\flower1.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\flower2.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard1.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard2.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard3.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\ptsd.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\trees.jpg`,
            ],
            options: {},
        },
        testResponse: {
            pictures: [
                `${rootPath}\\server\\resources\\exampleImages\\bike.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\bus.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\feather.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\fish.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\flower1.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\flower2.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard1.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard2.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\trees.jpg`,
            ],
        },
    },
    // Test case 2 - Test before
    {
        testRequest: {
            paths: [
                `${rootPath}\\server\\resources\\exampleImages\\bike.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\bus.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\feather.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\fish.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\flower1.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\flower2.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard1.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard2.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard3.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\ptsd.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\trees.jpg`,
            ],
            options: {
                dateBefore: new Date('2005-01-01T00:00:00'),
            },
        },
        testResponse: {
            pictures: [
                `${rootPath}\\server\\resources\\exampleImages\\bike.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\flower1.jpg`,
            ],
        },
    },
    // Test case 3 - Test after
    {
        testRequest: {
            paths: [
                `${rootPath}\\server\\resources\\exampleImages\\bike.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\bus.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\feather.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\fish.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\flower1.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\flower2.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard1.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard2.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard3.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\ptsd.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\trees.jpg`,
            ],
            options: {
                dateAfter: new Date('2007-01-01T00:00:00'),
            },
        },
        testResponse: {
            pictures: [
                `${rootPath}\\server\\resources\\exampleImages\\bus.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\flower2.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard1.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\trees.jpg`,
            ],
        },
    },
    // Test case 4 - Test between
    {
        testRequest: {
            paths: [
                `${rootPath}\\server\\resources\\exampleImages\\bike.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\bus.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\feather.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\fish.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\flower1.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\flower2.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard1.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard2.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard3.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\ptsd.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\trees.jpg`,
            ],
            options: {
                dateBefore: new Date('2009-01-01T00:00:00'),
                dateAfter: new Date('2006-01-01T00:00:00'),
            },
        },
        testResponse: {
            pictures: [
                `${rootPath}\\server\\resources\\exampleImages\\bus.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\feather.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\fish.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\flower2.jpg`,
                `${rootPath}\\server\\resources\\exampleImages\\lizard1.jpg`,
            ],
        },
    },
];

describe('Test default path', () => {

    testRequests.forEach( ({testRequest, testResponse}, index) => {
	    test(`It should response with status 200 and filtered paths [Case: ${index+1}]`, (done) => {
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
    });
});
