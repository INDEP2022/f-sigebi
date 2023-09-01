import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared';
import {
  GOODS_COLUMNS,
  GOODS_MANUAL_COLUMNS,
  GOODS_PROG_COLUMNS,
  GOODS_PROG_ENT_COLUMNS,
  GOODS_REC_DOC_COLUMNS,
  GOODS_REUB_GOOD_COLUMNS,
  GOODS_VAL_REQ_COLUMNS,
  GOODS_WAREHOUSE_COLUMNS,
} from './report-expenses-for-good-columns';

@Component({
  selector: 'app-report-expenses-for-good',
  templateUrl: './report-expenses-for-good.component.html',
  styles: [],
})
export class ReportExpensesForGoodComponent extends BasePage implements OnInit {
  infoValReq = new LocalDataSource();
  infoRecDoc = new LocalDataSource();
  infoProg = new LocalDataSource();
  infoProgEnt = new LocalDataSource();
  infoWarehouse = new LocalDataSource();
  infoManual = new LocalDataSource();
  infoReubGood = new LocalDataSource();
  infoGoods = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsRecDoc = new BehaviorSubject<ListParams>(new ListParams());
  paramsValReq = new BehaviorSubject<ListParams>(new ListParams());
  paramsProg = new BehaviorSubject<ListParams>(new ListParams());
  paramsProgEnt = new BehaviorSubject<ListParams>(new ListParams());
  paramsWarehouse = new BehaviorSubject<ListParams>(new ListParams());
  paramsMan = new BehaviorSubject<ListParams>(new ListParams());
  paramsReubGood = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItemsValReq: number = 0;
  totalItemsRecDoc: number = 0;
  totalItemsProg: number = 0;
  totalItemsProgEnt: number = 0;
  totalItemsMan: number = 0;
  totalItemsWarehouse: number = 0;
  totalItemsReubGood: number = 0;
  form: FormGroup = new FormGroup({});
  settingsValReq = {
    ...this.settings,
    actions: false,
    columns: {
      ...GOODS_VAL_REQ_COLUMNS,
    },
  };

  settingsRecDoc = {
    ...this.settings,
    actions: false,
    columns: {
      ...GOODS_REC_DOC_COLUMNS,
    },
  };

  settingsProg = {
    ...this.settings,
    actions: false,
    columns: {
      ...GOODS_PROG_COLUMNS,
    },
  };

  settingsProgEnt = {
    ...this.settings,
    actions: false,
    columns: {
      ...GOODS_PROG_ENT_COLUMNS,
    },
  };

  settingsWarehouse = {
    ...this.settings,
    actions: false,
    columns: {
      ...GOODS_WAREHOUSE_COLUMNS,
    },
  };

  settingsManual = {
    ...this.settings,
    actions: false,
    columns: {
      ...GOODS_MANUAL_COLUMNS,
    },
  };

  settingsReubGood = {
    ...this.settings,
    actions: false,
    columns: {
      ...GOODS_REUB_GOOD_COLUMNS,
    },
  };

  loadingValReq: boolean = false;
  loadingRecDoc: boolean = false;
  loadingProg: boolean = false;
  loadingProgEnt: boolean = false;
  loadingWarehouse: boolean = false;
  loadingMan: boolean = false;
  loadingReubGood: boolean = false;

  constructor(
    private goodsQueryService: GoodsQueryService,
    private fb: FormBuilder,
    private router: Router
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        ...GOODS_COLUMNS,
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();

    this.paramsValReq
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInfoValReq());

    this.paramsRecDoc
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInfoRecDoc());

    this.paramsProg
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInfoProg());

    this.paramsProgEnt
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInfoProgEnt());

    this.paramsWarehouse
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInfoWarehouse());

    this.paramsMan
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInfoManual());

    this.paramsReubGood
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInfoReubGood());
  }

  prepareForm() {
    this.form = this.fb.group({
      idGood: [null, [Validators.maxLength(100)]],
      idTypeRelevant: [null, [Validators.maxLength(100)]],
      fileNumber: [null, [Validators.maxLength(100)]],
      descriptionGood: [null, [Validators.maxLength(100)]],
      quantity: [null, [Validators.maxLength(100)]],
      unit: [null, [Validators.maxLength(100)]],
      uniqueKey: [null, [Validators.maxLength(100)]],
    });
  }

  getInfoValReq() {
    this.goodsQueryService
      .getInfoValReqView(this.paramsValReq.getValue())
      .subscribe({
        next: response => {
          console.log('response', response);
        },
        error: error => {},
      });
  }

  getInfoRecDoc() {
    this.goodsQueryService
      .getInfoRecDocView(this.paramsRecDoc.getValue())
      .subscribe({
        next: response => {
          console.log('response', response);
        },
        error: error => {},
      });
  }

  getInfoProg() {
    this.goodsQueryService
      .getInfoProgView(this.paramsProg.getValue())
      .subscribe({
        next: response => {
          console.log('response', response);
        },
        error: error => {},
      });
  }

  getInfoProgEnt() {
    this.goodsQueryService
      .getInfoProgEntView(this.paramsProgEnt.getValue())
      .subscribe({
        next: response => {
          console.log('response', response);
        },
        error: error => {},
      });
  }
  getInfoWarehouse() {
    this.goodsQueryService
      .getInfoWarehouseView(this.paramsWarehouse.getValue())
      .subscribe({
        next: response => {
          console.log('response', response);
        },
        error: error => {},
      });
  }

  getInfoManual() {
    this.goodsQueryService.getInfoManView(this.paramsMan.getValue()).subscribe({
      next: response => {
        console.log('response', response);
      },
      error: error => {},
    });
  }

  getInfoReubGood() {
    this.goodsQueryService
      .getInfoReubGoodView(this.paramsReubGood.getValue())
      .subscribe({
        next: response => {
          console.log('response', response);
        },
        error: error => {},
      });
  }

  close() {
    this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
  }
}
