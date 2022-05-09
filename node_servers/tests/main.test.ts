import supertest from 'supertest';
import main from '../src/modules/mainModule/main';
import { serialize, deserialize } from 'bson';
import process from 'process';

const rootPath = process.cwd().split('\\').join('/').split('/server')[0];

const testCases = [
	{
		testRequest: {
			path: `${rootPath}/resources/exampleImages`,
			moduleOptions: [],
		},
		testResponse: {
			pictures: [
				`${rootPath}/resources/exampleImages/bike.jpg`,
				`${rootPath}/resources/exampleImages/bus.jpg`,
				`${rootPath}/resources/exampleImages/feather.jpg`,
				`${rootPath}/resources/exampleImages/fish.jpg`,
				`${rootPath}/resources/exampleImages/flower1.jpg`,
				`${rootPath}/resources/exampleImages/flower2.jpg`,
				`${rootPath}/resources/exampleImages/lizard1.jpg`,
				`${rootPath}/resources/exampleImages/lizard2.jpg`,
				`${rootPath}/resources/exampleImages/lizard3.jpg`,
				`${rootPath}/resources/exampleImages/ptsd.jpg`,
				`${rootPath}/resources/exampleImages/trees.jpg`,
			],
		},
	},
];

describe('Test default path', () => {
	test('should response with status 200 and valid binary buffer', (done) => {
		for (const { testRequest, testResponse } of testCases) {
			const chunks: Buffer[] = [];
			supertest(main)
				.post('/')
				.set('Content-Type', 'application/octet-stream')
				.send(serialize(testRequest))
				.expect(200)
				.expect('Content-Type', /octet-stream/)
				.buffer()
				.parse((res, callback) => {
					res.on('data', (chunk) => {
						chunks.push(Buffer.from(chunk));
					});
					res.on('end', () => {
						callback(null, null);
					});
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
		}
	});
});
