import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() params: BehaviorSubject<ListParams>;
  @Input() totalItems: number = 0;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  pageSize: FormControl = new FormControl(10);
  constructor() { }

  ngOnInit(): void {

  }
  pageChanged(event: PageChangedEvent) {
    const params = this.params.getValue();
    this.emitEvent({ ...params, inicio: event.page });
  }

  get getRangeLabel(): string {
    if (this.totalItems == 0 || this.params.getValue().pageSize == 0) {
      return `0 of ${this.totalItems}`;
    }
    this.totalItems = Math.max(this.totalItems, 0);
    const startIndex = (this.params.getValue().inicio - 1) * this.params.getValue().pageSize;
    const endIndex =
      startIndex < this.totalItems
        ? Math.min(startIndex + this.params.getValue().pageSize, this.totalItems)
        : startIndex + this.params.getValue().pageSize;
    return `${startIndex + 1} - ${endIndex} de ${this.totalItems}`;
  }

  emitEvent(params: ListParams) {
    this.params.next(params)
  }

  pageSizeChange() {
    const params = this.params.getValue();
    this.emitEvent({ ...params, pageSize: Number(this.pageSize.value) });
  }
}
