import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ALLOTMENT_COLUMNS } from './payment-dispersion-validation-allotment-columns';
import { BANK_COLUMNS } from './payment-dispersion-validation-bank-columns';
import { EVENT_COLUMNS } from './payment-dispersion-validation-event-columns';
import { RECEIVED_COLUMNS } from './payment-dispersion-validation-received-columns';

import { ExcelService } from 'src/app/common/services/exportToExcel.service';


@Component({
  selector: 'app-c-b-vdp-c-payment-dispersion-validation',
  templateUrl: './c-b-vdp-c-payment-dispersion-validation.component.html',
  styles: [
  ]
})
export class CBVdpCPaymentDispersionValidationComponent extends BasePage implements OnInit {
  settingsLotes = {...TABLE_SETTINGS};
  settingsBienes = {...TABLE_SETTINGS};
  settingsPagosBanco = {...TABLE_SETTINGS};
  settingsCompos = {...TABLE_SETTINGS};
  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder, private excelService:ExcelService) {
    super();
    this.settingsLotes.columns = EVENT_COLUMNS;
    this.settingsLotes.actions.edit = false;
    this.settingsLotes.actions.delete = false;
    this.settingsLotes.actions.add = false;

    this.settingsBienes.columns = ALLOTMENT_COLUMNS;
    this.settingsBienes.actions.edit = false;
    this.settingsBienes.actions.delete = false;
    this.settingsBienes.actions.add = false;

    this.settingsPagosBanco.columns = BANK_COLUMNS;
    this.settingsPagosBanco.actions.edit = false;
    this.settingsPagosBanco.actions.delete = false;
    this.settingsPagosBanco.actions.add = false;

    this.settingsCompos.columns = RECEIVED_COLUMNS
    this.settingsCompos.actions.edit = false;
    this.settingsCompos.actions.delete = false;
    this.settingsCompos.actions.add = false;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvento: ['', [Validators.required]],
      blackList: ['', [Validators.required]],
      refundAmount: ['', [Validators.required]],
      penaltyAmount: ['', [Validators.required]],
    });
  }

  dataLotes = [
    {
      lote: '1',
      cliente: 'FRE060601M',
      descripcion: 'DODGE RAM',
      precio: '$42,000.00',
    },
    {
      lote: '2',
      cliente: 'QUCS721008RX4',
      descripcion: 'SENTRA',
      precio: '$16,000.00',
    }
  ]
  exportAsXLSXLotes():void {
    this.excelService.exportAsExcelFile(this.dataLotes, 'lotes_de_evento');
  }

  
  dataBienes = [
    {
      noBien: '78778',
      descripcion: 'VEHICULO DODGE SUBMARIN',
      precio: '$42,000.00',
      iva: '$5,478.26'      
    },
  ]

  exportAsXLSXBienes():void {
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
      noPago: '14136'  
    },
    {
      noMov: '27',
      fecha: '10-sep-08',
      banco: 'BANAMEX',
      referencia: 'L8206340000069067L35',
      deposito: '$21,000.00',
      noOrdenIngreso: '8094',
      noPago: '14154'  
    },
  ]

  exportAsXLSXPagosBanco():void {
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
      pagoOrigen: '$14136'  
    },
    {
      referencia: 'G8206340000069067L35',
      monto: '$18,260.87',
      iva: '$2,739.13',
      noIva: '$.00',
      transferente: '820634',
      tipo: 'NORMAL',
      pagoOrigen: '$14136'  
    },
  ]

  exportAsXLSXCompos():void {
    this.excelService.exportAsExcelFile(this.dataCompos, 'Composicion_pagos_recibidos');
  }
}
