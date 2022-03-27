import fs from 'fs';
import path from 'path';
import imageType from 'image-type';

export const getAllFiles = (baseFolder: string, recursive: boolean = true, filesList: string[] = []): string[] => {
	let currDirFiles: string[] = fs.readdirSync(baseFolder);
	let absoluteFiles: string[] = currDirFiles.map((file: string) => path.join(baseFolder, file))

	let regularFiles: string[] = absoluteFiles.filter((file: string) => fs.statSync(file).isFile());
	filesList.push(...regularFiles);

	if (recursive){
		absoluteFiles.forEach((file: any) => {
			if (fs.statSync(file).isDirectory()){
				getAllFiles(file, recursive, filesList);
			}
		});
	}
	return filesList;
}

const readChunk = (file: string, size: number): Buffer => {
    let buffer = Buffer.alloc(size);
    const fd: number = fs.openSync(file, 'r')
    try{
        const bytesRead: number = fs.readSync(fd, buffer, 0, size, null);
        return bytesRead < size ? buffer.slice(0, bytesRead) : buffer;
    }
    finally{
        fs.closeSync(fd);
    }
}

export const isImage = (file: string) => {
    const buffer: Buffer = readChunk(file, 12);
    return imageType(buffer)?.mime.startsWith("image/");
}

export const getAllImages = (baseFolder: string, recursive: boolean = true) => {
    const files = getAllFiles(baseFolder, recursive);
    return files.filter((file: string) => isImage(file));
}
