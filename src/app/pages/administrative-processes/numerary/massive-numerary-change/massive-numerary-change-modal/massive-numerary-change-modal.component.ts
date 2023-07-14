import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, firstValueFrom, map, skip } from 'rxjs';
import { showQuestion } from 'src/app/common/helpers/helpers';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IMassiveNumeraryGood } from '../types/massive-numerary.type';
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
  title: string = 'Bienes';
  form: FormGroup;
  settings2 = {
    ...this.settings,
    actions: false,
    hideSubHeader: false,
    pager: {
      perPage: 10,
    },
  };
  dataTableGoods: IMassiveNumeraryGood[] = [];
  dataTableGoodsLocal = new LocalDataSource([]);
  dataTableSpents: any[] = [];
  dataTableSpentsLocal = new LocalDataSource([]);
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsSpent = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsSpent = 0;
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
      hideSubHeader: false,
      pager: {
        perPage: 10,
      },
    };
    this.settings2.columns = WIN_BIENES_MODAL_COLUMNS;
  }

  ngOnInit(): void {
    this.dataTableGoods = this.dataTableGoods.map(item => {
      return {
        ...item,
        entry: (item?.entry?.toFixed(2) || item) as any,
      };
    });
    this.dataTableGoodsLocal.load(this.dataTableGoods);
    this.dataTableSpentsLocal.load(this.dataTableSpents);
    this.totalItems = this.dataTableGoods.length;
    this.totalItemsSpent = this.dataTableSpents.length;
    this.params.pipe(skip(1)).subscribe(params => {
      this.dataTableGoodsLocal.setPaging(params.page, params.limit);
    });
    this.paramsSpent.pipe(skip(1)).subscribe(params => {
      console.log(params);
      this.dataTableSpentsLocal.setPaging(params.page, params.limit);
    });
  }
  close() {
    this.modalRef.hide();
  }

  getGood(id: number | string) {
    return firstValueFrom(
      this.goodServices.getAll(`?filter.id=${id}`).pipe(
        map(res => {
          const good = res.data[0];
          return {
            V_DESC_NUM: good?.description,
            V_ESTATUS_NUM: good?.status,
            V_MONEDA_NUM: good?.val1,
            V_INGRESO_NUM: good?.val2,
            V_IVA_NUM: good?.val10,
            V_GASTO_NUM: good?.val13,
            V_VALOR_AVALUO_NUM: good?.appraisedValue,
          };
        })
      )
    );
  }

  async onClickArchoNumeraryConc() {
    try {
      let V_DESC_NUM: any = null;
      let V_ESTATUS_NUM: any = null;
      let V_MONEDA_NUM: any = null;
      let V_INGRESO_NUM: any = null;
      let V_IVA_NUM: any = null;
      let V_GASTO_NUM: any = null;
      let V_VALOR_AVALUO_NUM: any = null;

      let rowsExcel: any[] = [];
      if (this.dataTableGoods.length > 0) {
        const promiseAll = this.dataTableGoods.map(async good => {
          if (good.indNume == 3) {
            try {
              const goodSearch = await this.getGood(good.npNUm);
              V_DESC_NUM = goodSearch.V_DESC_NUM;
              V_ESTATUS_NUM = goodSearch.V_ESTATUS_NUM;
              V_MONEDA_NUM = goodSearch.V_MONEDA_NUM;
              V_INGRESO_NUM = goodSearch.V_INGRESO_NUM;
              V_IVA_NUM = goodSearch.V_IVA_NUM;
              V_GASTO_NUM = goodSearch.V_GASTO_NUM;
              V_VALOR_AVALUO_NUM = goodSearch.V_VALOR_AVALUO_NUM;
            } catch (error) {
              V_DESC_NUM = null;
              V_ESTATUS_NUM = null;
              V_MONEDA_NUM = null;
              V_INGRESO_NUM = null;
              V_IVA_NUM = null;
              V_GASTO_NUM = null;
              V_VALOR_AVALUO_NUM = null;
            }

            rowsExcel.push({
              NO_BIEN: good.noGood,
              DESCRIPCION: good.description,
              ESTATUS: good.status,
              INGRESO: good.entry,
              GASTO: good.costs,
              IVA: good.tax,
              VALOR_CALC: good.impNumerary,
              NO_BIEN_NUM: good.npNUm,
              DESCRIPCION_NUM: V_DESC_NUM,
              ESTATUS_NUM: V_ESTATUS_NUM,
              CVE_EVENTO: good.cveEvent,
              MONEDA_NUM: V_MONEDA_NUM,
              INGRESO_NUM: V_INGRESO_NUM,
              IVA_NUM: V_IVA_NUM,
              GASTO_NUM: V_GASTO_NUM,
              VALOR_AVALUO_NUM: V_VALOR_AVALUO_NUM,
            });
          }
        });
        await Promise.all(promiseAll);
      }

      if (rowsExcel.length > 0) {
        this.excelService.export(rowsExcel, {
          type: 'csv',
          filename: 'hoja1',
        });
      } else {
        this.alert(
          'warning',
          'Advertencia',
          'Con estos datos no se puede generar el archivo de excel.'
        );
      }
    } catch (error) {
      // WHEN NO_DATA_FOUND THEN
      this.onLoadToast(
        'warning',
        '',
        'No se puede copiar el archivo de excel.'
      );
      //    END;
    }
    // END;
  }

  user: string;
  chkMovBan = false;
  DI_MONEDA_NEW = '';
  TI_FICHA_NEW = '';
  TI_BANCO_NEW = '';
  TI_FECHA_NEW = '';
  DI_CUENTA_NEW = '';
  DI_NO_CUENTA_DEPOSITO = '';
  DI_CATEGORIA = '';
  DI_NO_MOVIMIENTO = '';
  vestatus_ant: any;
  vestatus_nue: any;
  v_clasif_bien: number;
  vBAN: boolean;
  vCHECA: boolean;
  vVALIDA_ESTATUS: number;
  V_FEC_REG_INSERT: string;
  vNoMovimiento: any;

  async onClickGenerateNumerareis(): Promise<void> {
    const dataTableGoods: IMassiveNumeraryGood[] = this.dataTableGoods;
    if (dataTableGoods.length > 0) {
      if (this.chkMovBan) {
        if (!this.TI_BANCO_NEW) {
          this.onLoadToast('error', '', 'Se debe ingresar los datos del banco');
          return;
        }
        if (!this.TI_FECHA_NEW) {
          this.onLoadToast(
            'error',
            '',
            'Se debe ingresar la fecha de depósito'
          );
          return;
        } else {
          try {
            const accountMovement = await this.selectAccountMovementFilter();
            this.vNoMovimiento = accountMovement?.numberMotion;
          } catch (ex) {
            this.onLoadToast(
              'error',
              '',
              'Se debe ingresar una fecha de depósito válida'
            );
            return;
          }
        }
      } else {
        this.DI_MONEDA_NEW = 'MN';
        this.TI_FICHA_NEW = '';
        this.TI_BANCO_NEW = '';
        this.TI_FECHA_NEW = '';
        this.DI_CUENTA_NEW = '';
        this.DI_NO_CUENTA_DEPOSITO = '';
        this.DI_CATEGORIA = '';
        this.DI_NO_MOVIMIENTO = '';
      }
      this.vestatus_ant = 'CNE';
      this.vestatus_nue = 'ADM';
      if (this.DI_MONEDA_NEW === 'MN') {
        this.v_clasif_bien = 1424;
      } else {
        this.v_clasif_bien = 1426;
      }
      // this.vBAN = false;
      this.vBAN = dataTableGoods.some(element => element.indNume == 2);

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
      const body = {
        goodArray: dataTableGoods.map(item => {
          return {
            goodNumber: item.noGood,
            indNume: item.indNume,
            income: item.entry,
            iva: item.tax,
            appraisalValue: item.impNumerary,
            spent: item.costs,
            numeGoodNumber: item.npNUm,
            status: item.status,
            description: item.description,
            expAssocNumber: item.noExpAssociated,
            fileNumber: item.noExpedient,
            delegationNumber: item.noDelegation,
            subdelegationNumber: item.noSubDelegation,
            identifier: item.identifier,
            flyerNumber: item.noFlier,
          };
        }),
        user: this.user,
        chk_movban: this.chkMovBan,
        di_moneda_new: this.DI_MONEDA_NEW,
        ti_ficha_new: this.TI_FICHA_NEW,
        ti_banco_new: this.TI_BANCO_NEW,
        ti_fecha_new:
          this.TI_FECHA_NEW || formatDate(new Date(), 'yyyy/MM/dd', 'en'),
        di_cuenta_new: this.DI_CUENTA_NEW,
        di_no_cuenta_deposito: this.DI_NO_CUENTA_DEPOSITO,
        di_categoria: this.DI_CATEGORIA,
        di_no_movimiento: this.DI_NO_MOVIMIENTO,
      };
      this.accountMovementService.postMassNumeraryGenerate(body).subscribe({
        next: (res: any) => {
          this.alert(
            'success',
            'Operación terminada correctamente',
            'Proceso terminado'
          );
        },
        error: (err: any) => {
          this.alert('error', 'Error', 'Ocurrió un error al procesar');
        },
      });
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
