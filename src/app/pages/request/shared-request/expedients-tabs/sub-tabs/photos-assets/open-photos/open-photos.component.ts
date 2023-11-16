import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { TABLE_SETTINGS } from '../../../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../../../common/repository/interfaces/list-params';
import { BasePage } from '../../../../../../../core/shared/base-page';
import { PHOTOS_TABLE_COLUMNS } from '../columns/photos-table-columns';

@Component({
  selector: 'app-open-photos',
  templateUrl: './open-photos.component.html',
  styleUrls: ['./open-photos.component.scss'],
})
export class OpenPhotosComponent extends BasePage implements OnInit {
  paragraphs: LocalDataSource = new LocalDataSource();
  information: any;
  request: boolean = true;
  columns = PHOTOS_TABLE_COLUMNS;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  task: any;
  statusTask: any = '';
  documentsSeaData: any[] = [];
  private data: any[][] = [];
  constructor(
    private bsModalRef: BsModalRef,
    private wContentService: WContentService,
    private modalservice: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    // DISABLED BUTTON - FINALIZED //
    if (this.request) {
      this.task = JSON.parse(localStorage.getItem('Task'));
      this.statusTask = this.task?.status;
    }

    this.settings = {
      ...TABLE_SETTINGS,

      actions: false,
      selectMode: '',
      columns: PHOTOS_TABLE_COLUMNS,
    };
    this.columns.actions = {
      ...this.columns.actions,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick.subscribe((data: any) => {
          this.getImage(data.dDocName);
        });
      },
    };
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getImagesGood());
  }

  getImagesGood() {
    const idGood: Object = {
      xidBien: this.information.id,
    };
    this.data = [];
    if (this.data.length == 0) {
      this.loading = true;
      this.wContentService.getDocumentos(idGood).subscribe(data => {
        const _data = data.data.filter((img: any) => {
          if (img.dDocType == 'DigitalMedia') return img;
        });

        if (_data.length > 0) {
          this.documentsSeaData =
            _data.length > 10 ? this.setPaginate([..._data]) : _data;
          this.totalItems = _data.length;
          this.loading = false;
        } else {
          this.alert(
            'warning',
            'Atención',
            'No hay fotos agregadas a este bien',
            ''
          );
          this.loading = false;
        }
      });
    } else {
      this.selectPage();
    }
  }
  private selectPage() {
    this.documentsSeaData = [...this.data[this.params.value.page - 1]];
  }
  private setPaginate(value: any[]): any[] {
    let data: any[] = [];
    let dataActual: any = [];
    value.forEach((val, i) => {
      dataActual.push(val);
      if ((i + 1) % this.params.value.limit === 0) {
        this.data.push(dataActual);
        dataActual = [];
      } else if (i === value.length - 1) {
        this.data.push(dataActual);
      }
    });
    data = this.data[this.params.value.page - 1];
    return data;
  }

  updateInfoPhotos() {
    const idReq: Object = {
      xidBien: this.information.id,
    };

    this.wContentService.getDocumentos(idReq).subscribe(data => {
      const _data = data.data.filter((img: any) => {
        if (img.dDocType == 'DigitalMedia') return img;
      });

      if (_data.length > 0) {
        this.paragraphs.load(_data);
        this.totalItems = this.paragraphs.count();
      } else {
        this.alert('warning', 'No hay fotos agregadadas a este bien', '');
      }
    });
  }

  getImage(docName: string) {
    this.wContentService.getObtainFile(docName).subscribe(data => {
      const type = this.detectMimeType(data);
      let blob = this.dataURItoBlob(data, type);
      let file = new Blob([blob], { type });

      const fileURL = URL.createObjectURL(file);
      this.openPrevImg(fileURL);
    });
  }

  dataURItoBlob(dataURI: any, type: string) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type });
    return blob;
  }

  openPrevImg(imageUrl: string) {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl),
          type: 'img',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalservice.show(PreviewDocumentsComponent, config);
  }

  close(): void {
    this.bsModalRef.hide();
  }

  detectMimeType(base64String: string, fileName = 'unamedfile') {
    let ext = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (ext === undefined || ext === null || ext === '') ext = 'bin';
    ext = ext.toLowerCase();
    const signatures: any = {
      JVBERi0: 'application/pdf',
      R0lGODdh: 'image/gif',
      R0lGODlh: 'image/gif',
      iVBORw0KGgo: 'image/png',
      TU0AK: 'image/tiff',
      '/9j/': 'image/jpg',
      UEs: 'application/vnd.openxmlformats-officedocument.',
      PK: 'application/zip',
    };
    for (const s in signatures) {
      if (base64String.indexOf(s) === 0) {
        let x = signatures[s];
        if (ext.length > 3 && ext.substring(0, 3) === 'ppt') {
          x += 'presentationml.presentation';
        } else if (ext.length > 3 && ext.substring(0, 3) === 'xls') {
          x += 'spreadsheetml.sheet';
        } else if (ext.length > 3 && ext.substring(0, 3) === 'doc') {
          x += 'wordprocessingml.document';
        }
        return x;
      }
    }
    const extensions: any = {
      xls: 'application/vnd.ms-excel',
      ppt: 'application/vnd.ms-powerpoint',
      doc: 'application/msword',
      xml: 'text/xml',
      mpeg: 'audio/mpeg',
      mpg: 'audio/mpeg',
      txt: 'text/plain',
    };
    for (const e in extensions) {
      if (ext.indexOf(e) === 0) {
        const xx = extensions[e];
        return xx;
      }
    }
    return 'unknown';
  }
}
