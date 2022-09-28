import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styles: [
    ``
  ],
})
export class PaginatorComponent implements OnInit {
  totalItems: number = 150;
  pageSize: number = 10;
  page: number = 1;
  pageSizeOptions: number[] = [10, 25, 50, 100]
  constructor() {}

  ngOnInit(): void {}

  pageChanged(event: PageChangedEvent) {
    console.log(event);
    this.page = event.page;
  }

  getRangeLabel() {
    if (this.totalItems == 0 || this.pageSize == 0) {
      return `0 of ${this.totalItems}`;
    }
    this.totalItems = Math.max(this.totalItems, 0);
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex =
      startIndex < this.totalItems
        ? Math.min(startIndex + this.pageSize, this.totalItems)
        : startIndex + this.pageSize;
    return `${startIndex + 1} - ${endIndex} de ${this.totalItems}`;
  }
}
