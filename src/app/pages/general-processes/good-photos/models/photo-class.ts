import { Component, inject, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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

  protected base64Change(base64: string) {
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
      : this.getUrlDocument(base64);
    this.mimeType = getMimeTypeFromImg(this.file.name);
    console.log(base64, this.imgSrc, this.mimeType, this.file.name);
  }

  protected getUrlTiff(base64: string) {
    try {
      const buffer = Buffer.from(base64, 'base64');
      const tiff = new Tiff({ buffer });
      const canvas: HTMLCanvasElement = tiff.toCanvas();
      canvas.style.width = '100%';
      console.log('llego aca', this.file.name);
      return this.sanitizer.bypassSecurityTrustResourceUrl(canvas.toDataURL());
    } catch (error) {
      this.error = true;
      console.log(this.error);
      return this.sanitizer.bypassSecurityTrustResourceUrl(NO_IMAGE_FOUND);
    }
  }

  protected getUrlDocument(base64: string) {
    let mimeType;
    mimeType = getMimeTypeFromImg(this.file.name);
    this.mimeType = mimeType;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:${mimeType};base64, ${base64}`
    );
  }

  openDocumentsViewer() {
    console.log(this.error);
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
