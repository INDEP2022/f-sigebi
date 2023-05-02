import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox-element',
  template: `
    <div class="row justify-content-center">
      <input [checked]="checked" (change)="onToggle($event)" type="checkbox" />
    </div>
  `,
  styles: [],
})
export class CheckboxElementComponent<T = any> implements OnInit {
  checked: boolean;

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
