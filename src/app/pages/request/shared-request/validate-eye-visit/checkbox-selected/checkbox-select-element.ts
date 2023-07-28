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
  selector: 'app-checkbox-select-element',
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
export class CheckboxSelectElementComponent<T = any>
  extends BasePage
  implements OnInit, OnChanges
{
  checked: boolean;
  disabled: boolean;
  @ViewChild('box', { static: true }) box: ElementRef<HTMLInputElement>;
  @Input() value: boolean;
  @Input() rowData: T;

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
    this.toggle.emit({ row, toggle });

    /* debugger
    if(this.count >= 1 && toggle == true){
      this.box.nativeElement.checked = false;
      toggle = false;
      this.count = this.count - 1;
      this.toggle.emit({ row, toggle });
    } else {
      this.count = this.count + 1;
      this.toggle.emit({ row, toggle });
    }*/
  }
}
