import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BsModalService, ModalModule, ModalOptions } from 'ngx-bootstrap/modal';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { getMimeTypeFromBase64 } from 'src/app/utils/functions/get-mime-type';
import { PreviewDocumentsComponent } from '../preview-documents/preview-documents.component';

const Tiff = require('tiff.js');
const LOADING_GIF = 'assets/images/loader-button.gif  ';
const NO_IMAGE_FOUND = 'assets/images/documents-icons/not-found.jpg';
@Component({
  selector: 'tiff-viewer',
  standalone: true,
  imports: [CommonModule, PreviewDocumentsComponent, ModalModule],
  templateUrl: './tiff-viewer.component.html',
  styleUrls: ['./tiff-viewer.component.scss'],
})
export class TiffViewerComponent extends BasePage implements OnInit, OnChanges {
  @Input() filename: string = '';
  @Input() folio: string | number = null;
  @ViewChild('container', { static: true })
  imgSrc: string | SafeResourceUrl = null;
  imgDocument: string;
  isDocument: boolean = false;
  loadingGif = LOADING_GIF;
  error: boolean = false;
  documentLength: number = 0;
  private mimeType: string = null;
  constructor(
    private fileBrowserService: FileBrowserService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.isDocument);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filename']) {
      this.filenameChange();
    }
  }

  filenameChange() {
    this.loading = true;
    this.fileBrowserService
      .getFileFromFolioAndName(this.folio, this.filename)
      .subscribe({
        next: base64 => {
          this.loading = false;
          this.error = false;
          this.base64Change(base64);
          console.log(this.error);
        },
        error: error => {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio un error al obtener el documento'
          );
          this.loading = false;
          this.error = true;
          console.log(this.error);
          this.imgSrc = NO_IMAGE_FOUND;
        },
      });
  }

  base64Change(base64: string) {
    if (!base64) {
      return;
    }
    const bytesSize = 4 * Math.ceil(base64.length / 3) * 0.5624896334383812;
    this.documentLength = bytesSize / 1000;
    const ext =
      this.filename.substring(this.filename.lastIndexOf('.') + 1) ?? '';
    // TODO: Checar cuando vengan pdf, img etc
    this.imgSrc = ext.toLowerCase().includes('tif')
      ? this.getUrlTiff(base64)
      : this.getUrlDocument(base64);
    // this.mimeType = getMimeTypeFromBase64(this.imgSrc as string, this.filename);
  }

  getUrlTiff(base64: string) {
    try {
      this.isDocument = false;
      const buffer = Buffer.from(base64, 'base64');
      const tiff = new Tiff({ buffer });
      const canvas: HTMLCanvasElement = tiff.toCanvas();
      canvas.style.width = '100%';
      console.log('llego aca', this.filename);
      return this.sanitizer.bypassSecurityTrustResourceUrl(canvas.toDataURL());
    } catch (error) {
      this.error = true;
      console.log(this.error);
      return this.sanitizer.bypassSecurityTrustResourceUrl(NO_IMAGE_FOUND);
    }
  }

  getUrlDocument(base64: string) {
    let mimeType;
    mimeType = getMimeTypeFromBase64(base64, this.filename);
    const ext =
      this.filename.substring(this.filename.lastIndexOf('.') + 1) ?? '';
    if (ext == 'pdf') {
      mimeType = 'application/pdf';
      this.isDocument = true;
      this.imgDocument = 'assets/images/documents-icons/pdf.png';
    } else {
      this.isDocument = false;
    }
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
