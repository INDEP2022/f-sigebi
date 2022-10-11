import { Component, OnInit  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-fdp-add-c-destruction-acts',
  templateUrl: './fdp-add-c-destruction-acts.component.html',
  styles: [
  ]
})
export class FdpAddCDestructionActsComponent implements OnInit {
  actForm: FormGroup;
  //datePicker config
  colorTheme = 'theme-red';
  response: boolean = false //data backend

  settings1 = {
    rowClassFunction: (row: any) =>
      row.data.status ? "available" : "not-available",
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
      proceso: {
        title: "Proceso",
        type: "string",
      },
      cantidad: {
        title: "Cantidad",
        type: "number",
      },
      unidad: {
        title: "Unidad",
        type: "string",
      },
      acta: {
        title: "Acta",
        type: "string",
      },
    },
    noDataMessage: "No se encontrarón registros",
  };

  settings2 = {
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
      descripcion: {
        title: "Descripción",
        type: "string",
      },
      cantidad: {
        title: "Cantidad",
        type: "number",
      }
    },
    noDataMessage: "No se encontrarón registros",
  };


  data = EXAMPLE_DATA;
  data2 = EXAMPLE_DATA2;

  constructor(
    private fb: FormBuilder
  ) { }
  
  ngOnInit(): void {
    this.initForm();
  }

  search(term: string){
    this.response = !this.response;
  }

  initForm(){
    this.actForm = this.fb.group({
      statusAct: [null, [Validators.required]],
      preliminaryAscertainment: [null, [Validators.required]],
      causePenal: [null, [Validators.required]],
      elabDate: [null, [Validators.required]],
      destructDate: [null, [Validators.required]],
      actSelect: [null, [Validators.required]],
      status: [null, [Validators.required]],
      trans: [null, [Validators.required]],
      destr: [null, [Validators.required]],
      admin: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      date: [null, [Validators.required]],
      act: [null, [Validators.required]],
      address: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      responsible: [null, [Validators.required]],
      witness1: [null, [Validators.required]],
      witness2: [null, []],
      methodDestruct: [null, [Validators.required]],
      witnessContr: [null, [Validators.required]],
      folioScan: [null, [Validators.required]],
    });
  }

  onSubmit(){
    
  }


}


const EXAMPLE_DATA = [
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    proceso: "ASEGURADO",
    cantidad: 1,
    unidad: "UNIDAD",
    acta: "A/PGR/6/JCS",
    status: false,
  },
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    proceso: "ASEGURADO",
    cantidad: 1,
    unidad: "UNIDAD",
    acta: "A/PGR/6/JCS",
    status: true,
  },
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    proceso: "ASEGURADO",
    cantidad: 1,
    unidad: "UNIDAD",
    acta: "A/PGR/6/JCS",
    status: true,
  },
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    proceso: "ASEGURADO",
    cantidad: 1,
    unidad: "UNIDAD",
    acta: "A/PGR/6/JCS",
    status: true,
  },
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    proceso: "ASEGURADO",
    cantidad: 1,
    unidad: "UNIDAD",
    acta: "A/PGR/6/JCS",
    status: true,
  },
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    proceso: "ASEGURADO",
    cantidad: 1,
    unidad: "UNIDAD",
    acta: "A/PGR/6/JCS",
    status: false,
  },
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    proceso: "ASEGURADO",
    cantidad: 1,
    unidad: "UNIDAD",
    acta: "A/PGR/6/JCS",
    status: false,
  },
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    proceso: "ASEGURADO",
    cantidad: 1,
    unidad: "UNIDAD",
    acta: "A/PGR/6/JCS",
    status: true,
  },
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    proceso: "ASEGURADO",
    cantidad: 1,
    unidad: "UNIDAD",
    acta: "A/PGR/6/JCS",
    status: false,
  },
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    proceso: "ASEGURADO",
    cantidad: 1,
    unidad: "UNIDAD",
    acta: "A/PGR/6/JCS",
    status: true,
  },
];


const EXAMPLE_DATA2 = [
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: "UN PAR DE ARETES, METAL FANTASIA",
    proceso: "DECOMISO",
    cantidad: 2,
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: "UN PAR DE ARETES, METAL FANTASIA",
    proceso: "DECOMISO",
    cantidad: 2,
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: "UN PAR DE ARETES, METAL FANTASIA",
    proceso: "DECOMISO",
    cantidad: 2,
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: "UN PAR DE ARETES, METAL FANTASIA",
    proceso: "DECOMISO",
    cantidad: 2,
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: "UN PAR DE ARETES, METAL FANTASIA",
    proceso: "DECOMISO",
    cantidad: 2,
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: "UN PAR DE ARETES, METAL FANTASIA",
    proceso: "DECOMISO",
    cantidad: 2,
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: "UN PAR DE ARETES, METAL FANTASIA",
    proceso: "DECOMISO",
    cantidad: 2,
  },
];
