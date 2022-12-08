import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-partializes-general-goods',
  templateUrl: './partializes-general-goods.component.html',
  styleUrls: ['partializes-general-goods.component.scss'],
})
export class PartializesGeneralGoodsComponent implements OnInit {
  form: FormGroup;
  settings = {
    ...TABLE_SETTINGS,

    actions: false,
    columns: {
      id: {
        title: 'Id.',
        type: 'string',
        sort: false,
      },
      noBien: {
        title: 'No. Bien',
        type: 'string',
        sort: false,
      },
      descripcion: {
        title: 'Descripción',
        type: 'string',
        sort: false,
      },
      proceso: {
        title: 'Proceso',
        type: 'string',
        sort: false,
      },
      cantidad: {
        title: 'Cantidad',
        type: 'string',
        sort: false,
      },
      avaluo: {
        title: 'Valor Avalúo',
        type: 'string',
        sort: false,
      },
      importe: {
        title: 'Importe',
        type: 'number',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  data = EXAMPLE_DATA;
  itemsSelect = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
    const total: number = this.data
      .map(element => element.cantidad)
      .reduce((prev, curr) => prev + curr, 0);
    this.data.push({
      id: null,
      noBien: null,
      descripcion: null,
      proceso: null,
      cantidad: total,
      avaluo: null,
      importe: null,
    });
  }
  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      cantidad: [null, [Validators.required]],
      avaluo: [null, [Validators.required]],
      estatus: [null, [Validators.required]],
      moneda: [null, [Validators.required]],
      expediente: [null, [Validators.required]],
      clasificador: [null, [Validators.required]],
      importe: [null, [Validators.required]],
      veces: [null, [Validators.required]],
      cantidad2: [null, [Validators.required]],
      saldo: [null, [Validators.required]],
    });
  }
}

const EXAMPLE_DATA = [
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
  {
    id: 1,
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
    proceso: 'ASEGURADO',
    cantidad: 10,
    avaluo: 1,
    importe: 500,
  },
];
