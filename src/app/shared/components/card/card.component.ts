import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styles: [
    `
    .card{
      box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
      border-radius: 7px;
    }
    `
  ]
})
export class CardComponent implements OnInit {
  @Input() header: boolean = false;
  @Input() footer: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
