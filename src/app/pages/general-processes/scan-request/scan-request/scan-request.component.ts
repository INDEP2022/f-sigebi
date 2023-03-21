import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CallScanDocumentComponent } from '../call-scan-document/call-scan-document.component';
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

  constructor(
    private fb: FormBuilder,
    private notificationServ: NotificationService,
    private documentServ: DocumentsService,
    private token: AuthService,
    private modalService: BsModalService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
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
          resp.data[0].keyTypeDocument = (
            resp.data[0] as any
          ).typeDocument.documentTypeKey;
          this.form.patchValue(resp.data[0]);
          this.countDoc = resp.count;
          this.idFolio = this.form.get('id').value;
          this.form.get('id').disable();
        },
        error: err => {
          this.loading = false;
          if (err.status === 400) {
            this.countDoc = 0;
            this.onLoadToast(
              'error',
              'No se encontro relacion de registros de documentos',
              ''
            );
          }
        },
      });
  }

  async generateDoc() {
    const valid = await this.validations();
    if (valid) {
      const { expedientNumber, wheelNumber } = this.formNotification.value;
      this.form.get('numberProceedings').patchValue(expedientNumber);
      this.form.get('flyerNumber').patchValue(wheelNumber);
      this.documentServ.create(this.form.value).subscribe({
        next: resp => {
          this.onLoadToast(
            'success',
            'Documento creado, procesando reporte',
            ''
          );
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
    const { expedientNumber, wheelNumber } = this.formNotification.value;
    let { keyTypeDocument, keySeparator } = this.form.value;

    if (!expedientNumber && !wheelNumber) {
      this.onLoadToast(
        'error',
        'Falta el número de expediente ó volante, favor de verificar.',
        ''
      );
      return false;
    }

    if (!keySeparator) {
      this.form.get('keySeparator').patchValue(60);
      keySeparator = 60;
    }

    if (!keySeparator || !keyTypeDocument) {
      this.onLoadToast(
        'error',
        'Falta el número de expediente ó separador ó tipo de documento, favor de verificar.',
        ''
      );
      return false;
    }

    const isPresent = await this.checkNoVolante(wheelNumber);

    if (!isPresent) return false;

    if (this.idFolio) {
      this.onLoadToast('error', 'Ya ha sido solicitado ese doumento', '');
      return false;
    }

    return true;
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
      significantDate: [null, Validators.maxLength(7)],
      descriptionDocument: [null, [Validators.maxLength(1000)]],
      scanStatus: ['SOLICITADO'],
      keySeparator: [null],
      flyerNumber: [null, Validators.required],
      numberProceedings: [null, Validators.required],
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
        },
        error: () => {
          this.onLoadToast(
            'error',
            'No existe volante, no se puede generar folio de escaneo, favor de verificar...',
            ''
          );
          check(false);
        },
      });
    });
  }

  proccesReport() {
    if (this.idFolio) {
      //en espera del reporte TODO:
    } else {
      this.onLoadToast(
        'error',
        'Debe tener el folio en pantalla para poder reimprimir',
        ''
      );
    }
  }

  callScan() {
    if (this.idFolio) {
      let config: ModalOptions = {
        //no se tiene los nombre que se enviaran por parametro
        initialState: {
          callback: (next: boolean) => {},
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(CallScanDocumentComponent, config);
    } else {
      this.onLoadToast('error', 'No existe un folio para escanear.', '');
    }
  }
}
