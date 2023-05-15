import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
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
  takeUntil,
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
export class SelectComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() control: string = '';
  @Input() value: string = '';
  @Input() bindLabel: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() data = new DefaultSelect<T>();
  @Input() multiple: boolean = false;
  @Input() addTag: boolean = false;
  @Input() loading: boolean = false;
  @Input() closeOnSelect: boolean = true;
  @Input() maxSelectedItems: number;
  @Input() searchable: boolean = true;
  @Input() searchOnInit: boolean = false;
  @Input() typeToSearchText: string = 'Escriba 3 o mas caracteres';
  @Input() paramFilter = 'search';
  @Output() fetchItems = new EventEmitter<ListParams>();
  @Output() fetchByParamsItems = new EventEmitter<FilterParams>();
  @Output() clear = new EventEmitter();
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
  title: string = '';
  $unSubscribe = new Subject<void>();
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
    if (this.showTooltip) {
      this.updateTitle();
      this.form
        .get(this.control)
        .valueChanges.pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: data => {
            if (data != null) {
              this.updateTitle();
            }
          },
          error: () => {},
        });
    }
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
    console.log(changes);
    if (changes['data']?.currentValue?.reset == true) {
      this.buffer = [];
      this.page = 1;
    }
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
      search: text ?? '',
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
      if (text && text.length > 0) {
        filterParam.addFilter(this.paramFilter, text, this.operator);
      }
    }
    this.fetchByParamsItems.emit(filterParam);
  }

  fetchMore(text: string) {
    if (!this.loading && this.buffer.length < this.totalItems) {
      console.log('aouto fecht ', this.buffer.length, this.totalItems);

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
        debounceTime(1000),
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
    if (this.showTooltip && event) {
      if (event[this.bindLabel]) {
        this.title = event[this.bindLabel];
      } else if (event[this.value]) {
        this.title = event[this.value];
      }
    }
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

  updateTitle() {
    if (
      typeof this.form.get(this.control).value == 'object' &&
      this.form.get(this.control).value != null
    ) {
      if (this.form.get(this.control).value[this.bindLabel])
        this.title = this.form.get(this.control).value[this.bindLabel];
    } else {
      if (this.form.get(this.control).value != null)
        this.title = this.form.get(this.control).value;
    }
  }

  ngOnDestroy(): void {
    this.$unSubscribe.next();
    this.$unSubscribe.complete();
  }
}
