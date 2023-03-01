import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CONFISCATED_RECEPCION_COLUMNS } from './confiscated-recepcion-columns';

@Component({
  selector: 'app-confiscated-reception',
  templateUrl: './confiscated-reception.component.html',
  styleUrls: ['./confiscated-reception.component.scss'],
})
export class ConfiscatedReceptionComponent implements OnInit {
  form: FormGroup;
  data = EXAMPLE_DATA;
  settings = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: CONFISCATED_RECEPCION_COLUMNS,
    rowClassFunction: function (row: {
      data: { status: any };
    }): 'available' | 'not-available' {
      return row.data.status ? 'available' : 'not-available';
    },
  };
  constructor(
    private fb: FormBuilder,
    private serviceProcDelRes: ProceedingsDeliveryReceptionService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  blurE() {
    const paramsF = new FilterParams();
    paramsF.addFilter('keysProceedings', this.form.get('cveActa').value);
    this.serviceProcDelRes.getByFilter(paramsF.getParams()).subscribe({
      next: data => {
        console.log(data);
        console.log('Acta duplicada');
        alert('Acta duplicada');
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
      },
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      expediente: [null, [Validators.required]],
      averPrevia: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      causaPenal: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cveActa: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      tipo: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      estatusFec: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      fechaElab: [null, [Validators.required]],
      fechaElabRecibo: [null, [Validators.required]],
      fechaEntrega: [null, [Validators.required]],
      recibeNombre: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      entregaNombre: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observaciones: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      estatus: [null, [Validators.required]],
    });
  }
}

const EXAMPLE_DATA = [
  {
    noBien: 1,
    description: 'DISCOS DE MUSICA VARIOS ARTISTAS',
    cantidad: 1,
    fec: new Date().toDateString(),
    status: false,
  },
  {
    noBien: 1,
    description: 'DISCOS DE MUSICA VARIOS ARTISTAS',
    cantidad: 1,
    fec: new Date().toDateString(),
    status: true,
  },
  {
    noBien: 1,
    description: 'DISCOS DE MUSICA VARIOS ARTISTAS',
    cantidad: 1,
    fec: new Date().toDateString(),
    status: false,
  },
  {
    noBien: 1,
    description: 'DISCOS DE MUSICA VARIOS ARTISTAS',
    cantidad: 1,
    fec: new Date().toDateString(),
    status: true,
  },
  {
    noBien: 1,
    description: 'DISCOS DE MUSICA VARIOS ARTISTAS',
    cantidad: 1,
    fec: new Date().toDateString(),
    status: true,
  },
  {
    noBien: 1,
    description: 'DISCOS DE MUSICA VARIOS ARTISTAS',
    cantidad: 1,
    fec: new Date().toDateString(),
    status: true,
  },
];
