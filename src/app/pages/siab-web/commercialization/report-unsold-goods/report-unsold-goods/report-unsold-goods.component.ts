import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  DELEGATION_COLUMNS_REPORT,
  GOODS_COLUMNS,
  HISTORY_COLUMNS_REPORT,
  HISTORY_EVENT_COLUMNS_REPORT,
  STATUS_COLUMNS_REPORT,
  SUBTYPE_COLUMNS_REPORT,
} from './columns';

@Component({
  selector: 'app-report-unsold-goods',
  templateUrl: './report-unsold-goods.component.html',
  styles: [],
})
export class ReportUnsoldGoodsComponent extends BasePage implements OnInit {
  //

  //Class Variables
  dataSubtypesGood: any;
  dataDelegation: any;
  dataStatusText: any;
  dataGoods: any;

  //Form
  form: FormGroup = new FormGroup({});
  formTwo: FormGroup;

  // Tables
  data: any;
  dataTwo: any;
  dataThree: LocalDataSource = new LocalDataSource();
  dataFour: LocalDataSource = new LocalDataSource();
  dataFive: any;
  dataSix: any;
  // - Columns
  settingsOne: any;
  settingsTwo: any;
  settingsThree: any;
  settingsFour: any;
  settingsFive: any;

  // Any
  fullGoods: any;
  fullDelegations: any;

  // Number
  totalDelegations: number;

  //Array
  columnsThree: any[] = [];

  // show: boolean = false;

  get filterGoods() {
    return this.form.get('filterGoods');
  }

  get filterText() {
    return this.form.get('filterText');
  }

  //

  constructor(
    private fb: FormBuilder,
    private serviceGoods: GoodprocessService,
    private serviceDelegations: DelegationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...GOODS_COLUMNS },
    };

    this.settingsFive = {
      ...this.settings,
      actions: false,
      columns: { ...HISTORY_EVENT_COLUMNS_REPORT },
    };

    this.settingsFour = {
      ...this.settings,
      actions: false,
      columns: { ...HISTORY_COLUMNS_REPORT },
    };

    this.settingsTwo = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...DELEGATION_COLUMNS_REPORT },
    };

    this.settingsThree = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...STATUS_COLUMNS_REPORT },
    };

    this.settingsOne = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...SUBTYPE_COLUMNS_REPORT },
    };
  }

  ngOnInit(): void {
    this.prepareForm();

    this.queryTypeGoods();

    this.queryDelegation();

    this.queryStatusGoods();

    this.querySubtypeGoods(0);

    this.queryDateMainReform();
  }

  //

  private prepareForm() {
    this.form = this.fb.group({
      typeGood: [null],
      subtype: [null],
      delegation: [null],
      status: [null],
      startDate: [null],
      filterGoods: [],
      filterText: [],
    });
    this.formTwo = this.fb.group({
      radioOne: [null],
      radioTwo: [null],
      file: [null],
    });
  }

  chargeFile(event: any) {}

  queryTypeGoods(params?: ListParams) {
    this.serviceGoods.getTypesGoods().subscribe({
      next: response => {
        this.fullGoods = new DefaultSelect(response.data, response.count || 0);
      },
      error: data => {
        this.fullGoods = new DefaultSelect([], 0);
      },
    });
  }

  queryDelegation() {
    console.log('Si quiera esta pasando por aqui?');
    this.serviceDelegations.getAllTwo().subscribe({
      next: response => {
        console.log('Esta es la respuesta con la data: ', response.data);
        if (Array.isArray(response.data)) {
          this.dataThree.load(response.data);
          this.totalDelegations = response.count || 0;
          this.dataThree.refresh();
        }
      },
      error: error => (this.loading = false),
    });
  }

  queryStatusGoods() {}

  querySubtypeGoods(type: number) {}

  queryDateMainReform() {}

  //
}
