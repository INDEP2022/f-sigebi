import { Component, EventEmitter, Input, Output } from '@angular/core';

interface CheckboxElementData {
  numberGood: any;
}
@Component({
  selector: 'app-checkbox-element',
  template: `
    <div class="row justify-content-center">
      <input
        [disabled]="disabled"
        [(ngModel)]="checked"
        type="checkbox"
        (change)="onToggle($event)" />
    </div>
  `,
  styles: [],
})
export class CheckboxElementRecordAccountStatementsComponent {
  checked: boolean;
  disabled: boolean;

  @Input() rowData: CheckboxElementData;
  @Output() toggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.checked = this.rowData.numberGood !== null;
    this.disabled = true;
  }

  onToggle(event: any) {
    const checked = event.target.checked;
    if (this.rowData.numberGood !== null) {
      this.checked = checked;
      this.toggle.emit(this.checked);
    }
  }
}
