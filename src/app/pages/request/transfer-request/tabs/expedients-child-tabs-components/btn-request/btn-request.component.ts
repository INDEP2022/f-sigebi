import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-btn-request',
  templateUrl: './btn-request.component.html',
  styleUrls: ['./btn-request.component.scss'],
})
export class BtnRequestComponent implements ViewCell, OnInit {
  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() btnclick1: EventEmitter<any> = new EventEmitter();
  @Output() btnclick2: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  /* ngOnChanges(changes: SimpleChanges): void {
    this.onClick();
  } */

  onSeeDetail() {
    this.btnclick1.emit(this.rowData);
  }

  onSeeDoc() {
    this.btnclick2.emit(this.rowData);
  }
}
