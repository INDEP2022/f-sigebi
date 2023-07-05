//CheckboxElementRecordAccountStatementsComponent

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

interface CheckboxElementData {
  numberGood: any; // Reemplaza 'any' con el tipo correcto de numberGood
  // Otras propiedades necesarias para el componente
}

@Component({
  selector: 'app-checkbox-element',
  template: `
    <div class="row justify-content-center">
      <input
        [disabled]="disabled"
        #box
        [checked]="checked"
        (change)="onToggle($event)"
        type="checkbox" />
    </div>
  `,
  styles: [],
})
export class CheckboxElementRecordAccountStatementsComponent<
  T extends CheckboxElementData = any
> implements OnInit, OnChanges
{
  checked: boolean;
  disabled: boolean;
  @ViewChild('box', { static: true }) box: ElementRef<HTMLInputElement>;
  @Input() value: boolean;
  @Input() rowData: T;

  @Output() toggle: EventEmitter<{ row: T; toggle: boolean }> =
    new EventEmitter();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    this.checked = this.value;
    console.log(this.checked);
    console.log(this.rowData.numberGood); // Verifica el valor de numberGood
    this.disabled = this.rowData.numberGood === null; // Asigna el valor de "disabled" basado en "numberGood"
    console.log(this.disabled); // Verifica el valor de disabled
  }

  onToggle($event: Event) {
    let row: any = this.rowData;
    let toggle = ($event.currentTarget as HTMLInputElement).checked;
    this.toggle.emit({ row, toggle });
  }

  setValue(value: boolean) {
    this.checked = value;
  }
}
