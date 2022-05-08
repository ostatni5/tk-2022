import supertest from 'supertest';
import example from '../src/modules/exampleModule/example';

describe('Test default path', () => {
	test('It should response with status 200', (done) => {
		supertest(example)
			.get('/')
			.then(({ statusCode }: { statusCode: number }) => {
				expect(statusCode).toBe(200);
				done();
			});
	});
});

describe('Test the cors path', () => {
	test('It should response the GET method', (done) => {
		supertest(example)
			.get('/cors')
			.then(({ statusCode }: { statusCode: number }) => {
				expect(statusCode).toBe(200);
				done();
			});
	});
});
