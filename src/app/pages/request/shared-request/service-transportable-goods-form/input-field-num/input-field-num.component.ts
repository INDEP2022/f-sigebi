import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-input-num-field',
  templateUrl: './input-field-num.component.html',
  styles: [],
})
export class InputFieldNumComponent implements ViewCell, OnInit {
  @Input() value: any = null;
  @Input() rowData: any = null;
  @Output() input: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  changeInput(event: any) {
    this.input.emit({ row: this.rowData, text: this.value });
  }

  bloquearCaracteres(e) {
    var tecla = e.which || e.keyCode;
    // Aquí defines los códigos ASCII de los caracteres que deseas bloquear
    var caracteresBloqueados = [35, 36, 37, 38, 39, 40]; // Por ejemplo, bloqueamos los caracteres '#', '$', '%', '&', ''', '(' y ')'

    if (caracteresBloqueados.indexOf(tecla) !== -1) {
      e.preventDefault();
    }
  }
}
