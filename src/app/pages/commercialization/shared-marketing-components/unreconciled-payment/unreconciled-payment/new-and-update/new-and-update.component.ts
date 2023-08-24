import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { LotParamsService } from 'src/app/core/services/ms-lot-parameters/lot-parameters.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  NUMBERS_POINT_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { secondFormatDateToDate2 } from 'src/app/shared/utils/date';
@Component({
  selector: 'app-new-and-update',
  templateUrl: './new-and-update.component.html',
  styles: [
    `
      .bg-gray {
        background-color: white !important;
      }
    `,
  ],
})
export class NewAndUpdateComponent extends BasePage implements OnInit {
  title: string = 'Pagos No Conciliados';
  edit: boolean = false;

  form: ModelForm<any>;
  data: any;
  events = new DefaultSelect();
  clients = new DefaultSelect();
  lotes = new DefaultSelect();
  banks = new DefaultSelect();
  disabledSend: boolean = true;
  valInitClient: boolean = false;
  layout: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private lotparamsService: LotParamsService,
    private lotService: LotService,
    private comerClientsService: ComerClientsService,
    private accountMovementService: AccountMovementService,
    private paymentService: PaymentService,
    private datePipe: DatePipe,
    private comerEventosService: ComerEventosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      paymentId: [null],
      reference: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      movementNumber: [
        null,

        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      date: [null, Validators.required],
      amount: [null, [Validators.pattern(NUMBERS_POINT_PATTERN)]],
      bankKey: [null, [Validators.required]],
      code: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      lotId: [null, Validators.required],
      type: [null, Validators.pattern(STRING_PATTERN)],
      result: [null, Validators.pattern(STRING_PATTERN)],
      recordDate: [null],
      referenceOri: [null],
      dateOi: [null],
      entryOrderId: [null, Validators.pattern(NUMBERS_PATTERN)],
      validSystem: [null, Validators.pattern(STRING_PATTERN)],
      description: [null, Validators.pattern(STRING_PATTERN)],
      branchOffice: [null],
      reconciled: [null, Validators.pattern(STRING_PATTERN)],
      appliedTo: [null],
      clientId: [null],
      rfc: [null],
      name: [null],
    });

    if (this.data != null) {
      this.valInitClient = false;
      this.edit = true;
      this.form.patchValue({
        paymentId: this.data.paymentId,
        reference: this.data.reference,
        movementNumber: this.data.movementNumber,
        date: secondFormatDateToDate2(this.returnParseDate_(this.data.date)),
        amount: this.data.amount,
        bankKey: this.data.bankKey,
        code: this.data.code,
        type: this.data.type,
        result: this.data.result,
        // recordDate: secondFormatDateToDate2(
        //   this.returnParseDate_(this.data.recordDate)
        // ),
        referenceOri: this.data.referenceOri,
        // dateOi: secondFormatDateToDate2(
        //   this.returnParseDate_(this.data.dateOi)
        // ),
        entryOrderId: this.data.entryOrderId,
        validSystem: this.data.validSystem,
        description: this.data.description,
        branchOffice: this.data.branchOffice,
        // reconciled: this.data.reconciled,
        appliedTo: this.data.appliedTo,
        // clientId: this.data.idAndName,
        lotId: this.data.lotId,
      });

      this.form.get('clientId').setValue(this.data.idAndName);

      this.form.get('bankKey').setValue(this.data.bankAndNumber);
      console.log('this.data', this.data);

      // if (this.data.clientId) {
      //   const params = new ListParams()
      //   params.te  returnDate(date: Date) {}
      //   this.getClientsById(params)
      // }
    } else {
      this.valInitClient = true;
    }
  }

  returnDate(date: Date) {}

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    // console.log(this.form.value.bankKey)
    // console.log(this.form.value.clientId)
    // return
    const bank = this.form.value.bankKey;
    const client = this.form.value.clientId;
    const requestBody: any = {
      paymentId: this.data.paymentId,
      reference: this.form.value.reference,
      movementNumber: this.form.value.movementNumber,
      date: this.form.value.date,
      amount: Number(this.form.value.amount),
      bankKey: bank.cveBank,
      code: bank.idCode,
      lotId: this.form.value.lotId,
      // type: this.form.value.type,
      // result: this.form.value.result,
      // recordDate: this.form.value.recordDate,
      // referenceOri: this.form.value.referenceOri,
      // dateOi: this.form.value.dateOi,
      // entryOrderId: this.form.value.entryOrderId,
      // validSystem:
      //   this.form.value.validSystem == '' ? null : this.form.value.validSystem,
      // description: this.form.value.description,
      // branchOffice: this.form.value.branchOffice,
      // reconciled: this.form.value.reconciled,
      appliedTo: this.form.value.appliedTo,
      clientId: client ? client.id : null,
    };

    this.paymentService.update(this.data.paymentId, requestBody).subscribe({
      next: response => {
        this.handleSuccess();
      },
      error: error => {
        this.handleError();
        // this.alert('error','Ocurrió un Error al Eliminar el Registro','');
      },
    });
  }

  create() {
    const requestBody: any = {
      reference: Number(this.form.value.reference),
      movementNumber: this.form.value.movementNumber,
      date: this.form.value.date,
      amount: Number(this.form.value.amount),
      bankKey: this.form.value.bankKey,
      code: Number(this.form.value.code),
      lotId: this.form.value.lotId,
      type: this.form.value.type,
      result: this.form.value.result,
      recordDate: this.form.value.recordDate,
      referenceOri: this.form.value.referenceOri,
      dateOi: this.form.value.dateOi,
      entryOrderId: this.form.value.entryOrderId,
      validSystem: this.form.value.validSystem,
      description: this.form.value.description,
      branchOffice: this.form.value.branchOffice,
      reconciled: this.form.value.reconciled,
      appliedTo: this.form.value.appliedTo,
      clientId: this.form.value.clientId,
    };

    this.paymentService.create(requestBody).subscribe({
      next: response => {
        this.handleSuccess();
        // this.alert('success', 'El Registro se Eliminó Correctamente', '');
      },
      error: error => {
        // if (error.error.message == "La clave del banco no ha sido previamente registrada"){
        this.alert(
          'error',
          'Ocurrió un Error al Guardar el Registro',
          error.error.message
        );
        // }
        // this.handleError();
        // this.alert('error','Ocurrió un Error al Eliminar el Registro','');
      },
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', `Registro ${message} Correctamente`, '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  handleError() {
    const message: string = this.edit ? 'Actualizar' : 'Guardar';
    this.alert('error', `Error al Intentar ${message} el Registro`, '');
    this.loading = false;
  }

  getEvents(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      params.addFilter('idEvent', lparams.text, SearchFilter.EQ);

    this.lotService.getLotbyEvent_(params.getParams()).subscribe({
      next: data => {
        console.log('EVENT', data);
        this.events = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.events = new DefaultSelect();
      },
    });
  }

  getClients(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('id', lparams.text, SearchFilter.EQ);
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        console.log('NO');

        params.addFilter('reasonName', lparams.text, SearchFilter.ILIKE);
        // params.addFilter('cve_banco', lparams.text);
      }

    this.comerClientsService.getAll_(params.getParams()).subscribe({
      next: data => {
        console.log('EVENT', data);
        let result = data.data.map(async (item: any) => {
          item['idAndName'] = item.id + ' - ' + item.reasonName;
        });

        Promise.all(result).then(resp => {
          this.clients = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.clients = new DefaultSelect();
      },
    });
  }

  // NO
  getLotes(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('idLot', lparams.text, SearchFilter.EQ);
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        console.log('NO');

        params.addFilter('description', lparams.text, SearchFilter.ILIKE);
        // params.addFilter('cve_banco', lparams.text);
      }
    params.sortBy = `idLot:ASC`;
    this.lotService.getLotbyEvent_(params.getParams()).subscribe({
      next: data => {
        console.log('EVENT', data);
        let result = data.data.map(async (item: any) => {
          item['idAndDesc'] = item.idLot + ' - ' + item.description;
        });

        Promise.all(result).then(resp => {
          this.lotes = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.lotes = new DefaultSelect();
      },
    });
  }

  getBanks(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    let params__ = '';
    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('idCode', lparams.text, SearchFilter.EQ);
      } else {
        console.log('NO');
        params.addFilter('cveBank', lparams.text, SearchFilter.ILIKE);

        // params.addFilter('cve_banco', lparams.text);
      }

    // this.hideError();
    return new Promise((resolve, reject) => {
      this.accountMovementService
        .getPaymentControl(params.getParams())
        .subscribe({
          next: response => {
            console.log('ress1', response);
            let result = response.data.map(item => {
              item['bankAndNumber'] = item.idCode + ' - ' + item.cveBank;
            });

            Promise.all(result).then((resp: any) => {
              this.banks = new DefaultSelect(response.data, response.count);
              this.loading = false;
            });
          },
          error: err => {
            this.banks = new DefaultSelect();
            console.log(err);
          },
        });
    });
  }

  returnParseDate_(data: Date) {
    this.datePipe.transform(data, 'dd/MM/yyyy');
    console.log('DATEEEE', data);
    const formattedDate = moment(data).format('YYYY-MM-DD');
    return data ? formattedDate : null;
  }

  returnParseDate_2(data: Date) {
    const a = this.datePipe.transform(data, 'dd/MM/yyyy');
    return data ? a : null;
  }

  getClientsById(lparams: ListParams) {
    lparams['filter.id'] = `$eq:${lparams.text}`;
    this.comerClientsService.getAll_(lparams).subscribe({
      next: (data: any) => {
        console.log('EVENT', data);
        let result = data.data.map(async (item: any) => {
          item['idAndName'] = item.id + ' - ' + item.reasonName;
        });

        Promise.all(result).then(resp => {
          this.form.get('clientId').setValue(data.data[0]);

          // this.clients = new DefaultSelect(data.data[0], data.count);
        });
      },
      error: err => {
        this.clients = new DefaultSelect();
      },
    });
  }

  // COMER_EVENTOS
  getLotes__(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('idLot', lparams.text, SearchFilter.EQ);
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        console.log('NO');

        params.addFilter('processKey', lparams.text, SearchFilter.ILIKE);
        // params.addFilter('cve_banco', lparams.text);
      }

    let obj = {
      pAddress: this.layout,
      idTpEvent: '6',
    };
    params.sortBy = `idLot:ASC`;
    this.comerEventosService.GetEventXLot(obj, params.getParams()).subscribe({
      next: data => {
        console.log('EVENT', data);
        let result = data.data.map(async (item: any) => {
          item['idAndDesc'] = item.idLot + ' - ' + item.processKey;
        });

        Promise.all(result).then(resp => {
          this.lotes = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.lotes = new DefaultSelect();
      },
    });
  }
}
