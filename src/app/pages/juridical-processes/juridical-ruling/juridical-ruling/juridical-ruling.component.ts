/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-juridical-ruling',
  templateUrl: './juridical-ruling.component.html',
  styleUrls: ['./juridical-ruling.component.scss'],
})
export class JuridicalRulingComponent
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
    },
    {
      noBien: 12345,
      description: 'UNA BOLSA',
      cantidad: 1,
      menaje: 13465,
      proceso: 'ASEGURADO',
    },
  ];

  data3 = [
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

  legalForm: FormGroup;
  subtipoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  prepareForm() {
    this.legalForm = this.fb.group({
      tipoDictaminacion: [null, [Validators.required]],
      noExpediente: [null, [Validators.required]],
      averPrevia: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      causaPenal: [null, [['', [Validators.pattern(STRING_PATTERN)]]]],
      tipo: [null],
      esPropiedad: [false],
      observaciones: [null, [['', [Validators.pattern(STRING_PATTERN)]]]],
      fecDest: [null, [Validators.required]],
      fecDicta: [null, [Validators.required]],
      autoriza: [null, [Validators.required]],
      cveOficio: [null, [Validators.required]],
      ident: [null],
      tipos: [null],
    });
    this.subtipoForm = this.fb.group({
      tipoDictaminacion: [null],
      noExpediente: [null],
    });
  }
}
