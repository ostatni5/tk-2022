// import path from 'path';
// import mock from 'mock-fs';
// import { getAllFiles, getAllImages } from '../src/modules/traverseModule/filesFinder';

// const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
// const JPG = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
// const BMP = Buffer.from([0x42, 0x4D]);

// describe('files test', () => {
//     beforeAll(() => {
//         mock({
//             'testDir': {
//                 'index.md': '# Hello world!',
//                 'empty.txt': '',
//                 'innerDir': {
//                     'short.txt': 'short',
//                     'file.txt': 'this is not an image, but txt file',
//                 },
//                 'image.png': PNG,
//                 'image.jpg': JPG,
//                 'image_without_extension': PNG,
//                 'innerDir2': {
//                     'another_image.bmp': BMP,

//                     'innerInnerDir': {
//                         'file': 'text',
//                         'another_image2.jpg': JPG
//                     }
//                 }
//             },
//         });
//     });

//     afterAll(() => {
//         mock.restore();
//     });

//     test('get all files in mocked testDir folder', () => {
//         const expected: string[] = [
//             'testDir/index.md',
//             'testDir/empty.txt',
//             'testDir/image.png',
//             'testDir/image.jpg',
//             'testDir/image_without_extension',
//             'testDir/innerDir/short.txt',
//             'testDir/innerDir/file.txt',
//             'testDir/innerDir2/another_image.bmp',
//             'testDir/innerDir2/innerInnerDir/file',
//             'testDir/innerDir2/innerInnerDir/another_image2.jpg'
//         ];
//         const dir = './testDir';

//         let files = getAllFiles(dir);
//         // change windows separators to posix separators
//         files = files.map((file: string) => file.split(path.sep).join(path.posix.sep));

//         expect(files.length).toEqual(expected.length);
//         expect(files).toEqual(expect.arrayContaining(expected));
//     });

//     test('get only images in mocked testDir folder', () => {
//         const expected: string[] = [
//             'testDir/image.png',
//             'testDir/image.jpg',
//             'testDir/image_without_extension',
//             'testDir/innerDir2/another_image.bmp',
//             'testDir/innerDir2/innerInnerDir/another_image2.jpg'
//         ];
//         const dir = './testDir';

//         let files = getAllImages(dir);
//         // change windows separators to posix separators
//         files = files.map((file: string) => file.split(path.sep).join(path.posix.sep));

//         expect(files.length).toEqual(expected.length);
//         expect(files).toEqual(expect.arrayContaining(expected));
//     });
// });
