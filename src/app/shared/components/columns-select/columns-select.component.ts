import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
      }
    `,
  ],
})
export class ColumnsSelectComponent implements OnInit {
  @Input() settings: ISettings = { columns: {} };
  @Input() defaultColumns: number = 5;
  @Output() settingsChange = new EventEmitter<any>();
  private allColumns: any = {};
  columns: IColumns[] = [];
  constructor() {}

  ngOnInit(): void {
    this.allColumns = Object.assign({}, this.settings.columns);
    this.buildColumnsSelect(this.defaultColumns);
  }

  private buildColumnsSelect(initial: number) {
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
    const selectedColumns = this.columns.filter(column => column.show);
    const notSelectedColumns = this.columns.filter(column => !column.show);
    const sortedArray = notSelectedColumns.sort((a, b) => {
      const aName = a?.name ?? '';
      const bName = b?.name ?? '';
      return aName > bName ? 1 : bName > aName ? -1 : 0;
    });
    return [...selectedColumns, ...sortedArray];
  }
}
