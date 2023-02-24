import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ViewCell } from 'ng2-smart-table';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-input-cell',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './input-cell.component.html',
  styles: [],
})
export class InputCellComponent<T = any> implements OnInit, ViewCell {
  @Input() value: string | number;
  @Input() rowData: T;
  @Input() inputType: 'text' | 'number';
  @Output() inputChange = new EventEmitter<{
    row: T;
    value: string | number;
  }>();
  readonly control = new FormControl<string | number>(null);

  constructor() {}

  ngOnInit(): void {
    if (this.value) {
      this.control.setValue(this.value);
    }
  }

  onInputChange() {
    this.inputChange.emit({ row: this.rowData, value: this.control.value });
  }
}
