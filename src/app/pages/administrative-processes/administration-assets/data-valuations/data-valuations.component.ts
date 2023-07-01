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
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-data-valuations',
  templateUrl: './data-valuations.component.html',
  styles: [],
})
export class DataValuationsComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() goodId: number;
  list: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilter: any = [];
  dataLoand: LocalDataSource = new LocalDataSource();

  constructor(private readonly appraiseService: AppraiseService) {
    super();
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
    this.settings.columns = {
      noRequest: {
        title: 'No. Solicitud',
        type: 'number',
        sort: false,
      },
      valuationDate: {
        title: 'Fecha Avalúo',
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
      validityDate: {
        title: 'Fecha Vigencia',
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
      cost: {
        title: 'Costo',
        type: 'string',
        sort: false,
      },
      valuationValue: {
        title: 'Valor Avalúo',
        type: 'string',
        sort: false,
      },
      origin: {
        title: 'Origen',
        type: 'string',
        sort: false,
      },
      comercializationValue: {
        title: 'Valor Comercialización',
        type: 'string',
        sort: false,
      },
      landValue: {
        title: 'Valor Terreno',
        type: 'string',
        sort: false,
      },
      buildingValue: {
        title: 'Valor Const.',
        type: 'string',
        sort: false,
      },
      instValue: {
        title: 'Valor Inst.',
        type: 'string',
        sort: false,
      },
      oportunityValue: {
        title: 'Valor Oportunidad',
        type: 'string',
        sort: false,
      },
      unitValue: {
        title: 'Valor Unitario',
        type: 'string',
        sort: false,
      },
      maqEquiValue: {
        title: 'Valor Maq. Equipo',
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
              case 'noRequest':
                searchFilter = SearchFilter.EQ;
                break;
              case 'valuationDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'validityDate':
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
    this.params.getValue()['filter.noGood'] = `$eq:${idGood}`;
    this.params.getValue()['order'] = 'DESC';
    let params = {
      ...this.params.getValue(),
      ...this.columnFilter,
    };
    this.appraiseService.getAllAvaluoXGood(params).subscribe({
      next: response => {
        this.list = response.data.map(apprise => {
          return {
            noRequest: apprise.requestXAppraisal.id,
            valuationDate: apprise.appraisalDate,
            validityDate: apprise.requestXAppraisal.requestDate,
            cost: apprise.cost,
            valuationValue: apprise.valueAppraisal,
            phisicValue: apprise.vPhysical,
            comercializationValue: apprise.vCommercial,
            landValue: apprise.vTerrain,
            buildingValue: apprise.vConst,
            instValue: apprise.vInst,
            oportunityValue: apprise.vOpportunity,
            unitValue: apprise.vUnitaryM2,
            maqEquiValue: apprise.vMachEquip,
            origin: '',
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
