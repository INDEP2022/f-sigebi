import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  catchError,
  concat,
  debounceTime,
  firstValueFrom,
  map,
  of,
  takeUntil,
} from 'rxjs';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { FilePhotoSaveZipService } from 'src/app/core/services/ms-ldocuments/file-photo-save-zip.service';
import { FilePhotoService } from 'src/app/core/services/ms-ldocuments/file-photo.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared';
import { PhotosHistoricComponent } from '../photos-historic/photos-historic.component';
import { GoodPhotosService } from '../services/good-photos.service';

@Component({
  selector: 'app-photos-list',
  templateUrl: './photos-list.component.html',
  styleUrls: ['./photos-list.component.scss'],
})
export class PhotosListComponent extends BasePage implements OnInit {
  @Input() disabled: boolean;
  @Input() origin: number;
  @Input()
  get goodNumber() {
    return this._goodNumber;
  }
  set goodNumber(value) {
    this._goodNumber = value;
    if (value) {
      this.getData();
    } else {
      this.files = [];
    }
  }
  private _goodNumber: string | number;
  errorMessage = '';
  userPermisions = true;
  // lastConsecutive: number = 1;
  filesToDelete: string[] = [];
  files: string[] = [];
  form: FormGroup;
  errorImages: string[] = [];
  constructor(
    private filePhotoService: FilePhotoService,
    private modalService: BsModalService,
    private segAppService: SecurityService,
    private dictationService: DictationService,
    private proceedingService: ProceedingsService,
    private filePhotoSaveZipService: FilePhotoSaveZipService,
    private service: GoodPhotosService,
    private fb: FormBuilder
  ) {
    super();
    this.form = this.fb.group({
      typedblClickAction: [1],
    });
  }

  get typedblClickAction() {
    return this.form ? this.form.get('typedblClickAction').value : 1;
  }

  async ngOnInit() {
    if (!this.origin) return;
    if (this.origin > 0) {
      this.getSegPantalla().subscribe({
        next: response => {
          if (response && response.length > 0) {
            console.log('Entro');
          } else {
            this.validRastrer();
          }
        },
        error: err => {
          this.validRastrer();
        },
      });
    }
  }

  private async pufValidaProcesoBien() {
    const existe = await firstValueFrom(
      this.proceedingService.getExistProceedings(this._goodNumber + '').pipe(
        takeUntil(this.$unSubscribe),
        catchError(x => {
          return of({ data: [] as { existe: number }[] });
        }),
        map(x => x.data.length > 0)
      )
    );
    return existe;
  }

  private async pufValidaUsuario() {
    const filterParams = new FilterParams();
    filterParams.addFilter('typeNumber', 'CARBIEN');
    // filterParams.addFilter('user', 'DR_SIGEBI');
    filterParams.addFilter(
      'user',
      localStorage.getItem('username').toUpperCase()
    );
    filterParams.addFilter('delete', 'S');
    // filterParams.addFilter()
    const rdicta = await firstValueFrom(
      this.dictationService
        .getRTdictaAarusr(filterParams.getParams())
        .pipe(catchError(x => of({ count: 0 })))
    );
    if (rdicta && rdicta.count && rdicta.count > 0) {
      return 1;
    }
    return 0;
  }

  showHistoric() {
    const modalConfig = {
      ...MODAL_CONFIG,
      initialState: {
        goodNumber: this.goodNumber + '',
      },
    };
    this.modalService.show(PhotosHistoricComponent, modalConfig);
  }

  private validRastrer() {
    if (localStorage.getItem('username').toUpperCase() !== 'SERA') {
      this.userPermisions = false;
    }
  }

  private getSegPantalla() {
    const filterParams = new FilterParams();
    filterParams.addFilter('screenKey', 'FIMGFOTBIEADD');
    filterParams.addFilter(
      'user',
      localStorage.getItem('username').toUpperCase()
    );
    filterParams.addFilter('writingPermission', 'S');
    return this.segAppService
      .getScreenWidthParams(filterParams.getFilterParams())
      .pipe(
        takeUntil(this.$unSubscribe),
        map(x => (x.data ? x.data : []))
      );
  }

  disabledDeletePhotos() {
    return this.disabledDeleteAllPhotos() || this.filesToDelete.length === 0;
  }

  disabledDeleteAllPhotos() {
    return this.files.length < 1 || !this.userPermisions;
  }

