import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-select-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './select-form.component.html',
  styles: [],
})
export class SelectFormComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() formField: string;
  @Input() label: string;
  @Input() value: string = 'id';
  @Input() bindLabel: string = 'description';
  @Input() getListObservable: Observable<{ data: any[]; count?: number }>;
  @Input() list: any[];
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
  @Output() selectEvent = new EventEmitter();
  _paramsFilter: FilterParams;
  _params: ListParams = new ListParams();
  data: DefaultSelect = new DefaultSelect();
  otherData: any[];
  get select() {
    return this.form.get(this.formField);
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
    // this.getData();
    if (this.select.value) this.getData();
  }

  setParams(params: ListParams) {
    // console.log(params);

    this.paramsChange.emit(params);
  }

  setFilterParams(params: FilterParams) {
    console.log(params);
    this.paramsFilterChange.emit(params);
  }

  private getDataOfList() {
    if (this.params.text.trim().toLowerCase() === '') {
      this.data = new DefaultSelect(
        this.haveTodos
          ? [{ [this.value]: null, [this.bindLabel]: 'Todos' }, ...this.list]
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
    this.getListObservable.subscribe({
      next: data => {
        console.log(data);
        this.otherData = data.data;
        this.data = new DefaultSelect(
          this.haveTodos
            ? [{ [this.value]: null, [this.bindLabel]: 'Todos' }, ...data.data]
            : data.data,
          data.count ? data.count : data.data.length
        );
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
    });
  }

  getData() {
    if (this.list && this.list.length > 0) {
      this.getDataOfList();
    } else {
      this.getDataObservable();
    }
  }

  onChange(event: any) {
    if (this.otherData) {
      this.selectEvent.emit(event);
      // console.log(event);
    }
    this.form.updateValueAndValidity();
  }
}
