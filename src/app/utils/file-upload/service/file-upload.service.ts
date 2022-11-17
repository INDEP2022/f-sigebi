import { Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { FileUploadEvent } from '../interfaces/file-event';
@Injectable()
export class FileUploadService {
  constructor(private imageCompress: NgxImageCompressService) {}
  async processImage(file: File) {
    const image = await this.readFile(file);
    const filename = file.name;
    const orientation = await this.imageCompress.getOrientation(file);
    const compressedImage = await this.imageCompress.compressFile(
      image.toString(),
      orientation,
      50,
      50
    );
    const compressedFile = this.dataURLToFile(compressedImage, filename);
    return new FileUploadEvent(compressedFile);
  }

  private dataURLToFile(dataurl: string, filename: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  readFile(file: File) {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve((e.target as FileReader).result);
      reader.onerror = e => reject(null);
      reader.readAsDataURL(file);
    });
  }
}
