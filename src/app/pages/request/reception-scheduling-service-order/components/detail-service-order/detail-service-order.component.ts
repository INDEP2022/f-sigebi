import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-service-order',
  templateUrl: './detail-service-order.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class DetailServiceOrderComponent implements OnInit {
  showDatais: boolean = true;
  constructor() {}

  ngOnInit(): void {}
}
