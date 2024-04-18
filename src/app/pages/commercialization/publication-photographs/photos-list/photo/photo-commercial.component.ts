import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import { FilePhotoEditService } from 'src/app/core/services/ms-ldocuments/file-photo-edit.service';
import { FilePhotoService } from 'src/app/core/services/ms-ldocuments/file-photo.service';
import {
  NO_IMAGE_FOUND,
  PhotoClassComponent,
} from 'src/app/pages/general-processes/good-photos/models/photo-class';

@Component({
  selector: 'app-photo-commercial',
  templateUrl: './photo-commercial.component.html',
  styleUrls: ['./photo-commercial.component.scss'],
})
export class PhotoCommercialComponent
  extends PhotoClassComponent
  implements OnInit
{
  @Output() refreshFiles = new EventEmitter<boolean>();
  // subscription: any;
  @Input() _file: any = null;
  @Input() _fileName: string = '';
  constructor(
    private service: FilePhotoService,
    private editService: FilePhotoEditService
  ) {
    super();
  }
  get filename() {
    if (!this.file) return '';
    return this.file.name;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['file']) {
      this.filenameChange();
    } else if (changes['_fileName']) {
      this._filenameChange();
    }
  }

  private filenameChange() {
    this.loading = true;
    console.log(this.file.name);
    let index = this.file.name.indexOf('F');
    let finish = this.file.name.indexOf('.');
    console.log(index);
    this.service
      .getById(this.goodNumber, +this.file.name.substring(index + 1, finish))
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: base64 => {
          this.loading = false;
          this.error = false;
          this.base64Change(base64);
          // console.log(this.error);
        },
        error: error => {
          // this.alert('error', 'Fotos', 'Ocurrio un error al cargar la foto');
          this.loading = false;
          this.error = true;
          // console.log(this.error);
          this.imgSrc = NO_IMAGE_FOUND;
        },
      });
  }

  private _filenameChange() {
    this.loading = true;

    if (!this._fileName) {
      this.loading = false;
      return;
    }
    console.log(this._fileName);
    let index = this._fileName.indexOf('F');
    let finish = this._fileName.indexOf('.');
    // console.log(index);
    this.service
      .getById(this.goodNumber, +this._fileName.substring(index + 1, finish))
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: base64 => {
          this.loading = false;
          this.error = false;
          this.base64Change_(base64);
        },
        error: error => {
          this.loading = false;
          this.error = true;
          this.imgSrc = NO_IMAGE_FOUND;
        },
      });
  }

  protected async base64Change_(base64: string) {
    if (!base64) {
      return;
    }
    const bytesSize = 4 * Math.ceil(base64.length / 3) * 0.5624896334383812;
    this.documentLength = bytesSize / 1000;
    const ext =
      this._fileName.substring(this._fileName.lastIndexOf('.') + 1) ?? '';
    // TODO: Checar cuando vengan pdf, img etc
    this.imgSrc = ext.toLowerCase().includes('tif')
      ? this.getUrlTiff(base64)
      : ['heic', 'heif'].includes(ext.toLowerCase())
      ? await this.getUrlHeic(base64)
      : this._getUrlDocument(base64);
    console.log(this.imgSrc);
    this.mimeType = this._getMimeTypeFromImg(this._fileName);
    console.log(this.mimeType);
    this.loading = false;
  }

  _getMimeTypeFromImg(fileName = 'unamedfile') {
    let ext = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (ext === undefined || ext === null || ext === '') ext = 'bin';
    ext = ext.toLowerCase();
    const signatures: any = {
      jpg: 'image/jpg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      tiff: 'image/tiff',
      tif: 'image/tif',
      raw: 'image/raw',
      webm: 'image/webm',
      bmp: 'image/bmp',
      svg: 'image/svg',
      heif: 'image/jpeg',
      heic: 'image/jpeg',
    };

    for (const s in signatures) {
      if (ext?.includes(s)) {
        let x = signatures[s];
        return x;
      }
    }
    return 'unknown';
  }

  _getUrlDocument(base64: string, isHeic = false) {
    let mimeType;
    mimeType = this._getMimeTypeFromImg(this._fileName);
    this.mimeType = mimeType;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      isHeic ? base64 : `data:${mimeType};base64, ${base64}`
    );
  }
}
