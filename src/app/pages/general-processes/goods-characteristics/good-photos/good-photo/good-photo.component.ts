import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilePhotoService,
  IPhotoFile,
} from 'src/app/core/services/ms-ldocuments/file-photo.service';
import { BasePage } from 'src/app/core/shared';
import { getMimeTypeFromBase64 } from 'src/app/utils/functions/get-mime-type';

const Tiff = require('tiff.js');
const LOADING_GIF = 'assets/images/loader-button.gif';
const NO_IMAGE_FOUND = 'assets/images/documents-icons/not-found.jpg';

@Component({
  selector: 'app-good-photo',
  templateUrl: './good-photo.component.html',
  styleUrls: ['./good-photo.component.scss'],
})
export class GoodPhotoComponent extends BasePage implements OnInit {
  @Input() file: IPhotoFile = null;
  @Input() goodNumber: string = null;
  @ViewChild('container', { static: true })
  imgSrc: string | SafeResourceUrl = null;
  imgDocument: string;
  isDocument: boolean = false;
  loadingGif = LOADING_GIF;
  error: boolean = false;
  documentLength: number = 0;
  subscription: any;
  private mimeType: string = null;
  constructor(
    private service: FilePhotoService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filename']) {
      this.filenameChange();
    }
  }

  get filename() {
    return this.file ? this.file.name : '';
  }

  private filenameChange() {
    this.loading = true;
    let index = this.file.name.indexOf('F');
    console.log(index);
    this.subscription = this.service
      .getById(this.goodNumber, +this.file.name.substring(index + 1, index + 5))
      .subscribe({
        next: base64 => {
          this.loading = false;
          this.error = false;
          this.base64Change(base64);
          console.log(this.error);
        },
        error: error => {
          // this.alert('error', 'Fotos', 'Ocurrio un error al cargar la foto');
          this.loading = false;
          this.error = true;
          console.log(this.error);
          this.imgSrc = NO_IMAGE_FOUND;
        },
      });
  }

  private base64Change(base64: string) {
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
    // this.mimeType = getMimeTypeFromBase64(this.imgSrc as string, this.filename);
  }

  private getUrlTiff(base64: string) {
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

  private getUrlDocument(base64: string) {
    let mimeType;
    mimeType = getMimeTypeFromBase64(base64, this.file.name);
    const ext =
      this.file.name.substring(this.file.name.lastIndexOf('.') + 1) ?? '';
    if (ext?.toLowerCase() == 'pdf') {
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

  override ngOnDestroy() {
    console.log('AQUI ESTAMOS');
    this.subscription.unsubscribe();
    // this.sub.unsubscribe();
  }
}
