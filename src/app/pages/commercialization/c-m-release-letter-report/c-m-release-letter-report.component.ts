import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';

@Component({
  selector: 'app-c-m-release-letter-report',
  templateUrl: './c-m-release-letter-report.component.html',
  styleUrls: ['c-m-release-letter-report.component.scss'],
})
export class CMReleaseLetterReportComponent implements OnInit {
  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      description: {
        title: 'Descripcion',
        type: 'string',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  data = EXAMPLE_DATA;
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      evento: [null, [Validators.required]],
      lote: [null, [Validators.required]],
      oficio: [null, [Validators.required]],
      diridoA: [null, [Validators.required]],
      puesto: [null, [Validators.required]],
      parrafo1: [null, [Validators.required]],
      adjudicatorio: [null, [Validators.required]],
      factura: [null, [Validators.required]],
      fechaFactura: [null, [Validators.required]],
      parrafo2: [null, [Validators.required]],
      firmante: [null, [Validators.required]],
      ccp1: [null, [Validators.required]],
      ccp2: [null, [Validators.required]],
    });
  }
}

const EXAMPLE_DATA = [
  {
    description: 'descripcion',
  },
  {
    description: 'descripcion',
  },
  {
    description: 'descripcion',
  },
  {
    description: 'descripcion',
  },
  {
    description: 'descripcion',
  },
  {
    description: 'descripcion',
  },
  {
    description: 'descripcion',
  },
  {
    description: 'descripcion',
  },
];
