/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-d-ne-c-notifications-file',
  templateUrl: './pj-d-ne-c-notifications-file.component.html',
  styleUrls: ['./pj-d-ne-c-notifications-file.component.scss'],
})
export class PJDNENotificationsFileComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noVolante: { title: 'No. Volante' },
      fechaCaptura: { title: 'Fecha de Captura' },
      fechaRecepcion: { title: 'Fecha de Recepción' },
      noOficio: { title: 'No. Oficio' },
      asunto: { title: 'Asunto' },
      observaciones: { title: 'Observaciones' },
      cveAmparo: { title: 'Cve. Amparo' },
      areaDestino: { title: 'Ärea Destino' },
    },
  };
  // Data table
  dataTable = [
    {
      noVolante: 'DATA',
      fechaCaptura: 'DATA',
      fechaRecepcion: 'DATA',
      noOficio: 'DATA',
      asunto: 'DATA',
      observaciones: 'DATA',
      cveAmparo: 'DATA',
      areaDestino: 'DATA',
    },
  ];
  public form: FormGroup;

  constructor(private fb?: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: '',
      causaPenal: '',
      averiguacionPrevia: '',
    });
  }
  btnGenerarReporte() {
    console.log('GenerarReporte');
  }
}
