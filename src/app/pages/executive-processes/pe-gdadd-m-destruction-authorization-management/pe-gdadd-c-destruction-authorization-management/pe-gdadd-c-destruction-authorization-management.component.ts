import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { GOODS_COLUMNS } from './destruction-authorization-management-goods-columns';

import { PROCEEDINGS_COLUMNS } from './destruction-authorization-management-proceedings-columns';
import { RULINGS_COLUMNS } from './destruction-authorization-management-rulings-columns';

@Component({
  selector: 'app-pe-gdadd-c-destruction-authorization-management',
  templateUrl:
    './pe-gdadd-c-destruction-authorization-management.component.html',
  styles: [],
})
export class PeGdaddCDestructionAuthorizationManagementComponent
  extends BasePage
  implements OnInit
{
  settings2 = {
    ...this.settings,
    actions: false,
  };
  settings3 = {
    ...this.settings,
    actions: false,
  };
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...GOODS_COLUMNS },
    };
    this.settings2.columns = RULINGS_COLUMNS;
    this.settings3.columns = PROCEEDINGS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noAuth: [
        '',
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      requesOffice: ['', [Validators.required]],
      requesScop: ['', [Validators.required]],
      recepDate: ['', [Validators.required]],
      scopDate: ['', [Validators.required]],
      inteDate: ['', [Validators.required]],
      scanFolio: ['', [Validators.required]],
      observations: ['', [Validators.required]],
    });
  }

  dataActRec = [
    {
      actasRecepcion: 'RT/AGA/ADM/DRBC/00254/17/12',
    },
    {
      actasRecepcion: 'RT/AGA/ADM/DRBC/00232/17/12',
    },
    {
      actasRecepcion: 'RT/AGA/ADM/TIJ/TIJ/02320/11/10',
    },
  ];

  dataDictam = [
    {
      actasRecepcion: 'DCCR/DECRO/DRBC/ATJRBC/00001/2018',
    },
    {
      actasRecepcion: 'DCCR/DECRO/DRBC/ATJRBC/00002/2018',
    },
    {
      actasRecepcion: 'DCCR/DECRO/DRBC/ATJRBC/00003/2018',
    },
  ];

  dataNoBien = [
    {
      noBien: 85431,
      descripcion: 'ROLLO DE PAPEL',
      cantidad: 1,
      ofsol: 'DCCR/DECRO/DRBC/ATJRBC/00001/2018',
    },

    {
      noBien: 3051053,
      descripcion: 'DISCOS EN FORMATO CD Y DVD',
      cantidad: 98,
      ofsol: 'DCCR/DECRO/DRBC/ATJRBC/00002/2018',
    },

    {
      noBien: 3301787,
      descripcion: 'EXHIBIDOR PUBLICITARIO',
      cantidad: 12,
      ofsol: 'DCCR/DECRO/DRBC/ATJRBC/00003/2018',
    },
  ];

  delete(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
