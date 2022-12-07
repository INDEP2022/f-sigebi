import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { HELP_SCREEN_COLUMNS } from './help-screen-columns';

@Component({
  selector: 'app-help-screen',
  templateUrl: './help-screen.component.html',
  styles: [],
})
export class HelpScreenComponent extends BasePage implements OnInit {
  constructor() {
    super();
    this.settings.actions = false;
    this.settings.columns = HELP_SCREEN_COLUMNS;
  }

  ngOnInit(): void {}
}
