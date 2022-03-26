import request from 'supertest';
import traverse from '../src/modules/traverseModule/traverse';
import fs from 'fs';
import { serialize } from 'bson';
const testRequest = {
	path: './tests/traverse.test.bson',
	modules: []
};

describe('Test default path', () => {
	beforeAll(() => {
		fs.writeFileSync('./tests/traverse.test.bson', serialize(testRequest));
	});
	afterAll(() => {
		fs.unlinkSync('./tests/traverse.test.bson');
	});
	test('It should response with status 200', (done) => {
		console.log(testRequest);
		request(traverse)
			.post('/')
			.send(serialize(testRequest))
			.then(({ statusCode }: { statusCode: number }) => {
				expect(statusCode).toBe(200);
				done();
			});
	});
});
