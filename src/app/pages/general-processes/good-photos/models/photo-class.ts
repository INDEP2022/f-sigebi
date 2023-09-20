import { Component, inject, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import heic2any from 'heic2any';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  IHistoricalPhoto,
  IPhotoFile,
} from 'src/app/core/services/ms-ldocuments/file-photo.service';
import { BasePage } from 'src/app/core/shared';
import { getMimeTypeFromImg } from 'src/app/utils/functions/get-mime-type';

const LOADING_GIF = 'assets/images/loader-button.gif';
export const NO_IMAGE_FOUND = 'assets/images/documents-icons/not-found.jpg';
const Tiff = require('tiff.js');
const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  console.log(blob);

  return blob;
};

@Component({
  selector: 'app-photo-class',
  template: '',
  styles: [''],
})
export class PhotoClassComponent extends BasePage {
  @Input() file: IPhotoFile | IHistoricalPhoto = null;
  @Input() goodNumber: string = null;
  @Input() typedblClickAction: number = 1;
  @ViewChild('container', { static: true })
  imgSrc: string | SafeResourceUrl = null;
  base64: string;
  mimeType: string = null;
  loadingGif = LOADING_GIF;
  error: boolean = false;
  documentLength: number = 0;
  sanitizer = inject(DomSanitizer);
  modalService = inject(BsModalService);
  constructor() {
    super();
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return theBlob as File;
  };

  protected async base64Change(base64: string) {
    if (!base64) {
      return;
    }
    const bytesSize = 4 * Math.ceil(base64.length / 3) * 0.5624896334383812;
    this.documentLength = bytesSize / 1000;
    const ext =
      this.file.name.substring(this.file.name.lastIndexOf('.') + 1) ?? '';
    // TODO: Checar cuando vengan pdf, img etc
    this.imgSrc = ext.toLowerCase().includes('tif')
      ? this.getUrlTiff(base64)
      : ['heic', 'heif'].includes(ext.toLowerCase())
      ? await this.getUrlHeic(base64)
      : this.getUrlDocument(base64);
    console.log(this.imgSrc);
    this.mimeType = getMimeTypeFromImg(this.file.name);
    console.log(this.mimeType);
    this.loading = false;
    // console.log(base64, this.imgSrc, this.mimeType, this.file.name);
  }

  protected async getUrlHeic(base64: string) {
    let convProm: Promise<any>;
    const blob = this.blobToFile(b64toBlob(base64, 'heif'), this.file.name);
    const result = await heic2any({
      blob,
      toType: 'image/jpeg',
      quality: 0.8,
    });
    console.log(result);
    const jpegBlob = Array.isArray(result) ? result[0] : result;
    console.log(jpegBlob);
    const result3 = await new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(jpegBlob);
      return reader.result;
      // let result2 = this.getUrlDocument(reader.result as string);
      // console.log(result2);
      // return result2;
    });
    console.log(result3);
    let urlDocument = this.getUrlDocument(result3 as string, true);
    return urlDocument;

    // reader.onloadend = () => resolve(reader.result);
    // {
    //   var base64data = reader.result;
    //   console.log(base64data);
    //   console.log(this.getUrlDocument(base64data as string));
    //   return this.getUrlDocument(base64data as string);
    // };
    // console.log(URL.createObjectURL(jpegBlob));
    // return URL.createObjectURL(jpegBlob);
  }

  protected getUrlTiff(base64: string) {
    try {
      const buffer = Buffer.from(base64, 'base64');
      const tiff = new Tiff({ buffer });
      const canvas: HTMLCanvasElement = tiff.toCanvas();
      canvas.style.width = '100%';
      // console.log('llego aca', this.file.name);
      return this.sanitizer.bypassSecurityTrustResourceUrl(canvas.toDataURL());
    } catch (error) {
      this.error = true;
      // console.log(this.error);
      return this.sanitizer.bypassSecurityTrustResourceUrl(NO_IMAGE_FOUND);
    }
  }

  protected getUrlDocument(base64: string, isHeic = false) {
    let mimeType;
    mimeType = getMimeTypeFromImg(this.file.name);
    this.mimeType = mimeType;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      isHeic ? base64 : `data:${mimeType};base64, ${base64}`
    );
  }

  openDocumentsViewer() {
    // console.log(this.error);
    if (this.loading || this.error) {
      return;
    }
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.imgSrc,
          type: this.mimeType,
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }
}
