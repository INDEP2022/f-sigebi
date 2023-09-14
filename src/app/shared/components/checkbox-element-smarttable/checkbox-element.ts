import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-checkbox-element',
  template: `
    <div class="row justify-content-center">
      <input
        [disabled]="disabled"
        #box
        id="checkbox-input"
        class="common-check custom-checkbox"
        [checked]="checked"
        (change)="onToggle($event)"
        type="checkbox" />
    </div>
  `,
  styles: [
    `
      .custom-checkbox input[type='checkbox'] {
        background-color: blue; /* Cambia el color de fondo del checkbox */
        border-color: red; /* Cambia el color del borde del checkbox */
      }

      .custom-checkbox input[type='checkbox']:checked {
        background-color: green; /* Cambia el color de fondo del checkbox cuando está seleccionado */
        border-color: yellow; /* Cambia el color del borde del checkbox cuando está seleccionado */
      }
    `,
  ],
})
export class CheckboxElementComponent<T = any> implements OnInit {
  checked: boolean;
  disabled: boolean;
  @ViewChild('box', { static: true }) box: ElementRef<HTMLInputElement>;
  @Input() value: boolean;
  @Input() rowData: T;

  @Output() toggle: EventEmitter<{ row: T; toggle: boolean }> =
    new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    //debugger;
    this.checked = this.value;
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
