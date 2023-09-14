import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <!-- <button class="btn btn-primary btn-sm active mr-3" (click)="onClick1()">
      <i class="fa fa-file-pdf" aria-hidden="true"></i>
    </button> -->
    <i
      class="fa fa-eye"
      aria-hidden="true"
      (click)="onClick1()"
      style="color: #9D2449;"></i>
  `,
})
export class ButtonColumnComponent {
  @Input() label: string;
  @Input() disabled: boolean;
  @Input() rowData: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  onClick1() {
    this.onClick.emit(this.rowData);
  }
}
