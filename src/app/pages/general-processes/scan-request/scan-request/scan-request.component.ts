import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil, tap } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocReceptionRegisterService } from 'src/app/core/services/document-reception/doc-reception-register.service';
import {
  IReport,
  SiabService,
} from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ListDocumentsComponent } from '../list-documents/list-documents.component';
import { ListNotificationsComponent } from '../list-notifications/list-notifications.component';

@Component({
  selector: 'app-scan-request',
  templateUrl: './scan-request.component.html',
  styles: [],
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

  constructor(
    private fb: FormBuilder,
    private notificationServ: NotificationService,
    private documentServ: DocumentsService,
    private jasperService: SiabService,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private receptionService: DocReceptionRegisterService,
    private router: Router
  ) {
    super();
    this.route.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.origin = params['origin'] ?? null;
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

    if (param1 && param1 != 'null') {
      this.isParams = true;
      this.filterParams
        .getValue()
        .addFilter('wheelNumber', param1, SearchFilter.EQ);
      this.getNotfications();
    } else if (param1 === 'null') {
      this.onLoadToast('error', `Parámetro no_volante no es válido`, '');
    }

    if (param2) {
      this.isParams = true;
      this.isParamFolio = true;
      this.getDocumentByFolio(param2);
    }
  }
  back() {
    const location: any = {
      FGESTBUZONTRAMITE: () =>
        this.router.navigate(['/pages/general-processes/work-mailbox']),
    };
    location[this.origin]();
  }

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
            .addFilter('receiptDate', receiptDate, SearchFilter.EQ)
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
    this.loading = true;
    this.createFilter();
    this.getNotfications();
  }

  getNotfications() {
    this.notificationServ
      .getAllFilter(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          this.notify = resp;
          this.noVolante = resp.data[0].wheelNumber;
          this.formNotification.patchValue(resp.data[0]);
          this.count = resp.count;
          this.searchDocuments(
            this.formNotification.get('expedientNumber').value,
            this.formNotification.get('wheelNumber').value
          );
        },
        error: err => {
          this.loading = false;
          this.form.reset();
          this.onLoadToast('error', err.error.message, '');
        },
      });
  }

  notificationList() {
    let config: ModalOptions = {
      initialState: {
        filterParamsDocuments: this.filterParams,
        dataNotification: this.notify,
        callback: (next: boolean, data: INotification) => {
          if (next) {
            this.form.reset();
            this.formNotification.patchValue(data);
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
        filterParamsDocuments: this.filterParamsDocuments,
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
          if (err.status === 500) {
            this.onLoadToast(
              'warning',
              'Error del Servidor',
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
          this.onLoadToast(
            'success',
            'Solicitud generada, procesando reporte...',
            ''
          );
          this.loadingDoc = false;
          this.form.patchValue(resp);
          this.idFolio = this.form.get('id').value;
          this.form.get('id').disable();
          const time = setTimeout(() => {
            this.proccesReport();
            clearTimeout(time);
          }, 1000);
        },
      });
    }
  }

  async validations(): Promise<boolean> {
    this.loadingDoc = true;
    const { expedientNumber, wheelNumber } = this.formNotification.value;
    let { keyTypeDocument, keySeparator } = this.form.value;

    if (!expedientNumber && !wheelNumber) {
      this.onLoadToast(
        'error',
        'Falta el número de expediente o volante, favor de verificar.',
        ''
      );
      this.loadingDoc = false;
      return false;
    }

    if (!keySeparator) {
      this.form.get('keySeparator').patchValue(60);
      keySeparator = 60;
    }

    if (!keySeparator || !keyTypeDocument) {
      this.onLoadToast(
        'error',
        'Falta el número de expediente o separador o tipo de documento, favor de verificar.',
        ''
      );
      this.loadingDoc = false;
      return false;
    }

    const isPresent = await this.checkNoVolante(wheelNumber);

    if (!isPresent) return false;

    if (this.idFolio) {
      this.onLoadToast('error', 'Ya ha sido solicitado ese documento', '');
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
          Validators.pattern('^[0-9]{2}[-]{1}[0-9]{4}$'),
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
          this.onLoadToast(
            'error',
            'No existe volante, no se puede generar folio de escaneo, favor de verificar...',
            ''
          );
          check(false);
          this.loadingDoc = false;
        },
      });
    });
  }

  proccesReport() {
    if (this.idFolio) {
      this.onLoadToast('success', 'Generando reporte...', '');
      const msg = setTimeout(() => {
        this.jasperService
          .fetchReport('RGERGENSOLICDIGIT', { pn_folio: this.idFolio })
          .pipe(
            tap(response => {
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
              clearTimeout(msg);
            })
          )
          .subscribe();
      }, 1000);
    } else {
      this.onLoadToast(
        'error',
        'Debe tener el folio en pantalla para poder reimprimir',
        ''
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
      this.router.navigate(['pages/general-processes/scan-documents'], {
        queryParams: {
          folio: this.idFolio,
          volante: this.noVolante,
          origin: 'FACTGENSOLICDIGIT',
          requestOrigin: this.origin ?? '',
        },
      });
    } else {
      this.onLoadToast('error', 'No existe un folio para escanear.', '');
    }
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
