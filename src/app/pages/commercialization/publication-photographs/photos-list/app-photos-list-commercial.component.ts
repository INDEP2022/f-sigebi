import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of, takeUntil } from 'rxjs';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodPhotoFav } from 'src/app/core/models/ms-goodphoto/good-photo.model';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { FilePhotoSaveZipService } from 'src/app/core/services/ms-ldocuments/file-photo-save-zip.service';
import {
  FilePhotoService,
  IPhotoFile,
} from 'src/app/core/services/ms-ldocuments/file-photo.service';
import { GoodPhotoService } from 'src/app/core/services/ms-photogood/good-photo.service';
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
  @Input() lot: any;
  @Input() event: any;
  @Output() fileEmiter = new EventEmitter<IPhotoFile[]>();
  @Output() imageEmitter = new EventEmitter<any>();
  @Input()
  get goodNumber() {
    return this._goodNumber;
  }
  set goodNumber(value) {
    console.log('AQUI', value);
    this._goodNumber = value;
    if (value) {
      this.getData(true);
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
  loading2: boolean = false;
  constructor(
    private filePhotoService: FilePhotoService,
    private modalService: BsModalService,
    private segAppService: SecurityService,
    private dictationService: DictationService,
    private proceedingService: ProceedingsService,
    private filePhotoSaveZipService: FilePhotoSaveZipService,
    private service: GoodPhotosService,
    private fb: FormBuilder,
    private goodPhotoService: GoodPhotoService
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

  private getData(val?: boolean) {
    this.files = [];
    this.filePhotoService
      .getAll(this.goodNumber + '')
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            let result = response.map(async item => {
              const params = new ListParams();
              params['filter.eventId'] = `$eq:${this.event}`;
              params['filter.batchId'] = `$eq:${this.lot}`;
              params['filter.goodNumber'] = `$eq:${item.no_bien}`;
              params['filter.consecNumber'] = `$eq:${item.no_consec}`;
              item['favorite'] = await this.getFavPhoto(params);
              item['post'] = item.publ_img_cat_web ? true : false;
            });
            Promise.all(result).then(resp => {
              this.files = [...response];
              this.fileEmiter.emit(this.files);
            });
          }
        },
        error: err => {
          if (val) this.alert('warning', 'No se encontraron fotos', '');
        },
      });
  }

  getFavPhoto(params: ListParams): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.goodPhotoService.getComerPhotoFav(params).subscribe({
        next(value) {
          resolve(true);
        },
        error(err) {
          resolve(false);
        },
      });
    });
  }
  validationUser(file: IPhotoFile) {
    if (!file.usuario_creacion) return true;
    if (file.usuario_creacion.length === 0) return true;
    /// if (file.usuario_creacion.toUpperCase() === this.userName) return true;
    return false;
  }

  async selectFilePub(image: IPhotoFile, event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.files[index]['post'] = checked;

    const img = {
      goodNumber: image.no_bien,
      consecNumber: Number(image.no_consec),
      publicImgcatWeb: checked ? 1 : 0,
    };
    // PUP_UPDATE_FOTO
    this.loading = true;
    const resp = await this.updatePhotoGood(img);
    if (!resp) {
      this.loading = false;
      this.alert(
        'warning',
        `No se pudo publicar el bien ${image.no_bien}, consecutivo ${image.no_consec}`,
        ''
      );
    } else {
      this.loading = false;
    }
  }

  async selectFileFav(image: IPhotoFile, event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.files[index]['favorite'] = checked;
    let V_FOTOFAVORITA = 0;
    this.loading = true;
    if (checked) {
      V_FOTOFAVORITA = await this.pufValFavorite(); // PUF_VALFOTFAVORITA(:COMER_LOTES.ID_LOTE);
      if (V_FOTOFAVORITA == 0) {
        const img = {
          goodNumber: image.no_bien,
          consecNumber: Number(image.no_consec),
          publicImgcatWeb: checked ? 1 : 0,
        };
        // PUP_UPDATE_FOTO
        await this.updatePhotoGood(img);
        // PUP_UPDFOTFAVORITA
        let resp = await this.pupUpdateFavorite(
          'I',
          this.event,
          this.lot,
          Number(image.no_bien),
          image.no_consec
        );
        if (!resp) {
          this.files[index]['favorite'] = !checked;
          this.loading = false;
        } else {
          // PUP_VISUALFOT
          this.imageEmitter.emit();
          this.files[index]['post'] = checked;
          this.loading = false;
        }
      } else {
        this.loading = false;
        this.alert(
          'warning',
          'No es posible actualizar',
          'Ya se ha asignado una fotografía favorita al Lote.'
        );
        this.files[index]['favorite'] = !checked;
      }
    } else {
      await this.pupUpdateFavorite(
        'D',
        this.event,
        this.lot,
        Number(image.no_bien),
        image.no_consec
      );
      // PUP_VISUALFOT
      this.imageEmitter.emit();
      this.loading = false;
    }
  }

  async updatePhotoGood(image: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.goodPhotoService.update(image).subscribe({
        next(value) {
          resolve(true);
        },
        error(err) {
          resolve(false);
        },
      });
    });
  }

  async pufValFavorite(): Promise<number> {
    // SERVICIO
    return 0;
  }
  async pupUpdateFavorite(
    pAction: string,
    pEvento: number,
    pLote: number,
    pBien: number,
    pConsec: number
  ): Promise<boolean> {
    if (pAction == 'I') {
      const data: GoodPhotoFav = {
        eventId: pEvento,
        batchId: pLote,
        goodNumber: pBien,
        consecNumber: pConsec,
      };
      let resp = await this.createFavPhoto(data);
      if (!resp)
        this.alert(
          'warning',
          'Ya se encuentra una fotografía como favorita',
          `Bien: ${pBien}, Consec. ${pConsec}`
        );
      return resp;
    } else if (pAction == 'D') {
      const data: GoodPhotoFav = {
        eventId: pEvento,
        batchId: pLote,
        goodNumber: pBien,
        consecNumber: pConsec,
      };
      let resp = await this.deleteFavPhoto(data);
      if (!resp)
        this.alert(
          'warning',
          'No se pudo eliminar de favoritos la fotografía',
          `Bien: ${pBien}, Consec. ${pConsec}`
        );
      return resp;
    } else {
      return true;
    }
  }
  async createFavPhoto(params: GoodPhotoFav): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.goodPhotoService.createComerPhotoFav(params).subscribe({
        next(value) {
          resolve(true);
        },
        error(err) {
          resolve(false);
        },
      });
    });
  }

  async deleteFavPhoto(params: GoodPhotoFav): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.goodPhotoService.deleteComerPhotoFav(params).subscribe({
        next(value) {
          resolve(true);
        },
        error(err) {
          resolve(false);
        },
      });
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
