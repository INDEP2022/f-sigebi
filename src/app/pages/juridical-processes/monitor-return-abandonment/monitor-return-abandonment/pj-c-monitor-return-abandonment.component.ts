/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-c-monitor-return-abandonment',
  templateUrl: './pj-c-monitor-return-abandonment.component.html',
  styleUrls: ['./pj-c-monitor-return-abandonment.component.scss'],
})
export class PJMonitorReturnAbandonmentComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  // Table settings
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
      noBien: { title: 'No Bien' },
      descripcion: { title: 'Descripción' },
      cantidad: { title: 'Cantidad' },
      motivoAbandono: { title: 'Motivo Abandono' },
      vencimientoUltimaNotificacion: {
        title: 'Vencimiento Ultima Notificación',
      },
      fechaNotificacion: { title: 'Fecha Notificación' },
      obervacionesAbandono: { title: 'Observaciones Abandono' },
      fechaRatificacionJudicial: { title: 'Fecha Ratificación Judicial' },
    },
  };
  // Data table
  dataTable = [
    {
      noBien: 'DATA',
      descripcion: 'DATA',
      cantidad: 'DATA',
      motivoAbandono: 'DATA',
      vencimientoUltimaNotificacion: 'DATA',
      fechaNotificacion: 'DATA',
      obervacionesAbandono: 'DATA',
      fechaRatificacionJudicial: 'DATA',
    },
  ];

  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      diEstatusBien: '',
    });
  }

  public btnDeclaracion() {
    console.log('btnDeclaracion');
  }
}
