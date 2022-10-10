import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
 
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { APPRAISAL_REGISTRATION_DETAIL_COLUMNS } from './appraisal-registration-detail-columns';
import { APPRAISAL_REGISTRATION_APPRAISALS_COLUMNS } from './appraisal-registration-appraisals-columns';
import { APPRAISAL_REGISTRATION_GOODS_COLUMNS } from './appraisal-registration-goods-columns';

@Component({
  selector: 'app-c-b-a-rda-c-appraisal-registration',
  templateUrl: './c-b-a-rda-c-appraisal-registration.component.html',
  styles: [
  ]
})
export class CBARdaCAppraisalRegistrationComponent extends BasePage implements OnInit {
  
  settings1 = {...TABLE_SETTINGS};
  settings2 = {...TABLE_SETTINGS};
  settings3 = {...TABLE_SETTINGS};
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) {
    super();
    this.settings1.columns = APPRAISAL_REGISTRATION_GOODS_COLUMNS;
    this.settings1.actions.edit = false;
    this.settings1.actions.add = false;
    this.settings1.actions.delete= false;

    this.settings2.columns = APPRAISAL_REGISTRATION_APPRAISALS_COLUMNS;
    this.settings2.actions.edit = false;
    this.settings2.actions.add = false;
    this.settings2.actions.delete= false;

    this.settings3.columns = APPRAISAL_REGISTRATION_DETAIL_COLUMNS;
    this.settings3.actions.edit = false;
    this.settings3.actions.add = false;
    this.settings3.actions.delete= false;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvento: ['', [Validators.required]],
      descriptionEvent: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      observations: ['', [Validators.required]],
      appDate: ['', [Validators.required]],
      type: ['', [Validators.required]],
      status: ['', [Validators.required]],
      reference: ['', [Validators.required]],
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
      incidencia: ' '
    },
    {
      noBienes: '3651460',
      estatus: 'CPV',
      valorAvaluo: '$440,496.63',
      descripcion: 'ESCURRIDORES DE PLATOS',
      situacionJuridica: ' ',
      incidencia: ' '
    }
  ];

  //Datos de prueba de avaluos
  data2 = [
    {
      id: '32243',
      claveAvaluo: 'IEV_DIV_186_E21673',
      claveOficio: '77',
      fechaInsert: '10/09/2020',
    }
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
    }
  ];

}
