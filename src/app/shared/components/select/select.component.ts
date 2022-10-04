import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
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
  @Input() data = new DefaultSelect<T>();
  @Output() fetchItems = new EventEmitter<ListParams>();
  @Output() change = new EventEmitter<any>();
  buffer: any[] = [];
  loading = false;
  input$ = new Subject<string>();
  page: number = 1;
  totalItems: number = 0;
  private concat: boolean = false;
  private readonly selectSize: number = SELECT_SIZE;
  constructor() {}

  ngOnInit() {
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
      const params = { inicio: this.page, text, pageSize: this.selectSize };
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
          const params = { inicio: this.page, text, pageSize: this.selectSize };
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
