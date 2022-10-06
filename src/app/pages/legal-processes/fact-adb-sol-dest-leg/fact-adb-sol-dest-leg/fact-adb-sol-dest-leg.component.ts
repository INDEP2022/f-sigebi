import { Component, OnInit } from '@angular/core';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-fact-adb-sol-dest-leg',
  templateUrl: './fact-adb-sol-dest-leg.component.html',
  styleUrls: ['./fact-adb-sol-dest-leg.component.scss']
})
export class FactAdbSolDestLegComponent  {

  tableFactGenSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true,//oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      fechaDepositaria: {
        title: 'Fecha',
      },
      tipoDepositaria: {
        title: 'Tipo',
      },
      nDiasDepositaria: {
        title: 'N. Días',
      },
      fecRecep: {
        title: 'Fec. Recep',
      },
      usuRecep: {
        title: 'Usu. Recep',
      },
      area: {
        title: 'Ärea',
      },
      nDias: {
        title: 'N. Días',
      },
      fecCierre: {
        title: 'Fec. Cierre',
      },
      usuarioCierre: {
        title: 'Usuario Cierre',
      }
    },
  };
  // tipoDepositaria --- Depositaría,Administrador,Interventor,Comodato
  dataFactGen = [
    {
      fechaDepositaria:'18/09/2022',
      tipoDepositaria:'Depositaría,Administrador,Interventor,Comodato',
      nDiasDepositaria:1,
      fecRecep:'18/09/2022',
      usuRecep:'Usu. Recep',
      area:'Ärea',
      nDias:1,
      fecCierre:'18/09/2022',
      usuarioCierre:'Usuario Cierre',
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
      noBien: ['', [Validators.required]],
    });}
  
mostrarInfo(): any{
  console.log(this.form.value)
}

/**
 * Formulario
 */
 public returnField(form, field) { return form.get(field); }
 public returnShowRequirements(form, field) { 
   return this.returnField(form, field)?.errors?.required && this.returnField(form, field).touched; 
 }

}
