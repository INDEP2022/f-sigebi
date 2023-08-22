import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { IWContent } from 'src/app/core/models/ms-wcontent/wcontent.model';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { UploadImgFieldModalComponent } from '../upload-img-field-modal/upload-img-field-modal.component';
import { LIST_IMAGES_COLUMNS } from './columns/list-images-columns';

var data = [
  {
    NoManagement: '123545',
    noAssets: '1',
    typeDocument: 'FOTOS DEL BIEN',
    titleDocument: 'Imagenes Bien',
    author: 'Luis_Rojas',
    date: '11/12/2022',
    noProgramming: '12455',
    folioProgramming: '',
  },
];
@Component({
  selector: 'app-upload-images-form',
  templateUrl: './upload-images-form.component.html',
  styleUrls: ['./upload-images-form.component.scss'],
})
export class UploadImagesFormComponent extends BasePage implements OnInit {
  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  showSearchForm: boolean = false;
  searchPhotoForm: ModelForm<any>;
  columns = LIST_IMAGES_COLUMNS;
  file: File | null = null;
  displayUploadPhoto: boolean = false;

  //datos pasados desde el modal
  good: any[] = [];

  private modalService = inject(BsModalService);
  private wcontentService = inject(WContentService);

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: LIST_IMAGES_COLUMNS,
    };

    this.columns.button = {
      ...this.columns.button,
      onComponentInitFunction(instance?: any) {
        instance.clicked.subscribe((data: any) => {
          console.log(data);
        });
      },
    };
    this.initForm();
    this.getData();
  }

  initForm(): void {
    this.searchPhotoForm = this.fb.group({
      xidBien: [{ value: 0.0, disabled: true }],
      xNoProgramacion: [null],
      dDocName: [null, [Validators.pattern(STRING_PATTERN)]],
      dDocAuthor: [null, [Validators.pattern(STRING_PATTERN)]],
      dDocTitle: [null, [Validators.pattern(STRING_PATTERN)]],
      texto: [null, [Validators.pattern(STRING_PATTERN)]],
      xFolioProgramacion: [null],
    });
  }

  getData() {
    this.loading = true;
    let body: IWContent = {};
    body.xidBien = this.good[0].id; //'9549189'
    this.wcontentService.getDocumentos(body).subscribe({
      next: resp => {
        const result = resp.data.filter(x => x.dDocType == 'DigitalMedia');

        const data = result.map(async (item: any) => {
          const xtipoDoc = await this.getTypeDocuments(item.xtipoDocumento);
          item['xTipoDoc'] = xtipoDoc;
        });

        Promise.all(data).then(item => {
          this.paragraphs = result;
          this.totalItems = result.length;
          this.loading = false;
        });
      },
    });
  }

  addImage(event: any): void {
    //preguntar si sube multiples fotos o solo una foto
    const file: File = event.target.files;
    console.log(file);

    this.displayUploadPhoto = true;
  }

  close(): void {
    this.modalRef.hide();
  }

  messageSuccess() {
    const message = 'La(s) fotografías se han cargado correctamente';
    Swal.fire({
      icon: 'success',
      title: '',
      text: message,
      confirmButtonColor: '#9D2449',
      confirmButtonText: 'Aceptar',
      footer: '',
      allowOutsideClick: false,
    });
  }

  uploadImage() {
    let config: ModalOptions = {
      initialState: {
        data: this.good,
        process: 'sampling-assets',
        callback: (next?: boolean) => {
          if (next) {
            setTimeout(() => {
              this.messageSuccess();
              this.getData();
            }, 300);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UploadImgFieldModalComponent, config);
  }

  getTypeDocuments(id: number | string) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      this.wcontentService.getDocumentTypes(params).subscribe({
        next: resp => {
          const result: any = resp.data.filter(x => x.ddocType == id);
          const descrip = result.length > 0 ? result[0].ddescription : '';

          resolve(descrip);
        },
      });
    });
  }
}
