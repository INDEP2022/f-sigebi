import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import {
  DynamicFilterLike,
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { BasePage } from 'src/app/core/shared/base-page';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-select-list-filtered-modal',
  standalone: true,
  imports: [CommonModule, SharedModule, NgScrollbarModule],
  templateUrl: './select-list-filtered-modal.component.html',
  styles: [],
})
export class SelectListFilteredModalComponent
  extends BasePage
  implements OnInit
{
  rowSelected: boolean = false;
  selectedRow: any = null;
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  id = new BehaviorSubject<string>('0');
  title: string = ''; // Input requerido al llamar el modal
  columnsType: any = {}; // Input requerido al llamar el modal
  service: any; // Input requerido al llamar el modal
  dataObservableFn: (self: any, params: string) => Observable<any>; // Input requerido al llamar el modal por filterParams
  dataObservableListParamsFn: (
    self: any,
    params: ListParams
  ) => Observable<any>; // Input requerido al llamar el modal por listParams
  dataObservableId: (self: any, id: string) => Observable<any>;
  showError: boolean = true;
  searchFilter: SearchBarFilter; // Input requerido al llamar el modal
  filters: DynamicFilterLike[] = []; // Input opcional para agregar filtros sin usar busqueda
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
    this.addFilters();
    if (this.dataObservableFn) {
      this.filterParams
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getData());
    } else if (this.dataObservableListParamsFn) {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getData());
    } else if (this.dataObservableId) {
      this.id
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getData());
    }
  }

  getData(): void {
    this.loading = true;
    let servicio = this.dataObservableFn
      ? this.dataObservableFn(
          this.service,
          this.filterParams.getValue().getParams()
        )
      : this.dataObservableListParamsFn
      ? this.dataObservableListParamsFn(this.service, this.params.getValue())
      : this.dataObservableId
      ? this.dataObservableId(this.service, this.id.getValue())
      : null;
    if (servicio) {
      servicio.subscribe({
        next: data => {
          console.log(data);
          this.columns = data.data;
          this.totalItems = data.count;
          this.loading = false;
        },
        error: err => {
          console.log(err);
          this.loading = false;
          if (this.showError) this.onLoadToast('error', 'Error', err);
        },
      });
    }
  }

  addFilters() {
    if (this.filters.length > 0) {
      const params = new FilterParams();
      this.filters.forEach(f => {
        if (f.value !== null) params.addFilter(f.field, f.value, f?.operator);
      });
      this.filterParams.next(params);
    }
  }

  close() {
    this.modalRef.hide();
  }

  selectEvent(event: any) {
    if (this.settings.selectMode === 'multi') {
      this.selectRow(event.selected);
    } else {
      this.selectRow(event.data);
    }
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
