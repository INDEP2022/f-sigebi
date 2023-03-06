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
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  catchError,
  debounceTime,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, CommonModule],
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
  @Input() isLoadInOnInit: boolean = true;
  @Input() url: string = environment.API_URL;
  @Input() pathData: string = 'data';
  @Input() value: string;
  @Input() paramSearch: string = 'text';
  @Input() placeholder: string = 'Search';
  @Input() prefixSearch: string = '';
  @Output() valueChange = new EventEmitter<any>();
  input$ = new Subject<string>();
  // input$ = new FormControl('');
  items: any[] = [];
  page: number = 1;
  isLoading: boolean = false;
  selectedItem: any;
  destroy$: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.onSearch();
    // if (this.isLoadInOnInit) {
    //   this.input$.next('');
    // }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onChange?: (item: any) => void;

  writeValue(obj: any): void {
    console.log(obj);
    this.selectedItem = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  onCurrencyChange(event: any) {
    console.log(event);
    this.selectedItem = event?.[this.value];

    this.onChange?.(event);
    this.valueChange.emit(event);
  }

  getItemsObservable(text: string = '') {
    if (this.prefixSearch) {
      text = `${this.prefixSearch}:${text}`;
    }
    const params = {
      page: this.page,
      limit: 10,
      [this.paramSearch]: text,
    };
    return this.http.get(`${this.url}/${this.path}`, {
      params,
    });
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
    console.log(text);
    this.page++;
    this.isLoading = true;
    this.getItemsObservable(text).subscribe({
      next: resp => {
        this.isLoading = false;
        this.items = this.getDataForPath(resp);
      },
      error: err => {
        this.isLoading = false;
        console.log(err);
      },
    });
  }

  onSearch() {
    this.input$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        // distinctUntilChanged(),
        switchMap((text: string) => {
          console.log(text);
          this.page = 1;
          this.isLoading = true;
          // return of(['fer']);
          return this.getItemsObservable(text);
        }),
        map((resp: any) => {
          return this.getDataForPath(resp);
        }),
        catchError(() => of([]))
      )
      .subscribe({
        next: resp => {
          this.isLoading = false;
          console.log(resp);
          this.items = resp;
        },
        error: err => {
          this.isLoading = false;
          this.items = [];
        },
      });
  }
}
