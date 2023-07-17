import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GENERAL_RECEPTION_STRATEGIES_COLUNNS } from './reception-strategies-columns';
interface IBlkcontrol {
  totalcumplido: number;
  totalNocumplido: number;
  porcentajeCunplido: number;
}
@Component({
  selector: 'app-reception-strategies',
  templateUrl: './reception-strategies.component.html',
  styles: [],
})
export class ReceptionStrategiesComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  blkcontrol: IBlkcontrol = {
    totalcumplido: 20,
    totalNocumplido: 10,
    porcentajeCunplido: 70,
  };
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private excelService: ExcelService,
    private strategyService: StrategyServiceService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = GENERAL_RECEPTION_STRATEGIES_COLUNNS;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.data
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
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'proceedings':
                searchFilter = SearchFilter.EQ;
                break;
              case 'captureMinutesReceptionDate':
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
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.strategyService.getZCenterOperationRegional(params).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
      },
    });
  }

  async consult(form: FormGroup) {
    console.log(form.value);
    const vEtapa: number = await this.vEtapa();
    if (vEtapa === 1) {
    } else {
    }
  }

  vEtapa() {
    return new Promise<number>((res, _rej) => {});
  }

  async export(event: FormGroup) {
    console.log(event.value);
    const filename: string = 'Numerario Prorraneo';
    const jsonToCsv = await this.data.getAll();
    if (jsonToCsv.length === 0) {
      this.alert(
        'warning',
        'Indicador de Dictaminación',
        'No hay información para descargar'
      );
      return;
    }
    this.excelService.export(jsonToCsv, { type: 'csv', filename });
  }
}
