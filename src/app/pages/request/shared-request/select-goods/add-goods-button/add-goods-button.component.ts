import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-add-goods-button',
  templateUrl: './add-goods-button.component.html',
  styles: [],
})
export class AddGoodsButtonComponent implements ViewCell, OnInit {
  @Input() value: string | number;
  @Input() rowData: any;

  @Output() action: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onClick() {
    this.action.emit(this.rowData);
  }
}
