import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent extends BasePage implements OnInit {
  @Input() params: BehaviorSubject<ListParams> = new BehaviorSubject(
    new ListParams()
  );
  @Input() filterParams: BehaviorSubject<FilterParams> = new BehaviorSubject(
    new FilterParams()
  );
  @Input() totalItems: number = 0;
  @Input() maxSize: number = 5;
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];
  @Input() limit: FormControl = new FormControl(10);
  @Input() paginatorPageSize: boolean = true;
  @Input() paginatorRangeLabel: boolean = true;
  constructor() {
    super();
  }
  ngOnInit(): void {
    /*  this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      this.limit.setValue(params.limit || params.page);
    });

    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      this.limit.setValue(params.limit || params.page);
    }); */
  }
  pageChanged(event: PageChangedEvent) {
    const params = this.params.getValue();
    this.emitEvent({ ...params, page: event.page });
  }

  get getRangeLabel(): string {
    if (this.totalItems == 0 || this.params.getValue().limit == 0) {
      return `0 de ${this.totalItems}`;
    }
    this.totalItems = Math.max(this.totalItems, 0);
    const startIndex =
      (this.params.getValue().page - 1) * this.params.getValue().limit;
    const endIndex =
      startIndex < this.totalItems
        ? Math.min(startIndex + this.params.getValue().limit, this.totalItems)
        : startIndex + this.params.getValue().limit;
    return this.params.getValue().limit > 1
      ? `${this.thousenFormat(startIndex + 1)} - ${this.thousenFormat(
          endIndex
        )} de ${this.thousenFormat(this.totalItems)}`
      : `${this.thousenFormat(startIndex + 1)} de ${this.thousenFormat(
          this.totalItems
        )}`;
  }

  thousenFormat(n: number) {
    if (!n) return n;
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  emitEvent(params: ListParams) {
    const filterParams = this.filterParams.getValue();
    filterParams.page = params.page;
    filterParams.limit = params.limit;
    this.filterParams.next(filterParams);
    this.params.next(params);
  }

  limitChange() {
    const params = this.params.getValue();
    this.emitEvent({ ...params, limit: Number(this.limit.value) });
  }

  pageSizeChange() {
    // debugger;
    const params = this.params.getValue();
    if (
      +(this.limit.value + '') > params.limit &&
      +(this.limit.value + '') * (params.page - 1) > this.totalItems
    ) {
      params.page = 1;
    }
    this.emitEvent({ ...params, limit: Number(this.limit.value) });
  }
}
