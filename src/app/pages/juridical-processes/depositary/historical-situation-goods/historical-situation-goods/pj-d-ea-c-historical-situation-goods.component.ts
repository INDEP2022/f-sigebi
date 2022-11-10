/** BASE IMPORT */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-d-ea-c-historical-situation-goods',
  templateUrl: './pj-d-ea-c-historical-situation-goods.component.html',
  styleUrls: ['./pj-d-ea-c-historical-situation-goods.component.scss'],
})
export class PJDAEHistoricalSituationGoodsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  @Input() noBien: string = '';
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: {
        title: 'No. Bien',
      }, //*
      descripcion: {
        title: 'Descripción',
      }, //*
      situacion: {
        title: 'Situación',
      }, //*
      fecCambio: {
        title: 'Fec. Cambio',
      }, //*
      usuario: {
        title: 'USUARIO',
      }, //*
      motivoCambio: {
        title: 'Motivo Cambio',
      }, //*
      proceso: {
        title: 'Proceso',
      }, //*
    },
  };
  // Data table
  dataTable = [
    {
      noBien: 'No. Bien',
      descripcion: 'Descripción',
      situacion: 'Situación',
      fecCambio: 'Fec. Cambio',
      usuario: 'USUARIO',
      motivoCambio: 'Motivo Cambio',
      proceso: 'Proceso',
    },
  ];

  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      noBien: [this.noBien != '' ? this.noBien : '', [Validators.required]], //*
      descripcion: ['', [Validators.required]], //*
    });
  }

  mostrarInfo(form: FormGroup): any {
    console.log(form.value);
  }

  mostrarInfoDepositario(formDepositario: FormGroup): any {
    console.log(formDepositario.value);
  }
}
