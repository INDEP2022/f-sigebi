import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-household',
  templateUrl: './household.component.html',
  styles: [],
})
export class HouseholdComponent extends BasePage implements OnInit {
  list: any[] = [];
  constructor() {
    super();
    this.settings.columns = {
      noGood: {
        title: 'No Bien',
        type: 'number',
        sort: false,
      },
      description: {
        title: 'Descripcion',
        type: 'string',
        sort: false,
      },
    };
  }

  ngOnInit(): void {}
}
