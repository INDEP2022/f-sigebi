import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
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
    this.paragraphs = data;
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
      icon: undefined,
      title: 'Información',
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
        callback: (next: boolean) => {
          //if (next){ this.getData();}
          debugger;
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UploadImgFieldModalComponent, config);

    /* let loadingPhotos = 0;
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
  
      callBack: (next?: boolean) => {
        if (next) {

          debugger
          loadingPhotos = loadingPhotos + 1;
          setTimeout(() => {
            
          }, 7000);
          if (loadingPhotos == 1) {
            this.alert(
              'success',
              'Acción correcta',
              'Imagen agregada correctamente'
            );
          }
        }
      },
    };
    this.modalService.show(UploadFileComponent, config); */
  }
}
