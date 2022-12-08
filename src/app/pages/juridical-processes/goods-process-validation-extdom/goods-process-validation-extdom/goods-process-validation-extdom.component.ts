/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-goods-process-validation-extdom',
  templateUrl: './goods-process-validation-extdom.component.html',
  styleUrls: ['./goods-process-validation-extdom.component.scss'],
})
export class GoodsProcessValidationExtdomComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: { title: 'No. Bien' }, //*
      descripcion: { title: 'Descripción' },
      unidad: { title: 'Unidad' },
      cantidad: { title: 'Cantidad' },
      estatus: { title: 'Estatus' },
      proceso: { title: 'Proceso' },
    },
  };
  // Data table
  dataTable = [
    {
      noBien: 'No. Bien',
      descripcion: 'Descripción',
      unidad: 'Unidad',
      cantidad: 'Cantidad',
      estatus: 'Estatus',
      proceso: 'Proceso',
    },
  ];

  tableSettings2 = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: { title: 'No. Bien' }, //*
      descripcion: { title: 'Descripción' },
      unidad: { title: 'Unidad' },
      cantidad: { title: 'Cantidad' },
      estatus: { title: 'Estatus' },
      proceso: { title: 'Proceso' },
    },
  };
  // Data table
  dataTable2 = [
    {
      noBien: 'No. Bien',
      descripcion: 'Descripción',
      unidad: 'Unidad',
      cantidad: 'Cantidad',
      estatus: 'Estatus',
      proceso: 'Proceso',
    },
  ];

  tableSettingsHistorico = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: { title: 'No. Bien' }, //*
      fechaCambio: { title: 'Fecha Cambio' },
      usuarioCambio: { title: 'Usuario Cambio' },
      folioUnivCambio: { title: 'Folio Univ Cambio' },
      fechaLibera: { title: 'Fecha Libera' },
      usuarioLibera: { title: 'Usuario Libera' },
      folioUnivLibera: { title: 'Folio Univ Libera' },
    },
  };
  // Data table
  dataTableHistorico = [
    {
      noBien: 'No. Bien',
      fechaCambio: 'Fecha Cambio',
      usuarioCambio: 'Usuario Cambio',
      folioUnivCambio: 'Folio Univ Cambio',
      fechaLibera: 'Fecha Libera',
      usuarioLibera: 'Usuario Libera',
      folioUnivLibera: 'Folio Univ Libera',
    },
  ];
  public listadoHistorico: boolean = false;

  public form: FormGroup;
  public formEscaneo: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: ['', [Validators.required]], //*
      noVolante: ['', [Validators.required]], //*
      fechaRecepcion: '',
      noExpedienteTransferente: '',
      cveOficioExterno: '',
      fechaOficioExterno: '',
      remitenteExterno: '',
      cveAmparo: '',
      cveTocaPenal: '',
      actaCircunstanciada: '',
      averiguacionPrevia: '',
      causaPenal: '',
      asunto: '', // extenso
      indiciado: '', // extenso
      ministerioPublico: '', // extenso
      juzgado: '', // extenso
      delegacion: '', // extenso
      entidadFederativa: '', // extenso
      ciudad: '', // extenso
      transferente: '', // extenso
      emisora: '', // extenso
      autoridad: '', // extenso
    });
    this.formEscaneo = this.fb.group({
      folioEscaneo: '',
    });
  }

  btnAgregar() {
    console.log('Agregar');
  }

  btnEliminar() {
    console.log('Eliminar');
  }
  btnEjecutarCambios() {
    console.log('EjecutarCambios');
  }

  btnConsultarHistorico() {
    console.log('ConsultarHistorico');
    this.listadoHistorico = true;
  }

  btnSalir() {
    console.log('Salir');
    this.listadoHistorico = false;
  }
}
