import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-deposit-account-statement-parameter',
  templateUrl: './deposit-account-statement-parameter.component.html',
  styleUrls: ['./deposit-account-statement-parameter.component.scss'],
})
export class DepositAccountStatementParameterComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  title: string = 'Parámetros';
  rateDesc: string;
  daysDesc: string;
  spentDesc: string;
  rateInitailValue: number;
  daysInitailValue: number;
  spentInitailValue: number;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private goodParametersService: GoodParametersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getParameters();
  }

  getParameters() {
    this.goodParametersService.getById('TASAPROYEC').subscribe({
      next: resp => {
        this.rateInitailValue = Number(resp.initialValue);
        this.rateDesc = resp.description;
      },
    });
    this.goodParametersService.getById('DIASCALINT').subscribe({
      next: resp => {
        this.daysInitailValue = Number(resp.initialValue);
        this.daysDesc = resp.description;
      },
    });
    this.goodParametersService.getById('GASTOSADMV').subscribe({
      next: resp => {
        this.spentInitailValue = +(Number(resp.initialValue) / 100).toFixed(2);
        this.spentDesc = resp.description;
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
