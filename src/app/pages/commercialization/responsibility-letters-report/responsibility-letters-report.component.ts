import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import { RFCCURP_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
@Component({
  selector: 'app-responsibility-letters-report',
  templateUrl: './responsibility-letters-report.component.html',
  styles: [],
})
export class ResponsibilityLettersReportComponent
  extends BasePage
  implements OnInit
{
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

  constructor(private fb: FormBuilder) {
    super();
  }

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

  confirm(): void {
    console.log(this.form.value);

    // console.log(this.reportForm.value);

    let params = { ...this.form.value };

    for (const key in params) {
      if (params[key] === null) delete params[key];
    }

    console.log(params);
    // open the window
    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);

    //const pdfurl = `http://s29.q4cdn.com/175625835/files/doc_downloads/test.pdf`; //window.URL.createObjectURL(blob);
    const pdfurl = `https://drive.google.com/file/d/1o3IASuVIYb6CPKbqzgtLcxx3l_V5DubV/view?usp=sharing`; //window.URL.createObjectURL(blob);
    setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000);

    window.open(pdfurl, 'FCOMERCARTARESP.pdf');
    this.loading = false;
    this.cleanForm();
  }
  cleanForm(): void {
    this.form.reset();
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
