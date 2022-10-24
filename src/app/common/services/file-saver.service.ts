import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

interface ISaveFromBufferOptions {
  type: string;
  filename: string;
  extension: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileSaverService {
  constructor() {}

  saveFromBuffer(buffer: Buffer, options: ISaveFromBufferOptions) {
    const { type, filename, extension } = options;
    const fullFilename = `${filename}${extension}`;
    const data: Blob = new Blob([buffer], {
      type,
    });
    saveAs(data, fullFilename);
  }
}
