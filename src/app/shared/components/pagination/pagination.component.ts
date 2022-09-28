import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() paginatorConf: any;
  @Input() totalItems: number;
  @Input() currentPage: number;
  @Input() itemsPerPage: number;
  @Input() maxSize?: number;
  @Output() changePage: EventEmitter<{ page: number, itemsPerPage: number }>;
  private rotate = true;
  public startPage: number;
  public endPage: number;
  public pages: number[];
  constructor() {
    this.pages = [];
    this.currentPage = 1;
    this.changePage = new EventEmitter();
  }
  ngAfterViewInit(): void {
    this.generatePages();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems']) {
      this.generatePages();
    }
    if (changes['currentPage']) {
      this.generatePages();
    }
  }

  ngOnInit(): void {

  }
  private generatePages() {
    this.pages = [];
    this.currentPage = this.currentPage == 0 ? 1 : this.currentPage;
    let total = Math.ceil(this.totalItems / this.itemsPerPage)
    for (let i = 0; i < total; i++) {
      this.pages.push(i + 1);
    }
    if (this.maxSize == undefined || this.maxSize == 0) {
      this.maxSize = total;
    }
    this.setMaxSize(this.currentPage, total);
  }
  public prevPage() {
    this.currentPage -= 1;
    this.selectPage(this.currentPage);
  }
  public nextPage() {
    this.currentPage += 1;
    this.selectPage(this.currentPage);
  }
  public selectPage(page: number) {
    this.changePage.emit({ page: page, itemsPerPage: this.itemsPerPage });
  }
  private setMaxSize(currentPage: number, totalPages: number) {
    this.startPage = 1;
    this.endPage = totalPages;
    let isMaxSized = this.maxSize < totalPages;
    if (isMaxSized) {
      if (this.rotate) {
        // Current page is displayed in the middle of the visible ones
        this.startPage = Math.max(currentPage - Math.floor(this.maxSize / 2), 1);
        this.endPage = this.startPage + this.maxSize - 1;
        // Adjust if limit is exceeded
        if (this.endPage > totalPages) {
          this.endPage = totalPages;
          this.startPage = this.endPage - this.maxSize + 1;
        }
      }
      else {
        // Visible pages are paginated with maxSize
        this.startPage =
          (Math.ceil(currentPage / this.maxSize) - 1) * this.maxSize + 1;
        // Adjust last page if limit is exceeded
        this.endPage = Math.min(this.startPage + this.maxSize - 1, totalPages);
      }
    }
  };
}
