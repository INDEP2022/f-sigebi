import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDays } from 'date-fns';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { transferenteAndAct } from 'src/app/common/validations/custom.validators';
import { GoodGetData } from 'src/app/core/models/ms-good/good';
import { TransferProceeding } from 'src/app/core/models/ms-proceedings/validations.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { WarehouseFilterService } from 'src/app/core/services/ms-warehouse-filter/warehouse-filter.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
export class ConfiscatedRecordsComponent extends BasePage implements OnInit {
  settings1 = {
    ...TABLE_SETTINGS,
    rowClassFunction: (row: { data: { avalaible: any } }) =>
      row.data.avalaible ? 'available' : 'not-available',
    actions: false,
    columns: {
      goodId: {
        title: 'No. Bien',
        type: 'number',
        sort: false,
      },
      description: {
        title: 'Descripcion',
        type: 'string',
        sort: false,
      },
      extDomProcess: {
        title: 'Proceso',
        type: 'string',
        sort: false,
      },
      quantity: {
        title: 'Cantidad',
        type: 'number',
        sort: false,
      },
      unit: {
        title: 'Unidad',
        type: 'string',
        sort: false,
      },
      acta: {
        title: 'Acta',
        type: 'string',
        sort: false,
      },
      avalaible: {
        title: 'Disponible',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings2 = {
    ...TABLE_SETTINGS,
    actions: false,
    mode: 'external',
    columns: {
      goodId: {
        title: 'No. Bien',
        type: 'number',
        sort: false,
      },
      clasificacion: {
        title: 'No Clasificación',
        type: 'number',
        sort: false,
      },
      description: {
        title: 'Descripción',
        type: 'string',
        sort: false,
      },
      proceso: {
        title: 'Proceso',
        type: 'string',
        sort: false,
      },
      quantity: {
        title: 'Cantidad',
        type: 'number',
        sort: false,
      },
      unit: {
        title: 'Unidad',
        type: 'string',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  data = EXAMPLE_DATA;
  data2 = EXAMPLE_DATA2;
  dataGoods = new LocalDataSource();
  dataGoodApraiser = new LocalDataSource();
  selectData: any;
  goodData: any[] = [];
  form: FormGroup;
  records: string[];
  itemsSelect = new DefaultSelect();
  warehouseSelect = new DefaultSelect();
  transferSelect = new DefaultSelect();
  adminSelect = new DefaultSelect();
  recibeSelect = new DefaultSelect();
  showFecReception = false;
  minDateFecElab = addDays(new Date(), 1);
  statusProceeding = '';
  labelActa = 'Abrir acta';
  btnCSSAct = 'btn-info';
  scanStatus = false;
  act2Valid = false;

  constructor(
    private fb: FormBuilder,
    private serviceGood: GoodService,
    private render: Renderer2,
    private serviceWarehouse: WarehouseFilterService,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private serviceDocuments: DocumentsService,
    private serviceNoty: NotificationService,
    private serviceExpedient: ExpedientService,
    private serviceRNomencla: ParametersService,
    private serviceSssubtypeGood: GoodSssubtypeService
  ) {
    super();
  }

  ngOnInit(): void {
    moment.locale('es');
    this.prepareForm();
    this.form.get('year').setValue(moment(new Date()).format('YYYY'));
    this.form.get('mes').setValue(moment(new Date()).format('MM'));
    if (this.form) {
      this.form
        .get('transfer')
        .setValidators([transferenteAndAct('A'), Validators.required]);
    }
  }

  prepareForm() {
    this.form = this.fb.group({
      expediente: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      averPrev: [null, []],
      causaPenal: [null, []],
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
      fecCaptura: [null, []],
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
      edoFisico: [null, [, Validators.pattern(STRING_PATTERN)]],
      requerido: [false, []],
      almacen: [null, []],
      boveda: [null, []],
      estatusPrueba: [null, [, Validators.pattern(STRING_PATTERN)]],
      etiqueta: [null, [, Validators.pattern(STRING_PATTERN)]],
    });
  }

  //Enable and disabled buttons

  toggleByLength(idBtn: string, data: string) {
    const btn = document.getElementById(idBtn);
    if (this.form.get(data).value != null) {
      this.render.removeClass(btn, 'disabled');
      this.render.addClass(btn, 'enabled');
    } else {
      this.render.removeClass(btn, 'enabled');
      this.render.addClass(btn, 'disabled');
    }
  }

  enableElement(elmt: string) {
    const element = document.getElementById(elmt);
    this.render.removeClass(element, 'disabled');
  }

  toggleActaBtn() {
    if (this.labelActa == 'Abrir acta') {
      this.statusProceeding = 'ABIERTA';
      this.labelActa = 'Cerrar acta';
      this.btnCSSAct = 'btn-primary';
      console.log(this.dataGoodApraiser);
      this.form.get('fecCaptura').setValue(new Date());
      this.validateFolio();
    } else if (this.labelActa === 'Cerrar acta') {
      if (this.scanStatus) {
        this.statusProceeding = 'CERRADO';
        this.labelActa = 'Abrir acta';
        this.btnCSSAct = 'btn-info';
      } else {
        this.alert(
          'warning',
          'FALTA ESCANEAR FOLIO',
          'El número de folio debe ser escaneado para poder cerrar el acta.'
        );
      }
    }
  }

  //Conditional functions

  verifyDateAndFill() {
    let fecElab = new Date(this.form.get('fecElab').value);
    if (this.form.get('fecElab').value != null) {
      this.form.get('fecReception').setValue(new Date(fecElab));
      this.showFecReception = true;
    } else {
      {
        this.form.get('fecReception').setValue('');
        this.showFecReception = false;
      }
    }
  }

  verifyActAndTransfer() {
    const transfer = this.form.get('transfer');
    const acta = this.form.get('acta');
    if (acta.value != null) {
      this.enableElement('transfer');
      this.fillActTwo();
      if (
        acta.value === 'A' &&
        transfer.value != null &&
        transfer.value.transferentKey != 'PGR' &&
        transfer.value.transferentKey != 'PJF'
      ) {
        transfer.setValue(null);
        this.fillActTwo();
      }
    }
  }

  verifyTransferenteAndAct() {
    if (this.form.get('acta').value != null) {
      let actaValue = this.form.get('acta').value;
      this.form
        .get('transfer')
        .setValidators([transferenteAndAct(actaValue), Validators.required]);
      this.fillActTwo();
    }
  }

  //Validations

  validateFolio() {
    this.serviceDocuments.getByFolio(-73378).subscribe(
      res => {
        if (res.scanStatus === 'ESCANEADO') {
          this.scanStatus = false;
        } else {
          this.scanStatus = false;
        }
      },
      err => {
        this.scanStatus = false;
      }
    );
  }

  //Catalogs

  getWarehouses(params: ListParams) {
    const paramsF = new FilterParams();
    paramsF.addFilter('description', params.text, SearchFilter.ILIKE);
    this.serviceWarehouse.getWarehouseFilter(paramsF.getParams()).subscribe(
      res => {
        this.warehouseSelect = new DefaultSelect(res.data, res.count);
        console.log(res);
      },
      err => {
        console.log(err);
      }
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

  //Bienes y disponibilidad de bienes

  getGoodsByExpedient() {
    this.serviceGood
      .getByExpedient(this.form.get('expediente').value, {
        text: '?expedient=',
      })
      .subscribe({
        next: async (res: any) => {
          const dataTry = res.data.filter((item: any) => {
            return item.status === 'VXP';
          });
          console.log(dataTry);
          if (res.data.length > 0) {
            this.form.get('ident').setValue('ADM');
            this.dataGoods.load(res.data);

            const newData = await Promise.all(
              res.data.map(async (e: any) => {
                const model: GoodGetData = {
                  goodNumber: e.id,
                  subDelegationNumber: e.subDelegationNumber,
                  clasifGoodNumber: e.goodClassNumber,
                  expedientNumber: parseInt(this.form.get('expediente').value),
                  delegationNumber: e.delegationNumber,
                  dateElaboration: '2023-04-11T00:00:00.000Z',
                  identificator: e.identifier,
                  processExt: e.extDomProcess,
                  statusGood: e.status,
                  screenKey: 'FACTREFACTAENTREC',
                };

                let disponible = true;

                const res = await this.serviceGood.getData(model).toPromise();

                if (res['available'] === 'N') {
                  disponible = false;
                } else {
                  disponible = true;
                }

                return { ...e, avalaible: true };
              })
            );
            this.dataGoods.load(newData);

            this.serviceExpedient
              .getById(this.form.get('expediente').value)
              .subscribe(res => {
                console.log(res.expedientType);
                if (
                  res.expedientType != 'A' &&
                  res.expedientType != 'N/A' &&
                  res.expedientType != 'T'
                ) {
                  this.alert(
                    'error',
                    'Numero de expediente invalido',
                    'El número de expediente ingresado tiene un tipo de expediente no valido'
                  );
                } else {
                  let model: TransferProceeding = {
                    numFile: res.transferNumber as number,
                    typeProceedings: res.expedientType,
                  };
                  if (res.expedientType === 'T') {
                    this.records = ['RT'];
                  } else {
                    this.records = ['A', 'NA', 'D', 'NS'];
                  }
                  console.log(model);
                  this.serviceProcVal.getTransfer(model).subscribe(res => {
                    this.transferSelect = new DefaultSelect(
                      res.data,
                      res.count
                    );
                  });
                  this.enableElement('acta');
                }
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

  //Function

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

  tryFunc() {
    const paramsF = new FilterParams();
    paramsF.addFilter('delegation', 'V', SearchFilter.ILIKE);
    this.serviceRNomencla.getRNomencla(paramsF.getParams()).subscribe(res => {
      console.log(res);
    });
  }

  openProceeding() {
    if (this.form.get('folio').value.length > 15) {
      this.alert(
        'error',
        'Número de folio incorrecto',
        'El número de folio no puede ser mayor de 15 dígitos'
      );
    } else {
      this.form.get('fecCaptura').setValue(new Date());
    }
  }

  //"Acta 2"

  fillActTwo() {
    let countAct: Number =
      0 +
      (this.form.get('acta').value != null ? 1 : 0) +
      (this.form.get('transfer').value != null ? 1 : 0) +
      (this.form.get('ident').value != null ? 1 : 0) +
      (this.form.get('recibe').value != null ? 1 : 0) +
      (this.form.get('admin').value != null ? 1 : 0) +
      (this.form.get('folio').value != null ? 1 : 0) +
      (this.form.get('year').value != null ? 1 : 0) +
      (this.form.get('mes').value != null ? 1 : 0);
    console.log(countAct);

    const nameAct =
      (this.form.get('acta').value != null ? this.form.get('acta').value : '') +
      '/' +
      (this.form.get('transfer').value != null
        ? this.form.get('transfer').value.transferentkey
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
    //Validar Acta 2
    countAct == 8 ? (this.act2Valid = true) : (this.act2Valid = false);
  }

  searchKeyProceeding() {
    const acta2Input = this.form.get('folio');
    if (
      this.form.get('acta').value != null &&
      this.form.get('transfer').value != null &&
      this.form.get('ident').value != null &&
      this.form.get('recibe') != null &&
      this.form.get('admin').value != null &&
      this.form.get('folio').value != null
    ) {
      const paramsF = new FilterParams();
      paramsF.addFilter(
        'keysProceedings',
        this.form.get('acta2').value,
        SearchFilter.ILIKE
      );
      this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
        res => {
          console.log(res.data[0]['typeProceedings']);
          console.log('existe');
        },
        err => {
          console.log('No existe');
        }
      );
    }
  }

  selectRow(e: any) {
    const { data } = e;
    console.log(data);
    this.selectData = data;
  }

  //Add good to Act

  subtypeGood(params: ListParams) {
    let resp = {
      no_type: '',
      no_subtype: '',
    };
    console.log(params);
    const newParams = `filter.numClasifGoods=$eq:${params}`;
    this.serviceSssubtypeGood.getFilter(newParams).subscribe(
      res => {
        const type = JSON.parse(JSON.stringify(res.data[0]['numType']));
        const subtype = JSON.parse(JSON.stringify(res.data[0]['numSubType']));
        resp.no_type = type.id;
        resp.no_subtype = subtype.id;
        return resp;
      },
      err => {
        console.log(err);
      }
    );
  }

  pushData() {
    const valAct = this.form.get('acta').value;
    const admin = this.form.get('admin').value;
    if (this.selectData) {
      const goodClass = this.selectData.goodClassNumber;
      const available = this.selectData.avalaible;
      console.log(this.subtypeGood(goodClass));

      if (!available) {
        this.alert(
          'error',
          'Estatus no disponible',
          'El bien tiene un estatus invalido para ser asignado a alguna acta'
        );
      }

      if (!this.act2Valid) {
        this.alert(
          'error',
          'Error en el número de acta',
          'Debe registrar un Acta antes de poder mover el bien'
        );
      }

      if (valAct != 'RT') {
        if (
          (goodClass == 1424 || goodClass == 1426 || goodClass == 1590) &&
          valAct[0] != 'N'
        ) {
          this.alert(
            'error',
            'Problema con el tipo de acta',
            'Para este bien la Clave de Acta debe iniciar con " N "'
          );
        }
        if (
          (goodClass == 1424 || goodClass == 1426 || goodClass == 1590) &&
          admin != 'CCB'
        ) {
          this.alert(
            'error',
            'Problema con quien administra en la clave',
            'En la parte de Quien Administra en la clave de acta debe ser para este bien " CCB "'
          );
        }
        if (
          (goodClass != 1424 || goodClass != 1426 || goodClass != 1590) &&
          valAct[0] == 'N'
        ) {
          this.alert(
            'error',
            'Problema con el tipo de acta',
            'Las actas con esta nomenclatura solo deben contener bienes de numerario efectivo'
          );
        }
      }
    } else {
      this.alert(
        'warning',
        'Bien no seleccionado',
        'No seleccionó un bien para asignar en el acta'
      );
    }

    /* if (this.selectData.avalaible) {
        this.goodData.push(this.selectData);
        this.dataGoodApraiser.load(this.goodData);
        console.log(this.dataGoodApraiser);
      } else {
        this.alert(
          'warning',
          'El bien esta no disponible',
          'El bien seleccionado tiene un estatus de no disponible, puede que se encuentre fuera de la fecha de recepción'
        );
      } */
  }
}

const EXAMPLE_DATA = [
  {
    goodId: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    goodId: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    goodId: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    goodId: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    goodId: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    goodId: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    goodId: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    goodId: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: true,
  },
  {
    goodId: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: 'ASEGURADO',
    cantidad: 1,
    unidad: 'UNIDAD',
    acta: 'A/PGR/6/JCS',
    status: false,
  },
  {
    goodId: 123,
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
