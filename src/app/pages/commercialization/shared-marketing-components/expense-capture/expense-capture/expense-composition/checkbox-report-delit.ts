import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IComerDetExpense2 } from 'src/app/core/models/ms-spent/comer-detexpense';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';

@Component({
  selector: 'app-checkbox-element',
  template: `
    <div class="row justify-content-center">
      <input
        [disabled]="disabled"
        #box
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
export class CheckboxReportDelitComponent implements OnInit {
  checked: boolean;
  disabled: boolean;
  @ViewChild('box', { static: true }) box: ElementRef<HTMLInputElement>;
  @Input() value: boolean;
  @Input() rowData: IComerDetExpense2;

  @Output() toggle: EventEmitter<{ row: IComerDetExpense2; toggle: boolean }> =
    new EventEmitter();

  constructor(private expenseCaptureDataService: ExpenseCaptureDataService) {}

  ngOnInit(): void {
    // debugger;
    this.checked = this.value;
    const row = this.rowData;
    if (this.expenseCaptureDataService.V_VALCON_ROBO > 0) {
      if (row.vehiculoCount === '0') {
        const firsValidation =
          !row.reportDelit && row.clasifGoodNumber + '' !== '1606';
        const secondValidation =
          row.reportDelit && row.clasifGoodNumber + '' === '1606';
        if (firsValidation || secondValidation) {
          this.disabled = true;
        }
      }
    }
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
