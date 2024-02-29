import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import {
  BehaviorSubject,
  distinctUntilChanged,
  Observable,
  takeUntil,
  throttleTime,
} from 'rxjs';
import {
  DynamicFilterLike,
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { BasePage } from 'src/app/core/shared/base-page';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  firstFormatDateToSecondFormatDate,
  secondFormatDate,
} from 'src/app/shared/utils/date';
import { IUserRowSelectEvent } from '../../../core/interfaces/ng2-smart-table.interface';
import { FormLoaderComponent } from '../../form-loader/form-loader.component';

@Component({
  selector: 'app-select-list-filtered-modal',
  standalone: true,
  imports: [CommonModule, SharedModule, NgScrollbarModule, FormLoaderComponent],
  templateUrl: './select-list-filtered-modal.component.html',
  styleUrls: ['./select-list-filtered-modal.component.scss'],
})
export class SelectListFilteredModalComponent
  extends BasePage
  implements OnInit
{
  data: LocalDataSource = new LocalDataSource();
  haveColumnFilters = false;
  haveSelectColumns = false;
  rowSelected: boolean = false;
  selectedRow: any = null;
  columns: any[] = [];
  totalItems: number = 0;
  idScss: string = '';
  selecteds: { column: string; data: any[] }; // Input para marcar seleccionados en el modal
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  id = new BehaviorSubject<string>('0');
  title: string = ''; // Input requerido al llamar el modal
  title2: string;
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
  showError: boolean = false;
  widthButton = false;
  multi = '';
  hideFilterPlaceholder = false;
  permitSelect = true;
  searchFilter: SearchBarFilter; // Input requerido al llamar el modal
  filters: DynamicFilterLike[] = []; // Input opcional para agregar varios filtros dinamicos
  searchFilterCompatible: boolean = true; // Input opcional para deshabilitar el filtro "search" en la busqueda cuando el endpoint no lo soporta
  selectOnClick: boolean = false; //Input opcional para seleccionar registro al dar click en la tabla
  placeholder: string = 'Buscar...'; //Input opcional para establecer el mensaje del input de busqueda
  pageSelecteds: number[] = [];
  columnFilters: any = [];
  sortFilter: any = [];
  // equalFilters: string[] = ['id'];
  ilikeFilters: string[] = ['description'];
  dateFilters: string[] = [];
  previousSelecteds: any[] = [];
  @Output() onSelect = new EventEmitter<any>();
  @ViewChild('table') table: Ng2SmartTableComponent;

  constructor(private modalRef: BsModalRef) {
    super();
  }

  protected dinamicFilterUpdate() {
    this.data
      .onChanged()
      .pipe(
        distinctUntilChanged(),
        throttleTime(500),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(change => {
        console.log(change);
        if (change.action === 'filter') {
          let haveFilter = false;
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            if (this.ilikeFilters.includes(filter.field)) {
              searchFilter = SearchFilter.ILIKE;
            } else {
              searchFilter = SearchFilter.EQ;
            }
            // if (this.ilikeFilters.includes(filter.field)) {
            //   searchFilter = SearchFilter.ILIKE;
            // }
            field = `filter.${filter.field}`;
            // let search = filter.search;
            // if (isNaN(+search)) {
            //   search = search + ''.toUpperCase();
            // }
            if (filter.search !== '') {
              let newSearch = filter.search;
              console.log(newSearch);
              if (this.dateFilters.includes(filter.field)) {
                if (newSearch instanceof Date) {
                  newSearch = secondFormatDate(newSearch);
                } else if ((newSearch + '').includes('/')) {
                  newSearch = firstFormatDateToSecondFormatDate(newSearch);
                }
              }
              this.columnFilters[field] = `${searchFilter}:${newSearch}`;
              haveFilter = true;
            } else {
              delete this.columnFilters[field];
            }
            console.log(this.columnFilters);
          });
          if (haveFilter) {
            this.params.value.page = 1;
          }
          this.getData();
        }
        if (change.action === 'sort' && change.sort) {
          let sort = change.sort[0];
          this.sortFilter['sortBy'] =
            sort.field + ':' + (sort.direction + '').toUpperCase();
          this.getData();
        }
      });
  }

  ngOnInit(): void {
    this.settings = {
      ...this.settings,
      selectMode: this.multi,
      selectedRowIndex: -1,
      actions: false,
      columns: { ...this.columnsType },
    };
    if (this.haveColumnFilters) {
      this.settings = {
        ...this.settings,
        hideSubHeader: false,
        actions: {
          ...this.settings.actions,
          add: false,
          edit: false,
          delete: false,
        },
      };
      this.dinamicFilterUpdate();
    } else {
      this.addFilters();
    }
    // console.log(this.settings);

    if (!this.widthButton) {
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
  }

  search() {
    this.loading = true;
    setTimeout(() => {
      this.getData();
    }, 1000);
  }

  private getAndSetInitialCharge() {
    if (this.initialCharge || !this.widthButton) {
      this.getData();
    } else {
      this.initialCharge = true;
    }
  }

  private fillSelectedRows() {
    setTimeout(() => {
      console.log(this.selecteds, this.table);
      const currentPage = this.params.getValue().page;
      const selectedPage = this.pageSelecteds.find(
        page => page === currentPage
      );
      this.table.isAllSelected = false;
      let allSelected = true;

      if (
        this.selecteds &&
        this.selecteds.data &&
        this.selecteds.data.length > 0
      ) {
        this.table.grid.getRows().forEach(row => {
          // console.log(row);

          if (
            this.selecteds.data.find(
              item => row.getData()[this.selecteds.column] === item
            )
          ) {
            this.table.grid.multipleSelectRow(row);
            allSelected = allSelected && true;
          } else {
            allSelected = allSelected && false;
          }
          // if(row.getData())
          // this.table.grid.multipleSelectRow(row)
        });
        this.table.isAllSelected = allSelected;
      }
    }, 500);
  }

  private getParams() {
    return {
      ...this.params.getValue(),
      ...this.columnFilters,
      ...this.sortFilter,
    };
  }

  getData(): void {
    // console.log(this.filterParams.getValue().getParams());
    this.loading = true;
    let servicio = this.dataObservableFn
      ? this.dataObservableFn(
          this.service,
          this.filterParams.getValue().getParams()
        )
      : this.dataObservableListParamsFn
      ? this.dataObservableListParamsFn(this.service, this.getParams())
      : this.dataObservableId
      ? this.dataObservableId(this.service, this.id.getValue())
      : null;
    if (servicio) {
      servicio.subscribe({
        next: data => {
          // console.log(data);
          this.columns = data.data;
          this.data.load(data.data);
          this.totalItems = data.count || 0;
          this.loading = false;
          this.fillSelectedRows();
        },
        error: err => {
          console.log(err);
          this.totalItems = 0;
          this.data.load([]);
          if (err.status == 400) {
            if (this.showError) {
              this.alert('error', 'Error', 'No se encontrarón registros');
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
    if (this.permitSelect) {
      if (this.settings.selectMode === 'multi') {
        this.selectRow(event);
      } else {
        this.selectedRow = event.data;
        this.rowSelected = true;
        if (this.selectOnClick) {
          this.onSelect.emit(this.selectedRow);
          this.modalRef.hide();
        }
      }
    }
  }

  private removeRow(item: any) {
    [this.selecteds.column];
    const row = this.selecteds.data.find(
      x => x[this.selecteds.column] === item[this.selecteds.column]
    );
    if (row) {
      this.selecteds.data = this.selecteds.data.filter(
        x => x[this.selecteds.column] != row[this.selecteds.column]
      );
    }
  }

  private selectRow(event: {
    selected: any[];
    isSelected: boolean;
    data: any;
  }) {
    console.log(event);
    // //
    const selecteds = event.selected;

    if (selecteds.length === 0) {
      if (this.previousSelecteds.length > 0 && event.isSelected === null) {
        this.previousSelecteds.forEach(selected => {
          this.removeRow(selected);
        });
      }
      if (event.isSelected === false) {
        this.removeRow(event.data);
      }
    } else {
      if (event.isSelected === null) {
        const currentPage = this.params.getValue().page;
        const selectedPage = this.pageSelecteds.find(
          page => page === currentPage
        );
        if (!selectedPage) {
          this.pageSelecteds.push(currentPage);
        }
        selecteds.forEach(selected => {
          const item = this.selecteds.data.find(
            x => x[this.selecteds.column] === selected[this.selecteds.column]
          );
          if (!item) {
            this.selecteds.data.push(selected);
          }
        });
      } else if (event.isSelected === true) {
        // this.addGood(event.data);
        const currentPage = this.params.getValue().page;
        const selectedPage = this.pageSelecteds.find(
          page => page === currentPage
        );
        if (!selectedPage) {
          this.pageSelecteds.push(currentPage);
        }
        selecteds.forEach(selected => {
          const item = this.selecteds.data.find(
            x => x[this.selecteds.column] === selected[this.selecteds.column]
          );
          if (!item) {
            this.selecteds.data.push(selected);
          }
        });
      } else {
        this.removeRow(event.data);
      }
    }
    console.log(this.selecteds.data);
    this.previousSelecteds = [...selecteds];
  }

  confirm() {
    // if (!this.rowSelected) return;
    if (this.selectedRow) {
      this.onSelect.emit(this.selectedRow);
      this.modalRef.hide();
    } else if (this.selecteds && this.selecteds.data) {
      this.onSelect.emit(this.selecteds.data);
      this.modalRef.hide();
    }
  }
}
