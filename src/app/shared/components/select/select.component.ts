import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  @Input() maxSelectedItems: number = 0;
  @Input() searchable: boolean = true;
  @Input() searchOnInit: boolean = false;
  @Output() fetchItems = new EventEmitter<ListParams>();
  @Output() change = new EventEmitter<any>();
  @Input() readonly: boolean = false;
  buffer: any[] = [];
  input$ = new Subject<string>();
  page: number = 1;
  totalItems: number = 0;
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
          this.page = 1;
          this.buffer = [];
          this.loading = true;
          this.concat = false;
<<<<<<< HEAD
          const params = { page: this.page, text, limit: this.selectSize };
=======
          const params = {
            page: this.page,
            text: text ?? '',
            limit: this.selectSize,
          };
>>>>>>> b16c24a8af7292780266f115de3a6c28b583c041
          this.fetchItems.emit(params);
          return of([]);
        })
      )
      .subscribe();
  }
  onChange(event: any) {
    this.change.emit(event);
  }
}
