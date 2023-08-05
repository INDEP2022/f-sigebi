import { Component } from '@angular/core';

import { BasePage } from 'src/app/core/shared/base-page';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expense-capture',
  templateUrl: './expense-capture.component.html',
  styles: [],
})
export class ExpenseCaptureComponent extends BasePage {
  address: string;
  constructor(private activateRoute: ActivatedRoute) {
    super();
    this.activateRoute.params.subscribe({
      next: param => {
        if (param['id']) {
          this.address = param['id'];
        }
      },
    });
  }
}
