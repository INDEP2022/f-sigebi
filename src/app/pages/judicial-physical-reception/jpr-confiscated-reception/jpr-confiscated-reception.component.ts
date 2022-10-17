import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { CONFISCATED_RECEPCION_COLUMNS } from './confiscated-recepcion-columns';

@Component({
  selector: 'app-jpr-confiscated-reception',
  templateUrl: './jpr-confiscated-reception.component.html',
  styleUrls: ["./confiscated-reception.component.scss"],
})
export class JprConfiscatedReceptionComponent implements OnInit {

  form: FormGroup;
  data= EXAMPLE_DATA;
  settings =  {
    ...TABLE_SETTINGS,
    actions:false, 
    columns: CONFISCATED_RECEPCION_COLUMNS,
    rowClassFunction: function (row: { data: { status: any; }; }): "available" | "not-available" {
      return row.data.status ? "available" : "not-available";
    },
  }
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
    
  }

  prepareForm() {
    this.form = this.fb.group({
      expediente: [null, [Validators.required]],
      averPrevia: [null, [Validators.required]],
      causaPenal: [null, [Validators.required]],
      cveActa: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      estatusFec: [null, [Validators.required]],
      fechaElab: [null, [Validators.required]],
      fechaElabRecibo: [null, [Validators.required]],
      fechaEntrega: [null, [Validators.required]],
      recibeNombre: [null, [Validators.required]],
      entregaNombre: [null, [Validators.required]],
      observaciones: [null, [Validators.required]],
      estatus: [null, [Validators.required]],
    });
  }
}

const EXAMPLE_DATA = [
  {
    noBien: 1,
    description: "DISCOS DE MUSICA VARIOS ARTISTAS",
    cantidad: 1,
    fec: new Date().toDateString(),
    status: false
  },
  {
    noBien: 1,
    description: "DISCOS DE MUSICA VARIOS ARTISTAS",
    cantidad: 1,
    fec: new Date().toDateString(),
    status: true
  },
  {
    noBien: 1,
    description: "DISCOS DE MUSICA VARIOS ARTISTAS",
    cantidad: 1,
    fec: new Date().toDateString(),
    status: false
  },
  {
    noBien: 1,
    description: "DISCOS DE MUSICA VARIOS ARTISTAS",
    cantidad: 1,
    fec: new Date().toDateString(),
    status: true
  },
  {
    noBien: 1,
    description: "DISCOS DE MUSICA VARIOS ARTISTAS",
    cantidad: 1,
    fec: new Date().toDateString(),
    status: false
  },
  {
    noBien: 1,
    description: "DISCOS DE MUSICA VARIOS ARTISTAS",
    cantidad: 1,
    fec: new Date().toDateString(),
    status: true
  },
  
];

