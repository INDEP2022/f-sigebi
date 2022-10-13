import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-c-b-up-c-unreconciled-payment',
  templateUrl: './c-b-up-c-unreconciled-payment.component.html',
  styles: [
  ]
})
export class CBUpCUnreconciledPaymentComponent extends BasePage implements OnInit {

  settings = {
    ...TABLE_SETTINGS,
    actions: false
  };
  form: FormGroup = new FormGroup({});
  data:any[]=[];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
  }


  settingsChange($event:any): void {
    this.settings=$event;
  }

}
