import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-button-select',
  template: `
    <button
      (click)="onClick()"
      type="button"
      data-toggle="tooltip"
      title="Seleccionar Notificación"
      class="btn btn-primary active btn-sm m-1">
      <i class="fas fa-edit bx-sm float-icon"></i>
    </button>
    <button
      (click)="onClickViewGood()"
      data-toggle="tooltip"
      title="Ver Bienes"
      class="btn btn-primary btn-sm active m-1">
      <i class="fa fa-eye" aria-hidden="true"></i>
    </button>
  `,
})
export class ButtonSelectComponent {
  @Input() rowData: any; // Datos de la fila actual
  @Output() someClick = new EventEmitter<any>();
  @Output() viewGood = new EventEmitter<any>();

  onClick() {
    this.someClick.emit(this.rowData);
  }

  onClickViewGood() {
    this.viewGood.emit(this.rowData);
  }
}
