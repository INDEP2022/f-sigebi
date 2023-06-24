import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DepositTokensModalComponent } from '../deposit-tokens-modal/deposit-tokens-modal.component';
import { DEPOSIT_TOKENS_COLUMNS } from './deposit-tokens-columns';
@Component({
  selector: 'app-deposit-tokens',
  templateUrl: './deposit-tokens.component.html',
  styles: [],
})
export class DepositTokensComponent extends BasePage implements OnInit {
  form: FormGroup;

  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  dataMovements: any = null;
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private accountMovementService: AccountMovementService,
    private datePipe: DatePipe,
    private readonly goodServices: GoodService,
    private dynamicCatalogsService: DynamicCatalogsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: DEPOSIT_TOKENS_COLUMNS,
      rowClassFunction: (row: any) => {
        if (row.data.no_bien != null) {
          return 'bg-warning text-black';
        } else {
          return '';
        }
      },
    };

    // this.settings.rowClassFunction = async (row: any) => {

    // };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              bank: () => (searchFilter = SearchFilter.ILIKE),
              cveAccount: () => (searchFilter = SearchFilter.ILIKE),
              fec_insercion: () => (searchFilter = SearchFilter.ILIKE),
              invoice: () => (searchFilter = SearchFilter.ILIKE),
              fec_traspaso: () => (searchFilter = SearchFilter.ILIKE),
              currency: () => (searchFilter = SearchFilter.ILIKE),
              deposito: () => (searchFilter = SearchFilter.ILIKE),
              no_expediente: () => (searchFilter = SearchFilter.EQ),
              no_bien: () => (searchFilter = SearchFilter.EQ),
              categoria: () => (searchFilter = SearchFilter.ILIKE),
              es_parcializacion: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getAccount();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getAccount();
    });
  }

  getAccount() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.accountMovementService.getAccount2(params).subscribe({
      next: async (response: any) => {
        let result = response.data.map(async (item: any) => {
          const detailsBank: any = await this.returnDataBank(item.no_cuenta);

          item['currency'] = detailsBank ? detailsBank.cveCurrency : null;
          item['bank'] = detailsBank ? detailsBank.cveBank : null;
          item['cveAccount'] = detailsBank ? detailsBank.cveAccount : null;
          item['fec_insercion_'] = item.fec_insercion
            ? this.datePipe.transform(item.fec_insercion, 'dd/MM/yyyy')
            : null;
          item['fec_traspaso_'] = item.fec_traspaso
            ? this.datePipe.transform(item.fec_traspaso, 'dd/MM/yyyy')
            : null;
          item['bancoDetails'] = detailsBank ? detailsBank : null;
        });

        Promise.all(result).then((resp: any) => {
          this.totalItems = response.count;
          this.data1.load(response.data);
          this.data1.refresh();
          console.log(response);
          this.loading = false;
        });
      },
      error: err => {
        this.loading = false;
        this.totalItems = 0;
        this.data1.load([]);
        this.data1.refresh();
      },
    });
  }

  async returnDataBank(id: any) {
    const params = new ListParams();
    params['filter.accountNumber'] = `$eq:${id}`;

    return new Promise((resolve, reject) => {
      this.accountMovementService.getAccountBank(params).subscribe({
        next: response => {
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
          console.log(err);
        },
      });
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      descriptionGood: [null, Validators.nullValidator],
      bank: [null, Validators.nullValidator],
      account: [null, Validators.nullValidator],
      accountType: [null, Validators.nullValidator],
      currency: [null, Validators.nullValidator],
      square: [null, Validators.nullValidator],
      description: [null, Validators.nullValidator],
      branch: [null, Validators.nullValidator],
      balanceOf: [null, Validators.nullValidator],
      balanceAt: [null, Validators.nullValidator],
    });
  }

  async onCustomAction(event: any) {
    this.dataMovements = event.data;
    console.log('data', event);
    // DESCRIPCIÓN DEL BIEN
    if (event.data.no_bien) {
      this.getDetailsGood(event.data.no_bien);
    } else {
      this.form.get('descriptionGood').setValue('');
    }

    // DETALLES DE LA CUENTA
    if (event.data.bancoDetails) {
      await this.insertDataBank(event.data.bancoDetails);

      if (event.data.bancoDetails.cveCurrency) {
        await this.getTvalTable5(event.data.bancoDetails.cveCurrency);
      }
    }
  }

  async insertDataBank(bank: any) {
    this.form.get('bank').setValue(bank.banco.name);
    this.form.get('account').setValue(bank.cveAccount);
    this.form.get('accountType').setValue(bank.accountType);
    this.form.get('currency').setValue(bank.cveCurrency);
    this.form.get('square').setValue(bank.square);
    this.form.get('branch').setValue(bank.branch);
    this.form.get('balanceOf').setValue('');
    this.form.get('balanceAt').setValue('');
  }

  // BUTTONS FUNCTIONS //

  async desconciliarFunc() {
    // this.loading = true;
    if (this.dataMovements) {
      if (this.dataMovements.no_bien == null) {
        this.alert(
          'warning',
          'No existe un bien asociado a este depósito.',
          ''
        );
      } else {
        let obj: any = {
          numberMotion: this.dataMovements.no_movimiento,
          numberGood: null,
          numberProceedings: null,
        };
        this.accountMovementService.update(obj).subscribe({
          next: async (response: any) => {
            this.getAccount();
            this.alert(
              'success',
              `El bien ${this.dataMovements.no_bien} ha sido desconciliado`,
              ''
            );
            this.loading = false;
          },
          error: err => {
            this.alert('error', `Error al desconciliar`, '');
            this.loading = false;
          },
        });
      }
    }
  }

  // GET DETAILS CURRENCY //
  async getTvalTable5(currency: any) {
    const params = new ListParams();
    params['filter.nmtable'] = `$eq:3`;
    params['filter.otkey1'] = `$eq:${currency}`;
    this.dynamicCatalogsService.getTvalTable5(params).subscribe({
      next: response => {
        this.form.get('description').setValue(response.data[0].otvalor01);
        this.loading = false;
      },
      error: err => {
        console.log(err);
        this.form.get('description').setValue('');
        this.loading = false;
      },
    });
  }

  getAttributes() {
    // this.loading = true;
    // this.attributesInfoFinancialService
    //   .getAll(this.params.getValue())
    //   .subscribe({
    //     next: response => {
    //       this.attributes = response.data;
    //       this.totalItems = response.count;
    //       this.loading = false;
    //     },
    //     error: error => (this.loading = false),
    //   });
  }

  getDetailsGood(id: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    this.goodServices.getByExpedientAndParams__(params).subscribe({
      next: async (response: any) => {
        this.form.get('descriptionGood').setValue(response.data[0].description);
      },
      error: err => {
        this.form.get('descriptionGood').setValue('');
      },
    });
  }

  openForm(data?: any) {
    const modalConfig = MODAL_CONFIG;
    let noCuenta = null;
    if (this.dataMovements) {
      noCuenta = this.dataMovements.bancoDetails.accountNumber;
    }
    modalConfig.initialState = {
      noCuenta,
      data,
      callback: (next: boolean) => {
        if (next) this.getAttributes();
      },
    };
    this.modalService.show(DepositTokensModalComponent, modalConfig);
  }
}
