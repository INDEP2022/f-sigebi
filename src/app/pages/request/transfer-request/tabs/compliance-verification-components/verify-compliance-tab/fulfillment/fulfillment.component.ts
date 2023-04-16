import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fulfillment',
  templateUrl: './fulfillment.component.html',
  styles: [],
})
export class FulfillmentComponent implements OnInit {
  enderValue: string;
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() input: EventEmitter<any> = new EventEmitter();
  isreadOnly: boolean = false;

  inputText: String = '';
  hidde: boolean = false;
  isLong: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.value.toString().length > 150) {
      this.isLong = true;
      this.inputText = this.value.toString().substring(0, 150).concat('...');
    } else {
      this.isLong = false;
      this.inputText = this.value.toString();
    }
  }

  seemore() {
    this.hidde = !this.hidde;
  }
}
