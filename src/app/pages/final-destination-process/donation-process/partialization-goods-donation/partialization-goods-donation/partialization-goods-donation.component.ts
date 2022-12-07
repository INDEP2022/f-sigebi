import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from './../../../../../common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-partialization-goods-donation',
  templateUrl: './partialization-goods-donation.component.html',
  styles: [],
})
export class PartializationGoodsDonationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      goodNumb: [null, [Validators.required]],
      description: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      appraisedValue: [null, [Validators.required]],
      status: [null, [Validators.required]],
      statusDescrip: [null, [Validators.required]],
      proceedings: [null, [Validators.required]],
      sorterNumb: [null, [Validators.required]],
      sorterDescrip: [null, [Validators.required]],
      currency: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      amountToSplit: [null, [Validators.required]],
    });
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  onSubmit() {}
}
