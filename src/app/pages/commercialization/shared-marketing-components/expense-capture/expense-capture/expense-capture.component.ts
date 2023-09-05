import { Component } from '@angular/core';

import { BasePage } from 'src/app/core/shared/base-page';

import { ActivatedRoute } from '@angular/router';
import { ExpenseCaptureDataService } from '../services/expense-capture-data.service';

@Component({
  selector: 'app-expense-capture',
  templateUrl: './expense-capture.component.html',
  styles: [],
})
export class ExpenseCaptureComponent extends BasePage {
  address: string;
  constructor(
    private activateRoute: ActivatedRoute,
    private dataService: ExpenseCaptureDataService
  ) {
    super();
    this.activateRoute.params.subscribe({
      next: param => {
        if (param['id']) {
          this.address = param['id'];
          this.dataService.address = param['id'];
        }
      },
    });
  }

  get form() {
    return this.dataService.form;
  }

  get conceptNumber() {
    return this.form ? this.form.get('conceptNumber').value : null;
  }
}
