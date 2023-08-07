import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil, tap } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGood } from 'src/app/core/models/good/good.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocReceptionRegisterService } from 'src/app/core/services/document-reception/doc-reception-register.service';
import {
  IReport,
  SiabService,
} from 'src/app/core/services/jasper-reports/siab.service';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ListDocumentsComponent } from '../list-documents/list-documents.component';
import { ListNotificationsComponent } from '../list-notifications/list-notifications.component';

@Component({
  selector: 'app-scan-request',
  templateUrl: './scan-request.component.html',
  styles: [
    `
      .bg-gray {
        background-color: #eee !important;
      }
    `,
  ],
})
export class ScanRequestComponent extends BasePage implements OnInit {
  formNotification: FormGroup;
  form: FormGroup;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  filterParamsDocuments = new BehaviorSubject<FilterParams>(new FilterParams());
  count: number = 0;
  countDoc: number = 0;
  idFolio: number;
  docs: IListResponse<IDocuments>;
  notify: IListResponse<INotification>;
  delegation: number;
  subDelegation: number;
  departament: number;
  isParamFolio: boolean = false;
  noVolante: number;
  isParams: boolean = false;
  origin: string = null;
  today: Date = new Date();
  loadingDoc: boolean = false;
  document: any;
  generateFo: boolean = true;
  data: any;
  isSearch: boolean = false;
  paramsDepositaryAppointment: any = {
    P_NB: null,
    P_FOLIO: null,
    P_ND: null,
  };
  user: ISegUsers;
  @Input() numberFoli: string | number = '';
  @Input() cveScreen: string | number = '';
  @Input() reportPrint: string = '';
  @Input() refresh: boolean = false;
  @Input() good: IGood;
  @Output() documentEmmit = new EventEmitter<IDocuments>();
  @Output() change = new EventEmitter<any>();
  dataDocs: IListResponse<any /*Modelado de datos*/> =
    {} as IListResponse<any /*Modelado de datos*/>;

