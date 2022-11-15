import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';

@Component({
  selector: 'app-jpr-partializes-goods',
  templateUrl: './jpr-partializes-goods.component.html',
  styleUrls: ['partializes-goods.component.scss'],
})
export class JprPartializesGoodsComponent implements OnInit {
  form: FormGroup;

  settings = {
    ...TABLE_SETTINGS,

    actions: false,
    columns: {
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
    },
    noDataMessage: 'No se encontrarón registros',
  };
  data = EXAMPLE_DATA;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
    });
  }
}

const EXAMPLE_DATA = [
  {
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
  },
  {
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
  },
  {
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
  },
  {
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
  },
  {
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
  },
  {
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
  },
  {
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
  },
  {
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
  },
  {
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
  },
  {
    noBien: 123,
    descripcion: 'DISCOS COMPACTOS PIRATAS DIFERENTES ARTISTAS',
  },
];
