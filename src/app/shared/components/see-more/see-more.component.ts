import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-see-more',
  template: `
    <p>
      {{ visibleText }}
      <span *ngIf="hiddenText.length > 0 && !readingMore">...</span>
      <span
        *ngIf="hiddenText.length > 0"
        (click)="changeText()"
        class="see-more btn-link ml-0">
        {{ readingMore ? 'Ver menos' : 'Ver más' }}
      </span>
    </p>
  `,
  styles: [
    `
      .see-more {
        cursor: pointer;
      }
    `,
  ],
})
export class SeeMoreComponent implements OnInit, ViewCell {
  @Input() value: string | number;
  @Input() rowData: any;
  fullText: string = '';
  visibleText: string = '';
  hiddenText: string = '';
  textButton: string = 'Ver m\u00E1s';
  maxLenght: number = 90;
  readingMore: boolean = false;
  constructor() {}

  ngOnInit(): void {
    this.fullText = String(this.value);
    this.cutText();
  }

  cutText() {
    if (this.fullText.length > this.maxLenght) {
      this.visibleText = this.fullText.substring(0, this.maxLenght);
      this.hiddenText = this.fullText.substring(this.maxLenght);
    } else {
      this.visibleText = this.fullText;
    }
  }

  changeText() {
    this.readingMore = !this.readingMore;
    if (this.readingMore) {
      this.visibleText += this.hiddenText;
    } else {
      this.cutText();
    }
  }
}
