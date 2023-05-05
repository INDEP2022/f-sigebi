import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';
import { showToast } from 'src/app/common/helpers/helpers';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
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
  dataTableMain = new LocalDataSource();
  dataTableSecond = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(
    private modalRef: BsModalRef,
    // private fb: FormBuilder,
    private goodServices: GoodService,
    private excelService: ExcelService
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
      const goodMore = goodsMore.find(
        goodMore => goodMore.noGood == good.noGood
      );
      const dataMoreExcel = {
        DESCRIPCION_NUM: goodMore?.description,
        ESTATUS_NUM: goodMore?.noExpedient,
        CVE_EVENTO: good?.noExpedient,
        MONEDA_NUM: goodMore?.val1,
        INGRESO_NUM: goodMore?.val2,
        IVA_NUM: goodMore?.val10,
        GASTO_NUM: goodMore?.val13,
        VALOR_AVALUO_NUM: goodMore?.appraisedValue,
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
    const goods: IMassiveNumeraryChangeSpent[] =
      await this.dataTableMain.getAll();
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
}
