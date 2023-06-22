import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ConceptMovisBankService } from 'src/app/core/services/catalogs/concept-movis-bank.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-income-per-asset',
  templateUrl: './income-per-asset.component.html',
  styles: [],
})
export class IncomePerAssetComponent
  extends BasePage
  implements OnInit, OnChanges
{
  assetList: any[] = [];
  depositList: any[] = [];
  assetSettings = { ...this.settings };
  depositSettings = { ...this.settings };
  assetParams = new BehaviorSubject<ListParams>(new ListParams());
  depositParams = new BehaviorSubject<ListParams>(new ListParams());
  assetTotalItems: number = 0;
  depositTotalItems: number = 0;
  @Input() goodId: number;
  assetLoading: boolean = this.loading;
  depositLoading: boolean = this.loading;

  constructor(
    private readonly accountmvmntServices: AccountMovementService,
    private readonly conceptMovisBankService: ConceptMovisBankService
  ) {
    super();
    this.assetSettings.actions.delete = true;
    this.assetSettings.actions.add = false;
    this.assetSettings.hideSubHeader = false;
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
        title: 'Fecha Depósito',
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
        title: 'Descripción',
        type: 'string',
        sort: false,
      },
      transferDate: {
        title: 'Fecha Transferencia',
        type: 'string',
        sort: false,
      },
    };
    this.depositSettings.actions.delete = true;
    this.depositSettings.actions.add = false;
    this.depositSettings.hideSubHeader = false;
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
        title: 'Fecha Depósito',
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.searchDepositary(this.goodId);
      this.searchIncomeFromTheAsset(this.goodId);
    }
  }

  ngOnInit(): void {
    this.depositParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchDepositary(this.goodId));

    this.assetParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchIncomeFromTheAsset(this.goodId));
  }

  searchDepositary(goodId: number) {
    this.searchDepositaryIsNull()
      .then(async (response: any) => {
        this.depositList = await Promise.all(
          response.map(async (deposit: any) => {
            const responseAccount: any = await this.searchAccount(
              deposit.no_cuenta
            );
            return {
              bank: responseAccount.data[0].cve_banco,
              account: responseAccount.data[0].cve_cuenta,
              depositDate: this.formatearFecha(
                new Date(deposit.fec_movimiento)
              ),
              fol: deposit.folio_ficha,
              currency: responseAccount.data[0].cve_moneda,
              amount: deposit.deposito,
            };
          })
        );
        this.depositLoading = false;
      })
      .catch(err => {
        this.depositLoading = false;
      });
  }

  searchDepositaryIsNull() {
    return new Promise((res, _rej) => {
      this.depositLoading = true;
      this.accountmvmntServices
        .getAccountAovementsIsNull(this.depositParams.getValue())
        .subscribe({
          next: response => {
            this.depositTotalItems = response.count;
            res(response.data);
          },
          error: err => {
            res('Error');
          },
        });
    });
  }

  searchAccount(numberAccount: string | number) {
    return new Promise((res, rej) => {
      this.accountmvmntServices.getAccountById(numberAccount).subscribe({
        next: response => {
          res(response);
        },
        error: err => {
          res('');
        },
      });
    });
  }

  searchIncomeFromTheAsset(goodId: number) {
    this.incomeFromTheAsset(goodId)
      .then(async (response: any) => {
        this.assetList = await Promise.all(
          response.map(async (deposit: any) => {
            const responseAccount: any = await this.searchAccount(
              deposit.no_cuenta
            );
            return {
              bank: responseAccount.data[0].cve_banco,
              account: responseAccount.data[0].cve_cuenta,
              depositDate: this.formatearFecha(
                new Date(deposit.fec_movimiento)
              ),
              fol: deposit.folio_ficha,
              currency: responseAccount.data[0].cve_moneda,
              amount: deposit.deposito,
              concept: deposit.cve_concepto,
              description: 'TRASPASO COBRO DE CHEQUE',
              transferDate: this.formatearFecha(
                new Date(deposit.fec_calculo_intereses)
              ),
            };
          })
        );
        this.assetLoading = false;
      })
      .catch(err => {
        this.assetLoading = false;
      });
  }

  incomeFromTheAsset(goodId: number | string) {
    return new Promise((res, _rej) => {
      this.assetLoading = true;
      this.accountmvmntServices
        .getAccountAovements(goodId, this.assetParams.getValue())
        .subscribe({
          next: response => {
            this.assetTotalItems = response.count;
            res(response.data);
          },
          error: err => {
            res('Error');
          },
        });
    });
  }

  formatearFecha(fecha: Date) {
    let dia: any = fecha.getDate();
    let mes: any = fecha.getMonth() + 1;
    let anio: any = fecha.getFullYear();
    dia = dia < 10 ? '0' + dia : dia;
    mes = mes < 10 ? '0' + mes : mes;
    let fechaFormateada = dia + '/' + mes + '/' + anio;
    return fechaFormateada;
  }

  getConceptMovisBank(key: string) {
    const params: ListParams = {};
    params['filter.key'] = `$eq:${key}`;
    this.conceptMovisBankService.getByKey(params).subscribe({
      next: response => {},
      error: err => {},
    });
  }
}
