import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-depository-fees',
  templateUrl: './depository-fees.component.html',
  styles: [],
})
export class DepositoryFeesComponent extends BasePage implements OnInit {
  data: any[];

  form: FormGroup;

  get appointment() {
    return this.form.get('appointment');
  }
  get idPayment() {
    return this.form.get('idPayment');
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
      appointment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      idPayment: [null, [Validators.required]],
    });
  }
}
