import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-associate-file-button',
  templateUrl: './associate-file-button.component.html',
  styles: [],
})
export class AssociateFileButtonComponent implements ViewCell, OnInit {
  @Input() value: string | number;
  @Input() rowData: any;

  @Output() action: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onClick() {
    this.action.emit(this.rowData);
  }
}
