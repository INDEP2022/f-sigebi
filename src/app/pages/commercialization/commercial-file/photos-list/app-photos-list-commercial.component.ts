import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of, takeUntil } from 'rxjs';
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
import { GoodPhotosService } from 'src/app/pages/general-processes/good-photos/services/good-photos.service';

@Component({
  selector: 'app-photos-list-commercial',
  templateUrl: './app-photos-list-commercial.component.html',
  styleUrls: ['./app-photos-list-commercial.component.scss'],
})
export class PhotosListCommercialComponent extends BasePage implements OnInit {
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
  private _goodNumber: string | number;
  errorMessage: string = '';
  // lastConsecutive: number = 1;
  filesToDelete: string[] = [];
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

  async ngOnInit() {
    if (!this.origin) return;
    if (this.origin > 0) {
      this.getSegPantalla().subscribe({
        next: response => {
          if (response && response.length > 0) {
            console.log('Entro');
            this.errorMessage = null;
          }
        },
        error: err => {},
      });
    }
  }

  private async pufValidaProcesoBien() {
    const existe = await firstValueFrom(
      this.proceedingService.getExistProceedings(this._goodNumber + '').pipe(
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
    /* const modalConfig = {
      ...MODAL_CONFIG,
      initialState: {
        goodNumber: this.goodNumber + '',
      },
    };
    this.modalService.show(PhotosHistoricComponent, modalConfig); */
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

  selectFile(image: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    if (checked) {
      this.filesToDelete.push(image);
    } else {
      this.filesToDelete = this.filesToDelete.filter(file => file != image);
    }
  }

  private getData() {
    this.files = [];
    this.filePhotoService
      .getAll(this.goodNumber + '')
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.files = [...response];
          }
        },
      });
  }

  openFileUploader() {
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
        accept2:
          'image/jpg, image/jpeg, image/png, image/gif, image/tiff, image/tif, image/raw,  image/webm, image/bmp, image/svg',
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
