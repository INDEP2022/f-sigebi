import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-registration-inventories-donation',
  templateUrl: './registration-inventories-donation.component.html',
  styles: [],
})
export class RegistrationInventoriesDonationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  formTable: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any = EXAMPLE_DATA;

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
      idRequest: [null, [Validators.required]],
      idDonee: [null, [Validators.required]],
      doneeDescrip: [null, [Validators.required]],
      justification: [null, [Validators.required]],
      representative: [null, [Validators.required]],
      position: [null, [Validators.required]],
      state: [null, [Validators.required]],
      municipality: [null, [Validators.required]],
      direction: [null, [Validators.required]],
      requestDate: [null, [Validators.required]],
      status: [null, [Validators.required]],
      cveAuth: [null, [Validators.required]],
      authDate: [null, [Validators.required]],
    });

    this.formTable = this.fb.group({
      totalGoods: [null, [Validators.required]],
    });
  }

  onSubmit() {}

  settingsChange(event: any) {
    this.settings = event;
  }
}

const EXAMPLE_DATA = [
  {
    goodNum: 1,
    description: '....',
    select: true,
    quantity: 2,
    proceedings: 3322,
    unit: 'Kg',
    sssubType: 'aaa',
    delAdmin: 'aaa',
    warehouse: 'warehouse',
  },
];
