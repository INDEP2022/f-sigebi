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
import { IDepositaryAppointments } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-appointment-data',
  templateUrl: './appointment-data.component.html',
  styles: [],
})
export class AppointmentDataComponent
  extends BasePage
  implements OnInit, OnChanges
{
  list: any[] = [];
  @Input() goodId: number;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilter: any = [];
  dataLoand: LocalDataSource = new LocalDataSource();

  constructor(private readonly depositaryService: MsDepositaryService) {
    super();
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
    this.settings.columns = {
      responsible: {
        title: 'Responsable',
        width: '20%',
        sort: false,
      },
      deliveryDate: {
        title: 'Fecha Entrega',
        width: '70%',
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
      provisionalAppointmentDate: {
        title: 'Fecha Nomb. Prov.',
        width: '70%',
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
      dateRemoval: {
        title: 'Fecha Remoción',
        width: '70%',
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
      contractKey: {
        title: 'Cve. Contrato',
        width: '70%',
        sort: false,
      },
      dateFinalAppointment: {
        title: 'Fecha Nomb. Definitivo',
        width: '70%',
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
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.searchGoodMenage(this.goodId);
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
              case 'deliveryDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'provisionalAppointmentDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'dateRemoval':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'dateFinalAppointment':
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
          this.searchGoodMenage(this.goodId);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchGoodMenage(this.goodId));
  }

  searchGoodMenage(idGood: number) {
    this.loading = true;
    this.params.getValue()['filter.goodNum'] = `$eq:${idGood}`;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilter,
    };
    this.depositaryService.getAppointments(params).subscribe({
      next: (response: any) => {
        this.list = response.data.map((appoiment: IDepositaryAppointments) => {
          return {
            responsible: appoiment.responsible,
            deliveryDate: appoiment.assignmentDate,
            provisionalAppointmentDate: appoiment.nameProvDete,
            dateRemoval: appoiment.revocationDate,
            contractKey: appoiment.contractKey,
            dateFinalAppointment: appoiment.appointmentDate,
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
