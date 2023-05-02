import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { SelectListFilteredModalComponent } from '../../../../@standalone/modals/select-list-filtered-modal/select-list-filtered-modal.component';
import {
  DynamicFilterLike,
  FilterParams,
  SearchFilter,
} from '../../../../common/repository/interfaces/list-params';
import { IListResponse } from '../../../../core/interfaces/list-response.interface';
import { IUserRowSelectEvent } from '../../../../core/interfaces/ng2-smart-table.interface';
import { BasePage } from '../../../../core/shared/base-page';

export interface FieldToSearch {
  field: string;
  operator?: SearchFilter;
  nestedObjField?: string;
}

@Component({
  selector: 'app-form-search-handler',
  templateUrl: './form-search-handler.component.html',
  styles: [
    `
      .heigth-limit {
        height: 52rem;
      }

      ng-scrollbar {
        ::ng-deep {
          .ng-scroll-viewport {
            padding-right: 1em;
            padding-bottom: 1em;
          }
        }
      }
    `,
  ],
})
export class FormSearchHandlerComponent
  extends BasePage
  implements OnInit, OnChanges
{
  searchMode: boolean = false;
  searchConfirm: boolean = false;
  rowSelected: boolean = false;
  selectedRow: any = null;
  searchOnInput: boolean = false;
  title: string = '';
  columns: any[] = [];
  totalItems: number = 0;
  filters: DynamicFilterLike[] = [];
  selectOnClick: boolean = false;
  modalLoaded: boolean = false;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  @ViewChild('modal', { static: false }) modal?: ModalDirective;
  @Input() columnsType: any = null;
  @Input() service: any;
  @Input() dataObservableFn: (
    self: any,
    params: string
  ) => Observable<IListResponse<any>>;
  @Input() formData: any = null;
  @Input() fieldsToSearch: FieldToSearch[] = []; //Si no hay campos se haran filtros para todos los elementos del objeto formData
  @Output() onSearchStart = new EventEmitter<boolean>();
  @Output() onConfirmSearch = new EventEmitter<boolean>();
  @Output() onSelect = new EventEmitter<any>();

  constructor(
    private modalService: BsModalService,
    private modalRef: BsModalRef<SelectListFilteredModalComponent>,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...this.settings,
      selectedRowIndex: -1,
      actions: false,
      columns: { ...this.columnsType },
    };
    if (this.dataObservableFn) {
      this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
        if (this.searchOnInput) {
          this.getData();
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (
      changes['formData']?.currentValue &&
      !changes['formData']?.isFirstChange()
    ) {
      console.log('formData');
      this.searchOnInput = true;
      this.loading = true;
      this.buildFilters();
    }
  }

  enableSearchMode() {
    this.searchMode = true;
    this.onSearchStart.emit(true);
  }

  confirmSearch() {
    this.searchMode = false;
    this.searchConfirm = true;
    this.onConfirmSearch.emit(true);
  }

  cancelSearch() {
    this.searchMode = false;
    this.searchConfirm = false;
    this.onSearchStart.emit(false);
  }

  getData(): void {
    console.log(this.filterParams.getValue().getParams());
    this.loading = true;
    if (this.dataObservableFn) {
      this.dataObservableFn(
        this.service,
        this.filterParams.getValue().getParams()
      ).subscribe({
        next: data => {
          if (data.count > 0) {
            this.columns = data.data;
            this.totalItems = data.count;
            this.loading = false;
            this.modalLoaded = true;
            this.changeDetectorRef.detectChanges();
            if (!this.modal.isShown && data.count > 1) {
              this.modal.show();
            } else if (data.count == 1) {
              this.onSearchStart.emit(false);
              this.onConfirmSearch.emit(false);
              this.onSelect.emit(data.data[0]);
            }
          } else {
            this.columns = [];
            this.totalItems = 0;
            this.loading = false;
            this.modalLoaded = true;
            this.changeDetectorRef.detectChanges();
            if (!this.modal.isShown) {
              this.modal.show();
            }
          }
        },
        error: err => {
          console.log(err);
          this.columns = [];
          this.totalItems = 0;
          this.loading = false;
          this.changeDetectorRef.detectChanges();
          if (!this.modal.isShown) {
            this.modal.show();
          }
        },
      });
    }
  }

  buildFilters() {
    console.log('building...');
    const params = new FilterParams();
    if (this.fieldsToSearch.length > 0 && this.formData != null) {
      console.log('fieldsToSearch');
      this.fieldsToSearch.forEach(f => {
        if (f.nestedObjField) {
          if (
            this.formData[f.field] !== null &&
            this.formData[f.field] !== undefined
          ) {
            console.log(this.formData[f.field]);
            let obj;
            const { field, operator } = f;
            const nestedObj = this.formData[field] as any;
            if (
              nestedObj[f.nestedObjField] !== null &&
              nestedObj[f.nestedObjField] !== undefined
            ) {
              const type = typeof nestedObj[f.nestedObjField];
              if (['string', 'number', 'boolean'].includes(type)) {
                if (f.operator) {
                  obj = {
                    field,
                    value: nestedObj[f.nestedObjField],
                    operator,
                  };
                } else {
                  obj = { field, value: nestedObj[f.nestedObjField] };
                }
                this.filters.push(obj);
              }
            }
          }
        } else {
          let obj;
          if (
            this.formData[f.field] !== null &&
            this.formData[f.field] !== undefined
          ) {
            const { field, operator } = f;
            const type = typeof field;
            if (['string', 'number', 'boolean'].includes(type)) {
              if (f.operator) {
                obj = {
                  field,
                  value: this.formData[field],
                  operator,
                };
              } else {
                obj = { field, value: this.formData[field] };
              }
              this.filters.push(obj);
            }
          }
        }
      });
      console.log(this.filters);
      this.filters.forEach(f => {
        const { field, value, operator } = f;
        if (operator) {
          params.addFilter(field, value, operator);
        } else {
          params.addFilter(field, value);
        }
      });
      this.filterParams.next(params);
      this.getData();
    } else if (this.formData != null) {
      console.log('No fieldsToSearch');
      const keys = Object.keys(this.formData);
      keys.forEach(k => {
        if (this.formData[k] !== null && this.formData[k] !== undefined) {
          this.filters.push({ field: k, value: this.formData[k] });
        }
      });
      this.filters.forEach(f => {
        const { field, value, operator } = f;
        if (operator) {
          params.addFilter(field, value, operator);
        } else {
          params.addFilter(field, value);
        }
      });
      this.filterParams.next(params);
      this.getData();
    }
  }

  openModalSearch() {
    this.modal.show();
  }

  close() {
    this.onSearchStart.emit(false);
    this.onConfirmSearch.emit(false);
    this.modal.hide();
  }

  selectRow(row: IUserRowSelectEvent<any>) {
    console.log(row);
    this.selectedRow = row.data;
    this.rowSelected = true;
    if (this.selectOnClick) {
      this.onSearchStart.emit(false);
      this.onConfirmSearch.emit(false);
      this.onSelect.emit(this.selectedRow);
      this.modal.hide();
    }
  }

  confirm() {
    if (!this.rowSelected) return;
    this.onSearchStart.emit(false);
    this.onConfirmSearch.emit(false);
    this.onSelect.emit(this.selectedRow);
    this.modal.hide();
  }
}
