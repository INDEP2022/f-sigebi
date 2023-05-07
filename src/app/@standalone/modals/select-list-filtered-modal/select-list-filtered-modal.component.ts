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
import { IUserRowSelectEvent } from '../../../core/interfaces/ng2-smart-table.interface';

@Component({
  selector: 'app-select-list-filtered-modal',
  standalone: true,
  imports: [CommonModule, SharedModule, NgScrollbarModule],
  templateUrl: './select-list-filtered-modal.component.html',
  styles: [
    `
      .heigth-limit {
        height: 52rem;
      }

      ng-scrollbar {
        ::ng-deep {
          .ng-scroll-viewport {
            padding-right: 1em;
          }
        }
      }
    `,
  ],
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
  type: 'number' | 'text' = 'number';
  initialCharge = true;
  haveSearch = true;
  showError: boolean = true;
  searchFilter: SearchBarFilter; // Input requerido al llamar el modal
  filters: DynamicFilterLike[] = []; // Input opcional para agregar varios filtros dinamicos
  searchFilterCompatible: boolean = true; // Input opcional para deshabilitar el filtro "search" en la busqueda cuando el endpoint no lo soporta
  selectOnClick: boolean = false; //Input opcional para seleccionar registro al dar click en la tabla
  placeholder: string = 'Buscar...'; //Input opcional para establecer el mensaje del input de busqueda
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
    // console.log(this.settings);

    this.addFilters();
    if (this.dataObservableFn) {
      this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
        this.getAndSetInitialCharge();
      });
    } else if (this.dataObservableListParamsFn) {
      this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
        this.getAndSetInitialCharge();
      });
    } else if (this.dataObservableId) {
      this.id.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
        this.getAndSetInitialCharge();
      });
    }
  }

  private getAndSetInitialCharge() {
    if (this.initialCharge) {
      this.getData();
    } else {
      this.initialCharge = true;
    }
  }

  getData(): void {
    console.log(this.filterParams.getValue().getParams());
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
          this.totalItems = data.count || 0;
          this.loading = false;
        },
        error: err => {
          console.log(err);
          if (err.status == 400) {
            if (this.showError) {
              this.onLoadToast('error', 'Error', 'No se encontrarón registros');
            }
          }
          this.loading = false;
        },
      });
    }
  }

  addFilters() {
    if (this.filters.length > 0) {
      const params = new FilterParams();
      this.filters.forEach(f => {
        if (f.value !== null && f.value !== undefined && this.type === 'text') {
          params.addFilter(f.field, f.value, f?.operator);
        } else if (
          f.value !== null &&
          f.value !== undefined &&
          f.value !== '' &&
          this.type !== 'number'
        ) {
          params.addFilter(f.field, f.value, f?.operator);
        }
      });
      this.filterParams.next(params);
    }
  }

  close() {
    this.modalRef.hide();
  }

  selectEvent(event: IUserRowSelectEvent<any>) {
    if (this.settings.selectMode === 'multi') {
      this.selectRow(event.selected);
    } else {
      this.selectRow(event.data);
    }
  }

  private selectRow(row: any) {
    this.selectedRow = row;
    this.rowSelected = true;
    if (this.selectOnClick) {
      this.onSelect.emit(this.selectedRow);
      this.modalRef.hide();
    }
  }

  confirm() {
    if (!this.rowSelected) return;
    this.onSelect.emit(this.selectedRow);
    this.modalRef.hide();
  }
}
