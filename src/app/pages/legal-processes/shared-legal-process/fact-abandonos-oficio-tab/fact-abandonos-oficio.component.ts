import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-fact-abandonos-oficio',
  templateUrl: './fact-abandonos-oficio.component.html',
  styleUrls: ['./fact-abandonos-oficio.component.scss']
})
export class FormFactAbandonosOficioComponent  {
    // @Input() formOficio: FormGroup;
    // @Input() nombrePantalla: string;
    allForms: {
      formOficio: FormGroup,
      formCcpOficio: FormGroup,
      formOficioInicioFin: FormGroup,
    }

    @Input() formOficio: FormGroup;
    @Input() formCcpOficio: FormGroup;
    @Input() formOficioInicioFin: FormGroup;

//   public formOficio: FormGroup;
@Output() formValues = new EventEmitter<any>();
// //   public formOficio: FormGroup;
// @Output() formCcpOficioValues = new EventEmitter<any>();
// //   public formOficio: FormGroup;
// @Output() formOficioInicioFinValues = new EventEmitter<any>();

// Config Table

  /** Tabla bienes */
  data2 = [
    {
      cveDocumento: 25,
      description: "UNA BOLSA",
    },
  ];
  settings2 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: "external",
    columns: {
      cveDocumento: {
        title: "No. Bien",
        type: "number",
      },
      description: {
        title: "Descripcion",
        type: "string",
      },
    },
    noDataMessage: "No se encontrarón registros",
  };
  /** Tabla bienes */

  constructor(
    private fb: FormBuilder
    ) {  
  }

  ngOnInit(): void {
    this.formOficioInicioFin = this.fb.group({
      inicio: ['', [Validators.required]], //*
      fin: ['', [Validators.required]], //*
    });
    
    this.formOficio = this.fb.group({
      tipoOficio: [''],
      remitente: [''],
      destinatario: [''],
      ciudad: [''],

      noVolante: ['', [Validators.required]], //*
      noExpediente: ['', [Validators.required]], //*
      cveOficio: ['', [Validators.required]], //*
      fechaCaptura: ['', [Validators.required]], //*
      estatus: ['', [Validators.required]], //*
    });
    
    this.formCcpOficio = this.fb.group({
      ccp: ['', [Validators.minLength(1)]], //*
      usuario: ['', [Validators.minLength(1)]], //*
      nombreUsuario: '',
      ccp2: ['', [Validators.minLength(1)]], //*
      usuario2: ['', [Validators.minLength(1)]], //*
      nombreUsuario2: ''
    });
  }
  
getDataFormOficio(formOficio: FormGroup): any{
  this.formOficio = formOficio;
  this.allForms.formOficio = this.formOficio;
  this.allForms.formCcpOficio = this.formCcpOficio;
  this.allForms.formOficioInicioFin = this.formOficioInicioFin;
  console.log(this.allForms);
  this.formValues.emit(this.allForms);

}


/**
 * Formulario
 */
// public returnField(form, field) { return form.get(field); }
// public returnShowRequirements(form, field) { 
//   return this.returnField(form, field)?.errors?.required 
//   && this.returnField(form, field).touched; 
// }

}
