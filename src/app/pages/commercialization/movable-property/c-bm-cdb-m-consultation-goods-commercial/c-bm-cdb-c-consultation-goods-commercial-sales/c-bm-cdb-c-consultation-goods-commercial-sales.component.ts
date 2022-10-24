import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import { CONSUL_GOODS_COMMER_SALES_COLUMNS } from './consul-goods-commer-sales-columns';

import { ExcelService } from 'src/app/common/services/excel.service';

@Component({
  selector: 'app-c-bm-cdb-c-consultation-goods-commercial-sales',
  templateUrl:
    './c-bm-cdb-c-consultation-goods-commercial-sales.component.html',
  styles: [],
})
export class CBmCdbCConsultationGoodsCommercialSalesComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  selectedGood: any = null;
  goodItems = new DefaultSelect();

  constructor(private fb: FormBuilder, private excelService: ExcelService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...CONSUL_GOODS_COMMER_SALES_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGoods({ inicio: 1, text: '' });
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: ['', [Validators.required]],
      // evento: [null, [Validators.required]],
      // lote: [null, [Validators.required]],
      // expediente: [null, [Validators.required]],
      // noSiab: [null, [Validators.required]],
      // cantidad: [null, [Validators.required]],
      // eventoPublico: [null, [Validators.required]],
      // lotePublico: [null, [Validators.required]],
      // estatus: [null, [Validators.required]],
      // idTrans: [null, [Validators.required]],
      // idSerie: [null, [Validators.required]],
    });
  }

  datatable = [
    {
      evento: '1427 - REMESA',
      lote: '12',
      expediente: '394029',
      noSiab: '794676',
      cantidad: '1 PIEZA. ESMERIL ELECTRICO MARCA HDC',
      eventoPublico: '1.00',
      lotePublico: '1491',
      estatus: 'CNE',
    },
    {
      evento: '1491 - SUBASTA ELECTRÓNICA',
      lote: '170940',
      expediente: '394029',
      noSiab: '794676',
      cantidad: '1 PIEZA. ESMERIL ELECTRICO MARCA HDC',
      eventoPublico: '',
      lotePublico: '',
      estatus: 'CNE',
    },
    {
      evento: '1491 - SUBASTA ELECTRÓNICA',
      lote: '170940',
      expediente: '394029',
      noSiab: '794676',
      cantidad: '1 PIEZA. ESMERIL ELECTRICO MARCA HDC',
      eventoPublico: '',
      lotePublico: '',
      estatus: 'CNE',
    },
  ];

  data: any = [
    {
      id: 1427,
      noSiab: 987,
      expediente: 321,
      idTrans: 147,
      idSerie: 8452,
      lote: 32147,
      evento: 'PREPARACIÓN',
      coordcapt: 'CDMX',
      rfc: 'XOXO001122',
      client: 'MIGUEL',
      price: '$12,321.00',
      entryOrder: 'PREPARACIÓN',
      reference: 'Referencia01',
      dateFromEvent: '10-10-2020',
      dateToEvent: '10-10-2022',
    },
    {
      id: 874,
      noSiab: 15498,
      expediente: 9842,
      idTrans: 17963,
      idSerie: 247,
      lote: 10,
      evento: 'SUBASTA',
      coordcapt: 'HERMOSILLO',
      rfc: 'XOXO321121',
      client: 'ARTURO',
      price: '$410.00',
      entryOrder: 'SUBASTA02',
      reference: 'Referencia02',
      dateFromEvent: '01-02-2010',
      dateToEvent: '15-08-2015',
    },
    {
      id: 1431,
      noSiab: 114,
      expediente: 9014,
      idTrans: 7401,
      idSerie: 6021,
      lote: 90406,
      evento: 'REMESAS',
      coordcapt: 'TIJUANA',
      rfc: 'XOXO310597',
      client: 'PEDRO',
      price: '$100,151.00',
      entryOrder: 'REMESAS3',
      reference: 'Referencia03',
      dateFromEvent: '15-06-2018',
      dateToEvent: '31-05-2020',
    },
  ];

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.data, 'ventas');
  }

  getGoods(params: ListParams) {
    if (params.text == '') {
      this.goodItems = new DefaultSelect(this.data, 3);
    } else {
      const id = parseInt(params.text);
      const item = [this.data.filter((i: any) => i.id == id)];
      this.goodItems = new DefaultSelect(item[0], 1);
    }
  }

  selectGood(event: any) {
    this.selectedGood = event;
  }
}
