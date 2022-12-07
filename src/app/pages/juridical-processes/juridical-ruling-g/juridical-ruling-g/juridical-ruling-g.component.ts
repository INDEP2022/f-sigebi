/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DEPOSITARY_ROUTES_2 } from 'src/app/common/constants/juridical-processes/depositary-routes-2';
import {
  baseMenu,
  baseMenuDepositaria,
} from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-juridical-ruling-g',
  templateUrl: './juridical-ruling-g.component.html',
  styleUrls: ['./juridical-ruling-g.component.scss'],
})
export class JuridicalRulingGComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  data1 = [
    {
      noBien: 12345,
      description: 'UNA BOLSA',
      cantidad: 1,
      est: 'ENGD',
      proceso: 'ASEGURADO',
    },
    {
      noBien: 12345,
      description: 'UNA BOLSA',
      cantidad: 1,
      est: 'ENGD',
      proceso: 'ASEGURADO',
    },
    {
      noBien: 12345,
      description: 'UNA BOLSA',
      cantidad: 1,
      est: 'ENGD',
      proceso: 'ASEGURADO',
    },
  ];

  data2 = [
    {
      noBien: 12345,
      description: 'UNA BOLSA',
      cantidad: 1,
      menaje: 13465,
      proceso: 'ASEGURADO',
      idDestino: 12345,
    },
    {
      noBien: 12345,
      description: 'UNA BOLSA',
      cantidad: 1,
      menaje: 13465,
      proceso: 'ASEGURADO',
      idDestino: 12345,
    },
  ];

  data3 = [
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
  ];

  data4 = [
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
  ];

  settings1 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      noBien: {
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        title: 'Descripcion',
        type: 'string',
      },
      cantidad: {
        title: 'Cantidad',
        type: 'string',
      },
      ident: {
        title: 'Ident.',
        type: 'string',
      },
      est: {
        title: 'Est',
        type: 'string',
      },
      proceso: {
        title: 'Proceso',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings2 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      noBien: {
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        title: 'Descripcion Dictaminada',
        type: 'string',
      },
      menaje: {
        title: 'Menaje',
        type: 'string',
      },
      cantidad: {
        title: 'Cant. Dic..',
        type: 'string',
      },
      est: {
        title: 'Est',
        type: 'string',
      },
      proceso: {
        title: 'Proceso',
        type: 'string',
      },
      idDestino: {
        title: 'ID Destino',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings3 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      id: {
        title: '#',
        type: 'number',
      },
      documento: {
        title: 'Documentos',
        type: 'string',
      },
      fecha: {
        title: 'Fec. Recibido',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings4 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      id: {
        title: '#',
        type: 'number',
      },
      documento: {
        title: 'Documentos',
        type: 'string',
      },
      fecha: {
        title: 'Fec. Recibido',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  expedientesForm: FormGroup;
  dictaminacionesForm: FormGroup;
  subtipoForm: FormGroup;
  gestionDestinoForm: FormGroup;
  public listadoDocumentos: boolean = false;
  public rutaAprobado: string =
    baseMenu + baseMenuDepositaria + DEPOSITARY_ROUTES_2[0].link;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  prepareForm() {
    this.expedientesForm = this.fb.group({
      tipoDictaminacion: [null, [Validators.required]],
      noExpediente: [null, [Validators.required]],
      averiguacionPrevia: [null],
      causaPenal: [null],
      delito: [false],
      observaciones: [null],
    });

    this.dictaminacionesForm = this.fb.group({
      etiqueta: [null],
      fechaResolucion: [null],
      fechaNotificacion: [null],
      fechaNotificacionAseg: [null],
      cveOficio: [null],
      estatus: [null],
    });
    this.subtipoForm = this.fb.group({
      tipoDictaminacion: [null],
      noExpediente: [null],
    });
    this.gestionDestinoForm = this.fb.group({
      estatus: [null],
    });
  }
  btnDocumentos() {
    console.log('btnDocumentos');
    this.listadoDocumentos = true;
  }
  btnAprobar() {
    console.log('btnAprobar');
  }
  btnRechazar() {
    console.log('btnRechazar');
  }
  btnBorrarDictamen() {
    console.log('btnBorrarDictamen');
  }
  btnImprimeOficio() {
    console.log('btnImprimeOficio');
  }
  btnParcializar() {
    console.log('btnParcializar');
  }
  btnOficioSubstanciacion() {
    console.log('btnOficioSubstanciacion');
  }
  btnOficioRelacionado() {
    console.log('btnOficioRelacionado');
  }

  btnSalir() {
    console.log('Salir');
    this.listadoDocumentos = false;
  }
}
