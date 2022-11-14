import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-ver-imagen-input',
  templateUrl: './ver-imagen-input.component.html',
  styleUrls: ['./ver-imagen-input.component.scss'],
})
export class VerImagenInputComponent implements ViewCell, OnInit {
  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() clicked: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.renderValue = this.value.toString().toUpperCase();
  }

  handleAntion(): void {
    this.clicked.emit(this.rowData);
  }
}
