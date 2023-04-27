import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ContentChild,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
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

@Component({
  standalone: true,
  imports: [FormsModule, NgSelectModule, CommonModule],
  selector: 'ng-custom-select',
  templateUrl: './custom-select.component.html',
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
})
export class CustomSelectComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;
  @Input() path: string;
  @Input() label: string;
  @Input() isLoadInOnInit: boolean = false;
  @Input() url: string = environment.API_URL;
  @Input() pathData: string = 'data';
  @Input() value: string = 'id';
  @Input() paramSearch: string = 'text';
  @Input() placeholder: string = '';
  @Input() prefixSearch: string = '';
  @Input() paramPageName: string = 'page';
  @Input() paramLimitName: string = 'limit';
  @Input() limit: number = 10;
  @Input() initOption: any = null;
  @Input() delay: number = 300;
  @Input() moreParams: { [key: string]: any } = {};
  @Output() valueChange = new EventEmitter<any>();
  input$ = new Subject<string>();
  items: any[] = [];
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
    if (this.initOption) {
      this.items.push(this.initOption);
    }
    if (this.isLoadInOnInit) {
      this.input$.next('');
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
    this.onChange?.(event || null);
    if (!event) {
      this.valueChange.emit(null);
      return;
    }
    const data = this.items.find(item => item[this.value] === event);
    this.valueChange.emit(data);
  }

  getItemsObservable(text: string = '') {
    if (this.prefixSearch) {
      text = `${this.prefixSearch}:${text}`;
    }
    const params = {
      [this.paramPageName]: this.page,
      [this.paramLimitName]: this.limit || 10,
      [this.paramSearch]: text,
      ...this.moreParams,
    };
    return this.http
      .get(`${this.url}${this.path}`, {
        params,
      })
      .pipe(catchError(() => of(this.items)));
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
