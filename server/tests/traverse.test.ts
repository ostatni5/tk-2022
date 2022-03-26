import supertest from 'supertest';
import traverse from '../src/modules/traverseModule/traverse';
import { serialize, deserialize } from 'bson';
const testRequest = {
	path: './tests/',
	modules: []
};

describe('Test default path', () => {
	test('should response with status 200 and valid binary buffer', (done) => {
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
				console.log('response', response);
				done();
			});
	});
});
