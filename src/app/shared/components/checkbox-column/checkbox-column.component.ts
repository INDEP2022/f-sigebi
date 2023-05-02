import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox-column',
  templateUrl: './checkbox-column.component.html',
  styles: [],
})
export class CheckboxColumnComponent implements OnInit {
  @Output() checkEvent = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  changeCheck(event: any) {
    console.log(event);

    this.checkEvent.emit(event);
  }
}
