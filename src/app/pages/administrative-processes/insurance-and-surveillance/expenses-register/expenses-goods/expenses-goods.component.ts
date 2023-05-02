import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  CRITERIA_COLUMNS,
  EXPENSES_GOODS_COLUMNS,
  EXPENSES_GOODS_COLUMNS2,
} from './expenses-goods-columns';

@Component({
  selector: 'app-expenses-goods',
  templateUrl: './expenses-goods.component.html',
  styles: [],
})
export class ExpensesGoodsComponent extends BasePage implements OnInit {
  form: FormGroup;
  data: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  settings2 = { ...this.settings, actions: false };
  data2: any[] = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;

  settings3 = { ...this.settings, actions: false };
  data3: any[] = [];
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems3: number = 0;

  searchGood = false;

  delegations = new DefaultSelect();
  warehouses = new DefaultSelect();
  safes = new DefaultSelect();
  types = new DefaultSelect();
  subtypes = new DefaultSelect();
  ssubtypes = new DefaultSelect();
  sssubtypes = new DefaultSelect();

  costCenters = new DefaultSelect();
  gastoConcepts = new DefaultSelect();

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: EXPENSES_GOODS_COLUMNS,
    };
    this.settings2.columns = EXPENSES_GOODS_COLUMNS2;
    this.settings3.columns = CRITERIA_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      warehouse: [null, Validators.required],
      boveda: [null, Validators.required],
      file: [null, Validators.required],
      tipoBien: [null, Validators.required],
      subtipoBien: [null, Validators.required],
      ssubtipoBien: [null, Validators.required],
      sssubtipoBien: [null, Validators.required],

      costCenter: [null, Validators.required],
      conceptGasto: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
      typeGasto: [null, Validators.required],
      status: [null, Validators.required],
    });
  }

  searchGoods() {
    this.searchGood = true;
  }

  getDelegations(evt: any): void {}

  getWarehouses(evt: any): void {}

  getSafes(evt: any): void {}

  getTypes(evt: any): void {}

  getSubtypes(evt: any): void {}

  getSsubtypes(evt: any): void {}

  getSssubtypes(evt: any): void {}
  getCostCenters(evt: any): void {}
  getGastoConcepts(evt: any): void {}
}
