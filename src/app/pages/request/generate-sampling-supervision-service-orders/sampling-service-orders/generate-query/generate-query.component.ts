import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';
import { LIST_ORDERS_COLUMNS } from './columns/list-orders-columns';

var data = [
  {
    noServiceOrder: '1275',
    foilServiceOrder: 'METROPOLITANA-SAT-1275-08',
    typeServiceOrder: 'Validación de requerimientos',
    regionalDelegation: 'METROPOLITANA',
    transfer: 'SAT-COMERCIO-EXTERIOR',
    noContract: '124',
    noRequest: '1428',
  },
];

@Component({
  selector: 'app-generate-query',
  templateUrl: './generate-query.component.html',
  styleUrls: ['./generate-query.component.scss'],
})
export class GenerateQueryComponent extends BasePage implements OnInit {
  title: string = 'Genera Consulta';
  orderServiceForm: ModelForm<any>;
  geographicalAreaSelected = new DefaultSelect();
  contractNumberSelected = new DefaultSelect();
  selectedRows: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  totalItems: number = 0;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: LIST_ORDERS_COLUMNS,
    };
    this.initForm();
    this.getData();
  }

  getData() {
    this.paragraphs = data;
  }

  initForm() {
    this.orderServiceForm = this.fb.group({
      geographicalArea: [null],
      samplingPeriod: [null],
      contractNumber: [null],
    });
  }

  addOrders(): void {}

  rowsSelected(event: any) {
    this.selectedRows = event.selected;
    console.log(event);
  }

  getContractNumberSelect(event: any) {}

  getgeographicalAreaSelect(event: any) {}

  turnSampling() {}

  save() {}
}
