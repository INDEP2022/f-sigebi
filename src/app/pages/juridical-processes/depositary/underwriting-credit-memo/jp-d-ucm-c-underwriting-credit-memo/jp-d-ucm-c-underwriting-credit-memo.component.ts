import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-jp-d-ucm-c-underwriting-credit-memo',
  templateUrl: './jp-d-ucm-c-underwriting-credit-memo.component.html',
  styles: [],
})
export class JpDUcmCUnderwritingCreditMemoComponent
  extends BasePage
  implements OnInit
{
  data: any[];

  form: FormGroup;

  get numberGood() {
    return this.form.get('numberGood');
  }
  get description() {
    return this.form.get('description');
  }
  get amount() {
    return this.form.get('amount');
  }
  get periods() {
    return this.form.get('periods');
  }
  get periods1() {
    return this.form.get('periods1');
  }
  get periods2() {
    return this.form.get('periods2');
  }
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      numberGood: [null, [Validators.required]],
      description: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      periods: [null, [Validators.required]],
      periods1: [null, [Validators.required]],
      periods2: [null, [Validators.required]],
    });
  }
}
