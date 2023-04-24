import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-income-orders-depository-goods',
  templateUrl: './income-orders-depository-goods.component.html',
  styles: [],
})
export class IncomeOrdersDepositoryGoodsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;

  get numberGood() {
    return this.form.get('numberGood');
  }
  get contractKey() {
    return this.form.get('contractKey');
  }
  get depositary() {
    return this.form.get('depositary');
  }
  get description() {
    return this.form.get('description');
  }
  get date() {
    return this.form.get('date');
  }
  get user() {
    return this.form.get('user');
  }
  get username() {
    return this.form.get('username');
  }
  get charge() {
    return this.form.get('charge');
  }

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
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
      contractKey: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      depositary: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      date: [null, [Validators.required]],
      user: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      username: [null, [Validators.required]],
      charge: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  print() {}
}
