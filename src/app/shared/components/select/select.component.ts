import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { SELECT_SIZE } from 'src/app/common/constants/select-size';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from './default-select';

@Component({
  selector: 'ngx-select',
  templateUrl: './select.component.html',
  styles: [],
})
export class SelectComponent<T> implements OnInit {
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
  @Output() fetchItems = new EventEmitter<ListParams>();
  @Output() change = new EventEmitter<any>();
  @Input() readonly: boolean = false;
  @Input() initialValue: Object = null;
  buffer: any[] = [];
  input$ = new Subject<string>();
  page: number = 1;
  totalItems: number = 0;
  @ViewChild('select') select: ElementRef;
  private concat: boolean = false;
  private readonly selectSize: number = SELECT_SIZE;
  constructor() {}

  ngOnInit() {
    if (this.searchOnInit) {
      const params = new ListParams();
      this.fetchItems.emit(params);
    }
    this.onSearch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].currentValue.length === 0) {
      this.buffer = [];
    } else if (changes['data'] && this.concat) {
      this.buffer = [...this.buffer, ...this.data.data];
    } else {
      this.buffer = this.data.data;
      this.totalItems = this.data.count;
    }
    this.loading = false;
  }

  fetchMore(text: string) {
    if (!this.loading && this.buffer.length < this.totalItems) {
      this.page++;
      this.loading = true;
      this.concat = true;
      const params = {
        page: this.page,
        text: text ?? '',
        limit: this.selectSize,
      };
      this.fetchItems.emit(params);
    }
  }

  onSearch() {
    this.input$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((text: string) => {
          if (text === null) {
            console.log('texto nulo');
            return of([]);
          }
          this.page = 1;
          this.buffer = [];
          this.loading = true;
          this.concat = false;
          const params = {
            page: this.page,
            text: text ?? '',
            limit: this.selectSize,
          };
          this.fetchItems.emit(params);
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
}
