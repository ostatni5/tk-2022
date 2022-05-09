import supertest from 'supertest';
import metadata from '../src/modules/metadataModule/metadata';

const rootPath = process.cwd().split('\\').join('/').split('/server')[0];

const testCases = [
	// Test case 1 - test if no option returns all
	{
		testRequest: {
			paths: [
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
			options: {},
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
	// Test case 2 - Test before
	{
		testRequest: {
			paths: [
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
			options: {
				dateBefore: new Date('2005-01-01T00:00:00'),
			},
		},
		testResponse: {
			pictures: [
				`${rootPath}/resources/exampleImages/bike.jpg`,
				`${rootPath}/resources/exampleImages/flower1.jpg`,
			],
		},
	},
	// Test case 3 - Test after
	{
		testRequest: {
			paths: [
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
			options: {
				dateAfter: new Date('2007-01-01T00:00:00'),
			},
		},
		testResponse: {
			pictures: [
				`${rootPath}/resources/exampleImages/bus.jpg`,
				`${rootPath}/resources/exampleImages/flower2.jpg`,
				`${rootPath}/resources/exampleImages/lizard1.jpg`,
				`${rootPath}/resources/exampleImages/trees.jpg`,
			],
		},
	},
	// Test case 4 - Test date between
	{
		testRequest: {
			paths: [
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
			options: {
				dateBefore: new Date('2009-01-01T00:00:00'),
				dateAfter: new Date('2006-01-01T00:00:00'),
			},
		},
		testResponse: {
			pictures: [
				`${rootPath}/resources/exampleImages/bus.jpg`,
				`${rootPath}/resources/exampleImages/feather.jpg`,
				`${rootPath}/resources/exampleImages/fish.jpg`,
				`${rootPath}/resources/exampleImages/flower2.jpg`,
				`${rootPath}/resources/exampleImages/lizard1.jpg`,
			],
		},
	},
	// Test case 5 - Test exposure time
	{
		testRequest: {
			paths: [
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
			options: {
				exposureTime: 0.004,
			},
		},
		testResponse: {
			pictures: [
				`${rootPath}/resources/exampleImages/lizard2.jpg`,
				`${rootPath}/resources/exampleImages/trees.jpg`,
			],
		},
	},
	// Test case 6 - Test f number
	{
		testRequest: {
			paths: [
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
			options: {
				fNumber: 4.9,
			},
		},
		testResponse: {
			pictures: [`${rootPath}/resources/exampleImages/flower1.jpg`],
		},
	},
	// Test case 7 - Test f number
	{
		testRequest: {
			paths: [
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
			options: {
				fNumber: 4.9,
			},
		},
		testResponse: {
			pictures: [`${rootPath}/resources/exampleImages/flower1.jpg`],
		},
	},
	// Test case 8 - Test focal length
	{
		testRequest: {
			paths: [
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
			options: {
				focalLength: 100,
			},
		},
		testResponse: {
			pictures: [`${rootPath}/resources/exampleImages/lizard3.jpg`],
		},
	},
	// Test case 9 - Test focal length
	{
		testRequest: {
			paths: [
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
			options: {
				focalLength: 100,
			},
		},
		testResponse: {
			pictures: [`${rootPath}/resources/exampleImages/lizard3.jpg`],
		},
	},
	// Test case 10 - Test flash
	{
		testRequest: {
			paths: [
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
			options: {
				flash: 24,
			},
		},
		testResponse: {
			pictures: [
				`${rootPath}/resources/exampleImages/bike.jpg`,
				`${rootPath}/resources/exampleImages/bus.jpg`,
				`${rootPath}/resources/exampleImages/flower1.jpg`,
				`${rootPath}/resources/exampleImages/lizard2.jpg`,
				`${rootPath}/resources/exampleImages/trees.jpg`,
			],
		},
	},
	// Test case 11 - Test width between
	{
		testRequest: {
			paths: [
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
			options: {
				pixelXDimMin: 100,
				pixelXDimMax: 100,
			},
		},
		testResponse: {
			pictures: [
				`${rootPath}/resources/exampleImages/bike.jpg`,
				`${rootPath}/resources/exampleImages/bus.jpg`,
				`${rootPath}/resources/exampleImages/fish.jpg`,
				`${rootPath}/resources/exampleImages/flower2.jpg`,
				`${rootPath}/resources/exampleImages/lizard1.jpg`,
				`${rootPath}/resources/exampleImages/lizard2.jpg`,
				`${rootPath}/resources/exampleImages/lizard3.jpg`,
				`${rootPath}/resources/exampleImages/ptsd.jpg`,
			],
		},
	},
	// Test case 12 - Test height between
	{
		testRequest: {
			paths: [
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
			options: {
				pixelYDimMin: 70,
				pixelYDimMax: 77,
			},
		},
		testResponse: {
			pictures: [
				`${rootPath}/resources/exampleImages/bike.jpg`,
				`${rootPath}/resources/exampleImages/bus.jpg`,
				`${rootPath}/resources/exampleImages/fish.jpg`,
				`${rootPath}/resources/exampleImages/flower2.jpg`,
				`${rootPath}/resources/exampleImages/ptsd.jpg`,
			],
		},
	},
];

describe('Test default path', () => {
	console.log(rootPath);

	testCases.forEach(({ testRequest, testResponse }, index) => {
		test(`It should response with status 200 and filtered paths [Case: ${index + 1}]`, (done) => {
			const chunks: Buffer[] = [];

			supertest(metadata)
				.post('/')
				.send(testRequest)
				.expect(200)
				.end((err, res) => {
					if (err) {
						throw err;
					}
					const response = res.body;
					expect(response).toBeDefined();
					expect(response).toEqual(testResponse);
					done();
				});
		});
	});
});
