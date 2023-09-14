import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IPhotos } from 'src/app/core/models/catalogs/photograph-media.model';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { UploadFileComponent } from '../expedients-tabs/sub-tabs/photos-assets/upload-file/upload-file.component';
import { PHOTOGRAPHY_COLUMNS } from './photography-columns';

@Component({
  selector: 'app-photography-form',
  templateUrl: './photography-form.component.html',
  styleUrls: ['./photography.scss'],
})
export class PhotographyFormComponent extends BasePage implements OnInit {
  photographs: any[] = [];
  programming: Iprogramming;
  showForm: boolean = false;
  loadingTable: boolean = false;
  photographyForm: FormGroup = new FormGroup({});
  totalItems: number = 0;
  good: number;
  formLoading: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  private data: any[][] = [];
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private wcontentService: WContentService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: PHOTOGRAPHY_COLUMNS,
      edit: {
        editButtonContent: '<i  class="fa fa-eye text-info mx-2" > Ver</i>',
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getImageGood());
  }

  prepareForm() {
    this.photographyForm = this.fb.group({
      managementNumber: [this.good],
      noProgrammation: [null],
      noImage: [null],
      author: [null, [Validators.pattern(STRING_PATTERN)]],
      titleImage: [null, [Validators.pattern(STRING_PATTERN)]],
      noPhotography: [null],
      text: [null, [Validators.pattern(STRING_PATTERN)]],
      programmingFolio: [null],
    });
  }

  getImageGood() {
    this.loadingTable = true;
    const formDatra: Object = {
      xidBien: this.good,
    };
    this.wcontentService.getDocumentos(formDatra).subscribe({
      next: response => {
        const _data = response.data.filter((img: any) => {
          if (img.dDocType == 'DigitalMedia') {
            return img;
          }
          //if (img.dDocType == 'DigitalMedia') return img;
        });

        if (_data.length > 0) {
          this.photographs =
            _data.length > 10 ? this.setPaginate([..._data]) : _data;
          this.totalItems = _data.length;
          this.loadingTable = false;
        } else {
          this.alert(
            'warning',
            'Información',
            'No hay imágenes agregadadas a este bien'
          );
          this.loadingTable = false;
        }
      },
      error: error => {
        this.loadingTable = false;
      },
    });
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

  loadImages() {
    console.log('loadImages photography');
    let loadingPhotos = 0;
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      goodProg: this.good,
      programming: this.programming,
      process: 'programming',
      callback: (next?: boolean) => {
        if (next) {
          this.formLoading = true;
          loadingPhotos = loadingPhotos + 1;
          setTimeout(() => {
            this.getImageGood();
            this.formLoading = false;
          }, 8000);
          if (loadingPhotos == 1) {
            this.alertInfo(
              'success',
              'Acción correcta',
              'Imagen agregada correctamente'
            ).then();
          }
        }
      },
    };
    this.modalService.show(UploadFileComponent, config);
  }

  viewImage(data: IPhotos) {
    this.wcontentService.getObtainFile(data.dDocName).subscribe(data => {
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
    this.modalService.show(PreviewDocumentsComponent, config);
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

  uploadPhotography() {}

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
