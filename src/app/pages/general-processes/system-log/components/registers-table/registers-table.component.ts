//PRIMER TABLA
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'system-log-registers-table',
  templateUrl: './registers-table.component.html',
  styles: [],
})
export class RegistersTableComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() columns: any = {};
  @Input() params: BehaviorSubject<FilterParams>;
  @Input() totalItems = 0;
  @Input() registers: any[] = [];
  dataFactRegister: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  registerNum: number = null;
  paramsRegi: BehaviorSubject<ListParams>;
  constructor() {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.hideSubHeader = false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.dataFactRegister.load(changes['registers'].currentValue);
    this.dataFactRegister.refresh();
    if (changes['registers']) {
      if (this.registers?.length == 0) {
        this.registerNum = null;
      }
    }
    if (changes['columns']) {
      if (this.columns) {
        const columns = {
          no_registro: {
            title: 'No. Registro',
            sort: false,
          },
          ...this.columns,
        };
        this.settings = { ...this.settings, columns };
      }
    }
  }

  ngOnInit(): void {
    this.dataFactRegister
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'destable'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.dataFactRegister.refresh();
        }
      });
  }

  onSelectTable(row: any) {
    const { no_registro } = row;
    if (!no_registro) {
      this.registerNum = null;
      this.alert('warning', 'El Dato no tiene el Número de Registro', ``);
      return;
    }
    this.registerNum = Number(no_registro);
  }
}
