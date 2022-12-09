import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ACT_DELIVERY_RECEPTION_COLUMNS } from './act-delivery-reception-columns';

@Component({
  selector: 'app-act-delivery-reception',
  templateUrl: './act-delivery-reception.component.html',
  styles: [],
})
export class ActDeliveryReceptionComponent extends BasePage implements OnInit {
  actDeliveryReceptionForm: FormGroup;

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: ACT_DELIVERY_RECEPTION_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.actDeliveryReceptionForm = this.fb.group({
      recordsSearchCriteria: [null, Validators.required],
    });
  }
}
