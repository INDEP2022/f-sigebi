import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { TransferProceeding } from 'src/app/core/models/ms-proceedings/validations.model';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from '../../../shared/components/select/default-select';

@Component({
  selector: 'app-cancellation-recepcion',
  templateUrl: './cancellation-recepcion.component.html',
  styleUrls: ['cancellation-recepcion.component.scss'],
})
export class CancellationRecepcionComponent extends BasePage implements OnInit {
  itemsSelect = new DefaultSelect();
  settings1 = {
    ...TABLE_SETTINGS,
    rowClassFunction: (row: { data: { status: any } }) =>
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
        type: 'string',
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
  records: string[] = ['C', 'A', 'S'];
  dataGoods = new LocalDataSource();
  transferSelect = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private serviceGood: GoodService,
    private serviceExpedient: ExpedientService,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private render: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      expediente: [null, [Validators.required]],
      averPrev: [null, [Validators.required]],
      acta: [null, [Validators.required]],
      autoridad: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ident: [null, [Validators.required]],
      recibe: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      admin: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      folio: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      year: [null, [Validators.required]],
      mes: [null, [Validators.required]],
      status: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
      acta2: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      direccion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      folioEscaneo: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      fecElab: [null, [Validators.required]],
      fecCierreActa: [null, [Validators.required]],
      fecCaptura: [null, [Validators.required]],
      elabora: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      testigo: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
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

  //VALIDATE PROCEEDING
  changeAct() {
    console.log(this.form.get('acta').value);
    if (this.form.get('acta').value === 'C') {
      this.form.get('ident').setValue('CAN');
    } else {
      this.form.get('ident').setValue('SUS');
    }
  }

  disabledElement(elmt: string) {
    const element = document.getElementById(elmt);
    this.render.addClass(element, 'disabled');
  }

  enableElement(elmt: string) {
    const element = document.getElementById(elmt);
    this.render.removeClass(element, 'disabled');
  }

  //Catalogs and data
  getGoodsByExpedient() {
    this.serviceGood
      .getByExpedient(this.form.get('expediente').value, {
        text: '?expedient=',
      })
      .subscribe({
        next: (res: any) => {
          const dataTry = res.data.filter((item: any) => {
            item.status != 'ADM';
          });
          if (res.data.length > 0) {
            this.form.get('ident').setValue('ADM');
            this.dataGoods.load(res.data);
            this.serviceExpedient
              .getById(this.form.get('expediente').value)
              .subscribe(res => {
                let model: TransferProceeding = {
                  numFile: res.transferNumber as number,
                  typeProceedings: res.expedientType,
                };

                this.serviceProcVal.getTransfer(model).subscribe(res => {
                  this.transferSelect = new DefaultSelect(res.data, res.count);
                });
                this.enableElement('acta');
              });
          } else {
            this.alert(
              'warning',
              'Sin bienes válidos',
              'El número de expediente registrado no tiene bienes válidos'
            );
          }
        },
        error: (err: any) => {
          console.error(err);
        },
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
