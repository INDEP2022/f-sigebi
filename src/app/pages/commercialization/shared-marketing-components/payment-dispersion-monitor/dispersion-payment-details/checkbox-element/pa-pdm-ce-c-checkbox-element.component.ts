import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-pa-pdm-ce-c-checkbox-element',
  template: `
    <div class="row justify-content-center">
      <input [checked]="checked" (checkedChange)="onToggle($event)" type="checkbox" >
    </div>
  `,
  styles: [
  ]
})

export class PaPdmCeCCheckboxElementComponent implements OnInit {
  checked: boolean;

  @Input() value: boolean;
  @Input() rowData: any;

  @Output() toggle: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.checked = this.value;
  }

  onToggle($event:any) {
    console.log($event)
    let row= this.rowData;
    let toggle=$event;
    this.toggle.emit({row,toggle});
  }
}
