import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';

type Attr = { [key: string]: string };
@Component({
  selector: 'ng-custom-select-loading',
  templateUrl: './custom-select-loading.component.html',
  styleUrls: ['./custom-select-loading.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectWidthLoading),
      multi: true,
    },
  ],
})
export class CustomSelectWidthLoading
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @ViewChild(NgSelectComponent) ngSelect: NgSelectComponent;
  @Input() searchable = true;
  @Input() form: FormGroup;
  @Input() formControlName: string = '';
  @Input() path: string;
  @Input() label: string;
  @Input() loadingText: string = 'Cargando...';
  @Input() typeToSearchText: string = 'Escriba 3 o mas caracteres';
  @Input() multiple: boolean = false;
  @Input() addTag: boolean = false;
  @Input() isLoadInOnInit: boolean = true;
  @Input() load = false;
  @Input() url: string = environment.API_URL;
  @Input() pathData: string = 'data';
  @Input() value: string = 'id';
  @Input() bindLabel: string = '';
  @Input() paramSearch: string = 'search';
  @Input() placeholder: string = '';
  @Input() prefixSearch: string = '';
  @Input() paramPageName: string = 'page';
  @Input() paramLimitName: string = 'limit';
  @Input() limit: number = 10;
  @Input() initOption: any = null;
  @Input() delay: number = 500;
  @Input() moreParams: string[] = [];
  @Input() labelTemplate: TemplateRef<any>;
  @Input() optionTemplate: TemplateRef<any>;
  @Input() termMaxLength: string = null;
  @Input() readonly: boolean = false;
  @Input() updateValues: boolean = false;
  @Input() externalSearch: string;
  @Output()
  valueChange = new EventEmitter<any>();
  @Output() getObject = new EventEmitter<any>();
  input$ = new Subject<string>();
  items: any[] = [];
  totalItems: number = 0;
  inputAttrs: Attr = {
    maxLength: '',
  };
  title: string = '';
  page: number = 1;
  isLoading: boolean = false;
  selectedItem: any;
  destroy$: Subject<any> = new Subject<any>();
  isDisabled = false;
  onChange?: (item: any) => void;
  onTouchedCb?: () => void;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.onSearch();
    this.checkMaxAttribute();
    if (this.initOption) {
      this.items.push(this.initOption);
    }
    if (this.isLoadInOnInit) {
      this.input$.next('');
    }
    if (this.form) {
      this.form.get(this.formControlName).valueChanges.subscribe(x => {
        // console.log(x);
        if (x && this.updateValues) {
          this.input$.next(x);
        }
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['externalSearch'] && changes['externalSearch'].currentValue) {
      // this.input$.next(changes['externalSearch'].currentValue);
      this.loadData(changes['externalSearch'].currentValue, false);
    }
    if (changes['load']) {
      console.log('Entro a recargar');
      this.page = 1;
      this.isLoading = true;
      this.loadData('');
      // this.input$.next('');
    }
  }

  writeValue(obj: any): void {
    this.selectedItem = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onSelectChange(event: any) {
    // console.log(event);
    if (!event) {
      this.input$.next('');
      this.valueChange.emit(null);
      return;
    }
    if (this.multiple) {
      this.onChange?.(event.map((x: any) => x[this.value]) || null);
    } else {
      this.onChange?.(event[this.value] || null);
    }
    const data = this.items.find(
      item => item[this.value] === event[this.value]
    );
    this.valueChange.emit(data);
    this.form.updateValueAndValidity();
  }

  clear(event: any) {
    console.log(event);
    this.input$.next('');
  }

  getItemsObservable(text: string = '', normalSearch = true) {
    let params: any = {
      [this.paramPageName]: this.page,
      [this.paramLimitName]: this.limit || 10,
    };
    if (text) {
      if (normalSearch) {
        if (this.prefixSearch) {
          text = `${this.prefixSearch}:${text}`;
        }
      } else {
        if (this.prefixSearch) {
          text = `$eq:${text}`;
        }
      }
      params[this.paramSearch] = text;
    }
    if (!normalSearch) {
      params[this.paramPageName] = 1;
    }
    const mParams =
      this.moreParams.length > 0 ? '?' + this.moreParams.join('&') : '';
    return this.http
      .get(`${this.url}${this.path}` + mParams, {
        params,
      })
      .pipe(
        takeUntil(this.destroy$),
        tap((x: any) => {
          if (x && x.count) {
            this.totalItems = x.count;
          } else {
            this.totalItems = 0;
          }
        }),
        catchError(() => of(this.items))
      );
  }

  getDataForPath(data: any): any[] {
    let path = this.pathData.split('.');
    if (path.length === 1) {
      return data[path[0]];
    }
    let result = data;
    for (let i = 0; i < path.length; i++) {
      result = result[path[i]];
    }
    // console.log(data);
    return result;
  }

  fetchMore(text: any) {
    // console.log(text);
    if (!this.isLoading && this.items.length < this.totalItems) {
      this.page++;
      this.isLoading = true;
      this.getItemsObservable(text).subscribe({
        next: resp => {
          this.isLoading = false;
          const items = this.getDataForPath(resp);
          this.items = [...this.items, ...items];
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  isRequired() {
    return this.form
      .get(this.formControlName)
      .hasValidator(Validators.required);
  }

  checkMaxAttribute() {
    if (this.termMaxLength != null) {
      this.inputAttrs['maxLength'] = this.termMaxLength;
    }
  }

  private loadData(input: string, normalSearch = true) {
    this.getItemsObservable(input, normalSearch)
      .pipe(
        take(1),
        map((resp: any) => {
          if (!resp) {
            return [];
          }
          return this.getDataForPath(resp);
        })
      )
      .subscribe({
        next: (resp: any[]) => {
          console.log(resp);
          this.isLoading = false;
          if (resp) {
            this.items = resp;

            if (resp.length === 1) {
              this.getObject.emit(resp[0]);
            }
          } else {
            this.isLoading = false;
            this.items = [];
          }
        },
        error: err => {
          this.isLoading = false;
          this.items = [];
        },
      });
  }

  onSearch() {
    this.input$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(this.delay),
        distinctUntilChanged(),
        switchMap((text: string) => {
          // console.log(this.items);
          if (text === null) {
            return of(null);
          }
          this.page = 1;
          this.isLoading = true;
          return this.getItemsObservable(text);
        }),
        map((resp: any) => {
          if (!resp) {
            return [];
          }
          return this.getDataForPath(resp);
        })
      )
      .subscribe({
        next: (resp: any[]) => {
          console.log(resp);
          this.isLoading = false;
          if (resp) {
            this.items = resp;

            if (resp.length === 1) {
              this.getObject.emit(resp[0]);
            }
          } else {
            this.isLoading = false;
            this.items = [];
          }
        },
        error: err => {
          this.isLoading = false;
          this.items = [];
        },
      });
  }
}
