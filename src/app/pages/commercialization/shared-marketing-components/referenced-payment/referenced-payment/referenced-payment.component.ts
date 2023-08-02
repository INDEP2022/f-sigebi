import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-referenced-payment',
  templateUrl: './referenced-payment.component.html',
  styles: [],
})
export class ReferencedPaymentComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  comerEventSelect = new DefaultSelect();
  banks = new DefaultSelect();
  layout: string = '';
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private modalService: BsModalService,
    private token: AuthService,
    private route: ActivatedRoute,
    private comerClientsService: ComerClientsService,
    private comerEventService: ComerEventService,
    private accountMovementService: AccountMovementService,
    private comerEventosService: ComerEventosService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: false,
        position: 'right',
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('goodType')) {
        console.log(params.get('goodType'));
        this.layout = params.get('goodType');
      }
    });

    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              paymentId: () => (searchFilter = SearchFilter.EQ),
              reference: () => (searchFilter = SearchFilter.ILIKE),
              movementNumber: () => (searchFilter = SearchFilter.EQ),
              move: () => (searchFilter = SearchFilter.EQ),
              date: () => (searchFilter = SearchFilter.EQ),
              amount: () => (searchFilter = SearchFilter.EQ),
              bankKey: () => (searchFilter = SearchFilter.ILIKE),
              entryOrderId: () => (searchFilter = SearchFilter.EQ),
              lotPub: () => (searchFilter = SearchFilter.EQ),
              event: () => (searchFilter = SearchFilter.EQ),
              clientId: () => (searchFilter = SearchFilter.EQ),
              rfc: () => (searchFilter = SearchFilter.ILIKE),
              name: () => (searchFilter = SearchFilter.ILIKE),
              appliedTo: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getPayments();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPayments());

    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      bank: [null, [Validators.required]],
      from: [null, [Validators.required]],
    });
  }

  add() {
    //this.openModal();
  }

  edit(data: any) {
    //console.log(data)
    //this.openModal({ edit: true, paragraph });
  }

  questionDelete(data: any) {
    console.log(data);
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  rowsSelected(event: any) {}
  getPayments() {
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    if (params['filter.date']) {
      var fecha = new Date(params['filter.date']);

      // Obtener los componentes de la fecha (año, mes y día)
      var año = fecha.getFullYear();
      var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var día = ('0' + fecha.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada = año + '-' + mes + '-' + día;
      params['filter.date'] = `$eq:${fechaFormateada}`;
      // delete params['filter.date'];
    }

    if (params['filter.name']) {
      params['filter.customers.nomRazon'] = params['filter.name'];
      delete params['filter.name'];
    }

    if (params['filter.rfc']) {
      params['filter.customers.rfc'] = params['filter.rfc'];
      delete params['filter.rfc'];
    }

    if (params['filter.lotPub']) {
      params['filter.lots.lotPublic'] = params['filter.lotPub'];
      delete params['filter.lotPub'];
    }

    if (params['filter.event']) {
      params['filter.lots.idEvent'] = params['filter.event'];
      delete params['filter.event'];
    }

    if (params['filter.move']) {
      params['filter.ctrl.description'] = params['filter.move'];
      delete params['filter.move'];
    }

    params['filter.entryOrderId'] = `$null`;
    params['sortBy'] = `paymentId:DESC`;
    this.paymentService.getComerPaymentRefGetAllV2(params).subscribe({
      next: response => {
        console.log(response);
        let result = response.data.map(async (item: any) => {
          // const client: any = await this.getClients(item.clientId);
          item['rfc'] = item.customers ? item.customers.rfc : null;
          item['name'] = item.customers ? item.customers.nomRazon : null;
          item['event'] = item.lots ? item.lots.idEvent : null;
          item['lotPub'] = item.lots ? item.lots.lotPublic : null;
          item['move'] = item.ctrl ? item.ctrl.description : null;
        });
        Promise.all(result).then(resp => {
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
        });
      },
      error: error => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
        console.log(error);
      },
    });
  }

  getComerEvents(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text) params.addFilter('id', lparams.text, SearchFilter.EQ);

    params.addFilter('address', this.layout, SearchFilter.EQ);

    this.comerEventService.getAllFilter(params.getParams()).subscribe({
      next: data => {
        // let result = data.data.map(item => {
        //   item['bindlabel_'] = item.id + ' - ' + item.description;
        // });
        // Promise.all(result).then(resp => {
        console.log('EVENT', data);
        this.comerEventSelect = new DefaultSelect(data.data, data.count);
        // });
      },
      error: err => {
        this.comerEventSelect = new DefaultSelect();
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
        // params__ = `?filter.idCode=${lparams.text}`;
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        console.log('NO');
        params.addFilter('cveBank', lparams.text, SearchFilter.ILIKE);
        // params__ = `?filter.cveBank=${lparams.text}`;
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
              item['bankAndCode'] = item.idCode + ' - ' + item.cveBank;
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
  search() {}
  clear() {}

  setValuesFormEvent(event?: any) {}

  setValuesFormBank(event?: any) {}
}
