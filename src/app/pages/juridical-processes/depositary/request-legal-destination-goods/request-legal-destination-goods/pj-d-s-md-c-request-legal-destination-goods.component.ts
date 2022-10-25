/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-d-s-md-c-request-legal-destination-goods',
  templateUrl: './pj-d-s-md-c-request-legal-destination-goods.component.html',
  styleUrls: ['./pj-d-s-md-c-request-legal-destination-goods.component.scss'],
})
export class PJDSMDRequestLegalDestinationGoodsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  tableFactGenSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      fechaDepositaria: {
        title: 'Fecha',
      },
      tipoDepositaria: {
        title: 'Tipo',
      },
      nDiasDepositaria: {
        title: 'N. Días',
      },
      fecRecep: {
        title: 'Fec. Recep',
      },
      usuRecep: {
        title: 'Usu. Recep',
      },
      area: {
        title: 'Ärea',
      },
      nDias: {
        title: 'N. Días',
      },
      fecCierre: {
        title: 'Fec. Cierre',
      },
      usuarioCierre: {
        title: 'Usuario Cierre',
      },
    },
  };
  // tipoDepositaria --- Depositaría,Administrador,Interventor,Comodato
  dataFactGen = [
    {
      fechaDepositaria: '18/09/2022',
      tipoDepositaria: 'Depositaría,Administrador,Interventor,Comodato',
      nDiasDepositaria: 1,
      fecRecep: '18/09/2022',
      usuRecep: 'Usu. Recep',
      area: 'Ärea',
      nDias: 1,
      fecCierre: '18/09/2022',
      usuarioCierre: 'Usuario Cierre',
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
      noBien: ['', [Validators.required]],
    });
  }

  mostrarInfo(): any {
    console.log(this.form.value);
  }
}
