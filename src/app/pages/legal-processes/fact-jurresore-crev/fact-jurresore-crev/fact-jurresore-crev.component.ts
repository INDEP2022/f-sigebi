import { Component, OnInit } from '@angular/core';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-fact-jurresore-crev',
  templateUrl: './fact-jurresore-crev.component.html',
  styleUrls: ['./fact-jurresore-crev.component.scss']
})
export class FactJurresoreCrevComponent  {

  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true,//oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      cveDocumento:{
        title: 'Cve. Documento',
      },
      
      noBien:{
        title: 'No. Bien',
      },
      descripcion:{
        title: 'Descripción',
      },
      cantidad:{
        title: 'Cantidad',
      },
      estatus:{
        title: 'Estatus',
      },
      motivoRecursoRevision:{
        title: 'Motivo de Recurso de Revisión',
      },
      fechaRecepcion:{
        title: 'Fecha Recepción',
      },
      fechaEmisionResolucion:{
        title: 'Fecha de Emisión de Resolución',
      },
      observacionesRecursoRevision:{
        title: 'Observaciones del Recurso de Revisión',
      },
    },
  };
  // Data table
  dataTable = [
    {
      noBien: 'DATA',
      descripcion: 'DATA',
      cantidad: 'DATA',
      estatus: 'DATA',
      motivoRecursoRevision: 'DATA',
      fechaRecepcion: 'DATA',
      fechaEmisionResolucion: 'DATA',
      observacionesRecursoRevision: 'DATA',
    },

  ];

  public form: FormGroup;

  constructor(
    private fb: FormBuilder) {  
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: '', 
      averiguacionPrevia: '',
      causaPenal: '',
      fechaPresentacionRecursoRevision: '',
      noAmparo: '',
      
      noBien: '',
      descripcion: '',
      fechaAcuerdoInicial: '',
      estatusBien: '', //Estatus del bien detalle
      fechaNotificacion: '',
      estatusDictaminacion: '',
      motivoRecursoRevision: '',
      observaciones: '',
    });
  }

  btnAprobar() {
    console.log("Aprobar");
  }
  

/**
 * Formulario
 */
//  public returnField(form, field) { return form.get(field); }
//  public returnShowRequirements(form, field) { 
//    return this.returnField(form, field)?.errors?.required && this.returnField(form, field).touched; 
//  }

}
