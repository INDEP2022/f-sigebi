import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'event-lots-list',
  templateUrl: './event-lots-list.component.html',
  styles: [],
})
export class EventLotsListComponent extends BasePage implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
