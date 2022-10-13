import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { CONSUL_GOODS_COMMER_SALES_COLUMNS } from './consul-goods-commer-sales-columns';

import { ExcelService } from 'src/app/common/services/exportToExcel.service'; 

@Component({
  selector: 'app-c-bm-cdb-c-consultation-goods-commercial-sales',
  templateUrl: './c-bm-cdb-c-consultation-goods-commercial-sales.component.html',
  styles: [
  ]
})
export class CBmCdbCConsultationGoodsCommercialSalesComponent extends BasePage implements OnInit {

  settings = {
    ...TABLE_SETTINGS,
    actions: false
  };
  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder, private excelService:ExcelService) {
    super();
    this.settings.columns = CONSUL_GOODS_COMMER_SALES_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idSiab: ['', [Validators.required]],
      idFile: ['', [Validators.required]],
      idTrans: ['', [Validators.required]],
      idSerie: ['', [Validators.required]],
      idEvent: ['', [Validators.required]],
      allotment: ['', [Validators.required]],
      tpEvent: ['', [Validators.required]],
      coordcapt: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      client: ['', [Validators.required]],
      price: ['', [Validators.required]],
      entryOrder: ['', [Validators.required]],
      invoice: ['', [Validators.required]],
      reference: ['', [Validators.required]],
      dateFromEvent: ['', [Validators.required]],
      dateToEvent: ['', [Validators.required]],

    });
  }

  data = [
    {
      evento: '1427 - REMESA',
      lote: '12',
      expediente: '394029',
      noSiab: '794676',
      cantidad: '1 PIEZA. ESMERIL ELECTRICO MARCA HDC',
      eventoPublico: '1.00',
      lotePublico: '1491',
      estatus: 'CNE'
    },
     {
       evento: '1491 - SUBASTA ELECTRÓNICA',
       lote: '170940',
       expediente: '394029',
       noSiab: '794676',
       cantidad: '1 PIEZA. ESMERIL ELECTRICO MARCA HDC',
       eventoPublico: '',
       lotePublico: '',
       estatus: 'CNE'
     },
     {
       evento: '1491 - SUBASTA ELECTRÓNICA',
       lote: '170940',
       expediente: '394029',
       noSiab: '794676',
       cantidad: '1 PIEZA. ESMERIL ELECTRICO MARCA HDC',
       eventoPublico: '',
       lotePublico: '',
       estatus: 'CNE'
     }
   ]

   exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.data, 'ventas');
  }

}
