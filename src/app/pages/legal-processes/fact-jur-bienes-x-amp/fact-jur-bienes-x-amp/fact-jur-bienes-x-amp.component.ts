import { Component, OnInit } from '@angular/core';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-fact-jur-bienes-x-amp',
  templateUrl: './fact-jur-bienes-x-amp.component.html',
  styleUrls: ['./fact-jur-bienes-x-amp.component.scss']
})
export class FactJurBienesXAmpComponent  {

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
      noBien: {
        title: 'No. Bien',
      }, //*
    },
  };
  // Data table
  dataTable = [
    {
      noBien: 'No. Bien',
      descripcion: 'Descripción',
    },

  ];

  tableSettings2 = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true,//oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: {
        title: 'No. Bien',
      }, //*
    },
  };
  // Data table
  dataTable2 = [
    {
      noBien: 'No. Bien',
      descripcion: 'Descripción',
    },

  ];

  public form: FormGroup;
  public formTipoSuspersion: FormGroup;
  public formAmparo: FormGroup;

  constructor(
    private fb: FormBuilder) {  
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: ['', [Validators.required]], //*
      averiguacionPrevia: '',
      causaPenal: '',
    });
    this.formTipoSuspersion = this.fb.group({
      tipoSupersion: '', // Provisional, Definitiva, De plano
      fechaInformePrevio: '',
      justificado: '',
      observaciones: '',
    });
    this.formAmparo = this.fb.group({
      amparo: ['', [Validators.required]], //* Directo, Indirecto
      fechaOficio: '',
      minPub: '', // Detalle Min. Pub.
      noJuzgado: '', // Detalle No Juzgado
      responsable: '',
      delegacion: '', // 4 campos con el primero en id
      quejosos: '',
      actoReclamado: '',
    });
  }
  
mostrarInfo(): any{
  console.log(this.form.value)
}

btnAgregar() {
  console.log("Agregar");
  
}

btnEliminar() {
  console.log("Eliminar");
  
}

/**
 * Formulario
 */
 public returnField(form, field) { return form.get(field); }
 public returnShowRequirements(form, field) { 
   return this.returnField(form, field)?.errors?.required && this.returnField(form, field).touched; 
 }

}
