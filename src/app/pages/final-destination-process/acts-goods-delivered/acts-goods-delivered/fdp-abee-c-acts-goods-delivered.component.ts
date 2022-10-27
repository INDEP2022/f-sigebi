import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-fdp-abee-c-acts-goods-delivered',
  templateUrl: './fdp-abee-c-acts-goods-delivered.component.html',
  styles: [],
})
export class FdpAbeeCActsGoodsDeliveredComponent
  extends BasePage
  implements OnInit
{
  response: boolean = false;
  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any = [];

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
      statusAct: [null, Validators.required],
      keyAct: [null, [Validators.required]],
      proceedings: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      captureDate: [null, [Validators.required]],
      closingDate: [null, [Validators.required]],
      universalFolio: [null, Validators.required],
    });
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  onSubmit() {}
}
