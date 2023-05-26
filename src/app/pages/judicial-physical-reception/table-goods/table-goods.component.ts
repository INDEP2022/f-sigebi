import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-table-goods',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './table-goods.component.html',
  styles: [``],
})
export class TableGoodsComponent extends BasePage implements OnInit {
  @Input()
  get statusActaValue() {
    return this._statusActaValue;
  }
  set statusActaValue(value: string) {
    this._statusActaValue = value;
    this.updateSettingsGoods();
  }
  @Input() override loading = false;
  @Input() haveServerPagination: boolean; // campo requerido
  @Input() haveDelete = true;
  @Input() data: any[] = [];
  @Input() totalItems: number = 0;
  @Input() settingsTable: any;
  @Output() updateData = new EventEmitter<ListParams>();
  @Output() rowsSelected = new EventEmitter();
  @Output() updateGoodsRow = new EventEmitter();
  @Output() showDeleteAlert = new EventEmitter();
  dataPaginated: any[] = [];
  count = 0;
  private _statusActaValue: string;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(x);
      if (this.haveServerPagination) {
        if (this.count > 0) {
          this.updateData.emit(params);
        }
        this.count++;
      } else {
        const cantidad = params.page * params.limit;
        this.dataPaginated = this.data.slice(
          (params.page - 1) * params.limit,
          cantidad > this.data.length ? this.data.length : cantidad
        );
      }
    });
  }

  updateRow(event: any) {
    let { newData, confirm } = event;
    console.log(event);
    this.updateGoodsRow.emit(event);
    confirm.resolve(newData);
  }

  private updateSettingsGoods(value = this.statusActaValue) {
    this.settingsTable = {
      ...this.settingsTable,
      actions: {
        ...this.settingsTable.actions,
        edit: value !== 'CERRADA',
        delete: this.haveDelete && value !== 'CERRADA',
      },
    };
    this.data = [...this.data];
  }
}
