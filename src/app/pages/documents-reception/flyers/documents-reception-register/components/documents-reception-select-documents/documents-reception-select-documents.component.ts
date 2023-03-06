import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-documents-reception-select-documents',
  templateUrl: './documents-reception-select-documents.component.html',
  styles: [],
})
export class DocumentsReceptionSelectDocumentsComponent
  extends BasePage
  implements OnInit
{
  rowSelected: boolean = false;
  selectedRow: any = null;
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  title: string = ''; // Input requerido al llamar el modal
  columnsType: any = {}; // Input requerido al llamar el modal
  service: any; // Input requerido al llamar el modal
  dataObservableFn: (self: any, params: string) => Observable<any>; // Input requerido al llamar el modal
  filter: SearchBarFilter; // Input requerido al llamar el modal
  showSearch: boolean = true; // Input opcional para mostrar busqueda
  @Output() onSelect = new EventEmitter<any>();

  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...this.settings,
      selectedRowIndex: -1,
      actions: false,
      columns: { ...this.columnsType },
    };
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData(): void {
    this.loading = true;
    this.dataObservableFn(
      this.service,
      this.params.getValue().getParams()
    ).subscribe({
      next: data => {
        this.columns = data.data;
        this.totalItems = data.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.onLoadToast('error', 'Error', err);
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  selectRow(row: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  confirm() {
    if (!this.rowSelected) return;
    this.onSelect.emit(this.selectedRow);
    this.modalRef.hide();
  }
}
