import fs from 'fs';
import path from 'path';
import imageType from 'image-type';

export function* directoryFilesGenerator(baseFolder: string, recursive: boolean = true): IterableIterator<string> {
    let currDirFiles: string[] = [];
    try{
        currDirFiles = fs.readdirSync(baseFolder);
    }
    catch{
        return;
    }
    const absolutePaths: string[] = currDirFiles.map((file: string) => path.join(baseFolder, file));

    const directoryPaths: string[] = [];
    for(const file of absolutePaths){
        try{
            const stat: fs.Stats = fs.statSync(file);
            if(stat?.isFile()){
                yield file.split('\\').join('/');
            }
            else if(stat?.isDirectory()){
                directoryPaths.push(file);
            }
        }
        catch{
            continue;
        }
    }

    if (recursive){
        for (const dir of directoryPaths){
            yield* directoryFilesGenerator(dir, recursive);
        }
    }
}

const readChunk = (file: string, size: number): Buffer => {
    const buffer = Buffer.alloc(size);
    let fd: number = 0;
    try{
        fd = fs.openSync(file, 'r');
    }
    catch{
        return buffer;
    }
    try{
        const bytesRead: number = fs.readSync(fd, buffer, 0, size, null);
        return bytesRead < size ? buffer.slice(0, bytesRead) : buffer;
    }
    finally{
        fs.closeSync(fd);
    }
}

export const isImage = (file: string) => {
    // image-type needs first 12 bytes of a file to identify mime type
    const buffer: Buffer = readChunk(file, 12);
    return imageType(buffer)?.mime.startsWith("image/");
}

export function* directoryImagesGenerator(baseFolder: string, recursive: boolean = true): IterableIterator<string> {
    for(const file of directoryFilesGenerator(baseFolder, recursive)){
        if (isImage(file)){
            yield file;
        }
    }
}

export const getAllFiles = (baseFolder: string, recursive: boolean = true): string[] => {
    let files = [];
    
    for(const file of directoryFilesGenerator(baseFolder, recursive)){
        files.push(file)
    }
    
    return files;
}

export const getAllImages = (baseFolder: string, recursive = true): string[] => {
    let files = [];
    
    for(const file of directoryFilesGenerator(baseFolder, recursive)){
        if(isImage(file)) files.push(file);
    }
    
    return files;
}
