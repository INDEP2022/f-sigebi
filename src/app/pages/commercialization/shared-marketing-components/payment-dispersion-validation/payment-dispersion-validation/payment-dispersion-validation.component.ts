import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { ALLOTMENT_COLUMNS } from './payment-dispersion-validation-allotment-columns';
import { BANK_COLUMNS } from './payment-dispersion-validation-bank-columns';
import { COLUMNS } from './columns';
import { RECEIVED_COLUMNS } from './payment-dispersion-validation-received-columns';

import { ExcelService } from 'src/app/common/services/excel.service';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ILot } from 'src/app/core/models/ms-lot/lot.model';

@Component({
  selector: 'app-payment-dispersion-validation',
  templateUrl: './payment-dispersion-validation.component.html',
  styles: [],
})
export class PaymentDispersionValidationComponent
  extends BasePage
  implements OnInit
{

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  lotByEvent: ILot[]=[];
  
  settingsLotes = {
    ...this.settings,
    actions: false,
  };
  settingsBienes = {
    ...this.settings,
    actions: false,
  };
  settingsPagosBanco = {
    ...this.settings,
    actions: false,
  };
  settingsCompos = {
    ...this.settings,
    actions: false,
  };
  form: FormGroup = new FormGroup({});
  show = false;

  constructor(private fb: FormBuilder, private excelService: ExcelService, private comerEventosService:ComerEventosService, private lotService:LotService ) {
    super();

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...COLUMNS },
    };

    this.settingsBienes.columns = ALLOTMENT_COLUMNS;
    this.settingsPagosBanco.columns = BANK_COLUMNS;
    this.settingsCompos.columns = RECEIVED_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      processKey: ['', []],
      address: ['', []],
    });
  }

  getEventByID(): void{
    let _id = this.form.controls['id'].value;
    this.loading = true;
    this.comerEventosService.getById(_id).subscribe(
      response => {
        //TODO: Validate Response
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.getLotEvents(response.id);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('info', 'No se encontraron registros', '');
        }

        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  getLotEvents(id: string | number):void{
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLotByIdEvent(id));
  }

  getLotByIdEvent(id?: string | number):void {
     this.loading = true;
    this.lotService.getLotbyEvent(id, this.params.value).subscribe({
      next: response => {
        this.lotByEvent = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });

  }

  
  exportAsXLSXLotes(): void {
    this.excelService.exportAsExcelFile(this.lotByEvent, 'lotes_de_evento');
  }

  dataBienes = [
    {
      noBien: '78778',
      descripcion: 'VEHICULO DODGE SUBMARIN',
      precio: '$42,000.00',
      iva: '$5,478.26',
    },
  ];

  exportAsXLSXBienes(): void {
    this.excelService.exportAsExcelFile(this.dataBienes, 'bienes_x_lote');
  }

  dataPagosBanco = [
    {
      noMov: '2',
      fecha: '10-sep-08',
      banco: 'BANAMEX',
      referencia: 'L8206340000069067L16',
      deposito: '$21,000.00',
      noOrdenIngreso: '8077',
      noPago: '14136',
    },
    {
      noMov: '27',
      fecha: '10-sep-08',
      banco: 'BANAMEX',
      referencia: 'L8206340000069067L35',
      deposito: '$21,000.00',
      noOrdenIngreso: '8094',
      noPago: '14154',
    },
  ];

  exportAsXLSXPagosBanco(): void {
    this.excelService.exportAsExcelFile(this.dataPagosBanco, 'Pagos_banco');
  }

  dataCompos = [
    {
      referencia: 'L8206340000069067L16',
      monto: '$18,260.87',
      iva: '$2,739.13',
      noIva: '$.00',
      transferente: '820634',
      tipo: 'NORMAL',
      pagoOrigen: '$14136',
    },
    {
      referencia: 'G8206340000069067L35',
      monto: '$18,260.87',
      iva: '$2,739.13',
      noIva: '$.00',
      transferente: '820634',
      tipo: 'NORMAL',
      pagoOrigen: '$14136',
    },
  ];

  exportAsXLSXCompos(): void {
    this.excelService.exportAsExcelFile(
      this.dataCompos,
      'Composicion_pagos_recibidos'
    );
  }
}
