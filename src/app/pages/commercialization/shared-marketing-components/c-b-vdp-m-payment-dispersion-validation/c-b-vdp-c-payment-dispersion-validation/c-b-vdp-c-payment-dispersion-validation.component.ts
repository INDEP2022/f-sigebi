import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from 'src/app/common/services/exportToExcel.service';

@Component({
  selector: 'app-c-b-vdp-c-payment-dispersion-validation',
  templateUrl: './c-b-vdp-c-payment-dispersion-validation.component.html',
  styles: [
  ]
})
export class CBVdpCPaymentDispersionValidationComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder, private excelService:ExcelService) { }

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

  //tabla LOTES PARTICIPANTES EN EL EVENTO
  settingsLotes = {

    actions: {
      // columnTitle: 'Acciones', 
      edit: false,
      delete: false,
      add: false,
    },

    hideSubHeader: true,

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    
    columns: {
      lote: {
        title: 'Lote',
        
      },
      cliente: {
        title: 'Cliente',
        
      },
      descripcion: {
        title: 'Descripción',
        
      },
      precio: {
        title: 'Precio',
        
      },
    },
    noDataMessage: "No se encontrarón registros"
  };

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


  //tabla BIENES QUE CONFORMAN EL BIEN
  settingsBienes = {

    actions: {
      // columnTitle: 'Acciones', 
      edit: false,
      delete: false,
      add: false,
    },

    hideSubHeader: true,

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    
    columns: {
      noBien: {
        title: 'No. Bien',
        // width: '25px'
      },
      descripcion: {
        title: 'Descripción',
      },
      precio: {
        title: 'Precio',
      },
      iva: {
        title: 'IVA',
      }
    },
    noDataMessage: "No se encontrarón registros"
  };

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

  //tabla PAGOS RECIBIDOS EN EL BANCO
  settingsPagosBanco = {

    actions: {
      // columnTitle: 'Acciones', 
      edit: false,
      delete: false,
      add: false,
    },

    hideSubHeader: true,

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    
    columns: {
      noMov: {
        title: 'No. Mov.',
        // width: '25px'
      },
      fecha: {
        title: 'Fecha',
      },
      banco: {
        title: 'Banco',
      },
      referencia: {
        title: 'Referencia',
      },
      deposito: {
        title: 'Depósito',
      },
      noOrdenIngreso: {
        title: 'No. Orden ingreso',
      },
      noPago: {
        title: 'No. Pago',
      },
    },
    noDataMessage: "No se encontrarón registros"
  };

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

  //tabla COMPOSICIÓN DE COMPOS
  settingsCompos = {

    actions: {
      // columnTitle: 'Acciones', 
      edit: false,
      delete: false,
      add: false,
    },

    hideSubHeader: true,

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    
    columns: {
      referencia: {
        title: 'Referencia',
        // width: '25px'
      },
      monto: {
        title: 'Monto',
      },
      iva: {
        title: 'IVA',
      },
      noIva: {
        title: 'Monto no aplica IVA',
      },
      transferente: {
        title: 'Transferente',
      },
      tipo: {
        title: 'Pago Origen',
      },
      pagoOrigen: {
        title: 'Total',
      },
    },
    noDataMessage: "No se encontrarón registros"
  };

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
