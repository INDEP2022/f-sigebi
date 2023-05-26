import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addDays, format, subDays } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { transferenteAndAct } from 'src/app/common/validations/custom.validators';
import {
  IAcceptGoodStatus,
  IAcceptGoodStatusScreen,
  IVban,
} from 'src/app/core/models/ms-good/good';
import { IDeleteDetailProceeding, IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { TransferProceeding } from 'src/app/core/models/ms-proceedings/validations.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-sale-cancellation',
  templateUrl: './sale-cancellation.component.html',
  styleUrls: ['cancellation-sale.component.scss'],
})
export class SaleCancellationComponent extends BasePage implements OnInit {
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
        title: 'Descripción',
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
  searchByOtherData = false;
  dataExpedients = new DefaultSelect();
  act2Valid: boolean = false;
  btnCSSAct = 'btn-success';
  dataGoodAct = new LocalDataSource();
  dataGoods = new LocalDataSource();
  form: FormGroup;
  goodData: any[] = [];
  idProceeding: number;
  initialBool = true;
  labelActa = 'Abrir acta';
  maxDate = new Date();
  maxDatefecElab = subDays(new Date(), 1);
  minDateFecElab: Date;
  navigateProceedings = false;
  nextProce = true;
  numberProceeding = 0;
  prevProce = false;
  proceedingData: any[] = [];
  recibeSelect = new DefaultSelect();
  records = new DefaultSelect(['A']);
  selectActData: any = null;
  selectData: any = null;
  statusProceeding: string;
  transferSelect = new DefaultSelect();
  rec_adm: string = '';
  v_atrib_del = 0;
  scanStatus = false;
  numberExpedient = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceDetailProc: DetailProceeDelRecService,
    private serviceExpedient: ExpedientService,
    private serviceGood: GoodService,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private serviceRNomencla: ParametersService,
    private serviceSssubtypeGood: GoodSssubtypeService,
    private serviceUser: UsersService,
    private serviceGoodParameter: GoodParametersService,
    private serviceDocuments: DocumentsService,
    private serviceGoodProcess: GoodProcessService,
    private render: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.form.get('year').setValue(format(new Date(), 'yyyy'));
    this.form.get('mes').setValue(format(new Date(), 'MM'));
    this.checkChange();
    this.initalizateProceeding();
  }

  prepareForm() {
    this.form = this.fb.group({
      listExpedients: [null],
      expediente: [null, [Validators.required]],
      averPrev: [null],
      causaPenal: [null],
      acta: [null],
      transfer: [null],
      ident: [null],
      entrego: [null, [Validators.pattern(STRING_PATTERN)]],
      recibe: [null],
      folio: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      year: [null],
      mes: [null],
      acta2: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      direccion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      folioEscaneo: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      recibe2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      entrega: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      fecElabRecibo: [null, [Validators.required]],
      fecEntregaBienes: [null, [Validators.required]],
      fecElab: [null, [Validators.required]],
      fecRecepFisica: [null, [Validators.required]],
      fecCaptura: [null, []],
      testigo: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      estatusPrueba: [null, []],
      etiqueta: [null, []],
      edoFisico: [null, []],
      noAlmacen: [null],
      noBoveda: [null],
      requerido: [null],
    });
  }

  selectExpedient(e: any) {}

  toggleByLength(idBtn: string, data: string) {
    const type = typeof this.form.get(data).value;
    const btn = document.getElementById(idBtn);
    if (
      (type === 'number' && this.form.get(data).value != null) ||
      (type === 'string' && this.form.get(data).value.length > 0)
    ) {
      this.render.removeClass(btn, 'disabled');
      this.render.addClass(btn, 'enabled');
    } else {
      this.render.removeClass(btn, 'enabled');
      this.render.addClass(btn, 'disabled');
    }
  }

  //Inicializa
  getDataExpedient() {
    this.serviceExpedient.getById(this.form.get('expediente').value).subscribe(
      resp => {
        console.log(resp);
        console.log(resp.preliminaryInquiry);
        this.form.get('averPrev').setValue(resp.preliminaryInquiry);
        console.log(resp.criminalCase);
        this.form.get('causaPenal').setValue(resp.criminalCase);
      },
      err => {
        console.log(err);
      }
    );
  }

  initalizateProceeding() {
    const user = localStorage.getItem('username');
    const paramsF = new FilterParams();
    let no_delegation: string | number;
    let stage_edo: string | number;
    paramsF.addFilter('id', user);
    this.serviceUser.getAllSegUsers(paramsF.getParams()).subscribe(
      res => {
        no_delegation = res.data['0']['usuario']['delegationNumber'];
        this.serviceGoodParameter.getPhaseEdo().subscribe(res => {
          stage_edo = res.stagecreated;
          const paramsFN = new FilterParams();
          paramsFN.addFilter('numberDelegation2', no_delegation);
          paramsFN.addFilter('stageedo', stage_edo);
          this.serviceRNomencla.getRNomencla(paramsFN.getParams()).subscribe(
            res => {
              if (res.count > 1) {
                this.rec_adm = 'FILTRAR';
              }
            },
            err => {
              console.log(err);
              this.rec_adm = 'NADA';
            }
          );
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  automaticFill() {
    console.log(this.rec_adm);
    if (!['FILTRAR', 'NADA'].includes(this.rec_adm)) {
      /* this.form.get('recibe').setValue(this.rec_adm); */
      this.form.get('entrego').setValue('PART');
      this.form.get('ident').setValue('DEV');
    } else {
      console.log('No llena');
    }
  }

  //Validate Proceeding
  changeAct() {
    this.fillActTwo();
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

  validateGood(element: any) {
    let di_disponible: boolean;
    /* return new Promise((resolve, reject) => { */
    const modelScreen: IAcceptGoodStatusScreen = {
      pNumberGood: element.id,
      pVcScreen: 'FACTREFACTAVENT',
    };

    const modelStatus: IAcceptGoodStatus = {
      pNumberGood: element.id,
      pExpedients: this.form.get('expediente').value,
    };
    console.log(modelScreen)
    return new Promise((resolve, reject) => {
      this.serviceGoodProcess.getacceptGoodStatusScreen(modelScreen).subscribe(
        res => {
          console.log(res)
          console.log(res.message);
          if (typeof res == 'number' && res > 0) {
            di_disponible = true;
            console.log('Entro if');
            this.serviceGoodProcess.getacceptGoodStatus(modelStatus).subscribe(
              res => {
                const resDis = JSON.stringify(res);
                if (resDis != 'S') {
                  resolve({ disponible: false });
                } else {
                  resolve({ disponible: true });
                }
              },
              err => {
                resolve({ disponible: false });
              }
            );
          } else {
            di_disponible = false;
            console.log('Entro else');
            this.serviceGoodProcess.getacceptGoodStatus(modelStatus).subscribe(
              res => {
                resolve({ disponible: false });
              },
              err => {
                resolve({ disponible: false });
              }
            );
          }
        },
        err => {
          resolve({ disponible: false });
        }
      );
    });

    /*     }); */
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
    this.form.get('etiqueta').setValue(data.goodStatus);
  }

  deselectRowGoodActa() {
    this.selectActData = null;
    this.form.get('etiqueta').setValue('');
  }

  //*Traer bienes
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

  fillIncomeProceeding(dataRes: any) {
    console.log(dataRes);
    const paramsF = new FilterParams();
    this.minDateFecElab = addDays(new Date(dataRes.elaborationDate), 1);
    paramsF.addFilter('numberProceedings', dataRes.id);
    paramsF.addFilter('keysProceedings', dataRes.keysProceedings);
    this.serviceDetailProc.getAllFiltered(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        const data = this.dataGoods;
        const incomeData = res.data;
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
        this.form.get('entrega').setValue(dataRes.witness1);
        this.form
          .get('fecElab')
          .setValue(addDays(new Date(dataRes.elaborationDate), 1));
        this.form
          .get('fecRecepFisica')
          .setValue(addDays(new Date(dataRes.datePhysicalReception), 1));
        this.form
          .get('fecCaptura')
          .setValue(addDays(new Date(dataRes.captureDate), 1));
        this.form
          .get('fecElabRecibo')
          .setValue(addDays(new Date(dataRes.dateElaborationReceipt), 1));
        this.form
          .get('fecEntregaBienes')
          .setValue(addDays(new Date(dataRes.dateDeliveryGood), 1));

        this.form.get('observaciones').setValue(dataRes.observations);
        this.form.get('recibe2').setValue(dataRes.witness2);
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
      err => {
        this.form.get('acta2').setValue(dataRes.keysProceedings);
        this.form.get('direccion').setValue(dataRes.address);
        this.form.get('entrega').setValue(dataRes.witness1);
        this.form
          .get('fecElab')
          .setValue(addDays(new Date(dataRes.elaborationDate), 1));
        this.form
          .get('fecRecepFisica')
          .setValue(addDays(new Date(dataRes.datePhysicalReception), 1));
        this.form
          .get('fecCaptura')
          .setValue(addDays(new Date(dataRes.captureDate), 1));
        this.form
          .get('fecElabRecibo')
          .setValue(addDays(new Date(dataRes.dateElaborationReceipt), 1));
        this.form
          .get('fecEntregaBienes')
          .setValue(addDays(new Date(dataRes.dateDeliveryGood), 1));

        this.form.get('observaciones').setValue(dataRes.observations);
        this.form.get('recibe2').setValue(dataRes.witness2);
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
      }
    );
  }

  saveButton(){
    if (!this.act2Valid) {
      this.alert('warning', 'Debe registrar un acta válida', '');
    } else if (!this.form.get('direccion').valid) {
      this.alert('warning', 'Debe registrar una dirección válida', '');
    } else if (!this.form.get('entrega').valid) {
      this.alert(
        'warning',
        'Debe registrar un dato de quien Entrega válido',
        ''
      );
    } else if (!this.form.get('fecElabRecibo').valid) {
      this.alert(
        'warning',
        'Debe registrar una fecha de elaboración recibo válida',
        ''
      );
    } else if (!this.form.get('fecEntregaBienes').valid) {
      this.alert(
        'warning',
        'Debe registrar una fecha de entrega de Bienes válida',
        ''
      );
    } else if (!this.form.get('fecElab').valid) {
      this.alert(
        'warning',
        'Debe registrar una fecha de elaboración válida',
        ''
      );
    } else if (!this.form.get('recibe2').valid) {
      this.alert(
        'warning',
        'Debe registrar un dato de quien Recibe válido',
        ''
      );
    } else if (!this.form.get('testigo').valid) {
      this.alert('warning', 'Debe registrar un dato de testigo válido', '');
    } else {
      const paramsF = new FilterParams();
      paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
      this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
        res => {
          const modelEdit: IProccedingsDeliveryReception = {
            comptrollerWitness: this.form.get('testigo').value,
            observations: this.form.get('observaciones').value,
            witness1: this.form.get('entrega').value,
            witness2: this.form.get('recibe2').value,
            address: this.form.get('direccion').value,
            elaborationDate: format(
              this.form.get('fecElab').value,
              'yyyy-MM,dd HH:mm'
            ),
            datePhysicalReception: format(
              this.form.get('fecRecepFisica').value,
              'yyyy-MM,dd HH:mm'
            ),
            dateElaborationReceipt: format(
              this.form.get('fecElabRecibo').value,
              'yyyy-MM,dd HH:mm'
            ),
            dateDeliveryGood: format(
              this.form.get('fecEntregaBienes').value,
              'yyyy-MM,dd HH:mm'
            ),
            captureDate: format(new Date(), 'yyyy-MM,dd HH:mm'),
          };
          const resData = JSON.parse(JSON.stringify(res.data[0]));
          console.log(modelEdit);
          this.serviceProcVal.editProceeding(resData.id, modelEdit).subscribe(
            res => {
              this.alert(
                'success',
                'Se modificaron los datos del acta de manera éxitosa',
                ''
              );
            },
            err => {
              this.alert(
                'error',
                'Se presento un error inesperado',
                'No se puedo guardar el acta'
              );
            }
          );
        },
        err => {
          let newProceeding: IProccedingsDeliveryReception = {
            comptrollerWitness: this.form.get('testigo').value,
            observations: this.form.get('observaciones').value,
            witness1: this.form.get('entrega').value,
            witness2: this.form.get('recibe2').value,
            address: this.form.get('direccion').value,
            elaborationDate: format(
              this.form.get('fecElab').value,
              'yyyy-MM,dd HH:mm'
            ),
            datePhysicalReception: format(
              this.form.get('fecRecepFisica').value,
              'yyyy-MM,dd HH:mm'
            ),
            dateElaborationReceipt: format(
              this.form.get('fecElabRecibo').value,
              'yyyy-MM,dd HH:mm'
            ),
            dateDeliveryGood: format(
              this.form.get('fecEntregaBienes').value,
              'yyyy-MM,dd HH:mm'
            ),
            captureDate: format(new Date(), 'yyyy-MM,dd HH:mm'),

            keysProceedings: this.form.get('acta2').value,
            /* elaborate: 'SERA', */
            elaborate: localStorage.getItem('username').toLocaleUpperCase(),
            numFile: this.form.get('expediente').value,
            typeProceedings: 'DXCV',
            responsible: null,
            destructionMethod: null,
            approvalDateXAdmon: null,
            approvalUserXAdmon: null,
            numRegister: null,
            numDelegation1: this.form.get('recibe').value.numberDelegation2,
            numDelegation2:
              this.form.get('recibe').value.numberDelegation2 === 11 ? 11 : null,
            identifier: null,
            label: null,
            universalFolio: null,
            numeraryFolio: null,
            numTransfer: null,
            idTypeProceedings: this.form.get('acta').value,
            receiptKey: null,
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
          this.serviceProcVal.postProceeding(newProceeding).subscribe(
            res => {
              this.initialBool = true;
              console.log(res);
              this.alert('success', 'Se guardo el acta de manera éxitosa', '');
            },
            err => {
              this.alert(
                'error',
                'Se presento un error inesperado',
                'No se puedo guardar el acta'
              );
            }
          );
        }
      );
    }
  }

  getGoodsByExpedient() {
    //Validar si hay un acta abierta
    const paramsF = new FilterParams();
    paramsF.addFilter(
      'numFile',
      this.form.get('expediente').value,
      SearchFilter.EQ
    );
    paramsF.addFilter(
      'typeProceedings',
      'DXCV'
    )
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
          this.minDateFecElab = new Date();
          this.checkChange();
          this.getTransfer();
        }
      },
      err => {
        console.log(err);
        this.initialBool = false;
        this.checkChange()
        this.getTransfer();
      }
    );
  }

  goodsByExpediente() {
    this.getDataExpedient();
    this.nextProce = true;
    this.prevProce = false;
    this.navigateProceedings = false;
    this.act2Valid = false;
    this.initialBool = true;
    this.goodData = [];
    this.dataGoodAct.load(this.goodData);
    this.numberProceeding = 0;
    this.statusProceeding = '';
    this.numberExpedient = this.form.get('expediente').value;
    this.form.get('folioEscaneo').reset();
    this.labelActa = 'Abrir acta';
    this.btnCSSAct = 'btn-success';

    const btn = document.getElementById('expedient-number');

    this.render.removeClass(btn, 'enabled');
    this.render.addClass(btn, 'disabled');

    this.clearInputs();

    if (this.form.get('expediente').value != null) {
      this.serviceGood
        .getAllFilterDetail(
          `filter.fileNumber=$eq:${this.form.get('expediente').value}`
        )
        .subscribe({
          next: async (res: any) => {
            console.log(res);
            if (res.data.length > 0) {
              this.form.get('ident').setValue('DEV');
              this.form.get('entrego').setValue('PART');
              this.dataGoods.load(res.data);
              console.log(res);
              const newData = await Promise.all(
                res.data.map(async (e: any) => {
                  let disponible: boolean;
                  const resp = await this.validateGood(e);
                  disponible = JSON.parse(JSON.stringify(resp)).disponible;
                  return { ...e, avalaible: disponible };
                })
              );
              this.dataGoods.load(newData);
              this.getGoodsByExpedient();
              this.alert(
                'success',
                'Se encontraron Bienes',
                'El número de expediente registrado tiene Bienes'
              );
              this.render.removeClass(btn, 'disabled');
              this.render.addClass(btn, 'enabled');
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
          },
        });
    } else {
    }
  }

  //Catalogs
  getRecibe(params: ListParams) {
    console.log(params);
    const paramsF = new FilterParams();
    paramsF.addFilter('delegation', params.text, SearchFilter.ILIKE);
    this.serviceRNomencla.getRNomencla(paramsF.getParams()).subscribe(
      res => {
        this.recibeSelect = new DefaultSelect(res.data, res.count);
      },
      err => console.log(err)
    );
  }

  //Functions
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

  //

  checkChange() {
    this.form.get('fecElab').valueChanges.subscribe(res => {
      this.form.get('fecRecepFisica').setValue(res);
    });
  }

  //Fill Act 2
  fillActTwo() {
    let countAct: Number =
      0 +
      (this.form.get('acta').value != null ? 1 : 0) +
      (this.form.get('transfer').value != null ? 1 : 0) +
      (this.form.get('ident').value != null ? 1 : 0) +
      (this.form.get('entrego').value != null ? 1 : 0) +
      (this.form.get('recibe').value != null ? 1 : 0) +
      (this.form.get('folio').value != null ? 1 : 0) +
      (this.form.get('year').value != null ? 1 : 0) +
      (this.form.get('mes').value != null ? 1 : 0);

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
      (this.form.get('entrego').value != null
        ? this.form.get('entrego').value
        : '') +
      '/' +
      (this.form.get('recibe').value != null
        ? this.form.get('recibe').value.delegation
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
  }

  //Functions
  toggleActa() {
    if (this.labelActa == 'Abrir acta') {
      this.openProceeding();
    } else {
      this.closeProceeding();
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
          typeProceedings: 'DXCVENT',
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

  //*Agregar bienes
  addGood() {
    let v_ban: boolean;
    let v_tipo_acta: string;
    let no_type: number | string;
    let no_subtype: number | string;

    if (this.selectData != null) {
      const goodClass = this.selectData.goodClassNumber;
      const available = this.selectData.avalaible;
      console.log(available);
      if (!available) {
        this.alert(
          'error',
          'Estatus no disponible',
          'El Bien no esta disponible para ser asignado a alguna acta'
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
            no_subtype = parseInt(subtype.id);
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
            } else if (
              this.form.get('ident').value != this.selectData.identifier &&
              !['D', 'ND'].includes(this.form.get('acta').value)
            ) {
              this.alert(
                'error',
                'Problemas con el identificador del bien',
                'El bien tiene un identificador diferente al del acta'
              );
            } else {
              v_ban = true;
              const model: IVban = {
                array: [
                  {
                    screenKey: 'FACTREFACTAVENT',
                    goodNumber: this.selectData.id,
                    identificador: this.selectData.identifier,
                    typeAct: 'DXCVENT',
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
                    if (this.selectData.avalaible) {
                      const paramsF = new FilterParams();
                      paramsF.addFilter(
                        'keysProceedings',
                        this.form.get('acta2').value
                      );
                      this.serviceProcVal
                        .getByFilter(paramsF.getParams())
                        .subscribe(
                          res => {
                            const data = JSON.parse(JSON.stringify(res.data[0]));
                            let newDetailProceeding: IDetailProceedingsDeliveryReception =
                              {
                                numberProceedings: data.id,
                                numberGood: this.selectData.id,
                                amount: this.selectData.quantity,
                                exchangeValue: 1,
                                approvedUserXAdmon: localStorage
                                  .getItem('username')
                                  .toLocaleUpperCase(),
                              };
                            this.serviceDetailProc
                              .addGoodToProceedings(newDetailProceeding)
                              .subscribe(
                                res => {
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
                                },
                                err => {
                                  this.alert(
                                    'error',
                                    'Ocurrió un erro inesperado al intentar mover el bien',
                                    'Ocurrió un error inesperado al intentar mover el bien. Por favor intentelo nuevamente'
                                  );
                                }
                              );
                          },
                          err => {
                            this.alert(
                              'warning',
                              'Debe registrar un Acta antes de poder mover el bien',
                              ''
                            );
                          }
                        );
                      /*  */
                    }
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
          'Debe especificar/buscar el acta para después eliminar el bien de esta'
        );
      } else if (this.selectActData == null) {
        this.alert(
          'warning',
          'No selecciono bien del acta',
          'Debe seleccionar un bien que forme parte del acta primero'
        );
      } else {
        const paramsF = new FilterParams();
        paramsF.addFilter('numberGood', this.selectActData.id);
        paramsF.addFilter('numberProceedings', this.idProceeding);
        this.serviceDetailProc.getAllFiltered(paramsF.getParams()).subscribe(
          res => {
            console.log(res.data[0]);
            const deleteModel: IDeleteDetailProceeding = {
              numberGood: this.selectActData.id,
              numberProceedings: this.idProceeding,
            };
            console.log(deleteModel);
            this.serviceDetailProc.deleteDetailProcee(deleteModel).subscribe(
              res => {
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
              },
              err => {
                this.alert(
                  'error',
                  'Ocurrió un error inesperado',
                  'Ocurrió un error inesperado. Por favor intentelo nuevamente'
                );
              }
            );
          },
          err => {
            
          }
        );


        /* this.goodData = this.goodData.filter(
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
        this.selectActData = null; */
      }
    }
  }

  //Botones
  goParcializacion() {
    this.router.navigate([
      '/pages/judicial-physical-reception/partializes-general-goods/v1',
    ]);
  }

  goCargaMasiva() {
    this.router.navigate(['/pages/general-processes/goods-tracker']);
  }

  //NAVIGATE
  //NAVIGATE PROCEEDING
  clearInputs() {
    this.form.get('acta2').reset();
    this.form.get('entrega').reset();
    this.form.get('fecElabRecibo').reset();
    this.form.get('fecEntregaBienes').reset();
    this.form.get('fecElab').reset();
    this.form.get('fecRecepFisica').reset();
    this.form.get('fecCaptura').reset();
    this.form.get('observaciones').reset();
    this.form.get('recibe2').reset();
    this.form.get('direccion').reset();
    this.form.get('acta').reset();
    this.form.get('transfer').reset();
    this.form.get('ident').reset();
    this.form.get('entrego').reset();
    this.form.get('recibe').reset();
    this.form.get('folio').reset();
  }

  nextProceeding() {
    if (this.numberProceeding <= this.proceedingData.length - 1) {
      this.numberProceeding += 1;
      console.log(this.numberProceeding);
      if (this.numberProceeding <= this.proceedingData.length - 1) {
        this.prevProce = true;
        const dataRes = JSON.parse(
          JSON.stringify(this.proceedingData[this.numberProceeding])
        );
        this.fillIncomeProceeding(dataRes);
      } else {
        this.checkChange();
        this.minDateFecElab = new Date();
        this.clearInputs();
        this.statusProceeding = '';
        this.labelActa = 'Abrir acta';
        this.btnCSSAct = 'btn-info';
        this.act2Valid = false;
        this.navigateProceedings = true;
        this.nextProce = false;
        this.initialBool = false;
        this.goodData = [];
        this.dataGoodAct.load(this.goodData);
        this.getTransfer();
      }
    }
  }

  prevProceeding() {
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

  deleteProceeding() {
    const perm = 1;

    if (perm == 1) {
      if (this.statusProceeding === 'CERRADO') {
        this.alert(
          'error',
          'No puede elimar acta',
          'No puede eliminar un Acta cerrada'
        );
      }
      if (
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
    if (this.act2Valid && this.statusProceeding != '') {
      this.alertQuestion(
        'question',
        '¿Desea eliminar completamente el acta?',
        `Se eliminará el acta ${this.idProceeding}`,
        'Eliminar'
      ).then(q => {
        if (q.isConfirmed) {
          const paramsF = new FilterParams();
          paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
          this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
            res => {
              const realData = JSON.parse(JSON.stringify(res.data[0]));
              this.serviceDetailProc.PADelActaEntrega(realData.id).subscribe(
                res => {
                  this.form.get('expediente').setValue(this.numberExpedient);
                  this.clearInputs();
                  this.getGoodsByExpedient();
                  this.alert('success', 'Acta eliminada con éxito', '');
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
    } else {
      this.alert(
        'warning',
        'Error en acta 2',
        'Necesita registrar un acta 2 correcto y que su estatus sea abierto o cerrado'
      );
    }
  }
}
