import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Component({
  selector: 'search-bar',
  template: `
    <div class="form-group d-flex">
      <label class="search-label">Buscar</label>
      <div class="text-search">
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
  @Input() params: BehaviorSubject<ListParams>;
  ngUnsubscribe = new Subject<void>();
  search: FormControl = new FormControl();

  constructor() {}

  ngOnInit(): void {
    this.search.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(400),
        takeUntil(this.ngUnsubscribe),
        switchMap((term: string) => {
          this.emitEvent(term);
          return of(term);
        })
      )
      .subscribe();
  }

  emitEvent(text: string) {
    const params = this.params.getValue();
    this.params.next({...params, text});
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
