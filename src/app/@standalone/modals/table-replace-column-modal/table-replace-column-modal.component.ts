import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectFormComponent } from '../../shared-forms/select-form/select-form.component';

@Component({
  selector: 'app-table-replace-column-modal',
  standalone: true,
  imports: [CommonModule, SharedModule, NgScrollbarModule, SelectFormComponent],
  templateUrl: './table-replace-column-modal.component.html',
  styles: [],
})
export class TableReplaceColumnModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup; // Input requerido al llamar el modal
  formField: string;
  otherFormField: string;
  otherFormLabel: string;
  titleColumnToReplace: string = ''; // nombre de la columna a reemplazar en plura
  tableData: any[] = []; // Input requerido al llamar el modal
  columnsType: any = {}; // Input requerido al llamar el modal
  service: any; //
  dataObservableFn: (self: any, params: string) => Observable<any>; // Input requerido al llamar el modal
  idSelect: string; // Input requerido al llamar el modal
  labelSelect: string; // Input requerido al llamar el modal
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsControl: FilterParams = new FilterParams(); // Input requerido al llamar el modal
  paramFilter = 'search';
  operator = SearchFilter.EQ;
  private _data: any[];
  @Output() newValue = new EventEmitter();
  get data() {
    return this._data;
  }

  get totalItems() {
    return this.tableData.length;
  }

  get getListObservableSelect() {
    return this.dataObservableFn(this.service, this.paramsControl.getParams());
  }

  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    // console.log(this.tableData, [...this.tableData].slice(0, 1));
    this.settings = {
      ...this.settings,
      selectedRowIndex: -1,
      actions: false,
      columns: { ...this.columnsType },
    };
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(x);
      const inicio = (params.page - 1) * params.limit;
      let final = inicio + params.limit;
      final = final > this.tableData.length ? this.tableData.length : final;
      this._data = [...this.tableData].slice(inicio, final);
    });
  }

  confirm() {
    this.newValue.emit(this.form.value);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
