import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs';
interface IColumns {
  id: string;
  name: string;
  show: boolean;
  showAlways?: boolean;
}

interface ISettings {
  columns: any;
}
@Component({
  selector: 'app-columns-select',
  templateUrl: './columns-select.component.html',
  styles: [
    `
      #dropdown-basic {
        max-height: 200px;
        overflow-y: auto;
        position: absolute !important;
        inset: 100% auto auto 0px !important;
        transform: translate3d(0px, 34px, 0px) !important;
        margin-right: 0px !important;
      }
      #dropdown-basic.left {
        inset: 0% auto auto -93px !important;
        width: 200px !important;
        max-width: 200px !important;
      }

      #searchbar {
        font-size: 14px;
        height: 35px;
      }
    `,
  ],
})
export class ColumnsSelectComponent implements OnInit {
  @Input() set changeSettings(value: number) {
    if (value > 0) {
      this.initColumns();
    }
  }
  @Input()
  defaultColumns: number = 6;
  /*
  ! Si se desea cambiar el numero de columnas para una pantalla en especifoco,
  ! se debe mandar el numero de columnas como input,
  ! POR DEFECTO SIEMPRE SERA 6
  */
  @Input() settings: ISettings = { columns: {} };
  @Output() settingsChange = new EventEmitter<any>();
  private allColumns: any = {};
  columns: IColumns[] = [];
  @Input()
  leftList: boolean = false;
  searchControl = new FormControl<string>(null);
  selectAllControl = new FormControl(false);
  constructor() {}

  ngOnInit(): void {
    this.initColumns();
    this.selectAllControl.valueChanges
      .pipe(tap(checked => (checked ? this.selectAll() : this.initColumns())))
      .subscribe();
  }

  private initColumns() {
    this.allColumns = Object.assign({}, this.settings.columns);
    this.buildColumnsSelect(this.defaultColumns);
  }

  private buildColumnsSelect(initial: number) {
    this.columns = [];
    Object.keys(this.allColumns).forEach((e, i) => {
      this.allColumns[e].show =
        this.allColumns[e]?.showAlways ?? (i < initial ? true : false);
      this.columns.push({
        id: e,
        name: this.allColumns[e].title,
        show: this.allColumns[e].show,
        showAlways: this.allColumns[e]?.showAlways,
      });
    });
    this.filterColumns();
  }

  private filterColumns() {
    const columns: any = {};
    Object.keys(this.allColumns).forEach((e, i) => {
      if (this.allColumns[e].show) {
        columns[e] = this.allColumns[e];
      }
    });
    const settings = Object.assign({}, this.settings);
    settings.columns = columns;
    this.settingsChange.emit(settings);
  }

  change(field: string, value: boolean) {
    this.allColumns[field].show = value;
    this.filterColumns();
  }

  selectVal(): IColumns[] {
    return this.columns.filter(_e => _e.show);
  }

  selectColumn(event: Event, field: string, value: boolean) {
    event.stopPropagation();
    this.change(field, value);
  }

  getColumns() {
    const search = this.searchControl.value;
    const selectedColumns = this.columns.filter(column => column.show);
    const notSelectedColumns = this.columns.filter(column => !column.show);
    const sortedArray = notSelectedColumns.sort((a, b) => {
      const aName = a?.name ?? '';
      const bName = b?.name ?? '';
      return aName > bName ? 1 : bName > aName ? -1 : 0;
    });
    const columns = [...selectedColumns, ...sortedArray];
    if (!search) {
      return columns;
    }
    return columns.filter(column =>
      (column.name ?? '').toLowerCase().includes(search.toLowerCase())
    );
  }

  selectAll() {
    Object.keys(this.allColumns).forEach(key => {
      this.allColumns[key].show = true;
    });

    this.filterColumns();
    this.columns = this.columns.map(column => {
      return { ...column, show: true };
    });
  }
}
