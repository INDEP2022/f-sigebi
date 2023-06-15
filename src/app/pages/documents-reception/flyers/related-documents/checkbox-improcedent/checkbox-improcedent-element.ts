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
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-checkbox-improcedent-element',
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
export class CheckboxImprocedentElementComponent<T = any>
  extends BasePage
  implements OnInit, OnChanges
{
  checked: boolean;
  disabled: boolean;
  @ViewChild('box', { static: true }) box: ElementRef<HTMLInputElement>;
  @Input() value: boolean;
  @Input() rowData: T | any;

  @Output() toggle: EventEmitter<{ row: T; toggle: boolean }> =
    new EventEmitter();

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    this.checked = this.value;
  }

  onToggle($event: Event) {
    let row: any = this.rowData;
    let toggle = ($event.currentTarget as HTMLInputElement).checked;
    if (row.seleccion == true && toggle == true) {
      this.box.nativeElement.checked = false;
      toggle = false;
      this.toggle.emit({ row, toggle });
      this.onLoadToast('info', 'No se puede seleccionar dos casillas a la vez');
    } else {
      this.toggle.emit({ row, toggle });
    }
  }
}
