import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
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
  goodSelect: number = 0;
  costValReq: number = 0;
  costRecDoc: number = 0;
  costProg: number = 0;
  costProgEnt: number = 0;
  costWarehouse: number = 0;
  costManual: number = 0;
  costReub: number = 0;
  total: number = 0;

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
    private regionalDelegationService: RegionalDelegationService,
    private orderServiceService: OrderServiceService,
    private goodService: GoodService
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
  }

  prepareForm() {
    this.form = this.fb.group({
      idGood: [null, [Validators.maxLength(100)]],
      idTypeRelevant: [null, [Validators.maxLength(100)]],
      descriptionGood: [null, [Validators.maxLength(100)]],
      uniqueKey: [null, [Validators.maxLength(100)]],
    });
  }

  showListGoods() {
    const idGood = this.form.get('idGood').value;
    const idTypeRelevant = this.form.get('idTypeRelevant').value;
    const descriptionGood = this.form.get('descriptionGood').value;
    const uniqueKey = this.form.get('uniqueKey').value;

    if (idGood) this.params.getValue()['filter.goodId'] = idGood;
    if (idTypeRelevant)
      this.params.getValue()['filter.relevantTypeId'] = idTypeRelevant;
    if (descriptionGood)
      this.params.getValue()['filter.description'] = descriptionGood;
    if (uniqueKey) this.params.getValue()['filter.uniqueKey'] = uniqueKey;

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInfoGoods());
  }

  getInfoGoods() {
    this.loading = true;
    const user: any = this.authService.decodeToken();
    this.params.getValue()['filter.delegationNumber'] = user.department;
    this.goodService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.infoGoods.load(response.data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  showGoodSelect(good: IGood) {
    this.goodSelect = Number(good.goodId);
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

  getInfoValReq() {
    this.loadingValReq = true;
    const user: any = this.authService.decodeToken();
    this.paramsValReq.getValue()[
      'filter.regionalDelegation'
    ] = `$eq:${user.department}`;

    this.paramsValReq.getValue()['filter.goodId'] = `$eq:${this.goodSelect}`;
    this.orderServiceService
      .getOrderServiceRecepReq(this.paramsValReq.getValue())
      .subscribe({
        next: async response => {
          const infoValReq = response.data.map(async (item: any) => {
            const showDelegation: any = await this.showDelegation(
              item.regionalDelegation
            );
            if (showDelegation) item.regionalDelegationName = showDelegation;
            if (item.costService != null && item.goodNumber != null) {
              item.prorrateo = item.costService * item.goodNumber;
              return item;
            } else {
              return item;
            }
          });

          Promise.all(infoValReq).then(ValReqData => {
            this.infoValReq.load(ValReqData);
            this.totalItemsValReq = response.count;
            this.loadingValReq = false;
            this.sumAllProValReq();
          });
        },
        error: error => {
          this.loadingValReq = false;
        },
      });
  }

  sumAllProValReq() {
    this.infoValReq.getElements().then(data => {
      if (data.length > 1) {
        data.map(item => {
          this.costValReq += item.prorrateo;
        });
      } else if (data.length == 1) {
        this.costValReq = data[0].prorrateo;
      }
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
    this.loadingRecDoc = true;
    const user: any = this.authService.decodeToken();
    this.paramsRecDoc.getValue()[
      'filter.regionalDelegation'
    ] = `$eq:${user.department}`;

    this.paramsRecDoc.getValue()['filter.goodId'] = `$eq:${this.goodSelect}`;
    this.orderServiceService
      .getOrderServiceRecepDoc(this.paramsRecDoc.getValue())
      .subscribe({
        next: async response => {
          const infoRecDoc = response.data.map(async (item: any) => {
            const showDelegation: any = await this.showDelegation(
              item.regionalDelegation
            );
            if (showDelegation) item.regionalDelegationName = showDelegation;

            if (item.costService != null && item.goodNumber != null) {
              item.prorrateo = item.costService * item.goodNumber;
              return item;
            } else {
              return item;
            }
          });

          Promise.all(infoRecDoc).then(infoRecDoc => {
            this.infoRecDoc.load(infoRecDoc);
            this.totalItemsRecDoc = response.count;
            this.loadingRecDoc = false;
            this.sumAllProRecDoc();
          });
        },
        error: error => {
          this.loadingRecDoc = false;
        },
      });
  }

  sumAllProRecDoc() {
    this.infoRecDoc.getElements().then(data => {
      if (data.length > 1) {
        data.map(item => {
          this.costRecDoc += item.prorrateo;
        });
      } else if (data.length == 1) {
        this.costRecDoc = data[0].prorrateo;
      }
    });
  }

  getInfoProg() {
    this.loadingProg = true;
    const user: any = this.authService.decodeToken();
    this.paramsProg.getValue()[
      'filter.regionalDelegation'
    ] = `$eq:${user.department}`;

    this.paramsProg.getValue()['filter.goodId'] = `$eq:${this.goodSelect}`;
    this.orderServiceService
      .getOrderServiceCancelled(this.paramsProg.getValue())
      .subscribe({
        next: async response => {
          const infoProg = response.data.map(async (item: any) => {
            const showDelegation: any = await this.showDelegation(
              item.regionalDelegation
            );
            if (showDelegation) item.regionalDelegationName = showDelegation;
            if (item.costService != null && item.goodNumber != null) {
              item.prorrateo = item.costService * item.goodNumber;
              return item;
            } else {
              return item;
            }
          });

          Promise.all(infoProg).then(infoProg => {
            this.infoProg.load(infoProg);
            this.totalItemsProg = response.count;
            this.loadingProg = false;
            this.sumAllProg();
          });
        },
        error: error => {
          this.loadingProg = false;
        },
      });
  }

  sumAllProg() {
    this.infoProg.getElements().then(data => {
      if (data.length > 1) {
        data.map(item => {
          this.costProg += item.prorrateo;
        });
      } else if (data.length == 1) {
        this.costProg = data[0].prorrateo;
      }
    });
  }

  getInfoProgEnt() {
    this.loadingProgEnt = true;
    const user: any = this.authService.decodeToken();
    this.paramsProgEnt.getValue()['filter.goodId'] = `$eq:${this.goodSelect}`;
    this.orderServiceService
      .getOrderServiceDateEndAt(this.paramsProgEnt.getValue())
      .subscribe({
        next: async response => {
          const infoProgEnt = response.data.map(async (item: any) => {
            const showDelegation: any = await this.showDelegation(
              item.regionalDelegation
            );
            if (showDelegation) item.regionalDelegationName = showDelegation;

            if (item.costService != null && item.goodNumber != null) {
              item.prorrateo = item.costService * item.goodNumber;
              return item;
            } else {
              return item;
            }
          });

          Promise.all(infoProgEnt).then(infoProgEnt => {
            this.infoProgEnt.load(infoProgEnt);
            this.totalItemsProgEnt = response.count;
            this.loadingProgEnt = false;
            this.sumAllProgEnt();
          });
        },
        error: error => {
          this.loadingProgEnt = false;
        },
      });
  }

  sumAllProgEnt() {
    this.infoProgEnt.getElements().then(data => {
      if (data.length > 1) {
        data.map(item => {
          this.costProgEnt += item.prorrateo;
        });
      } else if (data.length == 1) {
        this.costProgEnt = data[0].prorrateo;
      }
    });
  }

  getInfoWarehouse() {
    this.loadingWarehouse = true;
    const user: any = this.authService.decodeToken();
    /*this.paramsWarehouse.getValue()[
      'filter.ORD_delegacion_regional'
    ] = `$eq:${user.department}`; */
    this.paramsWarehouse.getValue()['filter.goodId'] = `$eq:${this.goodSelect}`;
    this.orderServiceService
      .getOrderServiceTypeOrder(this.paramsWarehouse.getValue())
      .subscribe({
        next: async response => {
          const infoWarehouse = response.data.map(async (item: any) => {
            const showDelegation: any = await this.showDelegation(
              item.regionalDelegation
            );
            if (showDelegation) item.regionalDelegationName = showDelegation;

            if (item.costService != null && item.goodNumber != null) {
              item.prorrateo = item.costService * item.goodNumber;
              return item;
            } else {
              return item;
            }
          });

          Promise.all(infoWarehouse).then(infoWarehouse => {
            this.infoWarehouse.load(infoWarehouse);
            this.totalItemsWarehouse = response.count;
            this.loadingWarehouse = false;
            this.sumAllWarehouse();
          });
        },
        error: error => {
          this.loadingWarehouse = false;
        },
      });
  }

  sumAllWarehouse() {
    this.infoWarehouse.getElements().then(data => {
      if (data.length > 1) {
        data.map(item => {
          this.costWarehouse += item.prorrateo;
        });
      } else if (data.length == 1) {
        this.costWarehouse = data[0].prorrateo;
      }
    });
  }

  getInfoManual() {
    this.loadingMan = true;
    const user: any = this.authService.decodeToken();
    /*this.paramsMan.getValue()[
      'filter.regionalDelegation'
    ] = `$eq:${user.department}`; */
    this.paramsMan.getValue()['filter.goodId'] = `$eq:${this.goodSelect}`;
    this.orderServiceService
      .getOrderServiceTypeMan(this.paramsMan.getValue())
      .subscribe({
        next: async response => {
          const infoManual = response.data.map(async (item: any) => {
            const showDelegation: any = await this.showDelegation(
              item.regionalDelegation
            );
            if (showDelegation) item.regionalDelegationName = showDelegation;

            if (item.costService != null && item.goodNumber != null) {
              item.prorrateo = item.costService * item.goodNumber;
              return item;
            } else {
              return item;
            }
          });

          Promise.all(infoManual).then(infoManual => {
            this.infoManual.load(infoManual);
            this.totalItemsMan = response.count;
            this.loadingMan = false;
            this.sumAllManual();
          });
        },
        error: () => {
          this.loadingMan = false;
        },
      });
  }

  sumAllManual() {
    this.infoManual.getElements().then(data => {
      if (data.length > 1) {
        data.map(item => {
          this.costManual += item.prorrateo;
        });
      } else if (data.length == 1) {
        this.costManual = data[0].prorrateo;
      }
    });
  }

  getInfoReubGood() {
    this.loadingReubGood = true;
    const user: any = this.authService.decodeToken();
    /*this.paramsReubGood.getValue()[
      'filter.regionalDelegation'
    ] = `$eq:${user.department}`; */
    this.paramsReubGood.getValue()['filter.goodId'] = `$eq:${this.goodSelect}`;
    this.orderServiceService
      .getOrderServiceTypeReb(this.paramsReubGood.getValue())
      .subscribe({
        next: async response => {
          const infoReubGood = response.data.map(async (item: any) => {
            const showDelegation: any = await this.showDelegation(
              item.regionalDelegation
            );
            if (showDelegation) item.regionalDelegationName = showDelegation;

            if (item.costService != null && item.goodNumber != null) {
              item.prorrateo = item.costService * item.goodNumber;
              return item;
            } else {
              return item;
            }
          });

          Promise.all(infoReubGood).then(infoReubGood => {
            this.infoReubGood.load(infoReubGood);
            this.totalItemsReubGood = response.count;
            this.loadingReubGood = false;
            this.sumAllReub();

            this.getSumTotal();
          });
        },
        error: () => {
          this.loadingReubGood = false;
          this.getSumTotal();
        },
      });
  }

  sumAllReub() {
    this.infoReubGood.getElements().then(data => {
      if (data.length > 1) {
        data.map(item => {
          this.costReub += item.prorrateo;
        });
      } else if (data.length == 1) {
        this.costReub = data[0].prorrateo;
      }
    });
  }

  getSumTotal() {
    this.total = this.costValReq;
    this.total = this.total + this.costRecDoc;
    this.total = this.total + this.costProg;
    this.total = this.total + this.costProgEnt;
    this.total = this.total + this.costWarehouse;
    this.total = this.total + this.costManual;
    this.total = this.total + this.costReub;
  }

  cleanSearch() {
    this.form.reset();
    this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInfoGoods());
  }

  close() {
    this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
  }
}
