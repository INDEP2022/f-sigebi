import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-parameter-maintenance',
  templateUrl: './parameter-maintenance.component.html',
  styles: [],
})
export class ParameterMaintenanceComponent extends BasePage implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}

  formEmiter(form: FormGroup) {
    console.log(form);
  }

  saved() {
    this.onLoadToast('success', 'Guardado Exitosamente', '');
  }
}
