import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  of,
  skip,
  startWith,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IParamsLegalOpinionsOffice } from 'src/app/pages/juridical-processes/depositary/legal-opinions-office/legal-opinions-office/legal-opinions-office.component';
import { DOCUMENTS_SCAN_COLUMNS } from '../utils/documents-scan-columns';
import { DocumentsScanForm } from '../utils/documents-scan-form';
import { DOCUMENTS_SCAN_MESSAGES } from '../utils/documents-scan-messages';

const INVALID_USER = 'INVALIDO';
const SERA_USER = 'SERA';
const DEVELOP_USER = 'DESARROLLO';
@Component({
  selector: 'app-documents-scan',
  templateUrl: './documents-scan.component.html',
  styleUrls: ['./documents-scan.component.scss'],
})
export class DocumentsScanComponent extends BasePage implements OnInit {
  form = this.fb.group(new DocumentsScanForm());
  documentsParams = new BehaviorSubject(new FilterParams());
  documents: IDocuments[] = [];
  totalDocuments = 0;
  data: any[] = [];
  folio: number = null;
  files: string[] = [];
  filesToDelete: string[] = [];
  origin: string = null;
  originFolio: string = '';
  originFlyer: string = '';
  requestOrigin: string = '';
  noDocumentsFound: boolean = false;
  noFoliosFound: boolean = false;
  registerUser: string = INVALID_USER;
  get controls() {
    return this.form.controls;
  }
  paramsScreen: IParamsLegalOpinionsOffice = {
    PAQUETE: '',
    P_GEST_OK: '',
    CLAVE_OFICIO_ARMADA: '',
    P_NO_TRAMITE: '',
    TIPO: '',
    P_VALOR: '',
    TIPO_VO: '',
    NO_EXP: '',
    CONSULTA: '',
  };
  origin2: string = ''; // Pantalla para regresar a la anterior de la que se llamo
  origin3: string = ''; // Pantalla para regresar a la anterior de la que se llamo desde la origin2
  no_bien: number = null;
  expedientNumber: number = null; //no_expediente
  wheelNumber: number = null; //no_volante

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private documentsService: DocumentsService,
    private fileBrowserService: FileBrowserService,
    private modalService: BsModalService,
    private router: Router,
    private authService: AuthService
  ) {
    super();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.folio = params['folio'] ? Number(params['folio']) : null;
        this.originFolio = params['folio'] ?? '';
        this.originFlyer = params['volante'] ?? '';
        this.origin = params['origin'] ?? null;
        this.requestOrigin = params['requestOrigin'] ?? null;
        this.expedientNumber = params['expedientNumber'] ?? null;
        this.wheelNumber = params['wheelNumber'] ?? null;

        console.log(params);
        if (this.origin == 'FACTJURDICTAMOFICIO') {
          for (const key in this.paramsScreen) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
              this.paramsScreen[key as keyof typeof this.paramsScreen] =
                params[key] ?? null;
            }
          }
          this.origin2 = params['origin2'] ?? null;
          this.origin3 = params['origin3'] ?? null;
        }
        if (this.origin == 'FACTJURREGDESTLEG') {
          this.no_bien = params['P_NB'] ?? null;
        }
      });
    this.settings = {
      ...this.settings,
      actions: false,
      columns: DOCUMENTS_SCAN_COLUMNS,
    };
    this.data.length = 15;
  }

  ngOnInit(): void {
    this.paramsSub();
    if (this.folio != null) {
      this.getDocumentsByFolio().subscribe();
    }
  }

  paramsSub() {
    this.documentsParams
      .pipe(
        takeUntil(this.$unSubscribe),
        skip(1),
        switchMap(params => this.fillFoliosTable(params))
      )
      .subscribe();
  }

  fillFoliosTable(params: FilterParams) {
    this.loading = true;
    return this.getDocuments(params).pipe(
      catchError(error => {
        this.loading = false;
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        this.documents = response.data;
        this.totalDocuments = response.count;
        this.noFoliosFound = this.documents.length == 0 ? true : false;
        this.markSelected();
      })
    );
  }

  getDocumentsByFolio() {
    const params = new FilterParams();
    params.addFilter('id', this.folio);
    this.loading = true;
    return this.getDocuments(params).pipe(
      catchError(error => {
        this.registerUser = INVALID_USER;
        this.loading = false;
        const message = DOCUMENTS_SCAN_MESSAGES.FOLIO_NOT_FOUND(this.folio);
        this.handleErrorAlert(message, error);
        return throwError(() => error);
      }),
      map(response => response.data[0] ?? null),
      tap(document => {
        this.registerUser = document.userRegistersScan ?? INVALID_USER;
        this.loading = false;
        if (!document) {
          return;
        }
        const { id } = document;
        const { expedient, folio } = this.controls;
        if (document.numberProceedings) {
          expedient.setValue(Number(document.numberProceedings));
        }
        folio.setValue(this.folio);
        const _params = new FilterParams();
        _params.addFilter('numberProceedings', document.numberProceedings);
        this.documentsParams.next(_params);
        this.loadImages(id).subscribe(
          response => {
            this.files = response;
            // this.noDocumentsFound = false;
          },
          error => {
            // if (error.status < 500) {
            // this.noDocumentsFound = true;
            // } else {
            // this.noDocumentsFound = false;
            // }
            // if (error.status >= 500) {
            // this.noDocumentsFound = true;
            // this.onLoadToast(
            //   'error',
            //   'Error',
            //   'Ocurrió un error al obtener los documentos'
            // );
            // }
          }
        );
      })
    );
  }

  getDocuments(params: FilterParams) {
    return this.documentsService.getAllFilter(params.getParams());
  }

  markSelected() {
    if (!this.folio) {
      return;
    }
    const index = this.documents.findIndex(
      document => document.id == this.folio
    );
    this.settings = {
      ...this.settings,
      selectedRowIndex: index,
    };
  }

  loadImages(folio: string | number) {
    return this.getFileNamesByFolio(folio).pipe(
      catchError(error => {
        if (error.status >= 500) {
          this.noDocumentsFound = true;
          // this.onLoadToast(
          //   'error',
          //   'Error',
          //   'Ocurrió un error al obtener los documentos'
          // );
        }
        return throwError(() => error);
      }),
      map(response => response.data.map(element => element.name)),
      tap(files => {
        this.noDocumentsFound = false;
        this.files = files;
      })
    );
  }

  getFileNamesByFolio(folio: number | string) {
    return this.fileBrowserService.getFilenamesFromFolio(folio).pipe(
      catchError(error => {
        this.files = [];
        return throwError(() => error);
      })
    );
  }

  getFiles(folio: string | number, name: string) {
    return this.fileBrowserService.getFileFromFolioAndName(folio, name).pipe(
      catchError(error => {
        return of(true);
      }),
      map(base64 => {
        return base64 === true
          ? {
              loading: false,
              error: true,
              base64: '',
            }
          : {
              loading: false,
              error: false,
              base64: base64 as string,
            };
      }),
      startWith({ loading: true, error: false, base64: '' })
    );
  }

  onSelectFolio(document: IDocuments) {
    this.registerUser = document.userRegistersScan ?? INVALID_USER;
    console.log(this.registerUser);
    const { id } = document;
    this.folio = Number(id);
    this.loadImages(this.folio).subscribe();
  }

  openFileUploader() {
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        identificator: this.folio,
        accept: 'image/*,application/pdf',
        callback: (refresh: boolean) => this.fileUploaderClose(refresh),
      },
    };
    this.modalService.show(FileUploadModalComponent, config);
  }

  fileUploaderClose(refresh: boolean) {
    if (refresh) {
      this.loadImages(this.folio).subscribe(() => {
        this.updateSheets();
      });
    }
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

  async confirmDelete() {
    const token = this.authService.decodeToken();
    const user = token?.preferred_username?.toUpperCase();
    const validUsers = [user, SERA_USER, DEVELOP_USER];
    if (this.filesToDelete.length < 1) {
      this.onLoadToast(
        'warning',
        'Advertencia',
        'Debes seleccionar mínimo un archivo'
      );
      return;
    }
    if (
      !validUsers.find(user => user == this.registerUser) ||
      this.registerUser == INVALID_USER
    ) {
      this.alert(
        'warning',
        'Advertencia',
        'No tiene permiso para borrar las imágenes. Sólo el usuario que escaneo puede borrar las imágenes.'
      );
      return;
    }
    const result = await this.alertQuestion(
      'warning',
      'Advertencia',
      '¿Estás seguro que desea eliminar las imágenes seleccionadas?'
    );

    if (result.isConfirmed) {
      this.deleteSelectedFiles();
    }
  }

  deleteSelectedFiles() {
    const obs = this.filesToDelete.map(filename => this.deleteFile(filename));
    forkJoin(obs).subscribe({
      complete: () => {
        this.files = [];
        this.onLoadToast(
          'success',
          'Se eliminaron los archivos correctamente',
          ''
        );
        this.filesToDelete = [];
        this.loadImages(this.folio).subscribe(() => {
          this.updateSheets();
        });
      },
    });
  }

  updateSheets() {
    const token = this.authService.decodeToken();
    let scanStatus = null;
    const sheets = `${this.files.length}`;
    if (this.files.length > 0) {
      scanStatus = 'ESCANEADO';
    }
    const userRegistersScan = token?.preferred_username?.toUpperCase();
    const dateRegistrationScan = new Date();
    this.documentsService
      .update(this.folio, {
        sheets,
        scanStatus,
        userRegistersScan,
        dateRegistrationScan,
      })
      .subscribe(() => {
        const params = this.documentsParams.getValue();
        this.documentsParams.next(params);
      });
  }

  deleteFile(name: string) {
    return this.fileBrowserService
      .deleteByFolioAndFilename(this.folio, name)
      .pipe(
        catchError(error => {
          this.alert(
            'error',
            'Error',
            'Ocurrió un error al eliminar la imagen'
          );
          return throwError(() => error);
        })
      );
  }

  folioChange() {
    const folio = this.controls.folio.value;
    if (!folio) {
      return;
    }
    this.files = [];
    this.controls.expedient.reset();
    this.folio = folio;
    this.getDocumentsByFolio().subscribe();
  }

  expedientChange() {
    const expedient = this.controls.expedient.value;
    if (!expedient) {
      return;
    }
    this.files = [];
    this.controls.folio.reset();
    this.folio = null;
    const _params = new FilterParams();
    _params.addFilter('numberProceedings', expedient);
    this.documentsParams.next(_params);
  }

  goBack() {
    if (this.origin == 'FGESTBUZONTRAMITE') {
      this.router.navigate(['/pages/general-processes/work-mailbox']);
    }

    if (this.origin == 'FACTREFACTAENTREC') {
      this.router.navigate([
        '/pages/judicial-physical-reception/confiscated-records',
      ]);
    }

    if (this.origin == 'FACTREFCANCELAR') {
      this.router.navigate([
        '/pages/judicial-physical-reception/cancellation-recepcion',
      ]);
    }

    if (this.origin == 'FACTREFACTAVENT') {
      this.router.navigate([
        '/pages/judicial-physical-reception/cancellation-sale',
      ]);
    }

    if (this.origin == 'FESTATUSRGA') {
      this.router.navigate([
        '/pages/executive-processes/destruction-authorization-management',
      ]);
    }
    if (this.origin == 'FACTGENSOLICDIGIT') {
      this.router.navigate(
        [
          `/pages/general-processes/scan-request/${this.originFlyer}/${this.originFolio}`,
        ],
        { queryParams: { origin: this.requestOrigin } }
      );
    }
    if (this.origin == 'FACTJURDICTAMOFICIO') {
      this.router.navigate(
        [`/pages/juridical/depositary/legal-opinions-office`],
        {
          queryParams: {
            ...this.paramsScreen,
            origin: this.origin2,
            origin3: this.origin3,
          },
        }
      );
    }
    if (this.origin == 'FACTJURABANDONOS') {
      this.router.navigate([
        `/pages/juridical/abandonments-declaration-trades`,
      ]);
    }
    if (this.origin == 'FPROCRECPAG') {
      this.router.navigate([
        `/pages/administrative-processes/payment-claim-process`,
      ]);
    }
    if (this.origin == 'FACTJURREGDESTLEG') {
      this.router.navigate([
        `/pages/juridical/depositary/depositary-record/` + this.no_bien,
      ]);
    }
    if (this.origin == 'FREGULARIZAJUR') {
      this.router.navigate([
        `pages/administrative-processes/legal-regularization`,
      ]);
    }
    if (this.origin == 'FADMAMPAROS') {
      this.router.navigateByUrl(
        `pages/juridical/depositary/maintenance-of-coverages?wheelNumber=${this.wheelNumber}&proceedingsNumber=${this.expedientNumber}`
      );
    }
  }
}
