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
        #box
        [checked]="checked"
        (change)="onToggle($event)"
        type="checkbox" />
    </div>
  `,
  styles: [],
})
export class CheckboxElementComponent<T = any> implements OnInit {
  checked: boolean;
  @ViewChild('box', { static: true }) box: ElementRef<HTMLInputElement>;
  @Input() value: boolean;
  @Input() rowData: T;

  @Output() toggle: EventEmitter<{ row: T; toggle: boolean }> =
    new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.checked = this.value;
  }

  onToggle($event: Event) {
    let row = this.rowData;
    let toggle = ($event.currentTarget as HTMLInputElement).checked;
    this.toggle.emit({ row, toggle });
  }
}
