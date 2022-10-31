import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-jp-d-iodg-c-income-orders-depository-goods',
  templateUrl: './jp-d-iodg-c-income-orders-depository-goods.component.html',
  styles: [],
})
export class JpDIodgCIncomeOrdersDepositoryGoodsComponent
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
      contractKey: [null, [Validators.required]],
      depositary: [null, [Validators.required]],
      description: [null, [Validators.required]],
      date: [null, [Validators.required]],
      user: [null, [Validators.required]],
      username: [null, [Validators.required]],
      charge: [null, [Validators.required]],
    });
  }

  print() {}
}
