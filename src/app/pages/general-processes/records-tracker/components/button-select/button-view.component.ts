import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-button-select',
  template: `
    <button
      (click)="onClick()"
      data-toggle="tooltip"
      [title]="'Ver Atributos del Bien ' + rowData.id"
      class="btn btn-primary btn-sm active m-1">
      <i class="fa fa-eye" aria-hidden="true"></i>
    </button>
  `,
})
export class ButtonViewComponent {
  @Input() rowData: any; // Datos de la fila actual
  @Output() someClick = new EventEmitter<any>();

  onClick() {
    this.someClick.emit(this.rowData);
  }
}
