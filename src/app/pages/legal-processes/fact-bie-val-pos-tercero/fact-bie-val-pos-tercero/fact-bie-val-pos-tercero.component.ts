import { Component, OnInit } from '@angular/core';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-fact-bie-val-pos-tercero',
  templateUrl: './fact-bie-val-pos-tercero.component.html',
  styleUrls: ['./fact-bie-val-pos-tercero.component.scss']
})
export class FactBieValPosTerceroComponent  {

  // Table settings
  tableSettingsNotificaciones = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true,//oculta subheaader de filtro
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
    hideSubHeader: true,//oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien:  { title: 'No. Bien' },
      estatus:  { title: 'Estatus' },
      descripcion:  { title: 'Descripción' },
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
    hideSubHeader: true,//oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien:  { title: 'No. Bien' },
      estatus:  { title: 'Estatus' },
      descripcion:  { title: 'Descripción' },
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

  constructor(
    private fb: FormBuilder) {  
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      noVolante: '',
      claveOficio: '',
      destinatario: '', // Detalle destinatario
      texto: '',
    });
    
    this.formCcpOficio = this.fb.group({
      ccp1: '',
      ccp2: '',
      firma: ''
    });
  }
  
mostrarInfo(form: any): any{
  console.log(form.value)
}

mostrarInfoDepositario(formDepositario: any): any{
  console.log(formDepositario.value)
}

sendForm() {
  console.log("Send form log");
}

/**
 * Formulario
 */
//  public returnField(form, field) { return form.get(field); }
//  public returnShowRequirements(form, field) { 
//    return this.returnField(form, field)?.errors?.required && this.returnField(form, field).touched; 
//  }

}
