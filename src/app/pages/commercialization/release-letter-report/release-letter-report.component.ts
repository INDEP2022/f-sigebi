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
      evento: [17, [Validators.required]],
      lote: [25, [Validators.required]],
      oficio: [
        'E-784555',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      diridoA: [
        'Administrador',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      puesto: [
        'Director',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      parrafo1: [
        'Convocatoria',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      adjudicatorio: [
        'Convocatoria',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      factura: ['254182', [Validators.required]],
      fechaFactura: ['20/11/2022', [Validators.required]],
      parrafo2: [
        'E-45155',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      firmante: [
        'indepCorp',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ccp1: [
        '20122',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ccp2: [
        '78455',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  confirm(): void {
    console.log(this.form.value);

    /*
        let entidadades = [
      {
        id: 1,
        etapaEdo: 1252,
        cveState: 'Nayarit',
        description: 'Nayarit',
        addressOffice: 'Nayarit',
        regionalDelegate: 'Nayarit',
        city: 'Nayarit',
        status: 1,
        iva: 12,
        noRegister: 12145,
        zoneContractCVE: 2454,
        zoneVigilanceCVE: 12454,
        diffHours: 5145451,
        idZoneGeographic: 122,
      },
      {
        id: 2,
        etapaEdo: 1252,
        cveState: 'Nuevo León',
        description: 'Nuevo León',
        addressOffice: 'Nuevo León',
        regionalDelegate: 'Nuevo León',
        city: 'Nuevo León',
        status: 1,
        iva: 12,
        noRegister: 12145,
        zoneContractCVE: 2454,
        zoneVigilanceCVE: 12454,
        diffHours: 5145451,
        idZoneGeographic: 122,
      },
      {
        id: 3,
        etapaEdo: 1252,
        cveState: 'Oaxaca',
        description: 'Oaxaca',
        addressOffice: 'Oaxaca',
        regionalDelegate: 'Oaxaca',
        city: 'Oaxaca',
        status: 1,
        iva: 12,
        noRegister: 12145,
        zoneContractCVE: 2454,
        zoneVigilanceCVE: 12454,
        diffHours: 5145451,
        idZoneGeographic: 122,
      },
      {
        id: 4,
        etapaEdo: 1252,
        cveState: 'Sinaloa',
        description: 'Sinaloa',
        addressOffice: 'Sinaloa',
        regionalDelegate: 'Sinaloa',
        city: 'Sinaloa',
        status: 1,
        iva: 12,
        noRegister: 12145,
        zoneContractCVE: 2454,
        zoneVigilanceCVE: 12454,
        diffHours: 5145451,
        idZoneGeographic: 122,
      },
    ];
        let params = {
          PN_DELEG: this.flyersForm.controls['delegation'].value,
          PN_SUBDEL: this.flyersForm.controls['subdelegation'].value,
          PF_FECINI: this.flyersForm.controls['from'].value,
          PF_FECFIN: this.flyersForm.controls['to'].value,
          PC_ENTFED: this.flyersForm.controls['entidad'].value,
          PARAMFORM: this.flyersForm.controls['includeArea'].value,
          PN_DELEGACION: this.flyersForm.controls['delegdestino'].value,
          PN_SUBDELEGACION: this.flyersForm.controls['subddestino'].value,
          PN_DEPARTAMENTO: this.flyersForm.controls['area'].value,
        };
        */

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

    window.open(pdfurl, 'FCOMERCARTALIB.pdf');
    this.loading = false;
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
