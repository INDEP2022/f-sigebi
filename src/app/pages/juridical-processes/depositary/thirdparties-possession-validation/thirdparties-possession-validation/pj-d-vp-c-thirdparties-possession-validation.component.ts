/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-d-vp-c-thirdparties-possession-validation',
  templateUrl: './pj-d-vp-c-thirdparties-possession-validation.component.html',
  styleUrls: ['./pj-d-vp-c-thirdparties-possession-validation.component.scss'],
})
export class PJDVPThirdpartiesPossessionValidationComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  // Table settings
  tableSettingsNotificaciones = {
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
      fecCaptura: { title: 'Fec. Captura' },
      cveOficioExterno: { title: 'Cve. Oficio Externo' },
      fecOficioExterno: { title: 'Fec. Oficio Externo' },
      remitenteExterno: { title: 'Remitente externo' },
      cveAmparo: { title: 'Cve. Amparo' },
      cveTocaPenal: { title: 'Cve. Toca Penal' },
      actaCircunstanciada: { title: 'Acta Circunstanciada' },
      averiguacionPrevia: { title: 'Averiguación Previa' },
      causaPenal: { title: 'Causa Penal' },
    },
  };
  // Data table
  dataTableNotificaciones = [
    {
      noVolante: 'DATA',
      fecCaptura: 'DATA',
      cveOficioExterno: 'DATA',
      fecOficioExterno: 'DATA',
      remitenteExterno: 'DATA',
      cveAmparo: 'DATA',
      cveTocaPenal: 'DATA',
      actaCircunstanciada: 'DATA',
      averiguacionPrevia: 'DATA',
      causaPenal: 'DATA',
    },
  ];

  // Table settings
  tableSettingsBienes = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: { title: 'No. Bien' },
      estatus: { title: 'Estatus' },
      descripcion: { title: 'Descripción' },
    },
  };
  // Data table
  dataTableBienes = [
    {
      noBien: 'DATA',
      estatus: 'DATA',
      descripcion: 'DATA',
    },
  ];

  // Table settings
  tableSettingsBienesOficio = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: { title: 'No. Bien' },
      estatus: { title: 'Estatus' },
      descripcion: { title: 'Descripción' },
    },
  };
  // Data table
  dataTableBienesOficio = [
    {
      noBien: 'DATA',
      estatus: 'DATA',
      descripcion: 'DATA',
    },
  ];

  public form: FormGroup;
  public formCcpOficio: FormGroup;
  public noExpediente: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }
  private prepareForm() {
    this.form = this.fb.group({
      noVolante: '',
      claveOficio: '',
      destinatario: '', // Detalle destinatario
      texto: '',
    });
    this.noExpediente = this.fb.group({
      noExpediente: '',
    });
    this.formCcpOficio = this.fb.group({
      ccp1: '',
      ccp2: '',
      firma: '',
    });
  }

  mostrarInfo(form: any): any {
    console.log(form.value);
  }

  mostrarInfoDepositario(formDepositario: any): any {
    console.log(formDepositario.value);
  }

  sendForm() {
    console.log('Send form log');
  }
  btnInsertarTextoPredefinido() {
    console.log('btnInsertarTextoPredefinido');
  }
  btnReemplazarMarcadores() {
    console.log('btnReemplazarMarcadores');
  }
  btnImprimir() {
    console.log('btnImprimir');
  }
}
