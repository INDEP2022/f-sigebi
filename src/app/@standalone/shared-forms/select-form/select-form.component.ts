import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
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

@Component({
  selector: 'app-select-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
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
  @Input()
  get paramsFilter(): FilterParams {
    return this._paramsFilter;
  }
  set paramsFilter(value: FilterParams) {
    this._paramsFilter = value;
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
    // console.log(value);
    this.getData();
  }
  @Output() paramsChange = new EventEmitter<ListParams>();
  @Output() loadingData = new EventEmitter<boolean>();
  @Output() selectEvent = new EventEmitter();
  _paramsFilter: FilterParams;
  _params: ListParams = new ListParams();
  data: DefaultSelect = new DefaultSelect();
  otherData: any[];
  subscription: Subscription;
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

  setParams(params: ListParams) {
    console.log(params);
    // this._params = params;
    // this.getData();
    this.paramsChange.emit(params);
  }

  setFilterParams(params: FilterParams) {
    console.log(params);
    // this._paramsFilter = params;
    // this.getData();
    this.paramsFilterChange.emit(params);
  }

  private getDataOfList() {
    if (this.params.text.trim().toLowerCase() === '') {
      this.data = new DefaultSelect(
        this.haveTodos
          ? [{ [this.value]: 'null', [this.bindLabel]: 'Todos' }, ...this.list]
          : this.list
      );
    } else {
      this.data = new DefaultSelect(
        this.list.filter(item => {
          return item[this.bindLabel]
            ? (item[this.bindLabel] + '')
                .trim()
                .toLowerCase()
                .includes(this.params.text.trim().toLowerCase())
            : true;
        })
      );
    }
  }

  private getDataObservable() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    console.log('Get Data');

    // this.loadingData.emit(true);
    const oldTypeSearchText = this.typeToSearchText;
    this.typeToSearchText = 'Cargando por favor espere';
    this.subscription = this.getListObservable.subscribe({
      next: data => {
        console.log(data);
        // debugger;
        // this.loadingData.emit(false);
        if (data.data && data.data.length > 0) {
          this.typeToSearchText = oldTypeSearchText;
          this.otherData = data.data;
          this.data = new DefaultSelect(
            this.haveTodos
              ? [
                  { [this.value]: null, [this.bindLabel]: 'Todos' },
                  ...data.data,
                ]
              : data.data,
            data.count ? data.count : data.data.length
          );
        }
      },
      error: err => {
        let error = '';
        console.log(err);
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.error.message;
        }
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
    console.log(this.data);
    if (this.list && this.list.length > 0) {
      this.getDataOfList();
    } else {
      this.getDataObservable();
    }
  }

  clear() {
    this.setFilterParams(new FilterParams());
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
    console.log(event);
    if (event.length == 0) {
      return;
    }
    if (this.otherData) {
      this.selectEvent.emit(event);
      // console.log(event);
    }
    this.form.updateValueAndValidity();
  }
}
