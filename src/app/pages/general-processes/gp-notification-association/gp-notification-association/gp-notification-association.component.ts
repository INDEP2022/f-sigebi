import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NOTIFICATION_ASSOCIATION_COLUMNS,
  NOTIFICATION_ASSOCIATION_EXAMPLE_DATA,
} from './notification-association-columns';

@Component({
  selector: 'app-gp-notification-association',
  templateUrl: './gp-notification-association.component.html',
  styles: [],
})
export class GpNotificationAssociationComponent
  extends BasePage
  implements OnInit
{
  data = NOTIFICATION_ASSOCIATION_EXAMPLE_DATA;
  constructor() {
    super();
    this.settings.columns = NOTIFICATION_ASSOCIATION_COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {}
}
