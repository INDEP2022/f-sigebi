import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';
import {
  showAlert,
  showQuestion,
  showToast,
} from 'src/app/common/helpers/helpers';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IMassiveNumeraryChangeSpent } from '../types/massive-numerary.type';
import {
  MASSIVE_NUMERARY_CHANGE_MODAL_COLUMNS,
  WIN_BIENES_MODAL_COLUMNS,
} from './massive-numerary-change-modal-columns';

@Component({
  selector: 'app-massive-numerary-change-modal',
  templateUrl: './massive-numerary-change-modal.component.html',
  styles: [
    `
      ::ng-deep .bg-custom-red {
        background: #dc3545;
        color: white;
      }

      ::ng-deep .bg-custom-green {
        background-color: green !important;
        color: white;
      }

      ::ng-deep .bg-custom-cyan {
        background-color: cyan !important;
      }

      ::ng-deep .bg-custom-orange {
        background-color: orange !important;
      }

      ::ng-deep .bg-custom-yellow {
        background-color: yellow !important;
      }
    `,
  ],
})
export class MassiveNumeraryChangeModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Win Bienes';
  form: FormGroup;
  settings2 = { ...this.settings, actions: false };
  BLK_BIENES = new LocalDataSource();
  BLK_GASTOS = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(
    private modalRef: BsModalRef,
    // private fb: FormBuilder,
    private goodServices: GoodService,
    private excelService: ExcelService,
    private accountMovementService: AccountMovementService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: MASSIVE_NUMERARY_CHANGE_MODAL_COLUMNS,
      rowClassFunction: (row: any) => {
        return row?.data?.color;
      },
    };
    this.settings2.columns = WIN_BIENES_MODAL_COLUMNS;
  }

  ngOnInit(): void {}
  close() {
    this.modalRef.hide();
  }

  async onClickArchoNumeraryConc() {
    const goods = await this.getGoodsIn();
    if (!goods) {
      showToast({
        icon: 'error',
        text: 'No hay bienes para consultar',
        title: 'Error',
      });
      return;
    }
    await this.exportExcel(goods.goods, goods.goodsMore);
  }

  async exportExcel(goods: any[], goodsMore: any[]) {
    const dataForExcel = goods.map(good => {
      const goodMoreFilter = goodsMore.find(
        goodMore => goodMore.noGood == good.noGood
      );
      const dataMoreExcel = {
        DESCRIPCION_NUM: goodMoreFilter?.description,
        ESTATUS_NUM: goodMoreFilter?.noExpedient,
        CVE_EVENTO: good?.noExpedient,
        MONEDA_NUM: goodMoreFilter?.val1,
        INGRESO_NUM: goodMoreFilter?.val2,
        IVA_NUM: goodMoreFilter?.val10,
        GASTO_NUM: goodMoreFilter?.val13,
        VALOR_AVALUO_NUM: goodMoreFilter?.appraisedValue,
      };
      const rowExcel = {
        NO_BIEN: good.noGood,
        DESCRIPCION: good.description,
        ESTATUS: good.status,
        INGRESO: good.entry,
        GASTO: good.costs,
        IVA: good.tax,
        VALOR_CALC: good.impNumerary,
        NO_BIEN_NUM: good.npNUm,
        ...dataMoreExcel,
      };
      return rowExcel;
    });
    console.log({ dataForExcel });
    this.excelService.export(dataForExcel, { type: 'csv', filename: 'hoja1' });
  }

  async getGoodsIn(): Promise<{ goods: any[]; goodsMore: any[] }> {
    const goods: IMassiveNumeraryChangeSpent[] = await this.BLK_BIENES.getAll();
    const goodsFilter = goods.filter(item => item.indNume === 3);

    const goodsNumber = goodsFilter.map((item: { noGood: any }) => item.noGood);
    if (!goodsNumber || goodsNumber?.length < 1) {
      return null;
    }

    const queryString = `?filter.id=${SearchFilter.IN}:${goodsNumber.join(
      ','
    )}`;
    const goodsMore = await firstValueFrom(
      this.goodServices.getAll(queryString).pipe(map(res => res.data || []))
    );
    console.log({ goodsMore });
    return { goods: goodsFilter, goodsMore };
  }

  chkMovBan = 'NO';
  DI_MONEDA_NEW: any;
  TI_FICHA_NEW: any;
  TI_BANCO_NEW: any;
  TI_FECHA_NEW: any;
  DI_CUENTA_NEW: any;
  DI_NO_CUENTA_DEPOSITO: any;
  DI_CATEGORIA: any;
  DI_NO_MOVIMIENTO: any;
  vestatus_ant: any;
  vestatus_nue: any;
  v_clasif_bien: number;
  vBAN: boolean;
  vCHECA: boolean;
  vVALIDA_ESTATUS: number;
  V_FEC_REG_INSERT: string;
  vNoMovimiento: any;

  async onClickGenerateNumeraries(): Promise<void> {
    const BLK_BIENES_ALL: IMassiveNumeraryChangeSpent[] =
      await this.BLK_BIENES.getAll();
    if (BLK_BIENES_ALL.length > 1) {
      if (this.chkMovBan === 'SI') {
        if (!this.TI_BANCO_NEW) {
          showAlert({
            title: 'Error',
            text: 'Se debe ingresar los datos del banco',
          });
          return;
        }
        if (!this.TI_FECHA_NEW) {
          showAlert({
            title: 'Error',
            text: 'Se debe ingresar la fecha de depósito',
          });
          return;
        } else {
          try {
            const accountMovement = await this.selectAccountMovementFilter();
            this.vNoMovimiento = accountMovement?.numberMotion;
          } catch (ex) {
            showAlert({
              title: 'Error',
              text: 'Se debe ingresar una fecha de depósito válida',
            });
            return;
          }
        }
      } else {
        this.DI_MONEDA_NEW = 'MN';
        this.TI_FICHA_NEW = null;
        this.TI_BANCO_NEW = null;
        this.TI_FECHA_NEW = null;
        this.DI_CUENTA_NEW = null;
        this.DI_NO_CUENTA_DEPOSITO = null;
        this.DI_CATEGORIA = null;
        this.DI_NO_MOVIMIENTO = null;
      }
      this.vestatus_ant = 'CNE';
      this.vestatus_nue = 'ADM';
      if (this.DI_MONEDA_NEW === 'MN') {
        this.v_clasif_bien = 1424;
      } else {
        this.v_clasif_bien = 1426;
      }
      // this.vBAN = false;
      this.vBAN = BLK_BIENES_ALL.some(element => element.indNume == 2);
      if (this.vBAN) {
        this.vCHECA = (
          await showQuestion({
            title: 'Confirmación',
            text: 'Se Actualizan los importes de los numerarios en ADM sin conciliar?',
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',
          })
        ).isConfirmed;
      }
      /**TODO: Esperando respuesta del backend  */
      // BLK_BIENES_ALL.forEach(async element => {
      //   this.vVALIDA_ESTATUS = 0;

      //   try {
      //     try {
      //     } catch (ex) {
      //       console.log(ex);
      //     }
      //   } catch (ex) {
      //     console.log(ex);
      //   }
      // });
    }
  }

  async selectAccountMovementFilter(): Promise<IAccountMovement> {
    const params = {
      'filter.dateMotion': this.TI_FECHA_NEW,
      'filter.numberAccount': this.DI_NO_CUENTA_DEPOSITO,
      'filter.isFileDeposit': 'S',
      'filter.numberGood': SearchFilter.NULL,
      limit: 1,
    };
    const result = await firstValueFrom(
      this.accountMovementService
        .getAllFiltered(params)
        .pipe(map(res => res?.data[0]))
    );
    return result;
  }
}
