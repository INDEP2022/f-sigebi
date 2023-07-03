import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { PolicyService } from 'src/app/core/services/ms-policy/policy.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-secure-data',
  templateUrl: './secure-data.component.html',
  styles: [],
})
export class SecureDataComponent extends BasePage implements OnInit, OnChanges {
  @Input() goodId: number;
  list: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilter: any = [];
  dataLoand: LocalDataSource = new LocalDataSource();

  constructor(private readonly policyServices: PolicyService) {
    super();
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
    this.settings.columns = {
      policy: {
        title: 'Póliza',
        type: 'number',
        sort: false,
      },
      policyDescription: {
        title: 'Descripción de Póliza',
        type: 'string',
        sort: false,
      },
      insuranceCarrier: {
        title: 'Aseguradora',
        type: 'string',
        sort: false,
      },
      entryDate: {
        title: 'Fecha Ingreso',
        sort: false,
        type: 'html',
        valuePrepareFunction: (text: string) => {
          return `${
            text ? text.split('T')[0].split('-').reverse().join('/') : ''
          }`;
        },
        filter: {
          type: 'custom',
          component: CustomDateFilterComponent,
        },
      },
      lowDate: {
        title: 'Fecha Baja',
        sort: false,
        type: 'html',
        valuePrepareFunction: (text: string) => {
          return `${
            text ? text.split('T')[0].split('-').reverse().join('/') : ''
          }`;
        },
        filter: {
          type: 'custom',
          component: CustomDateFilterComponent,
        },
      },
      amountInsured: {
        title: 'Suma Asegurada',
        type: 'string',
        sort: false,
      },
      premiumAmount: {
        title: 'Monto Prima',
        type: 'string',
        sort: false,
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.searchDataValuations(this.goodId);
    }
  }

  ngOnInit(): void {
    this.dataLoand
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'policy':
                searchFilter = SearchFilter.EQ;
                break;
              case 'entryDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'lowDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilter[field] = `${searchFilter}:${filter.search}`;
              this.params.value.page = 1;
            } else {
              delete this.columnFilter[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.searchDataValuations(this.goodId);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchDataValuations(this.goodId));
  }

  searchDataValuations(idGood: number) {
    this.loading = true;
    this.params.getValue()['filter.goodNumberId'] = `$eq:${idGood}`;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilter,
    };
    this.policyServices.getAll(params).subscribe({
      next: response => {
        this.list = response.data.map(policy => {
          return {
            policy: policy.Policies.policyKeyId,
            policyDescription: policy.Policies.description,
            insuranceCarrier: policy.Policies.insurancecarrier,
            entryDate: policy.entryDate,
            lowDate: policy.shortDate,
            amountInsured: policy.additionInsured,
            premiumAmount: policy.amountCousin,
          };
        });
        this.dataLoand.load(this.list);
        this.dataLoand.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.dataLoand.load([]);
        this.dataLoand.refresh();
        this.loading = false;
      },
    });
  }
}
