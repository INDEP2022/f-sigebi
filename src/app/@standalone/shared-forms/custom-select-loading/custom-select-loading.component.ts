import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
  takeUntil,
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
  @Input() form: FormGroup;
  @Input() formControlName: string = '';
  @Input() path: string;
  @Input() label: string;
  @Input() loadingText: string = 'Cargando...';
  @Input() typeToSearchText: string = 'Escriba 3 o mas caracteres';
  @Input() multiple: boolean = false;
  @Input() addTag: boolean = false;
  @Input() isLoadInOnInit: boolean = true;
  @Input() url: string = environment.API_URL;
  @Input() pathData: string = 'data';
  @Input() value: string = 'id';
  @Input() bindLabel: string = '';
  @Input() paramSearch: string = 'text';
  @Input() placeholder: string = '';
  @Input() prefixSearch: string = '';
  @Input() paramPageName: string = 'page';
  @Input() paramLimitName: string = 'limit';
  @Input() limit: number = 10;
  @Input() initOption: any = null;
  @Input() delay: number = 300;
  @Input() moreParams: string[] = [];
  @Input() labelTemplate: TemplateRef<any>;
  @Input() optionTemplate: TemplateRef<any>;
  @Input() termMaxLength: string = null;
  @Input() readonly: boolean = false;
  @Output() valueChange = new EventEmitter<any>();
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
    console.log(event);

    this.onChange?.(event[this.value] || null);
    if (!event) {
      this.valueChange.emit(null);
      return;
    }
    const data = this.items.find(
      item => item[this.value] === event[this.value]
    );
    this.valueChange.emit(data);
    this.form.updateValueAndValidity();
  }

  getItemsObservable(text: string = '') {
    const params: any = {
      [this.paramPageName]: this.page,
      [this.paramLimitName]: this.limit || 10,
    };
    if (text) {
      if (this.prefixSearch) {
        text = `${this.prefixSearch}:${text}`;
      }
      params[this.paramSearch] = text;
    }
    const mParams =
      this.moreParams.length > 0 ? '?' + this.moreParams.join('&') : '';
    return this.http
      .get(`${this.url}${this.path}` + mParams, {
        params,
      })
      .pipe(
        takeUntil(this.destroy$),
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
    console.log(data);
    return result;
  }

  fetchMore(text: any) {
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
          }
        },
        error: err => {
          this.isLoading = false;
          this.items = [];
        },
      });
  }
}
