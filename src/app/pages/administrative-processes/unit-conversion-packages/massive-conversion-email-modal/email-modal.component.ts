import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styles: [],
})
export class EmailModalComponent extends BasePage implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
