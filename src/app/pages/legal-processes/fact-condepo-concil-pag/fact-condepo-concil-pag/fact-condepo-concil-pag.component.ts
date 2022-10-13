import { Component, OnInit } from '@angular/core';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-fact-condepo-concil-pag',
  templateUrl: './fact-condepo-concil-pag.component.html',
  styleUrls: ['./fact-condepo-concil-pag.component.scss']
})
export class FactCondepoConcilPagComponent  {

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
  public formDepositario: FormGroup;

  constructor(
    private fb: FormBuilder) {  
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      noBien: ['', [Validators.required]], //*
      nombramiento: ['', [Validators.required]], //*
      fecha: ['', [Validators.required]], //*
    });
    this.formDepositario = this.fb.group({
      idDepositario: ['', [Validators.required]], //*
      depositario: ['', [Validators.required]], //*
      procesar: ['', [Validators.required]], //* SI/NO
      fechaEjecucion: ['', [Validators.required]], //*
    });
  }
  
mostrarInfo(form: any): any{
  console.log(form.value)
}

mostrarInfoDepositario(formDepositario: any): any{
  console.log(formDepositario.value)
}

/**
 * Formulario
 */
//  public returnField(form, field) { return form.get(field); }
//  public returnShowRequirements(form, field) { 
//    return this.returnField(form, field)?.errors?.required && this.returnField(form, field).touched; 
//  }

}