  //Declaraciones para ocupar filtrado
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  // filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  loadingText = 'Cargando ...';
  get scanningFoli() {
    return this.form.get('scanningFoli');
  }
  constructor(
    private fb: FormBuilder,
    private notificationServ: NotificationService,
    private documentServ: DocumentsService,
    private jasperService: SiabService,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private docService: DocumentsService,
    private readonly documnetServices: DocumentsService,
    private authService: AuthService,
    private receptionService: DocReceptionRegisterService,
    private router: Router,
    private msDepositaryService: MsDepositaryService,
    private readonly userServices: UsersService
  ) {
    super();
    this.route.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.origin = params['origin'] ?? null;
        if (this.origin == 'FACTJURREGDESTLEG') {
          this.paramsDepositaryAppointment.P_NB = params['P_NB'] ?? null;
          this.paramsDepositaryAppointment.P_FOLIO = params['P_FOLIO'] ?? null;
          this.paramsDepositaryAppointment.P_ND = params['P_ND'] ?? null;
        }
      });
    const params = new FilterParams();
    const token = this.authService.decodeToken();
    params.addFilter('user', token.preferred_username);
    this.receptionService.getUsersSegAreas(params.getParams()).subscribe({
      next: response => {
        if (response.data.length > 0) {
          this.subDelegation = response.data[0].subdelegationNumber;
          this.delegation = response.data[0].delegationNumber;
          this.departament = response.data[0].departamentNumber;
        }
      },
      error: () => {},
    });
  }

  ngOnInit(): void {
    this.createForm();
    const param1: any = this.route.snapshot.paramMap.get('P_NO_VOLANTE');
    const param2: any = this.route.snapshot.paramMap.get('P_FOLIO');
    const param3: any = this.route.snapshot.queryParamMap.get('origin');

    this.isParams = param3 ? true : false;

    if (param1 && param1 != 'null') {
      this.filterParams
        .getValue()
        .addFilter('wheelNumber', param1, SearchFilter.EQ);
      this.getNotfications();
    } else if (param1 === 'null') {
      this.alert('error', 'ERROR', 'Parámetro no_volante no es válido');
    }

    if (param2) {
      this.isParamFolio = true;
      this.getDocumentByFolio(param2);
    }
    // console.log(this.numberFoli);

    // this.createForm();
    // this.formNotification.get('').setValue(this.numberFoli);
    // this.form.disable();
    // this.getDataUser();
  }

  back() {
    if (this.origin == 'FACTJURREGDESTLEG') {
      // this.router.navigate([
      //   `/pages/juridical/depositary/depositary-record/` +
      //     this.paramsDepositaryAppointment.P_NB,
      // ]);
      this.router.navigate(
        [
          '/pages/juridical/depositary/depositary-record/' +
            this.paramsDepositaryAppointment.P_NB,
        ],
        {
          queryParams: {
            p_nom: this.paramsDepositaryAppointment.P_ND,
          },
        }
      );
    } else {
      const location: any = {
        FGESTBUZONTRAMITE: () =>
          this.router.navigate(['/pages/general-processes/work-mailbox']),
      };
      location[this.origin]();
    }
  }
  // getNotfications() {
  //   this.loading = true;
  //   let params = {
  //     ...this.paramsList.getValue(),
  //     ...this.columnFilters,
  //   };

  //   //Usar extends HttpService en los servicios para usar ListParams | string por si el service usa FiltersParams
  //   this.docService.getAll(params).subscribe({
  //     next: resp => {
  //       this.totalItems = resp.count;
  //       this.dataDocs = resp;
  //       this.data.load(resp.data);
  //       this.data.refresh();
  //       this.loading = false;
  //     },
  //     error: () => {
  //       this.loading = false;
  //       this.totalItems = 0;
  //       this.data.load([]);
  //       this.data.refresh();
  //     },
  //   });
  // }

  createFilter() {
    const {
      expedientNumber,
      wheelNumber,
      receiptDate,
      preliminaryInquiry,
      criminalCase,
      touchPenaltyKey,
      circumstantialRecord,
      protectionKey,
    } = this.formNotification.value;

    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = 1;

    if (typeof receiptDate == 'object' && receiptDate) {
      const convertDate = this.datePipe.transform(receiptDate, 'yyyy-MM-dd');
      this.filterParams
        .getValue()
        .addFilter('receiptDate', convertDate, SearchFilter.EQ);
    } else {
      receiptDate
        ? this.filterParams
            .getValue()
            .addFilter(
              'receiptDate',
              receiptDate.split('/').reverse().join('-'),
              SearchFilter.EQ
            )
        : null;
    }

    expedientNumber
      ? this.filterParams
          .getValue()
          .addFilter('expedientNumber', expedientNumber, SearchFilter.EQ)
      : null;
    wheelNumber
      ? this.filterParams
          .getValue()
          .addFilter('wheelNumber', wheelNumber, SearchFilter.EQ)
      : null;
    preliminaryInquiry
      ? this.filterParams
          .getValue()
          .addFilter('preliminaryInquiry', preliminaryInquiry, SearchFilter.EQ)
      : null;
    criminalCase
      ? this.filterParams
          .getValue()
          .addFilter('criminalCase', criminalCase, SearchFilter.EQ)
      : null;
    touchPenaltyKey
      ? this.filterParams
          .getValue()
          .addFilter('touchPenaltyKey', touchPenaltyKey, SearchFilter.EQ)
      : null;
    circumstantialRecord
      ? this.filterParams
          .getValue()
          .addFilter(
            'circumstantialRecord',
            circumstantialRecord,
            SearchFilter.EQ
          )
      : null;
    protectionKey
      ? this.filterParams
          .getValue()
          .addFilter('protectionKey', protectionKey, SearchFilter.EQ)
      : null;
  }

  searchNotification() {
    const {
      expedientNumber,
      wheelNumber,
      receiptDate,
      preliminaryInquiry,
      criminalCase,
      touchPenaltyKey,
      circumstantialRecord,
      protectionKey,
    } = this.formNotification.value;

    if (
      !expedientNumber &&
      !wheelNumber &&
      !receiptDate &&
      !preliminaryInquiry &&
      !criminalCase &&
      !touchPenaltyKey &&
      !circumstantialRecord &&
      !protectionKey
    )
      return;

    this.loading = true;
    this.createFilter();
    this.getNotfications();
  }

  getNotfications() {
    this.notificationServ
      .getAllFilter(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          this.isSearch = true;
          this.notify = resp;
          this.noVolante = resp.data[0].wheelNumber;
          this.formNotification.patchValue(resp.data[0]);
          const date = resp.data[0].receiptDate
            ? resp.data[0].receiptDate
                .toString()
                .split('T')[0]
                .split('-')
                .reverse()
                .join('/')
            : '';
          this.formNotification.controls['receiptDate'].patchValue(date);
          this.count = resp.count;
          this.searchDocuments(
            this.formNotification.get('expedientNumber').value,
            this.formNotification.get('wheelNumber').value
          );
        },
        error: err => {
          this.isSearch = false;
          this.loading = false;
          this.form.reset();
          this.alert('error', 'ERROR', err.error.message);
        },
      });
  }

  notificationList() {
    let config: ModalOptions = {
      initialState: {
        filterParams: this.filterParams,
        dataNotification: this.notify,
        callback: (next: boolean, data: INotification) => {
          if (next) {
            this.form.reset();
            this.formNotification.patchValue(data);
            const date = data.receiptDate
              ? data.receiptDate
                  .toString()
                  .split('T')[0]
                  .split('-')
                  .reverse()
                  .join('/')
              : '';
            this.formNotification.controls['receiptDate'].patchValue(date);
            this.noVolante = data.wheelNumber;
            this.searchDocuments(data.expedientNumber, data.wheelNumber);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ListNotificationsComponent, config);
  }

  documentsList() {
    let config: ModalOptions = {
      initialState: {
        filterParams: this.filterParamsDocuments,
        callback: (next: boolean, data: IDocuments) => {
          if (next) {
            data.keyTypeDocument = (data as any).typeDocument.documentTypeKey;
            this.form.patchValue(data);
            this.idFolio = this.form.get('id').value;
            this.form.get('id').disable();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ListDocumentsComponent, config);
  }

  searchDocuments(expedient: number, wheel: number) {
    this.filterParamsDocuments.getValue().removeAllFilters();
    this.filterParamsDocuments
      .getValue()
      .addFilter('numberProceedings', expedient, SearchFilter.EQ);
    this.filterParamsDocuments
      .getValue()
      .addFilter('flyerNumber', wheel, SearchFilter.EQ);
    this.documentServ
      .getAllFilter(this.filterParamsDocuments.getValue().getParams())
      .subscribe({
        next: resp => {
          this.loading = false;
          this.docs = resp;
          this.countDoc = resp.count;
          if (!this.isParamFolio) {
            resp.data[0].keyTypeDocument = (
              resp.data[0] as any
            ).typeDocument.documentTypeKey;
            this.form.patchValue(resp.data[0]);
            this.idFolio = this.form.get('id').value;
            this.form.get('id').disable();
          }

          this.isParamFolio = false;
        },
        error: err => {
          this.form.reset();
          if (err.status === 500) {
            this.alert(
              'error',
              'ERROR',
              'No se pudo obtener todos los datos relacionados'
            );
          }
          if (err.status === 400) {
            this.countDoc = 0;
          }

          this.loading = false;
        },
      });
  }

  async generateDoc() {
    const valid = await this.validations();
    if (valid) {
      const { expedientNumber, wheelNumber } = this.formNotification.value;
      this.loadingDoc = true;
      const token = this.authService.decodeToken();
      let userId = token.preferred_username;

      this.form.get('numberProceedings').patchValue(expedientNumber);
      this.form.get('flyerNumber').patchValue(wheelNumber);
      this.form.get('userRequestsScan').patchValue(userId.toUpperCase());
      this.form
        .get('scanRequestDate')
        .patchValue(this.parseDateNoOffset(new Date()));
      this.form.get('numberDelegationRequested').patchValue(this.delegation);
      this.form
        .get('numberSubdelegationRequests')
        .patchValue(this.subDelegation);
      this.form.get('numberDepartmentRequest').patchValue(this.departament);

      this.documentServ.create(this.form.value).subscribe({
        next: resp => {
          // this.alert(
          //   'success',
          //   'ÉXITO',
          //   'Solicitud generada, procesando reporte...'
          // );
          this.form.patchValue(resp);
          this.idFolio = this.form.get('id').value;
          this.form.get('id').disable();
          this.countDoc++;
          const time = setTimeout(() => {
            this.proccesReport(false);
            clearTimeout(time);
            if (this.origin == 'FACTJURREGDESTLEG') {
              const params = new ListParams();
              params['filter.goodNumber'] =
                this.paramsDepositaryAppointment.P_NB;
              params['filter.appointmentNumber'] =
                this.paramsDepositaryAppointment.P_ND;
              this.msDepositaryService.getAllFiltered(params).subscribe({
                next: data => {
                  let body: any = {
                    appointmentNumber: data.data[0].appointmentNumber,
                    amountIVA: data.data[0].amountIVA
                      ? data.data[0].amountIVA
                      : 0,
                    personNumber: data.data[0].personNumber.id,
                    iva: data.data[0].iva ? data.data[0].iva : 0,
                    folioReturn: data.data[0].folioReturn
                      ? Number(data.data[0].folioReturn)
                      : null,
                  };
                  if (this.paramsDepositaryAppointment.P_FOLIO == 'R') {
                    body['folioReturn'] = this.idFolio;
                  } else if (this.paramsDepositaryAppointment.P_FOLIO == 'A') {
                    body['universalFolio'] = this.idFolio;
                  }
                  if (
                    this.paramsDepositaryAppointment.P_FOLIO == 'A' ||
                    this.paramsDepositaryAppointment.P_FOLIO == 'R'
                  ) {
                    // Guardar nuevo folio universal en nombramientos depositarias
                    this.msDepositaryService.update(body).subscribe({
                      next: data => {
                        // Guardar nuevo folio universal en nombramientos depositarias
                        localStorage.setItem(
                          '_saveFolioDepositary',
                          this.paramsDepositaryAppointment.P_FOLIO
                        );
                      },
                      error: error => {
                        this.loadingDoc = false;
                        console.log(error);
                      },
                    });
                  }
                },
                error: error => {
                  console.log(error);
                },
              });
            }
          }, 1000);
        },
        error: () => {
          this.loadingDoc = false;
        },
      });
    }
  }

  async validations(): Promise<boolean> {
    this.loadingDoc = true;
    const { expedientNumber, wheelNumber } = this.formNotification.value;
    let { keyTypeDocument, keySeparator } = this.form.value;

    if (!expedientNumber && !wheelNumber) {
      this.alert(
        'error',
        'ERROR',
        'Falta el número de expediente o volante, favor de verificar'
      );
      this.loadingDoc = false;
      return false;
    }

    if (!keySeparator) {
      this.form.get('keySeparator').patchValue(60);
      keySeparator = 60;
    }

    if (!keySeparator || !keyTypeDocument) {
      this.alert(
        'error',
        'ERROR',
        'Falta el número de expediente o separador o tipo de documento, favor de verificar'
      );
      this.loadingDoc = false;
      return false;
    }

    const isPresent = await this.checkNoVolante(wheelNumber);

    if (!isPresent) return false;

    if (this.idFolio) {
      this.alert('error', 'ERROR', 'Ya ha sido generada esta solicitud'); //'Ya ha sido solicitado ese documento');
      this.loadingDoc = false;
      return false;
    }

    return true;
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() - dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  createForm() {
    this.formNotification = this.fb.group({
      expedientNumber: [null, Validators.pattern(STRING_PATTERN)],
      wheelNumber: [null, Validators.pattern(STRING_PATTERN)],
      receiptDate: [null, Validators.pattern(STRING_PATTERN)],
      preliminaryInquiry: [null, Validators.pattern(STRING_PATTERN)],
      criminalCase: [null, Validators.pattern(STRING_PATTERN)],
      touchPenaltyKey: [null, Validators.pattern(STRING_PATTERN)],
      circumstantialRecord: [null, Validators.pattern(STRING_PATTERN)],
      protectionKey: [null, Validators.pattern(STRING_PATTERN)],
    });

    this.form = this.fb.group({
      id: [{ value: null, disabled: true }],
      keyTypeDocument: [null, Validators.required],
      natureDocument: ['ORIGINAL', Validators.required],
      significantDate: [
        null,
        [
          Validators.minLength(7),
          Validators.pattern('^[0-9]{2}[/]{1}[0-9]{4}$'),
        ],
      ],
      descriptionDocument: [null, [Validators.maxLength(1000)]],
      scanStatus: ['SOLICITADO'],
      keySeparator: [null],
      flyerNumber: [null],
      numberProceedings: [null],
      scanRequestDate: [null],
      userRequestsScan: [null],
      numberDelegationRequested: [null],
      numberSubdelegationRequests: [null],
      numberDepartmentRequest: [null],
    });
  }

  clear() {
    this.formNotification.reset();
    this.form.reset();
    this.loading = false;
    this.count = 0;
    this.countDoc = 0;
    this.idFolio = null;
  }

  clearDocument() {
    this.form.reset();
    this.idFolio = null;
  }

  async checkNoVolante(volante: number): Promise<boolean> {
    return new Promise(check => {
      const filter = this.filterParams.getValue();
      filter.removeAllFilters();
      filter.addFilter('wheelNumber', volante, SearchFilter.EQ);
      this.notificationServ.getAllFilter(filter.getParams()).subscribe({
        next: () => {
          check(true);
          this.loadingDoc = false;
        },
        error: () => {
          this.alert(
            'error',
            'ERROR',
            'No existe volante, no se puede generar folio de escaneo, favor de verificar'
          );
          check(false);
          this.loadingDoc = false;
        },
      });
    });
  }

  proccesReport(imp: boolean) {
    if (this.idFolio) {
      const msg = setTimeout(() => {
        this.jasperService
          .fetchReport('RGERGENSOLICDIGIT', { pn_folio: this.idFolio })
          .pipe(
            tap(response => {
              this.alert(
                'success',
                `${
                  imp
                    ? 'Reporte de Digitalización'
                    : 'Solicitud y Reporte de Digitalización'
                }`,
                `${
                  imp
                    ? 'Generado correctamente'
                    : 'Generado correctamente con folio: ' + this.idFolio
                }`
              );
              const blob = new Blob([response], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              let config = {
                initialState: {
                  documento: {
                    urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                    type: 'pdf',
                  },
                  callback: (data: any) => {},
                },
                class: 'modal-lg modal-dialog-centered',
                ignoreBackdropClick: true,
              };
              this.modalService.show(PreviewDocumentsComponent, config);
              this.loadingDoc = false;
              clearTimeout(msg);
            })
          )
          .subscribe();
      }, 1000);
    } else {
      this.alert(
        'error',
        'ERROR',
        'Debe tener el folio en pantalla para poder reimprimir'
      );
    }
  }

  readFile(file: IReport) {
    const reader = new FileReader();
    reader.readAsDataURL(file.data);
    reader.onload = _event => {
      this.openPrevPdf(reader.result as string);
    };
  }

  openPrevPdf(pdfurl: string) {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  callScan() {
    if (this.idFolio) {
      if (this.origin == 'FACTJURREGDESTLEG') {
        this.router.navigate([`/pages/general-processes/scan-documents`], {
          queryParams: {
            origin: 'FACTGENSOLICDIGIT',
            folio: this.idFolio,
            volante: this.noVolante,
            requestOrigin: this.origin ?? '',
            P_NB: this.paramsDepositaryAppointment.P_NB,
            P_FOLIO: this.paramsDepositaryAppointment.P_FOLIO,
            P_ND: this.paramsDepositaryAppointment.P_ND,
          },
        });
      } else {
        this.router.navigate(['/pages/general-processes/scan-documents'], {
          queryParams: {
            folio: this.idFolio,
            volante: this.noVolante,
            origin: 'FACTGENSOLICDIGIT',
            requestOrigin: this.origin ?? '',
          },
        });
      }
    } else {
      this.alert('error', 'ERROR', 'No existe un folio para escanear');
    }
  }

  getDataUser() {
    const params = new FilterParams();
    const token = this.authService.decodeToken();
    params.addFilter('user', token.preferred_username);

    console.log(params);

    this.userServices
      .getAllSegUsers(this.filterParams.getValue().getParams())
      .subscribe({
        next: response => {
          console.log(response);
          this.user = response.data[0];
        },
        error: err => {
          console.log(err);
        },
      });
  }
  printScanFile() {
    if (this.good === undefined) {
      this.alert(
        'warning',
        'Solicitud de escaneo',
        'No existe folio de escaneo',
        ''
      );
      return;
    }
    if (this.form.get('scanningFoli').value !== '') {
      const params = {
        pn_folio: this.form.get('scanningFoli').value,
      };
      this.downloadReport(this.reportPrint, params);
    } else {
      this.alert(
        'warning',
        'Solicitud de escaneo',
        'No existe folio de escaneo',
        ''
      );
    }
  }

  scan() {
    if (this.good === undefined) {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'No existe folio de escaneo',
        ''
      );
      return;
    }
    console.log(this.form.get('scanningFoli').value);
    if (this.form.get('scanningFoli').value !== '') {
      this.alertQuestion(
        'question',
        'Se abrirá la pantalla de escaneo para el folio de escaneo del Bien consultado',
        '¿Deseas continuar?',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          this.goToScan();
        }
      });
    } else {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'No existe folio de escaneo',
        ''
      );
    }
  }
  generateFoli() {
    console.log(
      this.scanningFoli.value != null,
      this.good,
      this.scanningFoli.value
    );
    if (this.good === null || this.good === undefined) {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'Debe cargar un Bien',
        ''
      );
      return;
    }
    if (this.document !== undefined) {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'El número de Bien para este proceso ya tiene folio de escaneo.'
      );
      return;
    }
    const documents: IDocuments = {
      numberProceedings: this.good.fileNumber,
      keySeparator: '60',
      keyTypeDocument: 'ENTRE',
      natureDocument: 'ORIGINAL',
      descriptionDocument: 'REGULARIZACION JURIDICA',
      significantDate: this.significantDate(),
      scanStatus: 'SOLICITADO',
      userRequestsScan: this.user.usuario.user,
      scanRequestDate: new Date(),
      associateUniversalFolio: null,
      flyerNumber: Number(this.good.fileNumber),
      goodNumber: Number(this.good.id),
      numberDelegationRequested: this.user.usuario.delegationNumber,
      numberDepartmentRequest: this.user.usuario.departamentNumber,
      numberSubdelegationRequests: this.user.usuario.subdelegationNumber,
    };
    console.log(documents);
    this.documnetServices.create(documents).subscribe({
      next: response => {
        this.document = response;
        console.log(response);
        this.scanningFoli.setValue(response.id);
        this.documentEmmit.emit(response);
        /* this.onLoadToast(
          'success',
          'Generado correctamente',
          `Se generó el Folio No ${response.id}`
        ); */
        this.generateFo = false;
        const params = {
          pn_folio: this.form.get('scanningFoli').value,
        };
        this.downloadReport(this.reportPrint, params);
      },
      error: err => {
        console.error(err);
        this.alert('error', 'Ha ocurrido un error', err.error.message);
      },
    });
  }
  significantDate() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return month < 10 ? `0${month}/${year}` : `${month}/${year}`;
  }
  generate() {
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
  }
  downloadReport(reportName: string, params: any) {
    this.loadingText = 'Generando reporte ...';
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        this.loading = false;
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
  }
  seeImages() {
    if (this.good === undefined) {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'No existe folio de escaneo',
        ''
      );
      return;
    }
    if (this.document !== undefined) {
      this.change.emit('Se hizo el change');
      localStorage.setItem('documentLegal', JSON.stringify(this.document));
    }
    if (this.form.get('scanningFoli').value !== '') {
      this.documnetServices
        .getByFolio(this.form.get('scanningFoli').value)
        .subscribe(res => {
          const data = JSON.parse(JSON.stringify(res));
          const scanStatus = data.data[0]['scanStatus'];
          const idMedium = data.data[0]['mediumId'];

          if (scanStatus === 'ESCANEADO') {
            this.goToScan();
          } else {
            this.alert(
              'warning',
              'Regularización Jurídica',
              'No existe documentación para este folio',
              ''
            );
          }
        });
    } else {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'No tiene folio de escaneo para visualizar.',
        ''
      );
    }
  }
  validFoli() {
    console.log('Entro');
    if (this.good !== undefined) {
      this.documnetServices.getByGood(this.good.id).subscribe({
        next: response => {
          if (response.count === 0) return;
          console.log(response);
          this.document = response.data[0];
          this.scanningFoli.setValue(this.document.id);
          this.documentEmmit.emit(this.document);
        },
      });
    }
  }

  goToScan() {
    this.change.emit('Se hizo el change');
    if (this.document !== undefined) {
      this.change.emit('Se hizo el change');
      localStorage.setItem('documentLegal', JSON.stringify(this.document));
    }
    console.log(this.cveScreen);
    if (this.origin == 'FACTJURREGDESTLEG') {
      this.router.navigate([`/pages/general-processes/scan-documents`], {
        queryParams: {
          origin: 'FACTGENSOLICDIGIT',
          folio: this.idFolio,
          volante: this.noVolante,
          requestOrigin: this.origin ?? '',
          P_NB: this.paramsDepositaryAppointment.P_NB,
          P_FOLIO: this.paramsDepositaryAppointment.P_FOLIO,
          P_ND: this.paramsDepositaryAppointment.P_ND,
        },
      });
    } else {
      this.router.navigate([`/pages/general-processes/scan-documents`], {
        queryParams: {
          origin: this.cveScreen,
          folio: this.form.get('scanningFoli').value,
        },
      });
    }
  }

  savedLocal(event: any) {
    console.log(event);
    const model = {
      numberGood: event.numberGood.value,
      status: event.status.value,
      description: event.description.value,
      justifier: event.justifier.value,
    };
    localStorage.setItem('savedForm', JSON.stringify(model));
    localStorage.setItem(
      'numberFoli',
      JSON.stringify(
        this.numberFoli === '' || this.numberFoli === null
          ? this.document.id
          : this.numberFoli
      )
    );
  }

  getDocumentByFolio(folio: number) {
    this.loading = true;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('id', folio, SearchFilter.EQ);
    this.documentServ.getAllFilter(params.getParams()).subscribe({
      next: resp => {
        this.loading = false;
        resp.data[0].keyTypeDocument = (
          resp.data[0] as any
        ).typeDocument.documentTypeKey;
        this.form.patchValue(resp.data[0]);
        this.idFolio = this.form.get('id').value;
        this.form.get('id').disable();
      },
    });
  }

  limit(limit: number, field: string, value: string) {
    if (String(value).length > limit) {
      this.formNotification
        .get(field)
        .patchValue(String(value).slice(0, limit));
    }
  }

  limit2(limit: number, field: string, value: string) {
    if (String(value).length > limit) {
      this.form.get(field).patchValue(String(value).slice(0, limit));
    }
  }

  validateDate(value: string) {
    if (value) {
      if (value.length >= 2) {
        const month = Number(value.slice(0, 2));
        if (month > 12 || month < 1) {
          this.form.get('significantDate').setErrors({ incorrect: true });
        }
      }
    }
  }
}
