import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { NbDialogService } from '@nebular/theme';
// import { BaseApp } from '../../../../@core/shared/base-app';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'ngx-fact-jur-dict-amas',
  templateUrl: './fact-jur-dict-amas.component.html',
  styleUrls: ['./fact-jur-dict-amas.component.scss'],
})
export class FactJurDictAmasComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  legalForm: FormGroup;
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

  constructor(
    private fb: FormBuilder
  ) //  private dialogService: NbDialogService
  {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.legalForm = this.fb.group({
      test: [null],
      tipoDictaminacion: [null, [Validators.required]],
      noExpediente: [null, [Validators.required]],
      averPrevia: [null],
      causaPenal: [null],
      esPropiedad: [false],
      observaciones: [null],
      fecDest: [null, [Validators.required]],
      fecDicta: [null, [Validators.required]],
      autoriza: [null, [Validators.required]],
      cveOficio: [null, [Validators.required]],
      ident: [null],
      tipos: [null],
    });
  }
}
