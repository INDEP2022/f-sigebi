import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

export interface IReport {
  data: File;
}

@Component({
  selector: 'app-release-letter-report',
  templateUrl: './release-letter-report.component.html',
  styleUrls: ['release-letter-report.component.scss'],
})
export class ReleaseLetterReportComponent extends BasePage implements OnInit {
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

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      evento: [null, [Validators.required]],
      lote: [null, [Validators.required]],
      oficio: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      diridoA: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      puesto: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      parrafo1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      adjudicatorio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      factura: [null, [Validators.required]],
      fechaFactura: [null, [Validators.required]],
      parrafo2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      firmante: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ccp1: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      ccp2: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
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

    window.open(pdfurl, 'FCOMERCARTARESP_I.pdf');
    this.loading = false;
    this.cleanForm();
  }

  Generar() {
    this.reportService.getReportDiario(this.form.value).subscribe({
      next: (resp: any) => {
        if (resp.file.base64 !== '') {
          this.preview(resp.file.base64);
        } else {
          this.onLoadToast(
            'warning',
            'advertencia',
            'Sin datos para los rangos de fechas suministrados'
          );
        }

        return;
      },
    });
  }
  cleanForm(): void {
    this.form.reset();
  }
  preview(file: IReport) {
    try {
      this.reportService.download(file).subscribe(response => {
        if (response !== null) {
          let blob = new Blob([response], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL);
        }
      });
    } catch (e) {
      console.error(e);
    }
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
