import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RapproveDonationService } from 'src/app/core/services/ms-r-approve-donation/r-approve-donation.service';
import { BasePage } from 'src/app/core/shared';
import {
  goodsColumns,
  proceedingsColumns,
  requestColumns,
  sGoodsColumns,
} from './columns';

@Component({
  selector: 'app-good-donations-modal',
  templateUrl: './good-donations-modal.component.html',
  styleUrls: [],
})
export class GoodDonationsModalComponent extends BasePage implements OnInit {
  //
  loadingTableProceedings = false;
  loadingTableRequest = false;
  loadingTableGoods = false;
  loadingTableSGoods = false;
  //
  dataProceedings = new LocalDataSource();
  paramsProceedings = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsProceedings: number = 0;
  settingsProceedings = {
    ...this.settings,
    actions: false,
    columns: proceedingsColumns,
  };
  //
  dataRequest = new LocalDataSource();
  paramsRequest = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsRequest: number = 0;
  settingsRequest = {
    ...this.settings,
    actions: false,
    columns: requestColumns,
  };
  //
  dataGoods = new LocalDataSource();
  paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsGoods: number = 0;
  settingsGoods = {
    ...this.settings,
    actions: false,
    columns: goodsColumns,
  };
  //
  dataSGoods = new LocalDataSource();
  paramsSGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsSGoods: number = 0;
  settingsSGoods = {
    ...this.settings,
    actions: false,
    columns: sGoodsColumns,
  };
  //
  totalAmount: number = 0;
  //
  selectGood: any = null;
  selectRequestData: any = null;

  constructor(
    private modalRef: BsModalRef,
    private rapproveDonationService: RapproveDonationService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getProceedingsData();
    this.getRequestData();
    this.getSGoodsData();
    /* this.getGoodsData();
    this.getSGoodsData(); */
    this.navigateRequest();
  }

  navigateRequest() {
    this.paramsRequest.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      this.getRequestData();
    });
  }

  getProceedingsData() {
    this.loadingTableProceedings = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('regional', this.authService.decodeToken().department);
    this.rapproveDonationService
      .getGoodProgDonationFilter(paramsF.getParams())
      .subscribe(
        res => {
          console.log(res);
          this.dataProceedings.load(res.data);
          this.totalItemsProceedings = res.count;
          this.loadingTableProceedings = false;
        },
        err => {
          console.log(err);
          this.dataProceedings.load([]);
          this.totalItemsProceedings = 0;
          this.loadingTableProceedings = false;
          this.alert(
            'warning',
            'No se encontraron registros de programaciones de entrega',
            ''
          );
        }
      );
  }

  async getRequestData() {
    this.loadingTableRequest = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('authorizeType', 'A');
    paramsF.page = this.paramsRequest.value.page;
    paramsF.limit = this.paramsRequest.value.limit;
    // paramsF.addFilter()
    this.rapproveDonationService
      .getDonationRequestFilter(paramsF.getParams())
      .subscribe(
        res => {
          console.log(res);
          this.dataRequest.load(res.data);
          this.totalItemsRequest = res.count;
          this.loadingTableRequest = false;
        },
        err => {
          console.log(err);
          this.dataRequest.load([]);
          this.totalItemsRequest = 0;
          this.alert(
            'warning',
            'No se encontraron solicitudes de donación',
            ''
          );
          this.loadingTableRequest = false;
        }
      );
  }

  selectRequest(e: any) {
    console.log(e.data);
    this.selectRequestData = e.data;
    this.getGoodsData(e.data.requestId.id);
  }

  getGoodsData(requestId: string) {
    this.loadingTableGoods = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('requestId', requestId);
    this.rapproveDonationService
      .getTmpGoodAutDonation(paramsF.getParams())
      .subscribe(
        res => {
          console.log(res);
          this.dataGoods.load(res.data);
          this.totalItemsGoods = res.count;
          this.loadingTableGoods = false;
          this.totalAmount = 12;
        },
        err => {
          console.log(err);
          this.dataGoods.load([]);
          this.totalItemsGoods = 0;
          this.alert(
            'warning',
            'No se encontraron bienes para la solicitud',
            ''
          );
          this.loadingTableGoods = false;
        }
      );
  }

  getSGoodsData() {
    this.loadingTableSGoods = true;
    const paramsF = new FilterParams();
    paramsF.addFilter(
      'userId.id',
      this.authService.decodeToken().preferred_username
    );
    this.rapproveDonationService
      .getTmpGoodProgDonationFilter(paramsF.getParams())
      .subscribe(
        res => {
          console.log(res);
          this.dataSGoods.load(res.data);
          this.totalItemsSGoods = res.count;
          this.loadingTableSGoods = false;
        },
        err => {
          console.log(err);
          this.dataSGoods.load([]);
          this.totalItemsSGoods = 0;
          this.alert(
            'warning',
            'No se encontraron registros de programaciones de entrega',
            ''
          );
          this.loadingTableSGoods = false;
        }
      );
  }

  close() {
    this.modalRef.hide();
  }

  selectRow(e: any) {
    console.log(e.data);
    this.selectGood = e.data;
  }

  cValrepCursor(): Promise<number> {
    return new Promise((resolve, _rej) => {
      const paramsF = new FilterParams();
      paramsF.addFilter(
        'userId.id',
        this.authService.decodeToken().preferred_username
      );
      paramsF.addFilter('requestId', this.selectGood.requestId);
      paramsF.addFilter('goodId', this.selectGood.goodId);
      this.rapproveDonationService
        .getTmpGoodAutDonation(paramsF.getParams())
        .subscribe(
          res => {
            console.log(res);
            resolve(res.count);
          },
          err => {
            console.log(err);
            resolve(0);
          }
        );
    });
  }

  async insertGood() {
    if (this.selectGood == null) {
      this.alert(
        'warning',
        'Seleccione un bien',
        'Debe seleccionar un bien para poder insertarlo'
      );
      return;
    }

    if (
      this.selectRequestData.sunQuantity == null ||
      this.selectRequestData.sunQuantity <= 0
    ) {
      this.alert(
        'warning',
        'No se puede seleccionar bienes',
        'No se puede seleccionar bienes por que el total de la solicitud es 0'
      );
      return;
    }

    const count = await this.cValrepCursor();
    if (count > 0) {
      this.alert(
        'warning',
        'Bien ya fue seleccionado',
        `El bien ${this.selectGood.goodId} ya fue seleccionado en esta solicitud`
      );
      return;
    }
  }

  deleteGood() {}
}
