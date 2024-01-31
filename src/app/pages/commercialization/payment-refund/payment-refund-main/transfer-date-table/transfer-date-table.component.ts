import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { PaymentDevolutionService } from 'src/app/core/services/ms-paymentdevolution/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from '../../../shared-marketing-components/payment-dispersion-monitor/dispersion-payment-details/checkbox-element/checkbox-element.component';
import { PaysService } from '../services/services';
// import { CREATION_PERMISSIONS_COLUMNS } from './creation-permissions-columns';

@Component({
  selector: 'app-transfer-date-table',
  templateUrl: './transfer-date-table.component.html',
  styles: [],
})
export class TransferDateTableComponent extends BasePage implements OnInit {
  title: 'Permisos de Creación';
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any[] = [];
  totalItems: number = 0;
  selectedAccountB: any;
  selectRowCtrol: any;
  maxDate: Date = new Date();
  dateForm: FormGroup = new FormGroup({});
  selectBanksCheck: any[] = [];
  constructor(
    private svPaymentDevolutionService: PaymentDevolutionService,
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private paysService: PaysService,
    private datePipe: DatePipe
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        delete: false,
        edit: true,
        add: false,
        position: 'right',
      },
      edit: {
        editButtonContent:
          '<i class="fa fa-pencil-alt text-warning mx-2 pl-4"></i>',
      },
      columns: {
        selection: {
          filter: false,
          sort: false,
          title: 'Selección',
          type: 'custom',
          showAlways: true,
          width: '10%',
          valuePrepareFunction: (isSelected: boolean, row: any) =>
            this.isBankSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onBankSelect(instance),
        },
        paymentId: {
          title: 'Id. Pago',
          type: 'string',
          sort: false,
          width: '10%',
        },
        amount: {
          title: 'Monto',
          type: 'html',
          sort: false,
          width: '10%',
          filter: false,
          valuePrepareFunction: (val: string) => {
            const formatter = new Intl.NumberFormat('en-US', {
              currency: 'USD',
              minimumFractionDigits: 2,
            });

            return formatter.format(Number(val));
          },
          filterFunction(cell?: any, search?: string): boolean {
            return true;
          },
        },
        batchId: {
          title: 'Lote',
          type: 'string',
          sort: false,
          width: '10%',
        },
        customer: {
          title: 'Nombre/Denominación',
          type: 'string',
          sort: false,
          width: '20%',
        },
        interbankCLABE: {
          title: 'Clabe Interbancaria',
          type: 'string',
          sort: false,
          width: '20%',
        },
        paymentDate: {
          title: 'Fecha Transf',
          type: 'string',
          sort: false,
          width: '20%',
          valuePrepareFunction: (text: string) => {
            return `${
              text ? text.split('T')[0].split('-').reverse().join('/') : ''
            }`;
          },
          filter: {
            type: 'custom',
            component: CustomDateFilterComponent,
          },
          filterFunction(): boolean {
            return true;
          },
        },
      },
      rowClassFunction: (row: any) => {
        // console.log("row", row)
        if (row.data.keyStatus == 0) {
          return 'bg-no-approved';
        } else {
          return '';
        }
      },
    };
  }
  onBankSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.billingDetSelectedChange(data.row, data.toggle),
    });
  }
  isBankSelected(data: any) {
    const exists = this.selectBanksCheck.find(
      (item: any) => item.paymentId == data.paymentId
    );
    return !exists ? false : true;
  }
  billingDetSelectedChange(data: any, selected: boolean) {
    if (selected) {
      this.selectBanksCheck.push(data);
    } else {
      this.selectBanksCheck = this.selectBanksCheck.filter(
        (item: any) => item.paymentId != data.paymentId
      );
    }
  }

  ngOnInit(): void {
    this.filterTable1();
    this.prepareForm();
  }

  private prepareForm(): void {
    this.dateForm = this.fb.group({
      transferDate: [null, [Validators.required]],
      observations: [null, Validators.pattern(STRING_PATTERN)],
    });
  }

  filterTable1() {
    this.data
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
              paymentId: () => (searchFilter = SearchFilter.EQ),
              amount: () => (searchFilter = SearchFilter.EQ),
              batchId: () => (searchFilter = SearchFilter.EQ),
              customer: () => (searchFilter = SearchFilter.EQ),
              interbankCLABE: () => (searchFilter = SearchFilter.ILIKE),
              paymentDate: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              if (filter.field == 'paymentDate') {
                filter.search = this.datePipe.transform(
                  filter.search,
                  'yyyy-MM-dd'
                );
              }
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  async getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.selectRowCtrol.idOrigen == 1) {
      params[
        'filter.devPaymentControlId'
      ] = `$eq:${this.selectedAccountB.idCtldevpag}`;
      params['filter.account'] = `$eq:${this.selectedAccountB.account}`;
      params['filter.bankCode'] = `$eq:${this.selectedAccountB.cveBank}`;
    } else {
      params[
        'filter.devPaymentControlId'
      ] = `$eq:${this.selectedAccountB.idCtldevpag}`;
    }

    this.svPaymentDevolutionService.getCtlDevPagP_(params).subscribe({
      next: (res: any) => {
        let result = res.data.map(async item => {
          let obj = {
            payId: item.paymentId,
            lotId: item.batchId,
          };
          let resolve: any =
            await this.paysService.getvwComerPaymenttobeReturned(obj);

          (item['amount'] = resolve ? resolve.amount : null),
            (item['publicLot'] = resolve ? resolve.publicLot : null),
            (item['rfc'] = resolve ? resolve.rfc : null),
            (item['customer'] = resolve ? resolve.customer : null),
            (item['interbankCode'] = resolve ? resolve.interbankCode : null),
            (item['keyStatus'] = resolve ? resolve.keyStatus : 1);
          console.log(resolve);
        });
        Promise.all(result).then(resp => {
          console.log('DATA BankAccount', res.data);

          this.data.load(res.data);
          this.data.refresh();
          this.totalItems = res.count;
          this.loading = false;
        });
      },
      error: error => {
        console.log(error);
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  openFolioModal(event?: any) {}

  close() {
    this.modalRef.hide();
  }

  cpyDate() {}
}
