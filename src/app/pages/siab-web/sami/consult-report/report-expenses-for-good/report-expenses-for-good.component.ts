import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
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
    private router: Router,
    private authService: AuthService,
    private regionalDelegationService: RegionalDelegationService
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
    const user: any = this.authService.decodeToken();
    this.paramsValReq.getValue()[
      'filter.ORD_delegacion_regional'
    ] = `$eq:${user.department}`;
    this.goodsQueryService
      .getInfoValReqView(this.paramsValReq.getValue())
      .subscribe({
        next: async response => {
          const infoValReq = response.data.map(async item => {
            const showDelegation: any = await this.showDelegation(
              item.ORD_delegacion_regional
            );
            if (showDelegation) item.ORD_delegacion_regional = showDelegation;

            return item;
          });

          Promise.all(infoValReq).then(ValReqData => {
            console.log('infoValReq', ValReqData);

            this.infoValReq.load(ValReqData);
            this.totalItemsValReq = ValReqData.length;
          });
        },
        error: error => {},
      });
  }

  showDelegation(delegationId: number) {
    return new Promise((resolve, reject) => {
      this.regionalDelegationService.getById(delegationId).subscribe({
        next: response => {
          resolve(response.description);
        },
        error: error => {},
      });
    });
  }

  getInfoRecDoc() {
    const user: any = this.authService.decodeToken();
    this.paramsRecDoc.getValue()[
      'filter.ORD_delegacion_regional'
    ] = `$eq:${user.department}`;
    this.goodsQueryService
      .getInfoRecDocView(this.paramsRecDoc.getValue())
      .subscribe({
        next: async response => {
          const infoRecDoc = response.data.map(async item => {
            const showDelegation: any = await this.showDelegation(
              item.ORD_delegacion_regional
            );
            if (showDelegation) item.ORD_delegacion_regional = showDelegation;

            return item;
          });

          Promise.all(infoRecDoc).then(infoRecDoc => {
            this.infoRecDoc.load(infoRecDoc);
            this.totalItemsRecDoc = infoRecDoc.length;
          });
        },
        error: error => {},
      });
  }

  getInfoProg() {
    const user: any = this.authService.decodeToken();
    this.paramsProg.getValue()[
      'filter.ORD_delegacion_regional'
    ] = `$eq:${user.department}`;
    this.goodsQueryService
      .getInfoProgView(this.paramsProg.getValue())
      .subscribe({
        next: async response => {
          const infoProg = response.data.map(async item => {
            const showDelegation: any = await this.showDelegation(
              item.ORD_delegacion_regional
            );
            if (showDelegation) item.ORD_delegacion_regional = showDelegation;

            return item;
          });

          Promise.all(infoProg).then(infoProg => {
            this.infoProg.load(infoProg);
            this.totalItemsProg = infoProg.length;
          });
        },
        error: error => {},
      });
  }

  getInfoProgEnt() {
    const user: any = this.authService.decodeToken();

    this.goodsQueryService
      .getInfoProgEntView(this.paramsProgEnt.getValue())
      .subscribe({
        next: async response => {
          console.log('prog Entrega', response);
          const infoProgEnt = response.data.map(async item => {
            const showDelegation: any = await this.showDelegation(
              item.ORD_delegacion_regional
            );
            if (showDelegation) item.ORD_delegacion_regional = showDelegation;

            return item;
          });

          Promise.all(infoProgEnt).then(infoProgEnt => {
            this.infoProgEnt.load(infoProgEnt);
            this.totalItemsProgEnt = infoProgEnt.length;
          });
        },
        error: error => {
          console.log('prog Entrega', error);
        },
      });
  }

  getInfoWarehouse() {
    const user: any = this.authService.decodeToken();
    this.paramsWarehouse.getValue()[
      'filter.ORD_delegacion_regional'
    ] = `$eq:${user.department}`;
    this.goodsQueryService
      .getInfoWarehouseView(this.paramsWarehouse.getValue())
      .subscribe({
        next: async response => {
          const infoWarehouse = response.data.map(async item => {
            const showDelegation: any = await this.showDelegation(
              item.ORD_delegacion_regional
            );
            if (showDelegation) item.ORD_delegacion_regional = showDelegation;

            return item;
          });

          Promise.all(infoWarehouse).then(infoWarehouse => {
            this.infoWarehouse.load(infoWarehouse);
            this.totalItemsWarehouse = infoWarehouse.length;
          });
        },
        error: error => {},
      });
  }

  getInfoManual() {
    const user: any = this.authService.decodeToken();
    this.paramsMan.getValue()[
      'filter.ORD_delegacion_regional'
    ] = `$eq:${user.department}`;
    this.goodsQueryService.getInfoManView(this.paramsMan.getValue()).subscribe({
      next: async response => {
        const infoManual = response.data.map(async item => {
          const showDelegation: any = await this.showDelegation(
            item.ORD_delegacion_regional
          );
          if (showDelegation) item.ORD_delegacion_regional = showDelegation;

          return item;
        });

        Promise.all(infoManual).then(infoManual => {
          this.infoManual.load(infoManual);
          this.totalItemsMan = infoManual.length;
        });
      },
      error: error => {},
    });
  }

  getInfoReubGood() {
    const user: any = this.authService.decodeToken();
    this.paramsReubGood.getValue()[
      'filter.ORD_delegacion_regional'
    ] = `$eq:${user.department}`;
    this.goodsQueryService
      .getInfoReubGoodView(this.paramsReubGood.getValue())
      .subscribe({
        next: async response => {
          const infoReubGood = response.data.map(async item => {
            const showDelegation: any = await this.showDelegation(
              item.ORD_delegacion_regional
            );
            if (showDelegation) item.ORD_delegacion_regional = showDelegation;

            return item;
          });

          Promise.all(infoReubGood).then(infoReubGood => {
            this.infoReubGood.load(infoReubGood);
            this.totalItemsReubGood = infoReubGood.length;
          });
        },
        error: error => {},
      });
  }

  close() {
    this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
  }
}