  selectFile(image: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    if (checked) {
      this.filesToDelete.push(image);
    } else {
      this.filesToDelete = this.filesToDelete.filter(file => file != image);
    }
  }

  private async getData() {
    this.files = [];
    // debugger;
    // this.lastConsecutive = 1;
    this.filePhotoService
      .getAll(this.goodNumber + '')
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: async response => {
          if (response) {
            console.log(response);
            // debugger;
            if (response) {
              this.files = [...response];
              // const index = last.indexOf('F');
              // this.lastConsecutive += +last.substring(index + 1, index + 5);
              const pufValidaUsuario = await this.pufValidaUsuario();
              if (pufValidaUsuario === 1) {
                this.userPermisions = true;
              } else {
                const pufValidaProcesoBien = await this.pufValidaProcesoBien();
                if (pufValidaProcesoBien) {
                  this.errorMessage =
                    'No puede eliminar las fotos, el bien ya fue recibido';
                  console.log(this.errorMessage);

                  this.userPermisions = false;
                  // this.userPermisions = true;
                } else {
                  this.userPermisions = true;
                }
              }
            }
          }
        },
      });
  }

  async confirmDelete(all = false) {
    // if (this.disabledDeletePhotos()) return;
    if (all) {
      this.filesToDelete = [...this.files];
    }
    if (this.filesToDelete.length < 1) {
      this.alert(
        'warning',
        'Advertencia',
        'Debes seleccionar mínimo un archivo'
      );
      return;
    }

    const result = await this.alertQuestion(
      'warning',
      'Advertencia',
      all
        ? '¿Estás seguro que desea eliminar todas las fotos?'
        : '¿Estás seguro que desea eliminar las fotos seleccionadas?'
    );
    if (result.isConfirmed) {
      this.deleteSelectedFiles();
    }
  }

  private async deleteSelectedFiles() {
    this.errorImages = [];
    const obs = this.filesToDelete.map(filename => {
      const index = filename.indexOf('F');
      const finish = filename.indexOf('.');
      return this.deleteFile(
        +filename.substring(index + 1, finish),
        filename
      ).pipe(debounceTime(500));
    });
    concat(...obs)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        complete: () => {
          // this.files = [];
          this.alert(
            'success',
            'Eliminación de Fotos',
            'Se eliminaron las fotos correctamente'
          );
          this.filesToDelete = [];
          this.service.deleteEvent.next(true);
          this.getData();
        },
        error: err => {
          this.alert(
            'error',
            'Imagenes sin eliminar',
            this.errorImages.toString()
          );
          if (this.errorImages.length < this.filesToDelete.length) {
            this.filesToDelete = [];
            this.service.deleteEvent.next(true);
            this.getData();
          }
        },
      });
  }

  private deleteFile(consecNumber: number, filename: string) {
    return this.filePhotoService
      .deletePhoto(this.goodNumber + '', consecNumber)
      .pipe(
        catchError(error => {
          // this.alert(
          //   'error',
          //   'Error',
          //   'Ocurrió un error al eliminar la imagen'
          // );
          this.errorImages.push(filename);
          return null;
        })
      );
  }

  openFileUploader() {
    // this.filePhotoService.consecNumber = this.lastConsecutive;
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        accept: 'image/*',
        uploadFiles: false,
        service: this.filePhotoService,
        identificator: this.goodNumber + '',
        titleFinishUpload: 'Imagenes cargadas correctamente',
        questionFinishUpload: '¿Desea subir más imagenes?',
        callback: (refresh: boolean) => {
          console.log(refresh);
          this.fileUploaderClose(refresh);
        },
      },
    };
    this.modalService.show(FileUploadModalComponent, config);
  }

  openZipUploader() {
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        accept: '.zip',
        uploadFiles: false,
        service: this.filePhotoSaveZipService,
        identificator: this.goodNumber + '',
        multiple: false,
        titleFinishUpload: 'Imagenes cargadas correctamente',
        questionFinishUpload: '¿Desea subir más imagenes?',
        callback: (refresh: boolean) => {
          console.log(refresh);
          this.fileUploaderClose(refresh);
        },
      },
    };
    this.modalService.show(FileUploadModalComponent, config);
  }

  refresh(reload: boolean) {
    if (reload) {
      this.getData();
    }
  }

  fileUploaderClose(refresh: boolean) {
    if (refresh) {
      this.getData();
      // this.loadImages(this.folio).subscribe(() => {
      //   this.updateSheets();
      // });
    }
  }
}
