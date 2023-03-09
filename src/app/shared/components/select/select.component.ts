import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { SELECT_SIZE } from 'src/app/common/constants/select-size';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from './default-select';

type Attr = { [key: string]: string };

@Component({
  selector: 'ngx-select',
  templateUrl: './select.component.html',
  styles: [],
})
export class SelectComponent<T> implements OnInit, AfterViewInit {
  @Input() form: FormGroup;
  @Input() control: string = '';
  @Input() value: string = '';
  @Input() bindLabel: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() data = new DefaultSelect<T>();
  @Input() multiple: boolean = false;
  @Input() loading: boolean = false;
  @Input() closeOnSelect: boolean = true;
  @Input() maxSelectedItems: number;
  @Input() searchable: boolean = true;
  @Input() searchOnInit: boolean = false;
  @Input() paramFilter = 'search';
  @Output() fetchItems = new EventEmitter<ListParams>();
  @Output() fetchByParamsItems = new EventEmitter<FilterParams>();
  @Input() operator = SearchFilter.EQ;
  @Output() change = new EventEmitter<any>();
  @Input() readonly: boolean = false;
  @Input() clearable = true;
  @Input() termMaxLength: string = null;
  @Input() showTooltip: boolean = false;
  @Input() labelTemplate: TemplateRef<any>;
  @Input() optionTemplate: TemplateRef<any>;
  @ViewChild(NgSelectComponent) ngSelect: NgSelectComponent;

  buffer: any[] = [];
  input$ = new Subject<string>();
  page: number = 1;
  totalItems: number = 0;
  inputAttrs: Attr = {
    maxLength: '',
  };
  private concat: boolean = false;
  private readonly selectSize: number = SELECT_SIZE;
  constructor() {}

  ngOnInit() {
    if (this.searchOnInit) {
      const params = new ListParams();
      this.fetchItems.emit(params);
    }
    this.onSearch();
    this.checkMaxAttribute();
  }

  ngAfterViewInit() {
    if (this.labelTemplate) {
      this.ngSelect.labelTemplate = this.labelTemplate;
    }

    if (this.optionTemplate) {
      this.ngSelect.optionTemplate = this.optionTemplate;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']?.currentValue.length === 0) {
      this.buffer = [];
    } else if (changes['data'] && this.concat) {
      this.buffer = [...this.buffer, ...this.data.data];
    } else {
      this.buffer = this.data.data;
      this.totalItems = this.data.count;
    }
    this.loading = false;
  }

  private emitListParams(text: string) {
    const params = {
      page: this.page,
      text: text ?? '',
      limit: this.selectSize,
    };
    this.fetchItems.emit(params);
  }
  private filterParams(text: string) {
    let filterParam = new FilterParams();
    filterParam.page = this.page;
    filterParam.limit = this.selectSize;
    if (this.paramFilter === 'search') {
      filterParam.search = text ?? '';
    } else {
      filterParam.addFilter(this.paramFilter, text ?? '', this.operator);
    }
    this.fetchByParamsItems.emit(filterParam);
  }

  fetchMore(text: string) {
    if (!this.loading && this.buffer.length < this.totalItems) {
      this.page++;
      this.loading = true;
      this.concat = true;
      this.emitListParams(text);
      this.filterParams(text);
    }
  }

  onSearch() {
    this.input$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((text: string) => {
          if (text === null) {
            return of([]);
          }
          this.page = 1;
          this.buffer = [];
          this.loading = true;
          this.concat = false;
          this.emitListParams(text);
          this.filterParams(text);
          return of([]);
        })
      )
      .subscribe();
  }
  onChange(event: any) {
    this.change.emit(event);
  }

  getLabel(item: any) {
    const key = this.bindLabel;
    return item[key] ?? '';
  }

  isRequired() {
    return this.form.get(this.control).hasValidator(Validators.required);
  }

  checkMaxAttribute() {
    if (this.termMaxLength != null) {
      this.inputAttrs['maxLength'] = this.termMaxLength;
    }
  }
}
