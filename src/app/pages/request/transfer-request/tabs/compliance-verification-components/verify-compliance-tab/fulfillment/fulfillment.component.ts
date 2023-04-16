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

  constructor() {}

  ngOnInit(): void {
    this.inputText = this.value.toString().substring(0, 100).concat('...');
  }

  seemore() {
    this.hidde = !this.hidde;
  }
}
