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

@Component({
  selector: 'app-checkbox-element',
  template: `
    <div class="row justify-content-center">
      <input
        [disabled]="disabled"
        #box
        class="common-check form-control custom-checkbox"
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
export class CheckboxElementComponent<T = any> implements OnInit, OnChanges {
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
