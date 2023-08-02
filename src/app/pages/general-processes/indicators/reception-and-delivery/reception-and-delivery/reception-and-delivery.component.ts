import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import { GENERAL_PROCESSES_RECEPTION_AND_DELIVERY_COLUNNS } from './reception-and-delivery-columns';

interface IBlkcontrol {
  totalcumplido: number;
  totalNocumplido: number;
  porcentajeCunplido: number;
  expedientesEnActasSinBienes: number;
  registrosProgramados: number;
  expedientesProgramados: number;
  registrosEnActas: number;
  expedientesEnActas: number;
}
@Component({
  selector: 'app-reception-and-delivery',
  templateUrl: './reception-and-delivery.component.html',
  styles: [],
})
export class ReceptionAndDeliveryComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  consulto: boolean = false;
  totalItems: number = 0;
  blkControl: IBlkcontrol = {
    totalcumplido: 0,
    totalNocumplido: 0,
    porcentajeCunplido: 0,
    expedientesEnActasSinBienes: 0,
    registrosProgramados: 0,
    expedientesProgramados: 0,
    registrosEnActas: 0,
    expedientesEnActas: 0,
  };

  get authUser() {
    return this.authService.decodeToken().preferred_username;
  }
  constructor(
    private goodService: GoodService,
    private authService: AuthService,
    private proceedingService: ProceedingsService,
    private goodsQueryService: GoodsQueryService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = GENERAL_PROCESSES_RECEPTION_AND_DELIVERY_COLUNNS;
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.consulto) this.consult();
    });
  }

  consult(form?: FormGroup) {
    this.consulto = true;
    this.getVIndProcedingsDelivery(this.params.getValue());
  }

  export(form: FormGroup) {}

  clean(form: FormGroup) {}
  //////// contadores
  async pupContadores() {
    const totalcumplido: number = await this.totalRegistros(1);
    const totalNocumplido: number = await this.totalRegistros(0);
    const registrosProgramados: number = await this.registrosProgramados();
    const expedientesEnActasSinBienes: number =
      await this.expedientesEnActasSinBienes();
    const registrosEnActas: number = await this.registrosEnActas();
    let porcentajeCunplido: number = 0;
    if (registrosProgramados !== 0) {
      const calc = (totalcumplido / (totalcumplido + totalNocumplido)) * 100;
      if (calc) {
        porcentajeCunplido = Number(calc.toFixed(2));
      }
    }
    this.blkControl = {
      totalcumplido,
      totalNocumplido,
      porcentajeCunplido,
      expedientesEnActasSinBienes,
      registrosProgramados,
      expedientesProgramados: 0,
      registrosEnActas,
      expedientesEnActas: 0,
    };
  }

  async totalRegistros(cumplio: number) {
    return new Promise<number>((resolve, reject) => {
      const params: ListParams = {};
      params['filter.regDebActs'] = '$eq:1';
      params['filter.regFulill'] = `$eq:${cumplio}`;
      params['filter.userReg'] = `$eq:${this.authUser}`;
      this.goodService.getRegistrosProgramados(params).subscribe({
        next: res => {
          console.log(res);
          resolve(res.count);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  async registrosProgramados() {
    return new Promise<number>((resolve, reject) => {
      const params: ListParams = {};
      params['filter.regDebActs'] = '$eq:1';
      params['filter.userReg'] = `$eq:${this.authUser}`;
      this.proceedingService.getTmpTotExpProceedings(params).subscribe({
        next: res => {
          console.log(res);
          resolve(res.count);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }
  async expedientesEnActasSinBienes() {
    return new Promise<number>((resolve, reject) => {
      const params: ListParams = {};
      params['filter.dogGoodProceedings'] = '$eq:0';
      params['filter.regUser'] = `$eq:${this.authUser}`;
      this.proceedingService.getTmpTotExpProceedings(params).subscribe({
        next: res => {
          resolve(res.count);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }
  async expedientesProgramados() {
    return new Promise((resolve, reject) => {});
  }
  async registrosEnActas() {
    return new Promise<number>((resolve, reject) => {
      const params: ListParams = {};
      params['filter.proceedingsProgId'] = '$eq:1';
      params['filter.regUser'] = `$eq:${this.authUser}`;
      this.proceedingService.getTmpTotGoodsProceedings(params).subscribe({
        next: res => {
          console.log(res);
          resolve(res.count);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }
  async expedientesEnActas() {
    return new Promise((resolve, reject) => {});
  }
  ///////// end Contadores

  getVIndProcedingsDelivery(params: ListParams) {
    this.loading = true;
    let params1 = {
      ...params,
      ...this.columnFilters,
    };
    this.goodsQueryService.getVIndProcedingsDelivery(params1).subscribe({
      next: res => {
        this.data.load(res.data);
        this.data.refresh();
        this.totalItems = res.count;
        this.loading = false;
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  getVIndProceedingsEntReception(params: ListParams) {
    this.loading = true;
    let params1 = {
      ...params,
      ...this.columnFilters,
    };
    this.goodsQueryService.getVIndProceedingsEntReception(params1).subscribe({
      next: res => {
        this.data.load(res.data);
        this.data.refresh();
        this.totalItems = res.count;
        this.loading = false;
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }
}
