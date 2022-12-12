import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { RFCCURP_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-responsibility-letters-report',
  templateUrl: './responsibility-letters-report.component.html',
  styles: [],
})
export class ResponsibilityLettersReportComponent implements OnInit {
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
      oficioCartaLiberacion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      factura: [null, [Validators.required]],
      fechaFactura: [null, [Validators.required]],
      adjudicatorio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      rfc: [null, [Validators.required, Validators.pattern(RFCCURP_PATTERN)]],
      domicilio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      colonia: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegacion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      estado: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      cp: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      puesto: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      parrafo1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      parrafo2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      parrafo3: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
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
