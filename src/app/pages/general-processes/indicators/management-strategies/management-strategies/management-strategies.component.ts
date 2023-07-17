import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { StrategyAdminService } from 'src/app/core/services/ms-strategy/strategy-admin.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { MANAGEMENT_STRATEGIES_COLUMNS } from './management-strategies.columns';

@Component({
  selector: 'app-management-strategies',
  templateUrl: './management-strategies.component.html',
  styles: [],
})
export class ManagementStrategiesComponent extends BasePage implements OnInit {
  form = this.fb.group({
    fecha: [null, [Validators.required]],
    // month: [null, [Validators.required]],
    year: [null, [Validators.required]],
    month: [null, [Validators.required]],
    usuario: [null, [Validators.required]],
    cordinador: [null, [Validators.required]],
    estrategiasPreparar: [null, [Validators.required]],
    reportePreparar: [null, [Validators.required]],
    estrategiasEntregadas: [null, [Validators.required]],
    reporteEntregadas: [null, [Validators.required]],
    porcentaje: [null, [Validators.required]],
  });
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  select = new DefaultSelect();
  columns: any[] = [];

  constructor(private fb: FormBuilder, private service: StrategyAdminService) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        add: false,
        edit: false,
        delete: false,
        position: 'right',
      },
      columns: MANAGEMENT_STRATEGIES_COLUMNS,
    };
    // this.settings.actions = false;
    // this.settings.columns = MANAGEMENT_STRATEGIES_COLUMNS;
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
            switch (filters.field) {
              case 'consecutiveId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'folioAmongWeatherId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'valFolioAmongTime':
                searchFilter = SearchFilter.EQ;
                break;
              case 'repAmongWeather':
                searchFilter = SearchFilter.EQ;
                break;
              case 'valRepAmongTime':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getTableFolio();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTableFolio());
  }

  onChangeUser(event: any) {
    console.log(event);
    this.form.get('usuario')?.setValue(event.id);
  }

  getTableFolio() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.service.getAllTableFolio(params).subscribe({
      next: response => {
        console.log(response);
        this.columns = response.data;
        this.data.load(this.columns);
        this.totalItems = response.count || 0;
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
    // this.service.getAllTableFolio().subscribe((res) => {
    //   console.log(res);
    //   this.data = res.data;
    //   this.totalItems = res.count || 0;
    // });
  }
  report() {
    console.log(this.form.value);
    //crear let model en base de IStrategyAdmin
    const model = {
      yearEvaluateId: this.form.value.year,
      monthEvaluateId: this.form.value.month,
      delegationNumberId: this.form.value.cordinador,
      userInsertId: this.form.value.usuario,
    };

    this.service.postReport(model).subscribe(res => {
      console.log(res);
    });
  }
}
