import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-income-per-asset',
  templateUrl: './income-per-asset.component.html',
  styles: [],
})
export class IncomePerAssetComponent extends BasePage implements OnInit {
  assetList: any[] = [];
  depositList: any[] = [];
  assetSettings = { ...this.settings };
  depositSettings = { ...this.settings };
  assetParams = new BehaviorSubject<ListParams>(new ListParams());
  depositParams = new BehaviorSubject<ListParams>(new ListParams());
  assetTotalItems: number = 0;
  depositTotalItems: number = 0;

  constructor(private readonly accountmvmntServices: AccountMovementService) {
    super();
    this.assetSettings.columns = {
      bank: {
        title: 'Banco',
        type: 'number',
        sort: false,
      },
      account: {
        title: 'Cuenta',
        type: 'string',
        sort: false,
      },
      depositDate: {
        title: 'Fecha Deposito',
        type: 'string',
        sort: false,
      },
      fol: {
        title: 'Folio',
        type: 'string',
        sort: false,
      },
      currency: {
        title: 'Moneda',
        type: 'string',
        sort: false,
      },
      amount: {
        title: 'Importe',
        type: 'string',
        sort: false,
      },
      concept: {
        title: 'Concepto',
        type: 'string',
        sort: false,
      },
      description: {
        title: 'Descripcion',
        type: 'string',
        sort: false,
      },
      transferDate: {
        title: 'Fecha Transferencia',
        type: 'string',
        sort: false,
      },
    };
    this.depositSettings.columns = {
      bank: {
        title: 'Banco',
        type: 'number',
        sort: false,
      },
      account: {
        title: 'Cuenta',
        type: 'string',
        sort: false,
      },
      depositDate: {
        title: 'Fecha Deposito',
        type: 'string',
        sort: false,
      },
      fol: {
        title: 'Folio',
        type: 'string',
        sort: false,
      },
      currency: {
        title: 'Moneda',
        type: 'string',
        sort: false,
      },
      amount: {
        title: 'Importe',
        type: 'string',
        sort: false,
      },
    };
  }

  ngOnInit(): void {}
}
