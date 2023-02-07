/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-verification-documents-confiscation',
  templateUrl: './verification-documents-confiscation.component.html',
  styleUrls: ['./verification-documents-confiscation.component.scss'],
})
export class VerificationDocumentsConfiscationComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  settingsTablaDocumentos = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      cveDocumento: {
        title: 'Cve. Documento',
        type: 'number',
      }, // 8 char
      descripcionDocumento: {
        title: 'Descripción Documento',
        type: 'text',
      }, // 100 char etiqueta
      solicitarDocumentos: {
        title: 'Solicitar Documentos',
        type: 'check',
      }, // 1 char
    },
    noDataMessage: 'No se encontrarón registros',
  };
  dataTablaDocumentos = [
    {
      cveDocumento: '123456', // 8 char
      descripcionDocumento: 'Descripcion Documento', // 100 char etiqueta
      solicitarDocumentos: '1', // 1 char
    },
    {
      cveDocumento: '123456', // 8 char
      descripcionDocumento: 'Descripcion Documento', // 100 char etiqueta
      solicitarDocumentos: '1', // 1 char
    },
  ];

  settingsDocumentos = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      cveDocumento: {
        title: 'Cve. Documento',
        type: 'number',
      }, // 8 char
      descripcionDocumento: {
        title: 'Descripción Documento',
        type: 'text',
      }, // 100 char etiqueta
      fechaRecibo: {
        title: 'Fecha Recibo',
        type: 'date',
      }, // 30 char
      estatusDocumentos: {
        title: 'Estatus Documentos',
        type: 'text',
      }, // 30 char
      solicitarDocumentos: {
        title: 'Solicitar Documentos',
        type: 'check',
      }, // 1 char
    },
    noDataMessage: 'No se encontrarón registros',
  };
  dataDocumentos = [
    {
      cveDocumento: '123456', // 8 char
      descripcionDocumento: 'Descripcion Documento', // 100 char etiqueta
      fechaRecibo: '04/11/2022', // 30 char
      estatusDocumentos: 'proceso', // 30 char
      solicitarDocumentos: '1', // 1 char
    },
    {
      cveDocumento: '123456', // 8 char
      descripcionDocumento: 'Descripcion Documento', // 100 char etiqueta
      fechaRecibo: '04/11/2022', // 30 char
      estatusDocumentos: 'proceso', // 30 char
      solicitarDocumentos: '1', // 1 char
    },
  ];

  public listadoDocumentos: boolean = false;
  public tablaDocumentos: boolean = false;
  expedientesForm: FormGroup;
  bienesForm: FormGroup;
  reporteHistorialForm: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  prepareForm() {
    this.expedientesForm = this.fb.group({
      articuloValidado: ['', [Validators.maxLength(1)]], // 1 char
      fechaDictamina: ['', [Validators.maxLength(10)]], // 10 date
      fechaMinisterial: ['', [Validators.maxLength(10)]], // 10 date
      actaMinisterial: [
        '',
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ], // 30 char
      noExpediente: ['', [Validators.required, Validators.maxLength(11)]], // 11 required number
      fechaDecomisoDictaminacion: ['', [Validators.maxLength(30)]], // 30 char
      causaPenal: [
        '',
        [Validators.maxLength(40), Validators.pattern(STRING_PATTERN)],
      ], //40 char
      averiguacionPrevia: [
        '',
        [Validators.maxLength(40), Validators.pattern(STRING_PATTERN)],
      ], // 40 char
    });
    this.bienesForm = this.fb.group({
      fechaDictaminacion: ['', [Validators.maxLength(10)]], // 10 date
      noExpediente: ['', [Validators.maxLength(10)]], // 10 number
      noBien: ['', [Validators.maxLength(11)]], //11 number
      estatus: [
        '',
        [Validators.maxLength(3), Validators.pattern(STRING_PATTERN)],
      ], //3 char
      estatusDescripcion: [
        '',
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ], // 100 char
      descripcion: [
        '',
        [Validators.maxLength(600), Validators.pattern(STRING_PATTERN)],
      ], // 600 char
      situacionBien: [
        '',
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ], //30 char
      observaciones: [
        '',
        [Validators.maxLength(1000), Validators.pattern(STRING_PATTERN)],
      ], // 1000 char
      proceso: [
        '',
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ], // 30 char
      autoridadOrdenaDictamen: [
        '',
        [Validators.maxLength(200), Validators.pattern(STRING_PATTERN)],
      ], // 200 char
      aprobarDictamen: [
        '',
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ], // 30 char
      disponible: ['', [Validators.maxLength(2)]], // 2 char
      noRegistro: ['', [Validators.maxLength(40)]], // 40 char
    });
    this.reporteHistorialForm = this.fb.group({
      noExpediente: ['', [Validators.maxLength(10)]], // 10 char
      noBien: ['', [Validators.maxLength(10)]], // 10 char
    });
  }

  btnAprobar() {
    console.log('btnAprobar');
  }
  btnRechazar() {
    console.log('btnRechazar');
  }
  btnParcializar() {
    console.log('btnParcializar');
  }
  btnHistorial() {
    console.log('btnHistorial');
    this.listadoDocumentos = true;
  }
  btnProceso() {
    console.log('btnProceso');
    this.tablaDocumentos = true;
  }
  btnGenerarReporte() {
    console.log('btnGenerarReporte');
  }
  btnSalir() {
    console.log('Salir');
    this.listadoDocumentos = false;
  }
  btnSalirTabla() {
    console.log('btnSalirTabla');
    this.tablaDocumentos = false;
  }
}
