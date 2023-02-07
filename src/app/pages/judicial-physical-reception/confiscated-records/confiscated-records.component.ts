import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-confiscated-records',
  templateUrl: './confiscated-records.component.html',
  styleUrls: ['confiscated-rcords.component.scss'],
})
export class ConfiscatedRecordsComponent implements OnInit {
  settings1 = {
    ...TABLE_SETTINGS,
    rowClassFunction: (row: { data: { status: any } }) =>
      row.data.status ? 'available' : 'not-available',
    actions: false,
    columns: {
      noBien: {
        title: 'No. Bien',
        type: 'number',
        sort: false,
      },
      description: {
        title: 'Descripcion',
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
        type: 'number',
        sort: false,
      },
      unidad: {
        title: 'Unidad',
        type: 'string',
        sort: false,
      },
      acta: {
        title: 'Acta',
        type: 'string',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings2 = {
    ...TABLE_SETTINGS,
    actions: false,
    mode: 'external',
    columns: {
      noBien: {
        title: 'No. Bien',
        type: 'number',
        sort: false,
      },
      clasificacion: {
        title: 'No Clasificación',
        type: 'number',
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
        type: 'number',
        sort: false,
      },
      unidad: {
        title: 'Unidad',
        type: 'string',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  data = EXAMPLE_DATA;
  data2 = EXAMPLE_DATA2;
  form: FormGroup;
  records: string[] = ['A', 'NA', 'D', 'NS'];
  itemsSelect = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      expediente: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      averPrev: [null, [Validators.required]],
      causaPenal: [null, [Validators.required]],
      acta: [null, [Validators.required]],
      transfer: [null, [Validators.required]],
      ident: [null, [Validators.required]],
      recibe: [null, [Validators.required]],
      admin: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      year: [null, [Validators.required]],
      mes: [null, [Validators.required]],
      acta2: [null, [Validators.required]],
      direccion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      entrega: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      fecElabRec: [null, [Validators.required]],
      fecEntBien: [null, [Validators.required]],
      fecElab: [null, [Validators.required]],
      fecReception: [null, [Validators.required]],
      fecCaptura: [null, [Validators.required]],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      recibe2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      testigo: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      folioEscaneo: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      edoFisico: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      requerido: [false, [Validators.required]],
      almacen: [null, [Validators.required]],
      boveda: [null, [Validators.required]],
      estatusPrueba: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      etiqueta: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}

const EXAMPLE_DATA = [
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
];

const EXAMPLE_DATA2 = [
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
    unidad: 'PIEZA',
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
    unidad: 'PIEZA',
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
    unidad: 'PIEZA',
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
    unidad: 'PIEZA',
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
    unidad: 'PIEZA',
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
    unidad: 'PIEZA',
  },
  {
    noBien: 321,
    clasificacion: 1139,
    descripcion: 'UN PAR DE ARETES, METAL FANTASIA',
    proceso: 'DECOMISO',
    cantidad: 2,
    unidad: 'PIEZA',
  },
];
