import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-column-see',
  template: `
    <button class="btn btn-primary btn-sm active mr-3" (click)="onClick1()">
      <i class="fas fa-eye" aria-hidden="true"></i>
    </button>
  `,
  //styleUrls: ['./button-column-see.component.css']
})
export class ButtonColumnSeeComponent {
  @Input() label: string;
  @Input() disabled: boolean;
  @Input() rowData: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
  //constructor() { }

  /*ngOnInit() {
  }*/
  onClick1() {
    this.onClick.emit(this.rowData);
  }
}
