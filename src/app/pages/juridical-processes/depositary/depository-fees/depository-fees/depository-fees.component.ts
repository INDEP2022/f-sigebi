import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IPaymentsGensDepositary } from 'src/app/core/models/ms-depositarypayment/ms-depositarypayment.interface';
import { MsDepositaryPaymentService } from 'src/app/core/services/ms-depositarypayment/ms-depositarypayment.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalDepositoryFeesComponent } from '../modal-depository-fees/modal-depository-fees.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-depository-fees',
  templateUrl: './depository-fees.component.html',
  styles: [],
})
export class DepositoryFeesComponent extends BasePage implements OnInit {
  form: FormGroup;

  get appointment() {
    return this.form.get('appointment');
  }
  get idPayment() {
    return this.form.get('idPayment');
  }

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  origin: string = null;
  origin2: string = null;
  noBienParams: number = null;
  consult: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private depositaryPaymentService: MsDepositaryPaymentService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.origin = params['origin'] ?? null;
        if (this.origin == 'FCONDEPODISPAGOS') {
          this.noBienParams = params['p_bien']
            ? Number(params['p_bien'])
            : null;
        }
        this.origin2 = params['origin2'] ?? null;
      });

    this.buildForm();

    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'no_appointment':
                searchFilter = SearchFilter.EQ;
                break;
              case 'noGoods':
                searchFilter = SearchFilter.EQ;
                break;
              case 'payId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'processDate':
                if (filter.search != null) {
                  filter.search = this.returnParseDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              this.params.value.page = 1;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getData();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.consult) this.getData();
    });
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      appointment: [null],
      idPayment: [null],
    });
  }

  goBack() {
    if (this.origin === 'FCONDEPODISPAGOS') {
      this.router.navigate(
        [
          '/pages/juridical/depositary/payment-dispersion-process/query-related-payments-depositories/' +
            this.noBienParams,
        ],
        {
          queryParams: {
            origin: this.origin2,
            goodNumber: this.noBienParams,
          },
        }
      );
    }
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.depositaryPaymentService
      .getPaymentsGensDepositories2(params)
      .subscribe({
        next: response => {
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
        },
        error: err => {
          this.data.load([]);
          this.data.refresh();
          this.totalItems = 0;
          this.loading = false;
        },
      });
  }

  search() {
    this.consult = true;
    console.log();
    if (this.appointment.value === '') this.appointment.setValue(null);
    if (this.idPayment.value === '') this.idPayment.setValue(null);
    if (this.appointment.value !== null) {
      this.params.getValue()[
        'filter.no_appointment'
      ] = `$eq:${this.appointment.value}`;
    } else {
      delete this.params.getValue()['filter.no_appointment'];
    }
    if (this.idPayment.value !== null) {
      this.params.getValue()['filter.payId'] = `$eq:${this.idPayment.value}`;
    } else {
      delete this.params.getValue()['filter.payId'];
    }
    this.getData();
  }

  clean() {
    delete this.params.getValue()['filter.payId'];
    delete this.params.getValue()['filter.no_appointment'];
    this.params.getValue().text = '';
    this.params.getValue().page = 1;
    //this.params.getValue().limit = 10;
    this.params.getValue().inicio = 1;
    this.params.getValue().pageSize = 10;
    this.params.getValue().take = 10;
    //this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.form.reset();
    this.data.load([]);
    this.data.refresh();
    this.totalItems = 0;
  }

  openModal(pay?: IPaymentsGensDepositary) {
    let config: ModalOptions = {
      initialState: {
        pay,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getData());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalDepositoryFeesComponent, config);
  }

  edit(pay: IPaymentsGensDepositary) {
    this.openModal(pay);
  }
}
