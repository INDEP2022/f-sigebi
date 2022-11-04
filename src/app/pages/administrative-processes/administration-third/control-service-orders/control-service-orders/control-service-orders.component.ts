import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { CONTROLSERVICEORDERS_COLUMNS } from './control-service-orders-columns';

@Component({
  selector: 'app-control-service-orders',
  templateUrl: './control-service-orders.component.html',
  styles: [],
})
export class ControlServiceOrdersComponent extends BasePage implements OnInit {
  serviceOrdersForm: ModelForm<any>;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...CONTROLSERVICEORDERS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.serviceOrdersForm = this.fb.group({
      regionalDelegation: [null, Validators.required],
      process: [null, Validators.required],
      dateInitial: [null, Validators.required],
      datefinal: [null, Validators.required],
    });
  }
}
