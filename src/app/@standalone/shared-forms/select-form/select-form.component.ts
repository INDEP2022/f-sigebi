import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { SweetAlertIcon } from 'sweetalert2';
import { FormLoaderComponent } from '../../form-loader/form-loader.component';

@Component({
  selector: 'app-select-form',
  standalone: true,
  imports: [CommonModule, SharedModule, FormLoaderComponent],
  templateUrl: './select-form.component.html',
  styles: [
    `
      #select-form {
        ngx-select {
          ::ng-deep {
            ng-select {
              height: auto;
              min-height: 43px;
            }
          }
        }
        form-loader {
          ::ng-deep {
            .loader {
              height: 30px;
              &:after {
                background-size: 100px 30px;
              }
            }
            .loader-msg {
              margin-top: 3rem;
            }
          }
        }
      }
    `,
  ],
})
export class SelectFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() formField: string;
  @Input() label: string;
  @Input() value: string = 'id';
  @Input() bindLabel: string = 'description';
  @Input() getListObservable: Observable<{ data: any[]; count?: number }>;
  @Input() list: any[];
  @Input() typeToSearchText: string = 'Escriba 3 o mas caracteres';
  @Input() multiple: boolean = false;
  @Input() searchable: boolean = true;
  @Input() paramFilter = 'search';
  @Input() operator = SearchFilter.EQ;
  @Input() haveTodos = true;
  @Input() readonly: boolean = false;
  @Input() clearable: boolean = true;
  @Input() labelTemplate: TemplateRef<any>;
  @Input() optionTemplate: TemplateRef<any>;
  fetchByListParams = true;
  @Input()
  get paramsFilter(): FilterParams {
    return this._paramsFilter;
  }
  set paramsFilter(value: FilterParams) {
    this._paramsFilter = value;
    this.fetchByListParams = false;
    // console.log(value);
    this.getData();
  }
  @Output() paramsFilterChange = new EventEmitter<FilterParams>();
  @Input()
  get params(): ListParams {
    return this._params;
  }
  set params(value: ListParams) {
    this._params = value;
    this.fetchByListParams = true;
    // console.log(value);
    this.getData();
  }
  @Output() paramsChange = new EventEmitter<ListParams>();
  @Output() loadingData = new EventEmitter<boolean>();
  @Output() selectEvent = new EventEmitter();
  _paramsFilter: FilterParams = new FilterParams();
  _params: ListParams = new ListParams();
  dataList: DefaultSelect = new DefaultSelect();
  dataSearch: DefaultSelect = new DefaultSelect();
  otherData: any[];
  subscription: Subscription;
  loading = false;
  page = 1;
  // lastValue = false;
  // $unSubscribe = new Subject<void>();
  private _toastrService = inject(ToastrService);
  get select() {
    return this.form.get(this.formField);
  }

  constructor() {
    // super();
  }

  ngOnInit(): void {
    // this.getData();
    if (this.select.value) this.getData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private getConcatData(concat: boolean, value: DefaultSelect) {
    return new DefaultSelect(
      this.haveTodos
        ? concat
          ? [
              { [this.value]: null, [this.bindLabel]: 'Todos' },
              ...this.data.data.concat(value.data),
            ]
          : [{ [this.value]: null, [this.bindLabel]: 'Todos' }, value.data]
        : concat
        ? this.data.data.concat(value.data)
        : value.data,
      value.count ? value.count : value.data.length
    );
  }

  get data() {
    const pFilter = this.paramsFilter.getFilterByParam(this.paramFilter);
    return this.list
      ? this.dataList
      : this.fetchByListParams
      ? this.params.text.trim() === ''
        ? this.dataList
        : this.dataSearch
      : pFilter
      ? pFilter
          .replace(`filter.${this.paramFilter}=${this.operator}:`, '')
          .trim().length > 0
        ? this.dataSearch
        : this.dataList
      : this.dataList;
  }

  set data(value: DefaultSelect) {
    if (this.fetchByListParams) {
      if (this.params.text.trim() === '') {
        this.dataList = this.getConcatData(true, value);
      } else {
        this.dataSearch = this.getConcatData(false, value);
      }
    } else {
      const pFilter = this.paramsFilter.getFilterByParam(this.paramFilter);
      if (
        pFilter &&
        pFilter
          .replace(`filter.${this.paramFilter}=${this.operator}:`, '')
          .trim().length > 0
      ) {
        this.dataSearch = this.getConcatData(false, value);
      } else {
        this.dataList = this.getConcatData(true, value);
      }
    }
  }

  setParams(params: ListParams) {
    // console.log(params, this.page);
    this.paramsChange.emit(params);
    // if (!this.lastValue) {
    //   this.page++;
    //   params.page = JSON.parse(JSON.stringify({ page: this.page })).page;
    //   console.log(params, this.page);
    //   this.paramsChange.emit(params);
    // } else {
    //   this.getData();
    // }
  }

  setFilterParams(params: FilterParams) {
    this.paramsFilterChange.emit(params);
    // if (!this.lastValue) {
    //   this.page++;
    //   params.page = JSON.parse(JSON.stringify({ page: this.page })).page;
    //   console.log(params, this.page);
    //   this.paramsFilterChange.emit(params);
    // }
  }

  private getDataOfList() {
    if (this.params.text.trim().toLowerCase() === '') {
      this.dataList = new DefaultSelect(
        this.haveTodos
          ? [{ [this.value]: 'null', [this.bindLabel]: 'Todos' }, ...this.list]
          : this.list
      );
    } else {
      this.dataList = new DefaultSelect(
        this.list.filter(item => {
          return item[this.bindLabel]
            ? (item[this.bindLabel] + '')
                .trim()
                .toLowerCase()
                .includes(this.params.text.trim().toLowerCase())
            : true;
        }),
        this.list.length
      );
    }
  }

  private getDataObservable() {
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }

    const oldTypeSearchText = this.typeToSearchText;
    this.typeToSearchText = 'Cargando por favor espere';
    this.loading = true;
    this.subscription = this.getListObservable.subscribe({
      next: data => {
        // console.log(data, this.form);
        // debugger;
        // this.loadingData.emit(false);
        if (data.data && data.data.length > 0) {
          this.typeToSearchText = oldTypeSearchText;
          this.otherData = data.data;
          this.data = new DefaultSelect(
            data.data,
            data.count ? data.count : data.data.length
          );

          // this.data = new DefaultSelect(
          //   this.haveTodos
          //     ? [
          //       { [this.value]: null, [this.bindLabel]: 'Todos' },
          //       ...this.data.data.concat(data.data),
          //     ]
          //     : this.data.data.concat(data.data),
          //   data.count ? data.count : data.data.length
          // );
        }
        this.loading = false;
      },
      error: err => {
        let error = '';
        console.log(err);
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.error.message;
        }
        this.loading = false;
        // this.data = new DefaultSelect();
        this.onLoadToast('error', 'Error', error);
      },
    });
  }

  onLoadToast(icon: SweetAlertIcon, title: string, text: string) {
    const throwToast = {
      success: (title: string, text: string) =>
        this._toastrService.success(text, title),
      info: (title: string, text: string) =>
        this._toastrService.info(text, title),
      warning: (title: string, text: string) =>
        this._toastrService.warning(text, title),
      error: (title: string, text: string) =>
        this._toastrService.error(text, title),
      question: (title: string, text: string) =>
        this._toastrService.info(text, title),
    };
    return throwToast[icon](title, text);
  }

  getData() {
    // console.log(this.data);
    if (this.list && this.list.length > 0) {
      this.getDataOfList();
    } else {
      this.getDataObservable();
    }
  }

  clear() {
    this.getData();
    // this.page = 1;
    // this.setFilterParams(new FilterParams());
    // this.getData();
    // this.clearing = true;
    // setTimeout(() => {
    //   this.clearing = false;
    // }, 1000);
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
    // console.log(this._params);
    // this.getDataObservable();
    // this.paramsChange.emit({ limit: 10, page: 1 });
  }

  onChange(event: any) {
    // console.log(event);
    // if (event.length == 0) {
    //   return;
    // }
    if (this.otherData) {
      this.selectEvent.emit(event);
    }
    this.form.updateValueAndValidity();
  }
}
