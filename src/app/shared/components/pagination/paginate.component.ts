import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'paginate',
  template: `
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li
          class="page-item"
          [ngClass]="currentPage == 1 ? 'disabled' : ''"
          [ngStyle]="{ cursor: currentPage == 1 ? '' : 'pointer' }">
          <a class="page-link" aria-label="Previous" (click)="startingPage()">
            <i class="bx bx-chevrons-left"></i>
          </a>
        </li>
        <li
          class="page-item"
          [ngClass]="currentPage == 1 ? 'disabled' : ''"
          [ngStyle]="{ cursor: currentPage == 1 ? '' : 'pointer' }">
          <a class="page-link" aria-label="Previous" (click)="prevPage()">
            <i class="bx bx-chevron-left"></i>
          </a>
        </li>
        <ng-container *ngFor="let page of pages | slice: startPage - 1:endPage">
          <li
            class="page-item"
            [ngClass]="page == currentPage ? 'active' : ''"
            [ngStyle]="{ cursor: page == currentPage ? '' : 'pointer' }"
            [attr.aria-current]="page"
            *ngIf="page >= startPage && page <= endPage">
            <span
              class="page-link"
              (click)="page == currentPage ? '' : selectPage(page)"
              >{{ page }}</span
            >
          </li>
        </ng-container>
        <li
          class="page-item"
          [ngClass]="currentPage >= pages.length ? 'disabled' : ''"
          [ngStyle]="{ cursor: currentPage == pages.length ? '' : 'pointer' }">
          <a class="page-link" aria-label="Next" (click)="nextPage()">
            <i class="bx bx-chevron-right"></i>
          </a>
        </li>
        <li
          class="page-item"
          [ngClass]="currentPage >= pages.length ? 'disabled' : ''"
          [ngStyle]="{ cursor: currentPage == pages.length ? '' : 'pointer' }">
          <a class="page-link" aria-label="Next" (click)="endingPage()">
            <i class="bx bx-chevrons-right"></i>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styleUrls: ['./paginate.component.scss'],
})
export class PaginateComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() totalItems: number;
  @Input() currentPage: number;
  @Input() itemsPerPage: number;
  @Input() maxSize?: number;
  @Output() changePage: EventEmitter<{ page: number; itemsPerPage: number }>;
  private rotate = true;
  startPage: number;
  endPage: number;
  pages: number[];
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
    if (changes['itemsPerPage']) {
      this.generatePages();
    }
  }

  ngOnInit(): void {}
  private generatePages() {
    this.pages = [];
    this.currentPage = this.currentPage == 0 ? 1 : this.currentPage;
    let total = Math.ceil(this.totalItems / this.itemsPerPage);
    for (let i = 0; i < total; i++) {
      this.pages.push(i + 1);
    }
    if (this.maxSize == undefined || this.maxSize == 0) {
      this.maxSize = total;
    }
    this.setMaxSize(this.currentPage, total);
  }
  startingPage() {
    this.currentPage = 1;
    this.selectPage(this.currentPage);
  }
  prevPage() {
    this.currentPage -= 1;
    this.selectPage(this.currentPage);
  }
  nextPage() {
    this.currentPage += 1;
    this.selectPage(this.currentPage);
  }
  endingPage() {
    this.currentPage = this.pages.length;
    this.selectPage(this.currentPage);
  }
  selectPage(page: number) {
    this.changePage.emit({ page: page, itemsPerPage: this.itemsPerPage });
  }
  private setMaxSize(currentPage: number, totalPages: number) {
    this.startPage = 1;
    this.endPage = totalPages;
    let isMaxSized = this.maxSize < totalPages;
    if (isMaxSized) {
      if (this.rotate) {
        // Current page is displayed in the middle of the visible ones
        this.startPage = Math.max(
          currentPage - Math.floor(this.maxSize / 2),
          1
        );
        this.endPage = this.startPage + this.maxSize - 1;
        // Adjust if limit is exceeded
        if (this.endPage > totalPages) {
          this.endPage = totalPages;
          this.startPage = this.endPage - this.maxSize + 1;
        }
      } else {
        // Visible pages are paginated with maxSize
        this.startPage =
          (Math.ceil(currentPage / this.maxSize) - 1) * this.maxSize + 1;
        // Adjust last page if limit is exceeded
        this.endPage = Math.min(this.startPage + this.maxSize - 1, totalPages);
      }
    }
  }
}
