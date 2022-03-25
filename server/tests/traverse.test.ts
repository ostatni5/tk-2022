import request from 'supertest';
import traverse from '../src/modules/traverseModule/traverse';

describe('Test default path', () => {
	test('It should response with status 200', (done) => {
		request(traverse)
			.get('/')
			.then(({ statusCode }: { statusCode: number }) => {
				expect(statusCode).toBe(200);
				done();
			});
	});
});
