import { Component, OnInit } from '@angular/core';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-fact-jur-abandonos',
  templateUrl: './fact-jur-abandonos.component.html',
  styleUrls: ['./fact-jur-abandonos.component.scss']
})
export class FactJurAbonadosComponent  {
  public optionsTipoVolante = [
    { value: 'Administrativo', label: 'Administrativo' },
    { value: 'Procesal', label: 'Procesal' },
    { value: 'Admin. Trans', label: 'Admin. Trans' },
    { value: 'Transferente', label: 'Transferente' },
  ];
  public form: FormGroup;
  public formOficio: FormGroup;
  public formCcpOficio: FormGroup;
  public formDeclaratoria: FormGroup;
  public formOficioInicioFin: FormGroup;
  public formDeclaratoriaInicioFin: FormGroup;

  /** Tabla bienes */
  data1 = [
    {
      noBien: 12345,
      description: "UNA BOLSA",
      cantidad: 1,
      est: "ENGD",
      proceso: "ASEGURADO",
    },
    {
      noBien: 12345,
      description: "UNA BOLSA",
      cantidad: 1,
      est: "ENGD",
      proceso: "ASEGURADO",
    },
    {
      noBien: 12345,
      description: "UNA BOLSA",
      cantidad: 1,
      est: "ENGD",
      proceso: "ASEGURADO",
    },
  ];
  settings1 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: "external",
    columns: {
      noBien: {
        title: "No. Bien",
        type: "number",
      },
      description: {
        title: "Descripcion",
        type: "string",
      },
      cantidad: {
        title: "Cantidad",
        type: "string",
      },
      ident: {
        title: "Ident.",
        type: "string",
      },
      est: {
        title: "Est",
        type: "string",
      },
      proceso: {
        title: "Proceso",
        type: "string",
      },
    },
    noDataMessage: "No se encontrarón registros",
  };
  /** Tabla bienes */

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
    private fb: FormBuilder) {  
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: [''],
      noVolante: ['', [Validators.required]], //*
      tipoVolante: ['', [Validators.required]], //*
      fechaRecepcion: ['', [Validators.required]], //*
      consecutivoDiario:['', [Validators.required]], //*
      actaCircunst: [''],
      averigPrevia: [''],
      causaPenal: [''],
      noAmparo: [''],
      tocaPenal: [''],
      noOficio: ['', [Validators.required]], //*
      fechaOficio: ['', [Validators.required]], //*
      descripcionAsunto: ['', [Validators.required]], //*
      remitente: ['', [Validators.required]], //*
      asunto: [''],
      desahogoAsunto: ['', [Validators.required]], //*
      ciudad: ['', [Validators.required]], //*
      entidadFederativa: ['', [Validators.required]], //*
      claveUnica: ['', [Validators.required]], //*
      transferente: ['', [Validators.required]], //*
      emisora: ['', [Validators.required]], //*
      autoridad: ['', [Validators.required]], //*
      autoridadEmisora: [''],
      ministerioPublico: [''],
      juzgado: ['', [Validators.required]], //*
      indiciado: ['', [Validators.required]],
      delito: [''],
      solicitante: ['', [Validators.required]], //*
      contribuyente: ['', [Validators.required]], //*
      viaRecepcion: ['', [Validators.required]], //*
      areaDestino: ['', [Validators.required]], //*
      destinatario: ['', [Validators.required]], //*
      justificacionConocimiento: [''],
      reaccionacionConocimiento: [''],
    });
    this.formDeclaratoria = this.fb.group({
      noExpediente: ['', [Validators.required]], //*
      averiPrevia: ['', [Validators.required]], //*
      causaPenal: ['', [Validators.required]], //*
      tipoOficio: ['', [Validators.required]], //*
      remitente: ['', [Validators.required]],
      destinatario: ['', [Validators.required]],
      cveOficio: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
    });
    this.formDeclaratoriaInicioFin = this.fb.group({
      inicio: ['', [Validators.required]], //*
      fin: ['', [Validators.required]], //*
    });
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
  
mostrarInfo(form: FormGroup): any{
  console.log(form.value)
}

mostrarInfoOficio(allFormsOficio: any): any{
  console.log(allFormsOficio)
  
  // this.allForms.formOficio = this.formOficio;
  // this.allForms.formCcpOficio = this.formCcpOficio;
  // this.allForms.formOficioInicioFin = this.formOficioInicioFin;
}

mostrarInfoDeclaratoria(formDeclaratoria: FormGroup): any{
  console.log(formDeclaratoria.value)
}

oficioRelacionado(event: any) {
  console.log("Oficio Relacionado", event);
}

capturaCopias(event: any) {
  console.log("Captura copias", event);
}

/**
 * Formulario
 */
// public returnField(form, field) { return form.get(field); }
// public returnShowRequirements(form, field) { 
//   return this.returnField(form, field)?.errors?.required && this.returnField(form, field).touched; 
// }

}
