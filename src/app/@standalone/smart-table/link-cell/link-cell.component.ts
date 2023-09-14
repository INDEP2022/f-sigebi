import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-link-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link-cell.component.html',
  styles: [
    `
      span {
        text-decoration: underline;
      }
    `,
  ],
})
export class LinkCellComponent<T = any> implements OnInit, ViewCell {
  @Input() value: string | number;
  @Input() rowData: T;
  @Output() onNavigate = new EventEmitter<T>();
  link: string;
  validateValue: boolean = true;
  constructor() {}

  ngOnInit(): void {
    // console.log(this.value);
  }

  onLinkClick() {
    if (!this.value && this.validateValue) {
      return;
    }
    this.onNavigate.emit(this.rowData);
  }
}
