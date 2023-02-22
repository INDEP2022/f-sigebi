import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from '../../../common/repository/interfaces/search-bar-filters';

@Component({
  selector: 'search-bar',
  template: `
    <div class="form-group form-secondary d-flex">
      <label class="search-label">{{ label }}</label>
      <div class="text-search ">
        <input
          type="text"
          class="form-control"
          [formControl]="search"
          [placeholder]="placeholder" />
        <span class="form-bar"></span>
      </div>
    </div>
  `,
  styles: [],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() params: BehaviorSubject<ListParams>;
  @Input() filterParams: BehaviorSubject<FilterParams>;
  @Input() placeholder?: string = 'Buscar...';
  @Input() label?: string = 'Buscar:';
  @Input() filterField?: SearchBarFilter | null = null;
  ngUnsubscribe = new Subject<void>();
  search: FormControl = new FormControl();

  constructor() {}

  ngOnInit(): void {
    this.search.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        takeUntil(this.ngUnsubscribe),
        switchMap((term: string) => {
          this.emitEvent(term);
          return of(term);
        })
      )
      .subscribe();
  }

  emitEvent(text: string) {
    if (this.filterField === null) {
      const params = this.params.getValue();
      params.page = 1;
      this.params.next({ ...params, text });
    } else {
      const filterParams = this.filterParams.getValue();
      filterParams.removeAllFilters();
      filterParams.page = 1;
      if (text != '') {
        filterParams.addFilter(
          this.filterField.field,
          text,
          this.filterField.operator
        );
      }
      this.filterParams.next(filterParams);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
