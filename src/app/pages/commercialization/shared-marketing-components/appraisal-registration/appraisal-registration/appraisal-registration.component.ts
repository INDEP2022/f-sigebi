import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

import { APPRAISAL_REGISTRATION_APPRAISALS_COLUMNS } from './appraisal-registration-appraisals-columns';
import { APPRAISAL_REGISTRATION_DETAIL_COLUMNS } from './appraisal-registration-detail-columns';
import { APPRAISAL_REGISTRATION_GOODS_COLUMNS } from './appraisal-registration-goods-columns';

@Component({
  selector: 'app-appraisal-registration',
  templateUrl: './appraisal-registration.component.html',
  styles: [],
})
export class AppraisalRegistrationComponent extends BasePage implements OnInit {
  settings1 = {
    ...this.settings,
    actions: false,
  };
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
    this.settings1.columns = APPRAISAL_REGISTRATION_GOODS_COLUMNS;
    this.settings2.columns = APPRAISAL_REGISTRATION_APPRAISALS_COLUMNS;
    this.settings3.columns = APPRAISAL_REGISTRATION_DETAIL_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvento: ['', [Validators.required]],
      descriptionEvent: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      eventDate: ['', [Validators.required]],
      observations: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      appDate: ['', [Validators.required]],
      type: ['', [Validators.required]],
      status: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      reference: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeEvent: ['', [Validators.required]],
    });
  }

  //Datos de prueba de bienes
  data1 = [
    {
      noBienes: '3651459',
      estatus: 'CPV',
      valorAvaluo: '$369,553.18',
      descripcion: 'ESCURRIDORES DE PLATOS',
      situacionJuridica: ' ',
      incidencia: ' ',
    },
    {
      noBienes: '3651460',
      estatus: 'CPV',
      valorAvaluo: '$440,496.63',
      descripcion: 'ESCURRIDORES DE PLATOS',
      situacionJuridica: ' ',
      incidencia: ' ',
    },
  ];

  //Datos de prueba de avaluos
  data2 = [
    {
      id: '32243',
      claveAvaluo: 'IEV_DIV_186_E21673',
      claveOficio: '77',
      fechaInsert: '10/09/2020',
    },
  ];

  //Datos de prueba de detalles de avaluo
  data3 = [
    {
      no: '1',
      noBien: '3651460',
      descripcion: 'ESCURRIDORES DE PLATOS',
      estatus: 'CPV',
      clasif: '1365',
      sub3tipo: 'ARTICULOS',
      sub2tipo: 'REFACCIONES',
      subTipo: 'REFACCIONES',
    },
    {
      no: '2',
      noBien: '3651459',
      descripcion: 'ESCURRIDORES DE PLATOS (MERCANCIA PESADA)',
      estatus: 'CPV',
      clasif: '1365',
      sub3tipo: 'ARTICULOS',
      sub2tipo: 'REFACCIONES',
      subTipo: 'REFACCIONES',
    },
  ];
}
