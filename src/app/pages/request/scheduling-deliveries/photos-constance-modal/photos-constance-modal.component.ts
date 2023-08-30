import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { UploadFileComponent } from '../../shared-request/expedients-tabs/sub-tabs/photos-assets/upload-file/upload-file.component';
import { PHOTOS_TABLE_COLUMNS } from './phtos-constance-columns';

@Component({
  selector: 'app-photos-constance-modal',
  templateUrl: './photos-constance-modal.component.html',
  styles: [],
})
export class PhotosConstanceModalComponent extends BasePage implements OnInit {
  progGood: any = {};
  showSearchFilter: boolean = false;
  filterForm: FormGroup = new FormGroup({});

  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  typeGoods = new DefaultSelect();
  data: any = [];
  nomProcess: string = null;
  typeDoc: any = null;

  private bsModelRef = inject(BsModalRef);
  private fb = inject(FormBuilder);
  private typeRelevantService = inject(TypeRelevantService);
  private content = inject(WContentService);
  private sanitizer = inject(DomSanitizer);
  private modelService = inject(BsModalService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setSettings();
    this.initSearchForm();
    //this.getTypeRelevant(new ListParams());
  }

  initSearchForm() {
    this.filterForm = this.fb.group({
      management: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      typeGood: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.filterForm.get('management').setValue(this.progGood.goodId);
  }

  setSettings() {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: {
        delete: false,
        edit: true,
        columnTitle: 'Acciones',
        position: 'right',
      },

      edit: {
        editButtonContent:
          '<i class="fa fa-eye tooltip="Ver" containerClass="tooltip-style" text-primary mx-2" ></i>',
      },
      /*delete: {
        deleteButtonContent:
          '<i class="fa fa-upload tooltip="Subir" containerClass="tooltip-style" text-info mx-2"></i>',
      }, */

      selectMode: '',
      columns: PHOTOS_TABLE_COLUMNS,
    };
  }

  getTypeRelevant(params: ListParams) {
    params['sortBy'] = 'description:ASC';
    this.typeRelevantService.getAll(params).subscribe({
      next: data => {
        this.typeGoods = new DefaultSelect(data.data, data.count);
      },
    });
  }

  searchPhotos() {
    const form = this.filterForm.getRawValue();
    const body: any = {};
    body.xidBien = form.management;
    body.xtipoDocumento = form.typeGood;
    this.getDocuments(body);
  }

  clean() {
    this.filterForm.reset();
    this.paragraphs = [];
  }

  getDocuments(body: any) {
    this.loading = true;
    this.content
      .getDocumentos(body)
      .pipe(
        catchError((e: any) => {
          if (e.status == 400) return of({ data: [], count: 0 });
          this.loading = false;
          throw e;
        })
      )
      .subscribe({
        next: resp => {
          const _data = resp.data.filter((img: any) => {
            if (img.dDocType == 'DigitalMedia') return img;
          });

          if (_data.length > 0) {
            this.paragraphs =
              _data.length > 10 ? this.setPaginate([..._data]) : _data;
            this.totalItems = _data.length;
            this.loading = false;
          } else {
            this.selectPage();
          }

          this.loading = false;
        },
      });
  }

  private selectPage() {
    this.paragraphs = [...this.data[this.params.value.page - 1]];
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

  seePhoto(event: any) {
    console.log(event);
    this.getImage(event.dDocName);
  }

  close() {
    this.bsModelRef.hide();
  }

  getImage(docName: string) {
    this.content.getObtainFile(docName).subscribe(data => {
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
    this.modelService.show(PreviewDocumentsComponent, config);
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

  uploadFiles() {
    console.log('uploadFiles photos-assets');
    let loadingPhotos = 0;
    const idRequest: any = null;
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      statusTask: '',
      data: this.progGood,
      idRequest,
      nomProcess: this.nomProcess,
      typeDoc: this.typeDoc,
      process: 'scheduling-deliveries',
      callBack: (next?: boolean) => {
        if (next) {
          this.alert(
            'success',
            'Acción correcta',
            'Imagen agregada correctamente'
          );
          setTimeout(() => {
            this.paragraphs = [];
            this.searchPhotos();
          }, 300);
        }
      },
    };
    this.modelService.show(UploadFileComponent, config);
  }
}
