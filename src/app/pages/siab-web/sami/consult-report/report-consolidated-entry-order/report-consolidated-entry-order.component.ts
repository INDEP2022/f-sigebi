import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { ORDER_SERVICE_COLUMNS } from './report-consolidated-entry-order-columns';

@Component({
  selector: 'app-report-consolidated-entry-order',
  templateUrl: './report-consolidated-entry-order.component.html',
  styles: [],
})
export class ReportConsolidatedEntryOrderComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsSampGood = new BehaviorSubject<ListParams>(new ListParams());
  paramsServices = new BehaviorSubject<ListParams>(new ListParams());
  paramsOrderAs = new BehaviorSubject<ListParams>(new ListParams());
  infoOrderService = new LocalDataSource();
  infoSamplingGoods = new LocalDataSource();
  infoOrderServices = new LocalDataSource();
  infoOrderAs = new LocalDataSource();
  totalItems: number = 0;
  totalItemsSampGood: number = 0;
  totalItemsService: number = 0;
  totalItemsOrderAs: number = 0;
  loadingServices: boolean = false;
  loadingSampGood: boolean = false;
  loadingOrderAs: boolean = false;
  form: FormGroup = new FormGroup({});
  settingsSampGood = {
    ...this.settings,
    actions: false,
    columns: {
      ...ORDER_SERVICE_COLUMNS,
    },
  };

  settingsServices = {
    ...this.settings,
    actions: false,
    columns: {
      ...ORDER_SERVICE_COLUMNS,
    },
  };

  settingsOrderAs = {
    ...this.settings,
    actions: false,
    columns: {
      ...ORDER_SERVICE_COLUMNS,
    },
  };

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        ...ORDER_SERVICE_COLUMNS,
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      dateOrdenPayment: [null],
      AreaSolicitante: [null],
      DireccionAreaSol: [null],
      Benificiario: [null],
      typeOperation: [null],
      description: [null],
      typeAdjudicación: [null],
      condicionesPago: [null],
      nomElabora: [null],
      InsEspeciales: [null],
      numContrato: [null],
      totServicios: [null],
    });
  }
}
