import supertest from 'supertest';
import traverse from '../src/modules/traverseModule/traverse';
import { serialize, deserialize } from 'bson';
import process from 'process';


const rootPath = process.cwd();

const testCases = [
	{
		testRequest: {
	        path: `${rootPath}\\server\\resources\\exampleImages`,
	        moduleConfig: [
	            {
	                name: 'metadata',
	                dateBefore: new Date('2006-01-01T00:00:00')
	            },
	            {
	                name: 'metadata',
	                dateAfter: new Date('2005-01-01T00:00:00')
	            }
	        ]
	    },
		testResponse: {
			pictures: [
			    `${rootPath}\\server\\resources\\exampleImages\\lizard2.jpg`,
			]
		}
	}
]



describe('Test default path', () => {
	test('should response with status 200 and valid binary buffer', (done) => {
		for(const {testRequest, testResponse} of testCases){
			const chunks: Buffer[] = [];
			supertest(traverse)
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
