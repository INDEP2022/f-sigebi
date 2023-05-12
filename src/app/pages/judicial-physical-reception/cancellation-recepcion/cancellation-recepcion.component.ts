import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addDays, format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IVban } from 'src/app/core/models/ms-good/good';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { TransferProceeding } from 'src/app/core/models/ms-proceedings/validations.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
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
    rowClassFunction: (row: { data: { avalaible: any } }) =>
      row.data.avalaible ? 'available' : 'not-available',
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      goodId: {
        title: 'No. Bien',
        type: 'string',
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
  act2Valid: boolean = false;
  adminSelect = new DefaultSelect();
  btnCSSAct = 'btn-success';
  countTransferSave: any;
  dataGoodAct = new LocalDataSource();
  dataGoods = new LocalDataSource();
  dataTransferSave: any[];
  form: FormGroup;
  goodData: any[] = [];
  idProceeding: number;
  initialBool = true;
  labelActa = 'Abrir acta';
  maxDate = new Date();
  minDateFecElab: any;
  navigateProceedings = false;
  nextProce = true;
  no_delegacion_1: string;
  no_delegacion_2: string;
  prevProce = false;
  proceedingData: any[] = [];
  recibeSelect = new DefaultSelect();
  records: string[] = ['C', 'A', 'S'];
  selectActData: any = null;
  selectData: any = null;
  statusProceeding = '';
  transferSelect = new DefaultSelect();
  numberProceeding = 0;
  v_atrib_del = 0;
  scanStatus = false;

  constructor(
    private fb: FormBuilder,
    private render: Renderer2,
    private router: Router,
    private serviceDetailProc: DetailProceeDelRecService,
    private serviceExpedient: ExpedientService,
    private serviceGood: GoodService,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private serviceRNomencla: ParametersService,
    private serviceSssubtypeGood: GoodSssubtypeService,
    private serviceDocuments: DocumentsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.form.get('year').setValue(format(new Date(), 'yyyy'));
    this.form.get('mes').setValue(format(new Date(), 'MM'));
    this.form.get('admin').valueChanges.subscribe(res => {
      this.fillNoDelegacion(res.delegation, this.no_delegacion_2);
    });
    this.form.get('recibe').valueChanges.subscribe(res => {
      this.fillNoDelegacion(res.delegation, this.no_delegacion_1);
    });
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
      estatusBienActa: [null, [Validators.required]],
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
    if (this.form.get('fecElab').value > new Date()) {
      this.alert(
        'warning',
        'Problema con la fecha de elaboración',
        'La fecha de elaboración debe de ser menor o igual a la fecha de hoy'
      );
    } else {
      this.form.get('fecCierreActa').setValue(this.form.get('fecElab').value);
    }
  }

  //Catalogs and data
  fetchTransfer(params: ListParams) {
    this.transferSelect = new DefaultSelect(
      this.dataTransferSave,
      this.countTransferSave
    );
  }

  fillNoDelegacion(delegation: string, saveData: any) {
    this.serviceRNomencla
      .getPhaseEdo(`date=${format(new Date(), 'yyyy-MM-dd')}`)
      .subscribe(res => {
        console.log(res);
        const resData = JSON.parse(JSON.stringify(res));
        const paramsF = new FilterParams();
        paramsF.addFilter('delegation', delegation);
        paramsF.addFilter('stageedo', resData.stagecreated);
        this.serviceRNomencla.getRNomencla(paramsF.getParams()).subscribe(
          res => {
            saveData = JSON.parse(
              JSON.stringify(res.data[0])
            ).numberDelegation2;
          },
          err => {}
        );
      });
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
        console.log(res);
      },
      err => console.log(err)
    );
  }

  //!VALIDAR NEGOCIO PARA TRAER BIENES
  getTransfer() {
    this.serviceExpedient
      .getById(this.form.get('expediente').value)
      .subscribe(res => {
        console.log(res.expedientType);
        let model: TransferProceeding = {
          numFile: res.transferNumber as number,
          typeProceedings: res.expedientType,
        };
        console.log(model);
        this.serviceProcVal.getTransfer(model).subscribe(
          res => {
            console.log(res);
            this.transferSelect = new DefaultSelect(res.data, res.count);
          },
          err => {
            console.log(err);
          }
        );
        /* this.enableElement('acta'); */
      });
  }

  goodsByExpediente() {
    console.log('¿Entra?');
    this.serviceGood
      .getAllFilterDetail(
        `filter.fileNumber=$eq:${
          this.form.get('expediente').value
        }&filter.status=$not:ADM&filter.labelNumber=$not:6&filter.detail.actNumber=$not:$null`
      )
      .subscribe({
        next: async (res: any) => {
          console.log(res.data);
          if (res.data.length > 0) {
            this.dataGoods.load(res.data);
            console.log(res);
            const newData = await Promise.all(
              res.data.map(async (e: any) => {
                let disponible: boolean = false;
                if (e.detail != null) {
                  if (
                    format(
                      new Date(e.detail.approvedXAdmonDate),
                      'yyyy-MM-dd'
                    ) <= format(new Date(), 'yyyy-MM-dd') &&
                    format(
                      new Date(e.detail.indicatesUserApprovalDate),
                      'yyyy-MM-dd'
                    ) >= format(new Date(), 'yyyy-MM-dd')
                  ) {
                    disponible = true;
                  } else {
                    disponible = false;
                  }
                } else {
                  disponible = false;
                }

                return { ...e, avalaible: disponible };
              })
            );
            this.dataGoods.load(newData);
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
          if (err.status === 404) {
            this.alert(
              'warning',
              'No hay bienes para este expediente',
              'No existen bienes en este expediente, por favor revisa que el número que hayas ingresado sea el correcto.'
            );
          }
          if (err.status === 400) {
            this.alert(
              'warning',
              'No hay bienes para este expediente',
              'No existen bienes en este expediente, por favor revisa que el número que hayas ingresado sea el correcto.'
            );
          }
        },
      });
  }

  fillIncomeProceeding(dataRes: any) {
    console.log(dataRes);
    const paramsF = new FilterParams();
    this.maxDate = addDays(new Date(dataRes.elaborationDate), 1);
    paramsF.addFilter('numberProceedings', dataRes.id);
    paramsF.addFilter('keysProceedings', dataRes.keysProceedings);
    this.serviceDetailProc.getAllFiltered(paramsF.getParams()).subscribe(
      res => {
        const data = this.dataGoods;
        const incomeData = res.data;
        console.log(incomeData);
        for (let i = 0; i < incomeData.length; i++) {
          const element = JSON.parse(JSON.stringify(incomeData[i]));
          this.goodData.push(element.good);
          this.dataGoods.load(
            this.dataGoods['data'].map((e: any) => {
              if (e.id == element.good.id) {
                return { ...e, avalaible: false };
              } else {
                return e;
              }
            })
          );
        }
        this.dataGoodAct.load(this.goodData);

        this.form.get('acta2').setValue(dataRes.keysProceedings);
        this.form.get('direccion').setValue(dataRes.address);
        this.form.get('autoridadCancela').setValue(dataRes.witness1);
        this.form
          .get('fecElab')
          .setValue(addDays(new Date(dataRes.elaborationDate), 1));
        this.form
          .get('fecCierreActa')
          .setValue(addDays(new Date(dataRes.datePhysicalReception), 1));
        this.form
          .get('fecCaptura')
          .setValue(addDays(new Date(dataRes.captureDate), 1));
        this.form.get('observaciones').setValue(dataRes.observations);
        this.form.get('elabora').setValue(dataRes.witness2);
        this.form.get('testigo').setValue(dataRes.comptrollerWitness);
        this.statusProceeding = dataRes.statusProceedings;
        if (this.statusProceeding === 'ABIERTA') {
          this.labelActa = 'Cerrar acta';
          this.btnCSSAct = 'btn-primary';
        } else {
          this.labelActa = 'Abrir acta';
          this.btnCSSAct = 'btn-success';
        }
        this.act2Valid = true;
        this.navigateProceedings = true;
        this.idProceeding = dataRes.id;
      },
      err => console.log(err)
    );
  }

  getGoodsByExpedient() {
    //Validar si hay un acta abierta

    const paramsF = new FilterParams();
    paramsF.addFilter(
      'numFile',
      this.form.get('expediente').value,
      SearchFilter.EQ
    );
    paramsF.addFilter('typeProceedings', 'SUSPENSION');
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        if (res.data != null) {
          this.proceedingData = res.data;
          const dataRes = JSON.parse(JSON.stringify(res.data[0]));
          this.fillIncomeProceeding(dataRes);
          console.log(typeof dataRes);
        } else {
          this.initialBool = false;
          this.maxDate = new Date();
          this.checkChange();
          this.getTransfer();
        }
      },
      err => {
        console.log(err);
        this.initialBool = false;
        this.getTransfer();
      }
    );

    this.goodsByExpediente();
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

  validations() {
    this.form.get('fe');
  }

  checkChange() {
    this.form.get('acta').valueChanges.subscribe(res => this.fillActTwo());
    this.form.get('autoridad').valueChanges.subscribe(res => this.fillActTwo());
    this.form.get('ident').valueChanges.subscribe(res => this.fillActTwo());
    this.form.get('recibe').valueChanges.subscribe(res => this.fillActTwo());
    this.form.get('admin').valueChanges.subscribe(res => this.fillActTwo());
    this.form.get('folio').valueChanges.subscribe(res => {
      if (
        this.form.get('folio').value != null &&
        this.form.get('folio').value.toString().length <= 5
      ) {
        this.fillActTwo();
      }
    });
    this.form.get('year').valueChanges.subscribe(res => this.fillActTwo());
    this.form.get('mes').valueChanges.subscribe(res => this.fillActTwo());
  }

  fillActTwo() {
    let countAct: Number =
      0 +
      (this.form.get('acta').value != null ? 1 : 0) +
      (this.form.get('autoridad').value != null ? 1 : 0) +
      (this.form.get('ident').value != null ? 1 : 0) +
      (this.form.get('recibe').value != null ? 1 : 0) +
      (this.form.get('admin').value != null ? 1 : 0) +
      (this.form.get('folio').value != null ? 1 : 0) +
      (this.form.get('year').value != null ? 1 : 0) +
      (this.form.get('mes').value != null ? 1 : 0);

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
        ? this.zeroAdd(this.form.get('folio').value.toString(), 5)
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
    console.log(countAct);
  }

  //Functions
  toggleActa() {
    if (this.labelActa == 'Abrir acta') {
      this.openProceeding();
    } else {
      this.closeProceeding();
    }
  }

  //Select Rows

  rowSelect(e: any) {
    const { data } = e;
    console.log(data);
    this.selectData = data;
    this.form.get('estatusPrueba').setValue(data.goodStatus);
  }

  deselectRow() {
    this.selectData = null;
    this.form.get('estatusPrueba').setValue('');
  }

  selectRowGoodActa(e: any) {
    const { data } = e;
    console.log(data);
    this.selectActData = data;
    this.form.get('estatusBienActa').setValue(data.goodStatus);
  }

  deselectRowGoodActa() {
    this.selectActData = null;
    this.form.get('estatusBienActa').setValue('');
  }

  //Move goods

  addGood() {
    let v_ban: boolean;
    let v_tipo_acta: string;
    let no_type: number | string;

    if (this.selectData != null) {
      const goodClass = this.selectData.goodClassNumber;
      const available = this.selectData.avalaible;
      console.log(available);
      if (!available) {
        this.alert(
          'error',
          'Estatus no disponible',
          'El bien tiene un estatus invalido para ser asignado a alguna acta'
        );
      } else if (!this.act2Valid) {
        this.alert(
          'error',
          'Error en el número de acta',
          'Debe registrar un Acta antes de poder mover el bien'
        );
      } else {
        //Tipo y subtipo de bien
        const newParams = `filter.numClasifGoods=$eq:${goodClass}`;
        this.serviceSssubtypeGood.getFilter(newParams).subscribe(
          res => {
            const type = JSON.parse(JSON.stringify(res.data[0]['numType']));
            const subtype = JSON.parse(
              JSON.stringify(res.data[0]['numSubType'])
            );
            no_type = parseInt(type.id);
            if (this.statusProceeding === 'CERRADA') {
              this.alert(
                'warning',
                'Acta cerrada',
                'El acta ya esta cerrada, no puede realizar modificaciones a esta'
              );
            } else if (
              this.form.get('fecElab').value != null &&
              format(this.form.get('fecElab').value, 'MM-yyyy') !=
                format(new Date(), 'MM-yyyy')
            ) {
              this.alert(
                'error',
                'Error en la fecha de elaboración',
                'No puede realizar modificaciones a esta acta, por estar fuera del mes'
              );
            } else {
              v_ban = true;
              const model: IVban = {
                array: [
                  {
                    screenKey: 'FACTREFCANCELAR',
                    goodNumber: this.selectData.id,
                    identificador: this.selectData.identifier,
                    typeAct:
                      this.form.get('acta').value === 'C'
                        ? 'RECEPCAN'
                        : 'SUSPENSION',
                  },
                ],
              };
              console.log(model);
              this.serviceGood.getVBan(model).subscribe(
                res => {
                  v_ban = res.data[0]['ban'];
                  v_ban = false; //!Forzando el false
                  if (v_ban) {
                    this.alert(
                      'warning',
                      'Bien no valido',
                      'El bien no es válido para esta acta'
                    );
                  } else {
                    console.log('else');
                    this.dataGoods.load(
                      this.dataGoods['data'].map((e: any) => {
                        if (e.id == this.selectData.id) {
                          return { ...e, avalaible: false };
                        } else {
                          return e;
                        }
                      })
                    );
                    /* console.log(dataTry.data); */
                    console.log(this.dataGoods);
                    this.goodData.push(this.selectData);
                    this.dataGoodAct.load(this.goodData);
                    console.log(this.dataGoodAct);
                    this.selectData = null;
                  }
                },
                err => {
                  console.log(err);
                }
              );
            }
          },
          err => {}
        );
      }
    } else {
      this.alert(
        'warning',
        'No selecciono bien',
        'Debe seleccionar un bien para agregar al acta'
      );
    }
  }

  deleteGoods() {
    let v_ban: boolean;
    if (this.statusProceeding === 'CERRADO') {
      this.alert(
        'error',
        'El acta está cerrada',
        'El acta ya esta cerrada, no puede realizar modificaciones a esta'
      );
    } else if (
      this.form.get('fecElab').value != null &&
      format(this.form.get('fecElab').value, 'MM-yyyy') !=
        format(new Date(), 'MM-yyyy')
    ) {
      this.alert(
        'error',
        'Error en la fecha de elaboración',
        'No puede realizar modificaciones a esta acta, por estar fuera del mes'
      );
    } else {
      if (!this.act2Valid) {
        this.alert(
          'warning',
          'Problemas con el número de acta',
          'Debe especificar/buscar el acta para despues eliminar el bien de esta'
        );
      } else if (this.selectActData == null) {
        this.alert(
          'warning',
          'No selecciono bien del acta',
          'Debe seleccionar un bien que forme parte del acta primero'
        );
      } else {
        this.goodData = this.goodData.filter(
          (e: any) => e.id != this.selectActData.id
        );
        this.dataGoodAct.load(this.goodData);
        console.log(this.goodData);

        this.dataGoods.load(
          this.dataGoods['data'].map((e: any) => {
            if (e.id == this.selectActData.id) {
              return { ...e, avalaible: true };
            } else {
              return e;
            }
          })
        );
        this.form.get('estatusBienActa').setValue('');
        this.selectActData = null;
      }
    }
  }

  //Botones
  goParcializacion() {
    this.router.navigate([
      '/pages/judicial-physical-reception/partializes-general-goods-1',
    ]);
  }

  //Validations

  validateFolio() {
    this.serviceDocuments.getByFolio(-73378).subscribe(
      res => {
        const data = JSON.parse(JSON.stringify(res));
        const scanStatus = data.data[0]['scanStatus'];
        console.log(scanStatus);
        if (scanStatus === 'ESCANEADO') {
          this.scanStatus = true;
        } else {
          this.scanStatus = false;
        }
        console.log(this.scanStatus);
      },
      err => {
        this.scanStatus = false;
      }
    );
  }

  saveDetailProceeding(resData: any) {
    let newDetailProceeding: IDetailProceedingsDeliveryReception = {
      numberProceedings: resData.id,
    };

    for (let i = 0; i < this.dataGoodAct['data'].length; i++) {
      const element = this.dataGoodAct['data'][i];
      newDetailProceeding.numberGood = element.id;
      newDetailProceeding.amount = element.quantity;
      newDetailProceeding.received = 'S';
      newDetailProceeding.approvedXAdmon = 'S';
      newDetailProceeding.approvedUserXAdmon = localStorage.getItem('username');
      newDetailProceeding.numberRegister = element.registryNumber;
      console.log(newDetailProceeding);
      this.serviceDetailProc
        .addGoodToProceedings(newDetailProceeding)
        .subscribe(
          res => {
            console.log(res);
            console.log('Guardo bien en detalle');
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  openProceeding() {
    if (this.statusProceeding === 'CERRADO') {
    } else {
      console.log(typeof this.form.get('folio').value);
      /* if (this.form.get('folioEscaneo').value.length > 15) {
      this.alert(
        'error',
        'Número de folio incorrecto',
        'El número de folio no puede ser mayor de 15 dígitos'
      );
    } else { */

      /* } */
      if (this.goodData.length <= 0) {
        this.alert(
          'warning',
          'No hay bienes registrados',
          'Necesita registrar bienes en el acta para crearla'
        );
      } else {
        let userDelegation: any;

        let newProceeding: IProccedingsDeliveryReception = {
          keysProceedings: this.form.get('acta2').value,
          elaborationDate: format(
            this.form.get('fecElab').value,
            'yyyy-MM,dd HH:mm'
          ),
          datePhysicalReception: format(
            this.form.get('fecReception').value,
            'yyyy-MM,dd HH:mm'
          ),
          address: this.form.get('direccion').value,
          statusProceedings: 'ABIERTA',
          elaborate: localStorage.getItem('username'),
          numFile: this.form.get('expediente').value,
          witness1: this.form.get('entrega').value,
          witness2: this.form.get('recibe2').value,
          typeProceedings:
            this.form.get('acta').value == 'C' ? 'RECEPCAN' : 'SUSPENSION',
          dateElaborationReceipt: format(
            this.form.get('fecElabRec').value,
            'yyyy-MM,dd HH:mm'
          ),
          dateDeliveryGood: format(
            this.form.get('fecEntBien').value,
            'yyyy-MM,dd HH:mm'
          ),
          responsible: null,
          destructionMethod: null,
          observations: this.form.get('observaciones').value,
          approvalDateXAdmon: null,
          approvalUserXAdmon: null,
          numRegister: null,
          captureDate: format(new Date(), 'yyyy-MM,dd HH:mm'),
          numDelegation1: this.form.get('admin').value.numberDelegation2,
          numDelegation2:
            this.form.get('admin').value.numberDelegation2 === 11 ? 11 : null,
          identifier: null,
          label: null,
          universalFolio: null,
          numeraryFolio: null,
          numTransfer: null,
          idTypeProceedings: this.form.get('acta').value,
          receiptKey: null,
          comptrollerWitness: this.form.get('testigo').value,
          numRequest: null,
          closeDate: null,
          maxDate: null,
          indFulfilled: null,
          dateCaptureHc: null,
          dateCloseHc: null,
          dateMaxHc: null,
          receiveBy: null,
          affair: null,
        };
        console.log(newProceeding);
        this.serviceProcVal.postProceeding(newProceeding).subscribe(
          res => {
            const paramsF = new FilterParams();
            paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
            this.serviceProcVal
              .getByFilter(paramsF.getParams())
              .subscribe(res => {
                const resData = JSON.parse(JSON.stringify(res.data))[0];
                this.saveDetailProceeding(resData);
                this.form.get('fecCaptura').setValue(new Date());
                this.statusProceeding = 'ABIERTA';
                this.labelActa = 'Cerrar acta';
                this.btnCSSAct = 'btn-primary';
              });
          },
          err => {
            console.log(err);
            console.log('Error al guardar');
          }
        );
        console.log(newProceeding);
      }
    }
  }

  closeProceeding() {
    console.log(this.dataGoodAct['data']);
    this.validateFolio();
    if (this.dataGoodAct['data'].length == 0) {
      this.alert(
        'warning',
        'No se registraron bienes',
        'El Acta no contiene Bienes, no se podrá Cerrar.'
      );
    } else {
      this.serviceDocuments.getByFolio(-73378).subscribe(
        res => {
          const data = JSON.parse(JSON.stringify(res));
          const scanStatus = data.data[0]['scanStatus'];

          if (scanStatus === 'ESCANEADO') {
            this.statusProceeding = 'CERRADO';
            this.labelActa = 'Abrir acta';
            this.btnCSSAct = 'btn-info';
            const paramsF = new FilterParams();

            paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
            this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
              res => {
                console.log(res);
              },
              err => {}
            );
          } else {
            this.alert(
              'warning',
              'FALTA ESCANEAR FOLIO',
              'El número de folio debe ser escaneado para poder cerrar el acta.'
            );
          }
          console.log(this.scanStatus);
        },
        err => {
          this.alert(
            'warning',
            'FALTA ESCANEAR FOLIO',
            'El número de folio debe ser escaneado para poder cerrar el acta.'
          );
        }
      );
    }
  }

  deleteProceeding() {
    console.log(this.form.get('fecElab').value);
    if (this.v_atrib_del === 0) {
      if (this.statusProceeding === 'CERRADO') {
        this.alert(
          'error',
          'No puede elimar acta',
          'No puede eliminar un Acta cerrada'
        );
      }
      if (
        this.form.get('fecElab').value != null &&
        format(this.form.get('fecElab').value, 'MM-yyyy') !=
          format(new Date(), 'MM-yyyy')
      ) {
        this.alert(
          'error',
          'No puede eliminar acta',
          'No puede eliminar un Acta fuera del mes de elaboración'
        );
      }
    }

    this.alertQuestion(
      'question',
      '¿Desea eliminar completamente el acta?',
      `Se eliminará el acta ${this.idProceeding}`,
      'Eliminar'
    ).then(q => {
      if (q.isConfirmed) {
        this.serviceProcVal
          .newDeleteProceeding(this.idProceeding.toString())
          .subscribe(
            res => {
              console.log(res);
              this.alert('success', 'Eliminado', 'Acta eliminada con éxito');
            },
            err => {
              console.log(err);
              this.alert(
                'error',
                'No se pudo eliminar acta',
                'Secudió un problema al eliminar el acta'
              );
            }
          );
      }
    });
  }

  //NAVIGATE PROCEEDING
  nextProceeding() {
    if (this.numberProceeding <= this.proceedingData.length - 1) {
      this.numberProceeding += 1;
      console.log(this.prevProce);
      console.log(this.numberProceeding);
      console.log(this.proceedingData.length - 1);
      if (this.numberProceeding <= this.proceedingData.length - 1) {
        console.log(this.prevProce);
        console.log(this.numberProceeding);
        this.prevProce = true;
        const dataRes = JSON.parse(
          JSON.stringify(this.proceedingData[this.numberProceeding])
        );
        this.fillIncomeProceeding(dataRes);
      } else {
        this.getTransfer();
        this.checkChange();
        this.maxDate = new Date();
        this.form.get('acta2').setValue(null);
        this.form.get('fecElab').setValue(null);
        this.form.get('fecCierreActa').setValue(null);
        this.form.get('fecCaptura').setValue(null);
        this.form.get('direccion').setValue(null);
        this.form.get('observaciones').setValue(null);
        this.form.get('autoridadCancela').setValue(null);
        this.form.get('elabora').setValue(null);
        this.form.get('testigo').setValue(null);
        this.statusProceeding = '';
        this.labelActa = 'Abrir acta';
        this.btnCSSAct = 'btn-info';
        this.act2Valid = false;
        this.navigateProceedings = true;
        this.nextProce = false;
        this.prevProce = true;
        this.initialBool = false;
        this.goodData = [];
        this.dataGoodAct.load(this.goodData);
      }
    }
  }

  prevProceeding() {
    this.initialBool = true;
    if (
      this.numberProceeding <= this.proceedingData.length &&
      this.numberProceeding > 0
    ) {
      this.numberProceeding -= 1;
      console.log(this.numberProceeding);
      if (this.numberProceeding <= this.proceedingData.length - 1) {
        this.nextProce = true;
        const dataRes = JSON.parse(
          JSON.stringify(this.proceedingData[this.numberProceeding])
        );
        this.fillIncomeProceeding(dataRes);
        if (this.numberProceeding == 0) {
          this.prevProce = false;
        }
      }
    }
  }
}
