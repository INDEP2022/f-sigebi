import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-fdp-add-c-return-acts',
  templateUrl: './fdp-add-c-return-acts.component.html',
  styles: [],
})
export class FdpAddCReturnActsComponent implements OnInit {
  response: boolean = false;
  actForm: FormGroup;

  settings1 = {
    rowClassFunction: (row: any) =>
      row.data.status ? 'available' : 'not-available',
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      noBien: {
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        title: 'Descripcion',
        type: 'string',
      },
      proceso: {
        title: 'Proceso',
        type: 'string',
      },
      cantidad: {
        title: 'Cantidad',
        type: 'number',
      },
      importe: {
        title: 'Importe',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings2 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      noBien: {
        title: 'No. Bien',
        type: 'number',
      },
      descripcion: {
        title: 'Descripción',
        type: 'string',
      },
      proceso: {
        title: 'Proceso',
        type: 'string',
      },
      cantidad: {
        title: 'Cantidad',
        type: 'number',
      },
      importe: {
        title: 'Importe',
        type: 'number',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  data = EXAMPLE_DATA;
  data2 = EXAMPLE_DATA2;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  search(term: string) {
    this.response = !this.response;
  }

  onSubmit() {}

  initForm() {
    this.actForm = this.fb.group({
      statusAct: [null, [Validators.required]],
      preliminaryAscertainment: [null, [Validators.required]],
      causePenal: [null, [Validators.required]],
      crimeKey: [null, [Validators.required]],
      crime: [null, [Validators.required]],
      actSelect: [null, [Validators.required]],
      status: [null, [Validators.required]],
      authority: [null, [Validators.required]],
      returnNumber: [null, [Validators.required]],
      admin: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      act: [null, [Validators.required]],
      elabDate: [null, [Validators.required]],
      date: [null, [Validators.required]],
      folioScan: [null, [Validators.required]],
      orderingJudge: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      deliveryName: [null, [Validators.required]],
      beneficiary: [null, [Validators.required]],
      witness: [null, [Validators.required]],
      auditor: [null, [Validators.required]],
    });
  }
}

const EXAMPLE_DATA = [
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: '1',
    cantidad: 1,
    importe: '1',
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: '1',
    cantidad: 1,
    importe: '1',
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: '1',
    cantidad: 1,
    importe: '1',
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: '1',
    cantidad: 1,
    importe: '1',
  },
];

const EXAMPLE_DATA2 = [
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    proceso: '2',
    cantidad: 3,
    importe: 5,
  },
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    proceso: '2',
    cantidad: 3,
    importe: 5,
  },
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    proceso: '2',
    cantidad: 3,
    importe: 5,
  },
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    proceso: '2',
    cantidad: 3,
    importe: 5,
  },
];
