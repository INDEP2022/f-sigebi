import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as FileSaver from 'file-saver';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  catchError,
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
import {
  FilePhotoService,
  IPhotoFile,
} from 'src/app/core/services/ms-ldocuments/file-photo.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared';
import { PhotosHistoricComponent } from '../photos-historic/photos-historic.component';
import { GoodPhotosService } from '../services/good-photos.service';
import { PhotoComponent } from './photo/photo.component';

@Component({
  selector: 'app-photos-list',
  templateUrl: './photos-list.component.html',
  styleUrls: ['./photos-list.component.scss'],
})
export class PhotosListComponent extends BasePage implements OnInit {
  @Input() disabled: boolean = true;
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
      this.errorMessage = '';
    }
  }
  @ViewChildren('photo') photos: QueryList<PhotoComponent>;
  private _goodNumber: string | number;
  options = [
    { value: 1, label: 'Visualizar' },
    { value: 2, label: 'Editar' },
  ];
  errorMessage: string = '';
  // lastConsecutive: number = 1;
  filesToDelete: IPhotoFile[] = [];
  files: IPhotoFile[] = [];
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

  get userName() {
    return this.service.userName;
  }

  async download(all = false) {
    this.alert(
      'warning',
      'Aviso',
      'La descarga está en proceso, favor de esperar'
    );
    let photos: any[] = [];
    this.photos.forEach(row => {
      let file = row.file;
      if (all) {
        photos.push(row);
        return;
      }
      if (this.filesToDelete.map(x => x.name).includes(row.file.name)) {
        photos.push(row);
      }
    });
    const zip = await this.service.downloadByGood(photos);
    const name = this.goodNumber + '.zip';
    zip.generateAsync({ type: 'blob' }).then(content => {
      if (content) {
        FileSaver.saveAs(content, name);
        this.alert('success', 'Archivo Descargado Correctamente', '');
      }
    });
  }

  async ngOnInit() {
    if (!this.origin) return;
    if (this.origin > 0) {
      this.getSegPantalla().subscribe({
        next: response => {
          if (response && response.length > 0) {
            console.log('Entro');
            this.errorMessage = null;
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
      this.proceedingService.getExistProceedings(this.goodNumber + '').pipe(
        takeUntil(this.$unSubscribe),
        catchError(x => {
          return of({ data: [] as { no_acta: string }[] });
        }),
        map(x => (x.data.length > 0 ? x.data[0].no_acta : null))
      )
    );
    return existe;
  }

  private async pufValidaUsuario() {
    const filterParams = new FilterParams();
    filterParams.addFilter('typeNumber', 'ELIMFOTOS');
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
      // this.userPermisions = false;
      this.errorMessage =
        'No tiene permisos para cambiar a histórico las fotos';
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
    return this.validFilesToDelete.length < 1 || this.errorMessage;
  }

  get validFilesToDelete() {
    return this.files.filter(row =>
      row.usuario_creacion ? row.usuario_creacion === this.userName : true
    );
  }

  selectFile(image: IPhotoFile, event: Event) {
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
    // this.lastConsecutive = 1;
    if (this.goodNumber) {
      this.filePhotoService
        .getAll(this.goodNumber + '')
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: async response => {
            if (response) {
              // console.log(response);
              if (response) {
                this.files = [...response];
                // this.errorMessage = null;
                // return;
                if (!this.errorMessage) {
                  const pufValidaUsuario = await this.pufValidaUsuario();
                  if (pufValidaUsuario === 1) {
                    this.errorMessage = null;
                  } else {
                    const noActa = await this.pufValidaProcesoBien();
                    if (noActa) {
                      this.errorMessage =
                        'No tiene permisos de sustitución a histórico debido a que el bien ya fue recibido por el acta ' +
                        noActa +
                        ' y esta se encuentra cerrada';
                      // console.log(this.errorMessage);
                    } else {
                      this.errorMessage = null;
                    }
                  }
                }
              }
            }
          },
        });
    } else {
      this.errorMessage = null;
    }
  }

  async confirmDelete(all = false) {
    // if (this.disabledDeletePhotos()) return;
    console.log(this.files, this.filesToDelete);
    if (all) {
      if (this.disabledDeleteAllPhotos()) {
        return;
      }
      this.filesToDelete = [...this.validFilesToDelete];
    }
    if (this.disabledDeletePhotos()) {
      return;
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
        ? '¿Estás seguro que desea cambiar a histórico todas las fotos?'
        : '¿Estás seguro que desea cambiar a histórico las fotos seleccionadas?'
    );
    if (result.isConfirmed) {
      this.deleteSelectedFiles();
    }
  }

  validationUser(file: IPhotoFile) {
    if (!file.usuario_creacion) return true;
    if (file.usuario_creacion.length === 0) return true;
    if (file.usuario_creacion.toUpperCase() === this.userName) return true;
    return false;
  }

  private async deleteSelectedFiles() {
    this.errorImages = [];
    this.loader.load = true;
    const results = await Promise.all(
      this.filesToDelete.map(async file => {
        const index = file.name.indexOf('F');
        const finish = file.name.indexOf('.');
        return await firstValueFrom(
          this.deleteFile(
            +file.name.substring(index + 1, finish),
            file.name
          ).pipe(debounceTime(500))
        );
      })
    );
    if (this.errorImages.length === this.filesToDelete.length) {
      this.alert(
        'error',
        'ERROR',
        'No se pudieron cambiar a histórico las fotos'
      );
    } else {
      if (this.errorImages.length > 0) {
        this.alert(
          'warning',
          'Fotos a Histórico',
          'Pero no se puedieron cambiar todas las fotos'
        );
      } else {
        this.alert(
          'success',
          'Eliminación de Fotos',
          'Las fotos seleccionadas se han eliminado'
        );
      }
    }
    this.loader.load = false;
    this.filesToDelete = [];
    this.service.deleteEvent.next(true);
    this.getData();
    // const obs = this.filesToDelete.map(filename => {
    //   const index = filename.indexOf('F');
    //   const finish = filename.indexOf('.');
    //   return this.deleteFile(
    //     +filename.substring(index + 1, finish),
    //     filename
    //   ).pipe(debounceTime(500));
    // });
    // concat(...obs)
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe({
    //     complete: () => {
    //       // this.files = [];
    //       this.alert(
    //         'success',
    //         'Eliminación de Fotos',
    //         'Se eliminaron las fotos correctamente'
    //       );
    //       this.filesToDelete = [];
    //       this.service.deleteEvent.next(true);
    //       this.getData();
    //     },
    //     error: err => {
    //       this.alert(
    //         'error',
    //         'Imagenes sin eliminar',
    //         this.errorImages.toString()
    //       );
    //       if (this.errorImages.length < this.filesToDelete.length) {
    //         this.filesToDelete = [];
    //         this.service.deleteEvent.next(true);
    //         this.getData();
    //       }
    //     },
    //   });
  }

  private deleteFile(consecNumber: number, filename: string) {
    return this.filePhotoService
      .deletePhoto(this.goodNumber + '', consecNumber)
      .pipe(
        catchError(error => {
          console.log(error);
          // this.alert(
          //   'error',
          //   'Error',
          //   'Ocurrió un error al eliminar la imagen'
          // );
          this.errorImages.push(error.error.message);
          return of(null);
        })
      );
  }

  openFileUploader() {
    // this.filePhotoService.consecNumber = this.lastConsecutive;
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        accept:
          'image/jpg, image/jpeg, image/png, image/gif, image/tiff, image/tif, image/raw,  image/webm, image/bmp, image/svg',
        uploadFiles: false,
        service: this.filePhotoService,
        identificator: this.goodNumber + '',
        titleFinishUpload: 'Imagenes Cargadas Correctamente',
        questionFinishUpload: '¿Desea subir más imagenes?',
        callback: (refresh: boolean) => {
          // console.log(refresh);
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
        accept2:
          'image/jpg, image/jpeg, image/png, image/gif, image/tiff, image/tif, image/raw,  image/webm, image/bmp, image/svg',
        uploadFiles: false,
        service: this.filePhotoSaveZipService,
        identificator: [this.goodNumber],
        multiple: false,
        titleFinishUpload: 'Imagenes Cargadas Correctamente',
        questionFinishUpload: '¿Desea subir más imagenes?',
        callback: (refresh: boolean) => {
          // console.log(refresh);
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
