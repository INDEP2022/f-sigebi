import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { maxDate } from 'src/app/common/validations/date.validators';

import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { GOODS_COLUMNS } from './destruction-authorization-management-goods-columns';

import { PROCEEDINGS_COLUMNS } from './destruction-authorization-management-proceedings-columns';
import { RULINGS_COLUMNS } from './destruction-authorization-management-rulings-columns';

@Component({
  selector: 'app-pe-gdadd-c-destruction-authorization-management',
  templateUrl:
    './pe-gdadd-c-destruction-authorization-management.component.html',
  styleUrls: ['./pe-gdadd-c-destruction-authorization-management.scss'],
})
export class PeGdaddCDestructionAuthorizationManagementComponent
  extends BasePage
  implements OnInit
{
  settings2 = {
    ...this.settings,
    actions: false,
  };
  settings3 = {
    ...this.settings,
    actions: false,
  };
  form: FormGroup = new FormGroup({});
  today: Date;
  imagenurl =
    'https://images.ctfassets.net/txhaodyqr481/6gyslCh8jbWbh9zYs5Dmpa/a4a184b2d1eda786bf14e050607b80df/plantillas-de-factura-profesional-suscripcion-gratis-con-sumup-facturas.jpg?fm=webp&q=85&w=743&h=892';

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.today = new Date();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...GOODS_COLUMNS },
      rowClassFunction: function (row: {
        data: { availability: any };
      }): 'available' | 'not-available' {
        return row.data.availability ? 'available' : 'not-available';
      },
    };
    this.settings2.columns = RULINGS_COLUMNS;
    this.settings3.columns = PROCEEDINGS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noAuth: [
        '',
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      requesOffice: ['', [Validators.required]],
      requesScop: ['', [Validators.required]],
      recepDate: ['', [Validators.required, maxDate(new Date())]],
      scopDate: ['', [Validators.required, maxDate(new Date())]],
      inteDate: ['', [Validators.required, maxDate(new Date())]],
      scanFolio: ['', [Validators.required]],
      observations: ['', [Validators.required]],
    });
  }

  dataActRec = [
    {
      actasRecepcion: 'RT/AGA/ADM/DRBC/00254/17/12',
    },
    {
      actasRecepcion: 'RT/AGA/ADM/DRBC/00232/17/12',
    },
    {
      actasRecepcion: 'RT/AGA/ADM/TIJ/TIJ/02320/11/10',
    },
  ];

  dataDictam = [
    {
      actasRecepcion: 'DCCR/DECRO/DRBC/ATJRBC/00001/2018',
    },
    {
      actasRecepcion: 'DCCR/DECRO/DRBC/ATJRBC/00002/2018',
    },
    {
      actasRecepcion: 'DCCR/DECRO/DRBC/ATJRBC/00003/2018',
    },
  ];

  dataNoBien = [
    {
      noBien: 85431,
      descripcion: 'ROLLO DE PAPEL',
      cantidad: 1,
      ofsol: 'DCCR/DECRO/DRBC/ATJRBC/00001/2018',
      availability: true,
    },

    {
      noBien: 3051053,
      descripcion: 'DISCOS EN FORMATO CD Y DVD',
      cantidad: 98,
      ofsol: 'DCCR/DECRO/DRBC/ATJRBC/00002/2018',
      availability: true,
    },

    {
      noBien: 3301787,
      descripcion: 'EXHIBIDOR PUBLICITARIO',
      cantidad: 12,
      ofsol: 'DCCR/DECRO/DRBC/ATJRBC/00003/2018',
      availability: false,
    },
  ];

  msjRequest() {
    this.alertQuestion(
      'question',
      'Atención',
      '¿Desea imprimir la solicitud de digitalización?'
    ).then(question => {
      if (question.isConfirmed) {
        this.alert('success', 'Listo', 'Se ha solicitado');
      }
    });
  }

  msjScan() {
    this.alertQuestion(
      'info',
      'Atención',
      'Para escanear debe de abrir la aplicación de su preferencia'
    );
  }

  openPrevImg() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.imagenurl),
          type: 'img',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }
}
