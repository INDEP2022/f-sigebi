import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BankService } from 'src/app/core/services/catalogs/bank.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
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
        background-color: #eee !important;
      }
    `,
  ],
})
export class NewAndUpdateComponent extends BasePage implements OnInit {
  title: string = 'Pago Referenciado';
  edit: boolean = false;

  form: ModelForm<any>;
  data: any;
  events = new DefaultSelect();
  clients = new DefaultSelect();
  lotes = new DefaultSelect();
  banks = new DefaultSelect();
  sats = new DefaultSelect();
  disabledSend: boolean = true;
  valInitClient: boolean = false;
  idPayment: string = '';
  valScroll: boolean;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  valCargado: boolean;
  dataNew: any;
  dataTable: LocalDataSource;
  nextPaymentId: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private lotparamsService: LotParamsService,
    private lotService: LotService,
    private comerClientsService: ComerClientsService,
    private accountMovementService: AccountMovementService,
    private paymentService: PaymentService,
    private datePipe: DatePipe,
    private bankService: BankService
  ) {
    super();
    this.dataNew = {
      movementNumber: null,
      date: null,
      move: null,
      bill: null,
      referenceOri: null,
      bankKey: null,
      branchOffice: null,
      amount: null,
      result: null,
      validSistem: null,
      paymentId: null,
      reference: null,
      lotPub: null,
      event: null,
      entryOrderId: null,
      typeSatId: null,
      code: null,
      lotId: null,
      inTimeNumber: null,
      type: null,
      paymentReturnsId: null,
      recordDate: null,
      dateOi: null,
      appliedTo: null,
      clientId: null,
      folioOi: null,
      indicator: null,
      codeEdoCta: null,
      affectationDate: null,
      recordNumber: null,
      spentId: null,
      paymentRequestId: null,
      customers: null,
      bankAndNumber: null,
    };
  }

  async ngOnInit() {
    await this.prepareForm();
    this.getEvents(new ListParams());
  }

  async prepareForm() {
    this.form = this.fb.group({
      paymentId: [null],
      reference: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      movementNumber: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.required],
      ],
      date: [null, Validators.required],
      amount: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
      bankKey: [null, Validators.required],
      code: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      lotId: [null],
      type: [null, Validators.pattern(STRING_PATTERN)],
      result: [null, Validators.pattern(STRING_PATTERN)],
      recordDate: [null],
      referenceOri: [null, [Validators.pattern(STRING_PATTERN)]],
      dateOi: [null],
      entryOrderId: [null, Validators.pattern(NUMBERS_PATTERN)],
      validSistem: [null, Validators.pattern(STRING_PATTERN)],
      description: [null, Validators.pattern(STRING_PATTERN)],
      branchOffice: [null, Validators.pattern(NUMBERS_PATTERN)],
      reconciled: [null, Validators.pattern(STRING_PATTERN)],
      appliedTo: [null],
      clientId: [null],
      typeSatId: [null, this.getValidators()],
      affectationDate: [null],
    });

    if (this.data != null) {
      this.valInitClient = false;
      this.edit = true;
      this.idPayment = ' No. ' + this.data.paymentId;
      this.form.patchValue({
        paymentId: this.data.paymentId,
        reference: this.data.reference,
        movementNumber: this.data.movementNumber,
        date: secondFormatDateToDate2(this.returnParseDate_(this.data.date)),
        amount: this.data.amount,
        bankKey: this.data.bankKey,
        code: this.data.code,
        result: this.data.result,
        referenceOri: this.data.referenceOri,
        entryOrderId: this.data.entryOrderId,
        validSistem: this.data.validSistem,
        // branchOffice: this.data.branchOffice,
        appliedTo: this.data.appliedTo,
        typeSatId: this.data.typeSatId,
        affectationDate: this.data.affectationDate,
      });

      this.form.get('bankKey').setValue(this.data.bankAndNumber);
      // this.form.get('typeSatId').setValue(this.data.descTypeSatId);
      console.log('this.data', this.data);
      if (this.valCargado) this.gettypeSatIdUpdate(this.data.typeSatId);

      // if (this.data.clientId) {
      //   const params = new ListParams()
      //   params.text = this.data.clientId;
      //   this.getClientsById(params)
      // }
    } else {
      this.valInitClient = true;
    }

    if (this.valScroll) {
      this.form.get('typeSatId').markAsTouched();
      setTimeout(() => {
        this.performScroll();
      }, 500);
    }
    if (this.valCargado) {
      if (this.dataTable)
        this.dataTable.getElements().then(item => {
          // OBTENER EL SIGUIENTE PAYMENT ID //
          console.log('item', item);
          const maxId = item.reduce(
            (max: any, item: any) =>
              item.paymentId > max ? item.paymentId : max,
            0
          );
          this.nextPaymentId = maxId + 1;
          console.log('maxId', this.nextPaymentId);
        });
    }
  }

  // Función para obtener los Validators condicionales
  getValidators() {
    const validators: any = [];

    if (this.valScroll) {
      validators.push(Validators.required);
      return validators;
    } else {
      return validators;
    }
  }

  returnDate(date: Date) {}

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  async update() {
    const bank = this.form.value.bankKey;
    const typeSatId = this.form.value.typeSatId;
    if (this.valCargado) {
      this.data.reference = this.form.value.reference;
      this.data.movementNumber = this.form.value.movementNumber;
      this.data.date = this.datePipe.transform(
        this.form.value.date,
        'yyyy-MM-dd'
      );
      this.data.amount = Number(this.form.value.amount);
      this.data.bankKey = bank.cveBank ? bank.cveBank : this.data.bankKey;
      this.data.code = bank.idCode ? bank.idCode : this.data.code;
      // result: this.form.value.result,
      this.data.referenceOri = this.form.value.referenceOri;
      this.data.validSistem =
        this.form.value.validSistem == '' ? null : this.form.value.validSistem;
      // this.data.branchOffice = this.form.value.branchOffice;
      this.data.appliedTo = this.form.value.appliedTo;
      this.data.typeSatId = typeSatId.idType
        ? typeSatId.idType
        : this.data.typeSatId;
      this.data.descriptionSAT = typeSatId.description
        ? typeSatId.description
        : this.data.descriptionSAT;
      const cve_banco = bank.cveBank ? bank.cveBank : this.data.bankKey;
      this.data.bill = await this.getBanksForCreateAndUpdate(cve_banco);
      if (this.valScroll) {
        this.alert(
          'success',
          'Descripción Pago Sat Actualizada Correctamente',
          ''
        );
        this.loading = false;
        this.modalRef.content.callback(true, this.data);
        this.modalRef.hide();
      } else {
        this.handleSuccess();
      }
    } else {
      const requestBody: any = {
        paymentId: this.data.paymentId,
        reference: this.form.value.reference,
        movementNumber: this.form.value.movementNumber,
        date: this.form.value.date,
        amount: Number(this.form.value.amount),
        bankKey: bank.cveBank,
        code: bank.idCode,
        // result: this.form.value.result,
        referenceOri: this.form.value.referenceOri,
        validSistem:
          this.form.value.validSistem == ''
            ? null
            : this.form.value.validSistem,
        // branchOffice: this.form.value.branchOffice,
        appliedTo: this.form.value.appliedTo,
        typeSatId: typeSatId ? typeSatId.idType : null,
      };

      const cve_banco = requestBody.bankKey
        ? requestBody.bankKey
        : this.data.bankKey;
      requestBody.bill = await this.getBanksForCreateAndUpdate(cve_banco);

      this.paymentService.update(this.data.paymentId, requestBody).subscribe({
        next: response => {
          if (this.valScroll) {
            this.alert(
              'success',
              'Descripción Pago Sat Actualizada Correctamente',
              ''
            );
            this.loading = false;
            this.modalRef.content.callback(true);
            this.modalRef.hide();
          } else {
            this.handleSuccess();
          }
        },
        error: error => {
          if (this.valScroll) {
            this.alert(
              'error',
              'Error al Intentar Actualizar la Descripción Pago Sat',
              ''
            );
          } else {
            if (
              error.error.message ==
              'duplicate key value violates unique constraint "unique_pago"'
            ) {
              this.alert(
                'error',
                'Se ha Encontrado un Registro con estos Datos',
                'Verifique y Actualice Nuevamente'
              );
            } else {
              this.handleError();
            }
          }
        },
      });
    }
  }

  async create() {
    const bank = this.form.value.bankKey;
    const typeSatId = this.form.value.typeSatId;
    const cve_banco = bank ? bank.cveBank : null;
    if (this.valCargado) {
      this.dataNew.reference = this.form.value.reference;
      this.dataNew.movementNumber = this.form.value.movementNumber;
      this.dataNew.date = this.datePipe.transform(
        this.form.value.date,
        'yyyy-MM-dd'
      );
      this.dataNew.amount = Number(this.form.value.amount);
      this.dataNew.bankKey = bank ? bank.cveBank : null;
      this.dataNew.code = bank ? bank.idCode : null;
      this.dataNew.recordDate = new Date();
      this.dataNew.referenceOri = this.form.value.reference;
      this.dataNew.validSistem =
        this.form.value.validSistem == '' ? null : this.form.value.validSistem;
      this.dataNew.appliedTo = this.form.value.appliedTo;
      this.dataNew.typeSatId = typeSatId ? typeSatId.idType : null;
      this.dataNew.paymentId = this.nextPaymentId;
      this.dataNew.descriptionSAT = typeSatId.description
        ? typeSatId.description
        : this.data.descriptionSAT;
      this.dataNew.move = bank ? bank.description : null;
      this.dataNew.bankAndNumber = bank
        ? bank.idCode + ' - ' + bank.cveBank
        : null;
      this.dataNew.bill = await this.getBanksForCreateAndUpdate(
        this.dataNew.bankKey
      );
      const message: string = this.edit ? 'actualizado' : 'guardado';
      this.alert('success', `Pago Referenciado ${message} correctamente`, '');
      this.loading = false;
      this.modalRef.content.callback(true, this.dataNew);
      this.modalRef.hide();
    } else {
      const requestBody: any = {
        reference: this.form.value.reference,
        movementNumber: this.form.value.movementNumber,
        date: this.form.value.date,
        amount: Number(this.form.value.amount),
        bankKey: bank ? bank.cveBank : null,
        code: bank ? bank.idCode : null,
        // result: this.form.value.result,
        recordDate: new Date(),
        referenceOri: this.form.value.reference,
        validSistem:
          this.form.value.validSistem == ''
            ? null
            : this.form.value.validSistem,
        // branchOffice: this.form.value.branchOffice,
        appliedTo: this.form.value.appliedTo,
        typeSatId: typeSatId ? typeSatId.idType : null,
      };
      console.log('requestBody.bankKey', requestBody.bankKey);
      requestBody.bill = await this.getBanksForCreateAndUpdate(
        requestBody.bankKey
      );

      this.paymentService.create(requestBody).subscribe({
        next: response => {
          this.handleSuccess();
          // this.alert('success', 'El Registro se Eliminó Correctamente', '');
        },
        error: error => {
          // if (error.error.message == "La clave del banco no ha sido previamente registrada"){
          if (
            error.error.message ==
            'duplicate key value violates unique constraint "unique_pago"'
          ) {
            this.alert(
              'error',
              'Se ha Encontrado un Registro con estos Datos',
              'Verifique y Actualice Nuevamente'
            );
          } else {
            this.handleError();
          }
          // this.alert(
          //   'error',
          //   'Ocurrió un Error al Guardar el Registro',
          //   error.error.message
          // );
          // }
          // this.handleError();
          // this.alert('error','Ocurrió un Error al Eliminar el Registro','');
        },
      });
    }
  }

  async obtenerMaximo(array: any) {
    return array.reduce(
      (max: any, obj: any) => (obj.paymentId > max.paymentId ? obj : max),
      array[0]
    );
  }

  handleSuccess() {
    const message: string = this.edit ? 'actualizado' : 'guardado';
    this.alert('success', `Pago Referenciado ${message} correctamente`, '');
    this.loading = false;
    this.modalRef.content.callback(true, this.data);
    this.modalRef.hide();
  }

  handleError() {
    const message: string = this.edit ? 'actualizar' : 'guardar';
    this.alert(
      'error',
      `Error al intentar ${message} el Pago Referenciado`,
      ''
    );
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
    params.sortBy = 'idCode:ASC';
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

  getPaymentTypeSat(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    let params__ = '';
    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('idType', lparams.text, SearchFilter.EQ);
      } else {
        console.log('NO');
        params.addFilter('description', lparams.text, SearchFilter.ILIKE);

        // params.addFilter('cve_banco', lparams.text);
      }

    // this.hideError();
    return new Promise((resolve, reject) => {
      this.accountMovementService
        .getPaymentTypeSat(params.getParams())
        .subscribe({
          next: response => {
            console.log('ress122', response);
            let result = response.data.map(item => {
              item['idAndDesc'] = item.idType + ' - ' + item.description;
            });

            Promise.all(result).then((resp: any) => {
              this.sats = new DefaultSelect(response.data, response.count);
            });
          },
          error: err => {
            this.sats = new DefaultSelect();
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
  performScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  gettypeSatIdUpdate(id: any) {
    const params = new FilterParams();

    params.addFilter('idType', id, SearchFilter.EQ);

    return new Promise((resolve, reject) => {
      this.accountMovementService
        .getPaymentTypeSat(params.getParams())
        .subscribe({
          next: response => {
            console.log('ress122', response);
            let result = response.data.map(item => {
              item['descTypeSatId'] = item.idType + ' - ' + item.description;
            });

            Promise.all(result).then((resp: any) => {
              this.form
                .get('typeSatId')
                .setValue(response.data[0].descTypeSatId);
              // this.sats = new DefaultSelect(response.data, response.count);
            });
          },
          error: err => {},
        });
    });
  }

  async getBanksForCreateAndUpdate(bankCode: any) {
    console.log('bankCode', bankCode);
    if (!bankCode) return null;

    const params = new FilterParams();
    params.addFilter('bankCode', bankCode, SearchFilter.EQ);
    return new Promise((resolve, reject) => {
      this.bankService.getAll_(params.getParams()).subscribe({
        next: response => {
          if (!response.data[0].bankAccount) {
            resolve(null);
          } else {
            resolve(response.data[0].bankAccount.cveAccount);
          }
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
}
