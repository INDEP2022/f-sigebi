import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-v-good-tracker',
  templateUrl: './v-good-tracker.component.html',
  styles: [],
})
export class VGoodTrackerComponent extends BasePage implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
