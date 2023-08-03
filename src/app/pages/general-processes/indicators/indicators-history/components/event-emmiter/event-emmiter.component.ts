import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-emmiter',
  templateUrl: './event-emmiter.component.html',
  styles: [],
})
export class EventEmmiterComponent implements OnInit {
  //

  static cumplio: string;

  //
  constructor() {}

  ngOnInit(): void {}

  //

  static test(mensaje: any) {
    return console.log('El mensaje ', this.cumplio);
  }
}
