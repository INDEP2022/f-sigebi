import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'search-bar',
  template: `
    <div class="form-group">
      <label class="col-md-3">Buscar</label>
      <div class="col-md-9">
        <input
          type="text"
          class="form-control"
          [formControl]="search"
          placeholder="Buscar..."
        />
      </div>
    </div>
  `,
  styles: [],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  search: FormControl = new FormControl();
  @Output() onSearch = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    this.search.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(400),
        takeUntil(this.ngUnsubscribe),
        switchMap((term) => {
          this.onSearch.emit(term);
          return of(term);
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
