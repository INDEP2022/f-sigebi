import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { TransferProceeding } from 'src/app/core/models/ms-proceedings/validations.model';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
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
  dataTransferSave: any[];
  countTransferSave: any;
  adminSelect = new DefaultSelect();
  recibeSelect = new DefaultSelect();
  initialBool = true;
  maxDate = new Date();
  labelActa = 'Cerrar acta';
  btnCSSAct = 'btn-primary';

  constructor(
    private fb: FormBuilder,
    private serviceGood: GoodService,
    private serviceExpedient: ExpedientService,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private render: Renderer2,
    private serviceRNomencla: ParametersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.checkChange();
    this.form.get('year').setValue(format(new Date(), 'yyyy'));
    this.form.get('mes').setValue(format(new Date(), 'MM'));
  }

  prepareForm() {
    this.form = this.fb.group({
      expediente: [null, [Validators.required]],
      averPrev: [null, [Validators.required]],
      acta: [null, [Validators.required]],
      autoridad: [null, [Validators.required]],
      ident: [null, [Validators.required]],
      recibe: [null, [Validators.required]],
      admin: [null, [Validators.required]],
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
      autoridadCancela: [null, [Validators.required]],
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


  fecElab() {
    console.log(this.form.get('fecElab').value);
    this.form.get('fecCierreActa').setValue(this.form.get('fecElab').value);
  }

  //Catalogs and data
  fetchTransfer(params: ListParams) {
    this.transferSelect = new DefaultSelect(
      this.dataTransferSave,
      this.countTransferSave
    );
  }

  getAdmin(params: ListParams) {
    const paramsF = new FilterParams();
    paramsF.addFilter('delegation', params.text, SearchFilter.ILIKE);
    this.serviceRNomencla.getRNomencla(paramsF.getParams()).subscribe(
      res => {
        this.adminSelect = new DefaultSelect(res.data, res.count);
      },
      err => console.log(err)
    );
  }

  getRecibe(params: ListParams) {
    const paramsF = new FilterParams();
    paramsF.addFilter('delegation', params.text, SearchFilter.ILIKE);
    this.serviceRNomencla.getRNomencla(paramsF.getParams()).subscribe(
      res => {
        this.recibeSelect = new DefaultSelect(res.data, res.count);
      },
      err => console.log(err)
    );
  }

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
            this.dataGoods.load(res.data);
            this.serviceExpedient
              .getById(this.form.get('expediente').value)
              .subscribe(res => {
                let model: TransferProceeding = {
                  numFile: res.transferNumber as number,
                  typeProceedings: res.expedientType,
                };

                this.serviceProcVal.getTransfer(model).subscribe(res => {
                  const filteredArray = res.data.filter((element: any) => {
                    return (
                      element.transferentkey.includes('PGR') ||
                      element.transferentkey.includes('PJF')
                    );
                  });
                  this.transferSelect = new DefaultSelect(
                    filteredArray,
                    res.count
                  );
                  this.dataTransferSave = filteredArray;
                  this.countTransferSave = res.count;
                });
                this.initialBool = false;
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

  //Acta 2
  zeroAdd(number: number, lengthS: number) {
    if (number != null) {
      const stringNum = number.toString();
      let newString = '';
      if (stringNum.length < lengthS) {
        lengthS = lengthS - stringNum.length;
        for (let i = 0; i < lengthS; i++) {
          newString = newString + '0';
        }
        newString = newString + stringNum;
        return newString;
      } else {
        return stringNum;
      }
    } else {
      return null;
    }
  }

  checkChange() {
    this.form.get('acta').valueChanges.subscribe(res => this.fillActTwo());
    this.form.get('autoridad').valueChanges.subscribe(res => this.fillActTwo());
    this.form.get('ident').valueChanges.subscribe(res => this.fillActTwo());
    this.form.get('recibe').valueChanges.subscribe(res => this.fillActTwo());
    this.form.get('admin').valueChanges.subscribe(res => this.fillActTwo());
    this.form.get('folio').valueChanges.subscribe(res => this.fillActTwo());
    this.form.get('year').valueChanges.subscribe(res => this.fillActTwo());
    this.form.get('mes').valueChanges.subscribe(res => this.fillActTwo());
  }

  fillActTwo() {
    /*     console.log(this.form.get('admin').value.delegation); */
    const nameAct =
      (this.form.get('acta').value != null ? this.form.get('acta').value : '') +
      '/' +
      (this.form.get('autoridad').value != null
        ? this.form.get('autoridad').value.transferentkey
        : '') +
      '/' +
      (this.form.get('ident').value != null
        ? this.form.get('ident').value
        : '') +
      '/' +
      (this.form.get('recibe').value != null
        ? this.form.get('recibe').value.delegation
        : '') +
      '/' +
      (this.form.get('admin').value != null
        ? this.form.get('admin').value.delegation
        : '') +
      '/' +
      (this.form.get('folio').value != null
        ? this.zeroAdd(this.form.get('folio').value, 5)
        : '') +
      '/' +
      (this.form.get('year').value != null
        ? this.form.get('year').value.toString().substr(2, 2)
        : '') +
      '/' +
      (this.form.get('mes').value != null
        ? this.zeroAdd(this.form.get('mes').value, 2)
        : '');
    this.form.get('acta2').setValue(nameAct);
  }


  //Functions
  toggleActa() {
    if (this.labelActa == 'Abrir acta') {
      this.labelActa = 'Cerrar acta';
      this.btnCSSAct = 'btn-primary';
    } else {
      this.labelActa = 'Abrir acta';
      this.btnCSSAct = 'btn-success';
    }
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
