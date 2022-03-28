import fs from 'fs';
import path from 'path';
import imageType from 'image-type';

export const getAllFiles = (baseFolder: string, recursive: boolean = true, filesList: string[] = []): string[] => {
    const currDirFiles: string[] = fs.readdirSync(baseFolder);
    const absoluteFiles: string[] = currDirFiles.map((file: string) => path.join(baseFolder, file))

    const regularFiles: string[] = absoluteFiles.filter((file: string) => fs.statSync(file).isFile());
    filesList.push(...regularFiles);

    if (recursive){
        absoluteFiles.forEach((file: string) => {
            if (fs.statSync(file).isDirectory()){
                getAllFiles(file, recursive, filesList);
            }
        });
    }
    return filesList;
}

export function* directoryFilesGenerator(baseFolder: string, recursive: boolean = true): IterableIterator<string> {
    const currDirFiles: string[] = fs.readdirSync(baseFolder);
    const absoluteFiles: string[] = currDirFiles.map((file: string) => path.join(baseFolder, file))

    const regularFiles: string[] = absoluteFiles.filter((file: string) => fs.statSync(file).isFile());
    for (const file of regularFiles){
        yield file;
    }

    if (recursive){
        for (const file of absoluteFiles){
            if (fs.statSync(file).isDirectory()){
                yield* directoryFilesGenerator(file, recursive);
            }
        }
    }
}

const readChunk = (file: string, size: number): Buffer => {
    const buffer = Buffer.alloc(size);
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

export function* directoryImagesGenerator(baseFolder: string, recursive: boolean = true): IterableIterator<string> {
    for(const file of directoryFilesGenerator(baseFolder, recursive)){
        if (isImage(file)){
            yield file;
        }
    }
}
