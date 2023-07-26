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
import { LotParamsService } from 'src/app/core/services/ms-lot-parameters/lot-parameters.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_POINT_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-new-and-update',
  templateUrl: './new-and-update.component.html',
  styles: [],
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
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private lotparamsService: LotParamsService,
    private lotService: LotService,
    private comerClientsService: ComerClientsService,
    private accountMovementService: AccountMovementService,
    private paymentService: PaymentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      referencia: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
      numberMovement: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
      date: [null, [Validators.required]],
      monto: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
      description: [null, [Validators.required]],
      conciliado: [null, [Validators.required]],
      cveBanco: [null, [Validators.required]],
      aplicadoA: [null, [Validators.required]],
      cliente: [null, [Validators.required]],
      lote: [null, [Validators.required]],
      validSystem: [null, [Validators.required]],
      entryOrderId: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
    });

    if (this.data != null) {
      this.edit = true;
      this.form.patchValue({
        referencia: this.data.idEvent,
        numberMovement: this.data.publicLot,
        date: this.data.specialGuarantee,
        monto: this.data.idLot,
        description: this.data.idLot,
        conciliado: this.data.idLot,
        cveBanco: this.data.idLot,
        aplicadoA: this.data.idLot,
        cliente: this.data.idLot,
        validSystem: this.data.idLot,
        entryOrderId: this.data.entryOrderId,
      });
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    const requestBody: any = {
      reference: Number(this.form.value.reference),
      numberMovement: Number(this.form.value.numberMovement),
      date: this.form.value.date,
      amount: Number(this.form.value.monto),
      description: this.form.value.description,
      conciliado: this.form.value.conciliado,
      bankkey: this.form.value.cveBanco,
      aplicadoA: this.form.value.aplicadoA,
      clientId: Number(this.form.value.cliente),
      lote: this.form.value.lote,
      entryOrderId: Number(this.form.value.entryOrderId),
      validSystem: this.form.value.validSystem,
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
      numberMovement: Number(this.form.value.numberMovement),
      date: this.form.value.date,
      amount: Number(this.form.value.monto),
      description: this.form.value.description,
      conciliado: this.form.value.conciliado,
      bankkey: this.form.value.cveBanco,
      aplicadoA: this.form.value.aplicadoA,
      clientId: Number(this.form.value.cliente),
      lote: this.form.value.lote,
      entryOrderId: Number(this.form.value.entryOrderId),
      validSystem: this.form.value.validSystem,
    };

    this.paymentService.create(requestBody).subscribe({
      next: response => {
        this.handleSuccess();
        // this.alert('success', 'El Registro se Eliminó Correctamente', '');
      },
      error: error => {
        this.handleError();
        // this.alert('error','Ocurrió un Error al Eliminar el Registro','');
      },
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', `Registro ${message} Correctamente`, this.title);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  handleError() {
    const message: string = this.edit ? 'Actualizar' : 'Guardar';
    this.alert('error', `Error al Intentar ${message} el Registro`, this.title);
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
        params.addFilter('cveAccount', lparams.text, SearchFilter.EQ);
      } else {
        console.log('NO');
        params.addFilter('cveBank', lparams.text, SearchFilter.ILIKE);

        // params.addFilter('cve_banco', lparams.text);
      }

    // this.hideError();
    return new Promise((resolve, reject) => {
      this.accountMovementService.getAccountBank(params.getParams()).subscribe({
        next: response => {
          console.log('ress1', response);
          let result = response.data.map(item => {
            item['bankAndNumber'] = item.cveBank + ' - ' + item.cveAccount;
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
    console.log('DATEEEE', data);
    const formattedDate = moment(data).format('YYYY-MM-DD');
    return data ? formattedDate : null;
  }
}
