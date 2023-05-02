import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
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
  constructor() {}

  ngOnInit(): void {}
  pageChanged(event: PageChangedEvent) {
    const params = this.params.getValue();
    this.emitEvent({ ...params, page: event.page });
  }

  get getRangeLabel(): string {
    if (this.totalItems == 0 || this.params.getValue().limit == 0) {
      return `0 of ${this.totalItems}`;
    }
    this.totalItems = Math.max(this.totalItems, 0);
    const startIndex =
      (this.params.getValue().page - 1) * this.params.getValue().limit;
    const endIndex =
      startIndex < this.totalItems
        ? Math.min(startIndex + this.params.getValue().limit, this.totalItems)
        : startIndex + this.params.getValue().limit;
    return `${startIndex + 1} - ${endIndex} de ${this.totalItems}`;
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
    const params = this.params.getValue();
    this.emitEvent({ ...params, limit: Number(this.limit.value) });
  }
}
