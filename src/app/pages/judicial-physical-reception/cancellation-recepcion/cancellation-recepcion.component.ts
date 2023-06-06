import { NonNullAssert } from '@angular/compiler';
import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { addDays, format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IPAAbrirActasPrograma,
  IPACambioStatus,
} from 'src/app/core/models/good-programming/good-programming';
import { IAcceptGoodActa, IVban } from 'src/app/core/models/ms-good/good';
import {
  IDeleteDetailProceeding,
  IDetailProceedingsDeliveryReception,
} from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { ICveAct } from 'src/app/core/models/ms-proceedings/update-proceedings.model';
import { TransferProceeding } from 'src/app/core/models/ms-proceedings/validations.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
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
  saveDataAct: any[] = [];
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
      status: {
        title: 'Estatus',
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
      numberGood: {
        title: 'No. Bien',
        type: 'number',
        sort: false,
      },
      'good.goodClassNumber': {
        title: 'No. Clasificación',
        type: 'number',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          if (row.good && row.good.goodClassNumber) {
            return row.good.goodClassNumber;
          } else {
            return null;
          }
        },
      },
      'good.description': {
        title: 'Descripción',
        type: 'string',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          if (row.good && row.good.description) {
            return row.good.description;
          } else {
            return null;
          }
        },
      },
      'good.extDomProcess': {
        title: 'Proceso',
        type: 'string',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          if (row.good && row.good.extDomProcess) {
            return row.good.extDomProcess;
          } else {
            return null;
          }
        },
      },
      'good.status': {
        title: 'Estatus',
        type: 'string',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          if (row.good && row.good.status) {
            return row.good.status;
          } else {
            return null;
          }
        },
      },
      'good.quantity': {
        title: 'Cantidad',
        type: 'number',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          if (row.good && row.good.quantity) {
            return row.good.quantity;
          } else {
            return null;
          }
        },
      },
      'good.unit': {
        title: 'Unidad',
        type: 'string',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => {
          if (row.good && row.good.unit) {
            return row.good.unit;
          } else {
            return null;
          }
        },
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  //NAVEGACION DE ACTAS
  paramsActNavigate = new BehaviorSubject<ListParams>(new ListParams());
  newLimitparamsActNavigate = new FormControl(1);

  //NAVEGACION EN TABLA DE BIENES
  paramsDataGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsDataGoods: number = 0;
  limitDataGoods = new FormControl(10);

  //NAVEGACION EN TABALA DE BIENES DE ACTA
  paramsDataGoodsAct = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsDataGoodsAct: number = 0;
  limitDataGoodsAct = new FormControl(10);

  //FOLIO DE ESCANEO
  //FOLIO DE ESCANEO
  folioEscaneo = 'folioEscaneo';
  cveScreen = 'FACTREFCANCELAR';
  nameReport = 'RGERGENSOLICDIGIT';

  act2Valid: boolean = false;
  adminSelect = new DefaultSelect();
  blockExpedient = false;
  btnCSSAct = 'btn-primary';
  countTransferSave: any;
  dataExpedients = new DefaultSelect();
  dataGoodAct = new LocalDataSource();
  dataGoods = new LocalDataSource();
  dataTransferSave: any[];
  form: FormGroup;
  goodData: any[] = [];
  idProceeding: number;
  initialBool = true;
  isEnableAutoridadCancela = true;
  isEnableDireccion = true;
  isEnableElabora = true;
  isEnableFecElab = true;
  isEnableObservaciones = true;
  isEnableTestigo = true;
  labelActa = 'Cerrar acta';
  maxDate = new Date();
  minDateFecElab: any;
  navigateProceedings = false;
  newAct = true;
  nextProce = true;
  no_delegacion_1: string;
  no_delegacion_2: string;
  numberExpedient = '';
  numberProceeding = 0;
  prevProce = true;
  proceedingData: any[] = [];
  recibeSelect = new DefaultSelect();
  records = new DefaultSelect(['C/RT', 'S/RT', 'C/A', 'S/A']);
  reopening = false;
  scanStatus = false;
  searchByOtherData = false;
  selectActData: any = null;
  selectData: any = null;
  transferSelect = new DefaultSelect();
  v_atrib_del = 0;

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
    private serviceDocuments: DocumentsService,
    private serviceGoodProcess: GoodProcessService,
    private serviceProgrammingGood: ProgrammingGoodService,
    private serviceProceeding: ProceedingsService
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

    if (localStorage.getItem('numberExpedient')) {
      this.loading = true;
      this.form
        .get('expediente')
        .setValue(localStorage.getItem('numberExpedient'));
      this.goodsByExpediente();
      localStorage.removeItem('numberExpedient');
    }

    this.paramsDataGoods
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.getGoodsFn();
      });

    this.paramsDataGoodsAct
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.getGoodsActFn();
      });

    this.paramsActNavigate
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        console.log('Sís');
        console.log(this.paramsActNavigate);
        console.log(this.paramsActNavigate.getValue().page);
        console.log(this.proceedingData.length);
        this.dataGoodAct.load([]);
        if (this.proceedingData.length > 0) {
          this.loading = true;
          const dataRes = JSON.parse(
            JSON.stringify(
              this.proceedingData[this.paramsActNavigate.getValue().page - 1]
            )
          );
          this.fillIncomeProceeding(dataRes, 'nextProceeding');
        }
      });
  }

  prepareForm() {
    this.form = this.fb.group({
      listExpedients: [null],
      statusProceeding: [null, []],
      expediente: [null, [Validators.required]],
      averPrev: [null],
      causaPenal: [null],
      acta: [null, []],
      autoridad: [null, []],
      ident: [null, []],
      recibe: [null, []],
      admin: [null, []],
      folio: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      year: [null, []],
      mes: [null, []],
      acta2: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      direccion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      folioEscaneo: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      fecElab: [null, [Validators.required]],
      fecCierreActa: [null, [Validators.required]],
      fecCaptura: [null, []],
      autoridadCancela: [null, [Validators.required]],
      elabora: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      testigo: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      estatusPrueba: [null, [Validators.pattern(STRING_PATTERN)]],
      etiqueta: [null, [Validators.pattern(STRING_PATTERN)]],
      estatusBienActa: [null],
    });
  }

  selectExpedient(e: any) {
    this.loading = true;
    console.log(e);
    this.form.get('expediente').setValue(e.id);
    this.goodsByExpediente();
  }

  inputsInProceedingClose() {
    this.isEnableTestigo = false;
    this.isEnableElabora = false;
    this.isEnableAutoridadCancela = false;
    this.isEnableObservaciones = false;
    this.isEnableDireccion = false;
    this.isEnableFecElab = false;
  }

  inputsNewProceeding() {
    this.isEnableTestigo = true;
    this.isEnableElabora = true;
    this.isEnableAutoridadCancela = true;
    this.isEnableObservaciones = true;
    this.isEnableDireccion = true;
    this.isEnableFecElab = true;
  }

  inputsReopenProceeding() {
    this.isEnableTestigo = true;
    this.isEnableElabora = true;
    this.isEnableAutoridadCancela = true;
    this.isEnableObservaciones = true;
    this.isEnableDireccion = true;
    this.isEnableFecElab = false;
  }

  //VALIDATE PROCEEDING
  changeAct() {
    const splitActa = this.form.get('acta').value.split('/');

    console.log(this.form.get('acta').value);
    if (splitActa[0] === 'C') {
      this.form.get('ident').setValue('CAN');
    } else if (splitActa[0] === null) {
      this.form.get('ident').setValue(null);
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
    if (
      format(this.form.get('fecElab').value, 'dd-MM-yyyy') >
      format(this.maxDate, 'dd-MM-yyyy')
    ) {
      this.form.get('fecElab').setValue(new Date());
      this.form.get('fecCierreActa').setValue(new Date());
    } else {
      this.form.get('fecCierreActa').setValue(this.form.get('fecElab').value);
    }
  }

  requireAct1() {
    this.form.get('acta').setValidators([Validators.required]);
    this.form.get('autoridad').setValidators([Validators.required]);
    this.form.get('ident').setValidators([Validators.required]);
    this.form.get('recibe').setValidators([Validators.required]);
    this.form.get('admin').setValidators([Validators.required]);
    this.form.get('folio').setValidators([Validators.required]);
    this.form.get('year').setValidators([Validators.required]);
    this.form.get('mes').setValidators([Validators.required]);

    this.form.get('acta').updateValueAndValidity();
    this.form.get('autoridad').updateValueAndValidity();
    this.form.get('ident').updateValueAndValidity();
    this.form.get('recibe').updateValueAndValidity();
    this.form.get('admin').updateValueAndValidity();
    this.form.get('folio').updateValueAndValidity();
    this.form.get('year').updateValueAndValidity();
    this.form.get('mes').updateValueAndValidity();
  }

  noRequireAct1() {
    this.form.get('acta').setValidators([]);
    this.form.get('autoridad').setValidators([]);
    this.form.get('ident').setValidators([]);
    this.form.get('recibe').setValidators([]);
    this.form.get('admin').setValidators([]);
    this.form.get('folio').setValidators([]);
    this.form.get('year').setValidators([]);
    this.form.get('mes').setValidators([]);

    this.form.get('acta').updateValueAndValidity();
    this.form.get('autoridad').updateValueAndValidity();
    this.form.get('ident').updateValueAndValidity();
    this.form.get('recibe').updateValueAndValidity();
    this.form.get('admin').updateValueAndValidity();
    this.form.get('folio').updateValueAndValidity();
    this.form.get('year').updateValueAndValidity();
    this.form.get('mes').updateValueAndValidity();
  }

  getCveAct(element: any) {
    return new Promise((resolve, reject) => {
      const model: ICveAct = {
        pExpedientNumber: this.numberExpedient,
        pGoodNumber: element.id,
        pVarTypeActa1: 'SUSPENSION',
        pVarTypeActa2: 'RECEPCAN',
      };
      console.log(model);
      this.serviceProceeding.getCveAct(model).subscribe(
        res => {
          if (res.data.length > 0) {
            resolve({
              acta: res.data[0]['cve_acta'],
            });
          } else {
            resolve({ acta: null });
          }
        },
        err => {
          resolve({ acta: null });
        }
      );
    });
  }

  validateGood(element: any) {
    let di_disponible = false;
    let bamparo: boolean;

    return new Promise((resolve, reject) => {
      if (this.form.get('expediente').value != null) {
        const modelActa: IAcceptGoodActa = {
          pNumberGood: parseInt(element.goodId),
          pVcScreen: 'FACTREFCANCELAR',
          pIdentify: element.identifier,
        };

        const model: ICveAct = {
          pExpedientNumber: this.numberExpedient,
          pGoodNumber: element.id,
          pVarTypeActa1: 'SUSPENSION',
          pVarTypeActa2: 'RECEPCAN',
        };

        this.serviceGoodProcess.getAccepGoodActa(modelActa).subscribe(
          res => {
            console.log(res);
            if (typeof res == 'number' && res > 0) {
              di_disponible = true;
              this.serviceGood
                .getById(`${element.goodId}&filter.labelNumber=$eq:6`)
                .subscribe(
                  res => {
                    bamparo = true;
                    this.serviceProceeding.getCveAct(model).subscribe(
                      res => {
                        if (res.data.length > 0) {
                          resolve({
                            avalaible: false,
                            bamparo: bamparo,
                            acta: res.data[0]['cve_acta'],
                          });
                        } else {
                          resolve({
                            avalaible: di_disponible,
                            bamparo: bamparo,
                            acta: null,
                          });
                        }
                      },
                      err => {
                        resolve({
                          avalaible: di_disponible,
                          bamparo: bamparo,
                          acta: null,
                        });
                      }
                    );
                  },
                  err => {
                    bamparo = false;
                    this.serviceProceeding.getCveAct(model).subscribe(
                      res => {
                        if (res.data.length > 0) {
                          resolve({
                            avalaible: false,
                            bamparo: bamparo,
                            acta: res.data[0]['cve_acta'],
                          });
                        } else {
                          resolve({
                            avalaible: di_disponible,
                            bamparo: bamparo,
                            acta: null,
                          });
                        }
                      },
                      err => {
                        resolve({
                          avalaible: di_disponible,
                          bamparo: bamparo,
                          acta: null,
                        });
                      }
                    );
                  }
                );
            } else {
              di_disponible = false;
              this.serviceGood
                .getById(`${element.goodId}&filter.labelNumber=$eq:6`)
                .subscribe(
                  res => {
                    bamparo = true;
                    this.serviceProceeding.getCveAct(model).subscribe(
                      res => {
                        if (res.data.length > 0) {
                          resolve({
                            avalaible: false,
                            bamparo: bamparo,
                            acta: res.data[0]['cve_acta'],
                          });
                        } else {
                          resolve({
                            avalaible: di_disponible,
                            bamparo: bamparo,
                            acta: null,
                          });
                        }
                      },
                      err => {
                        resolve({
                          avalaible: di_disponible,
                          bamparo: bamparo,
                          acta: null,
                        });
                      }
                    );
                  },
                  err => {
                    bamparo = false;
                    this.serviceProceeding.getCveAct(model).subscribe(
                      res => {
                        if (res.data.length > 0) {
                          resolve({
                            avalaible: false,
                            bamparo: bamparo,
                            acta: res.data[0]['cve_acta'],
                          });
                        } else {
                          resolve({
                            avalaible: di_disponible,
                            bamparo: bamparo,
                            acta: null,
                          });
                        }
                      },
                      err => {
                        resolve({
                          avalaible: di_disponible,
                          bamparo: bamparo,
                          acta: null,
                        });
                      }
                    );
                  }
                );
            }
          },
          err => {
            di_disponible = false;
            this.serviceGood
              .getById(`${element.goodId}&filter.labelNumber=$eq:6`)
              .subscribe(
                res => {
                  bamparo = true;
                  this.serviceProceeding.getCveAct(model).subscribe(
                    res => {
                      if (res.data.length > 0) {
                        resolve({
                          avalaible: false,
                          bamparo: bamparo,
                          acta: res.data[0]['cve_acta'],
                        });
                      } else {
                        resolve({
                          avalaible: di_disponible,
                          bamparo: bamparo,
                          acta: null,
                        });
                      }
                    },
                    err => {
                      resolve({
                        avalaible: di_disponible,
                        bamparo: bamparo,
                        acta: null,
                      });
                    }
                  );
                },
                err => {
                  bamparo = false;
                  this.serviceProceeding.getCveAct(model).subscribe(
                    res => {
                      if (res.data.length > 0) {
                        resolve({
                          avalaible: false,
                          bamparo: bamparo,
                          acta: res.data[0]['cve_acta'],
                        });
                      } else {
                        resolve({
                          avalaible: di_disponible,
                          bamparo: bamparo,
                          acta: null,
                        });
                      }
                    },
                    err => {
                      resolve({
                        avalaible: di_disponible,
                        bamparo: bamparo,
                        acta: null,
                      });
                    }
                  );
                }
              );
          }
        );
      }
    });
  }

  //Catalogs and data
  getDataExpedient() {
    this.serviceExpedient.getById(this.form.get('expediente').value).subscribe(
      resp => {
        /* if(this.form.get('averPrev').value !) null && this.form.get('averPrev').value != resp.preliminaryInquiry){

        } */
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
            this.blockExpedient = false;
            this.alert('error', 'Clave de transferente inválida', '');
            this.dataGoods.load([]);
            this.dataGoodAct.load([]);
            this.goodData = [];
          }
        );
      });
  }

  statusGood(formName: string, data: any) {
    console.log(formName);
    const paramsF = new FilterParams();
    paramsF.addFilter('status', data.status || data.good.status);
    this.serviceGood.getStatusGood(paramsF.getParams()).subscribe(
      res => {
        this.form.get(formName).setValue(res.data[0]['description']);
      },
      err => {
        this.form.get(formName).setValue(null);
      }
    );
  }

  getGoodsFn() {
    this.loading = true;
    const paramsF = new FilterParams();
    paramsF.page = this.paramsDataGoods.getValue().page;
    paramsF.limit = this.paramsDataGoods.getValue().limit;
    this.limitDataGoods = new FormControl(
      this.paramsDataGoods.getValue().limit
    );
    console.log(this.paramsDataGoods);
    console.log(paramsF.getParams());
    this.serviceGood
      .getAllFilterDetail(
        `filter.fileNumber=$eq:${
          this.numberExpedient
        }&filter.status=$not:ADM&filter.labelNumber=$not:6&${paramsF.getParams()}`
      )
      .subscribe({
        next: async (res: any) => {
          if (res.data.length > 0) {
            this.form.get('ident').setValue('ADM');
            /*  this.dataGoods.load(res.data); */
            const newData = await Promise.all(
              res.data.map(async (e: any) => {
                let disponible: boolean;
                const resp = await this.validateGood(e);
                const act = await this.getCveAct(e);
                disponible = JSON.parse(JSON.stringify(resp)).avalaible;
                const acta = JSON.parse(JSON.stringify(resp)).acta;
                return { ...e, avalaible: disponible, acta: acta };
              })
            );
            this.dataGoods.load(newData);
            this.totalItemsDataGoods = res.count;
            this.loading = false;
          }
        },
        error: (err: any) => {
          console.error(err);
          this.loading = false;
          this.totalItemsDataGoods = 0;
        },
      });
  }

  goodsByExpediente() {
    //Validar si hay un acta abierta
    this.loading = true;
    this.getDataExpedient();
    this.noRequireAct1();
    this.initialBool = true;
    this.nextProce = true;
    this.prevProce = true;
    this.act2Valid = false;
    this.navigateProceedings = false;
    this.newAct = true;
    this.form.get('statusProceeding').reset();
    this.goodData = [];
    this.dataGoodAct.load(this.goodData);
    this.numberProceeding = 0;
    this.numberExpedient = this.form.get('expediente').value;
    this.form.get('folioEscaneo').reset();
    this.labelActa = 'Cerrar acta';
    this.btnCSSAct = 'btn-primary';

    const btn = document.getElementById('expedient-number');

    this.render.removeClass(btn, 'enabled');
    this.render.addClass(btn, 'disabled');

    this.clearInputs();
    if (this.form.get('expediente').value != null) {
      const paramsF = new FilterParams();
      paramsF.page = this.paramsDataGoods.getValue().page;
      paramsF.limit = this.paramsDataGoods.getValue().limit;
      this.limitDataGoods = new FormControl(
        this.paramsDataGoods.getValue().limit
      );
      this.serviceGood
        .getAllFilterDetail(
          `filter.fileNumber=$eq:${
            this.form.get('expediente').value
          }&filter.status=$not:ADM&filter.labelNumber=$not:6&${paramsF.getParams()}`
        )
        .subscribe({
          next: async (res: any) => {
            console.log(res.data);
            if (res.data.length > 0) {
              this.dataGoods.load(res.data);
              console.log(res);
              const newData = await Promise.all(
                res.data.map(async (e: any) => {
                  let disponible: boolean;
                  const resp = await this.validateGood(e);
                  const act = await this.getCveAct(e);
                  disponible = JSON.parse(JSON.stringify(resp)).avalaible;
                  const acta = JSON.parse(JSON.stringify(resp)).acta;
                  return { ...e, avalaible: disponible, acta: acta };
                })
              );
              this.totalItemsDataGoods = res.count;
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
              this.initialBool = false;
              this.requireAct1();
              this.maxDate = new Date();
              this.getTransfer();
              this.checkChange();
              this.alert(
                'warning',
                'Sin bienes válidos',
                'El número de expediente registrado no tiene bienes válidos'
              );
              this.render.removeClass(btn, 'disabled');
              this.render.addClass(btn, 'enabled');
            }
          },
          error: (err: any) => {
            console.error(err);
            this.loading = false;
            if (err.status === 404) {
              this.initialBool = false;
              this.requireAct1();
              this.maxDate = new Date();
              this.getTransfer();
              this.checkChange();
              this.render.removeClass(btn, 'disabled');
              this.render.addClass(btn, 'enabled');
              this.alert(
                'warning',
                'No hay bienes para este expediente',
                'No existen bienes en este expediente, por favor revisa que el número que hayas ingresado sea el correcto.'
              );
            }
            if (err.status === 400) {
              this.initialBool = false;
              this.requireAct1();
              this.maxDate = new Date();
              this.getTransfer();
              this.checkChange();
              this.render.removeClass(btn, 'disabled');
              this.render.addClass(btn, 'enabled');
              this.alert(
                'warning',
                'No hay bienes para este expediente',
                'No existen bienes en este expediente, por favor revisa que el número que hayas ingresado sea el correcto.'
              );
            }
            this.render.removeClass(btn, 'disabled');
            this.render.addClass(btn, 'enabled');
          },
        });
    } else {
      this.searchByOthersData();
    }
  }

  searchByOthersData() {
    const paramsF = new FilterParams();
    if (this.form.get('averPrev').value != null) {
      paramsF.addFilter('preliminaryInquiry', this.form.get('averPrev').value);
      this.serviceExpedient.getAllFilter(paramsF.getParams()).subscribe(
        res => {
          console.log(res);
          this.searchByOtherData = true;
          this.loading = false;
          this.dataExpedients = new DefaultSelect(res.data);
        },
        err => {
          console.log(err);
          this.loading = false;
          this.form.get('averPrev').setValue(null);
          this.dataExpedients = new DefaultSelect();
          this.alert(
            'error',
            'La averiguación previa colocada no tiene datos',
            ''
          );
        }
      );
    } else if (this.form.get('causaPenal').value != null) {
      paramsF.addFilter('criminalCase', this.form.get('causaPenal').value);
      this.serviceExpedient.getAllFilter(paramsF.getParams()).subscribe(
        res => {
          this.loading = false;
          console.log(res);
          this.searchByOtherData = true;
          this.dataExpedients = new DefaultSelect(res.data);
        },
        err => {
          this.loading = false;
          console.log(err);
          this.form.get('causaPenal').setValue(null);
          this.dataExpedients = new DefaultSelect();
          this.alert('error', 'La causa penal colocada no tiene datos', '');
        }
      );
    }
    this.blockExpedient = false;
  }

  newProceeding() {
    this.numberProceeding = this.proceedingData.length;
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
    this.form.get('statusProceeding').reset();
    this.labelActa = 'Cerrar acta';
    this.btnCSSAct = 'btn-primary';
    this.act2Valid = false;
    this.navigateProceedings = true;
    this.nextProce = false;
    this.prevProce = true;
    this.initialBool = false;
    this.goodData = [];
    this.dataGoodAct.load(this.goodData);
    this.requireAct1();
    this.inputsNewProceeding();
  }

  getGoodsActFn() {
    this.loading = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('numberProceedings', this.idProceeding);
    paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
    paramsF.page = this.paramsDataGoodsAct.getValue().page;
    paramsF.limit = this.paramsDataGoodsAct.getValue().limit;
    this.limitDataGoods = new FormControl(
      this.paramsDataGoodsAct.getValue().limit
    );

    this.serviceDetailProc.getAllFiltered(paramsF.getParams()).subscribe(
      res => {
        this.dataGoodAct.load(res.data);
        this.totalItemsDataGoodsAct = res.count;
        this.loading = false;
      },
      err => {
        console.log(err);
        this.dataGoodAct.load([]);
        this.totalItemsDataGoods = 0;
        this.loading = false;
      }
    );
  }

  fillIncomeProceeding(dataRes: any, action: string) {
    console.log(dataRes);
    const paramsF = new FilterParams();
    this.maxDate = addDays(new Date(dataRes.elaborationDate), 1);
    paramsF.addFilter('numberProceedings', dataRes.id);
    paramsF.addFilter('keysProceedings', dataRes.keysProceedings);
    this.serviceDetailProc.getAllFiltered(paramsF.getParams()).subscribe(
      res => {
        const data = this.dataGoods;
        const incomeData = res.data;
        this.totalItemsDataGoodsAct = res.count;
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
        this.dataGoodAct.load(incomeData).then(res => {});

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
        this.form.get('statusProceeding').setValue(dataRes.statusProceedings);
        this.form.get('folioEscaneo').setValue(dataRes.universalFolio);
        if (this.form.get('statusProceeding').value === 'ABIERTA') {
          this.labelActa = 'Cerrar acta';
          this.btnCSSAct = 'btn-primary';
          this.inputsReopenProceeding();
        } else if (
          ['CERRADO', 'CERRADA'].includes(
            this.form.get('statusProceeding').value
          )
        ) {
          this.labelActa = 'Abrir acta';
          this.btnCSSAct = 'btn-success';
          this.inputsInProceedingClose();
        } else {
          this.labelActa = 'Abrir acta';
          this.btnCSSAct = 'btn-success';
          this.inputsNewProceeding();
        }
        this.loading = false;
        this.act2Valid = true;
        this.prevProce = true;
        this.nextProce = true;
        this.navigateProceedings = true;
        this.idProceeding = dataRes.id;
      },
      err => {
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
        this.form.get('statusProceeding').setValue(dataRes.statusProceedings);
        this.form.get('folioEscaneo').setValue(dataRes.universalFolio);
        if (this.form.get('statusProceeding').value === 'ABIERTA') {
          this.labelActa = 'Cerrar acta';
          this.btnCSSAct = 'btn-primary';
          this.inputsReopenProceeding();
        } else if (
          ['CERRADO', 'CERRADA'].includes(
            this.form.get('statusProceeding').value
          )
        ) {
          this.labelActa = 'Abrir acta';
          this.btnCSSAct = 'btn-success';
          this.inputsInProceedingClose();
        } else {
          this.labelActa = 'Abrir acta';
          this.btnCSSAct = 'btn-success';
          this.inputsNewProceeding();
        }
        this.loading = false;
        this.prevProce = true;
        this.nextProce = true;
        this.act2Valid = true;
        this.navigateProceedings = true;
        this.idProceeding = dataRes.id;
      }
    );
  }

  clearAll() {
    this.clearInputs();
    this.form.get('expediente').reset();
    this.form.get('averPrev').reset();
    this.form.get('causaPenal').reset();
    this.form.get('statusProceeding').reset();

    this.limitDataGoodsAct = new FormControl(10);
    this.limitDataGoods = new FormControl(10);
    this.totalItemsDataGoods = 0;
    this.totalItemsDataGoodsAct = 0;
    this.paramsDataGoods = new BehaviorSubject<ListParams>(new ListParams());
    this.paramsDataGoodsAct = new BehaviorSubject<ListParams>(new ListParams());
    this.paramsActNavigate = new BehaviorSubject<ListParams>(new ListParams());

    this.dataGoods.load([]);

    this.blockExpedient = false;
    this.navigateProceedings = false;
    this.searchByOtherData = false;

    this.dataExpedients = new DefaultSelect([]);
    this.numberProceeding = 0;

    this.transferSelect = new DefaultSelect([]);
    this.recibeSelect = new DefaultSelect([]);
    this.adminSelect = new DefaultSelect([]);
  }

  clearInputs() {
    this.form.get('acta2').reset();
    this.form.get('fecElab').reset();
    this.form.get('fecCierreActa').reset();
    this.form.get('fecCaptura').reset();
    this.form.get('direccion').reset();
    this.form.get('observaciones').reset();
    this.form.get('autoridadCancela').reset();
    this.form.get('elabora').reset();
    this.form.get('testigo').reset();
    this.form.get('acta').reset();
    this.form.get('autoridad').reset();
    this.form.get('ident').reset();
    this.form.get('recibe').reset();
    this.form.get('admin').reset();
    this.form.get('folio').reset();
    this.goodData = [];
    this.dataGoodAct.load(this.goodData);
  }

  getGoodsByExpedient() {
    this.clearInputs();
    const paramsF = new FilterParams();
    paramsF.addFilter(
      'numFile',
      this.form.get('expediente').value,
      SearchFilter.EQ
    );
    paramsF.addFilter(
      'typeProceedings',
      'SUSPENSION,RECEPCAN',
      SearchFilter.IN
    );
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        if (res.data != null) {
          this.proceedingData = res.data;
          const dataRes = JSON.parse(JSON.stringify(res.data[0]));
          this.fillIncomeProceeding(dataRes, '');
          console.log(typeof dataRes);
        } else {
          this.initialBool = false;
          this.loading = false;
          this.requireAct1();
          this.maxDate = new Date();
          this.checkChange();
          this.inputsNewProceeding();
          this.getTransfer();
        }
      },
      err => {
        console.log(err);
        this.initialBool = false;
        this.loading = false;
        this.requireAct1();
        this.maxDate = new Date();
        this.getTransfer();
        this.checkChange();
        this.inputsNewProceeding();
      }
    );
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

  replicateFolio() {
    this.alert('info', 'El apartado de folios está en construcción', '');
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
    if (countAct == 8) {
      this.act2Valid = true;
      this.searchKeyProceeding();
    } else {
      this.act2Valid = false;
    }
    console.log(countAct);
  }

  //Functions
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

  toggleActa() {
    if (this.labelActa == 'Abrir acta') {
      this.fnOpenProceeding();
    } else if (this.labelActa == 'Cerrar acta') {
      console.log('Funciono');
      /* this.newCloseProceeding() */
      this.closeProceeding();
    }
  }

  goToHistorico() {
    this.router.navigate([
      '/pages/general-processes/historical-good-situation',
    ]);
  }

  //Select Rows

  rowSelect(e: any) {
    const { data } = e;
    console.log(data);
    const resp = this.validateGood(data);
    console.log(resp);
    this.selectData = data;
    this.statusGood('estatusPrueba', data);
    /* this.form.get('estatusPrueba').setValue(data.goodStatus); */
  }

  deselectRow() {
    this.selectData = null;
    this.form.get('estatusPrueba').setValue('');
  }

  selectRowGoodActa(e: any) {
    const { data } = e;
    console.log(data);
    this.selectActData = data;
    this.statusGood('estatusBienActa', data);
    /* this.form.get('estatusBienActa').setValue(data.goodStatus); */
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
          'El bien tiene un estatus inválido para ser asignado a alguna acta'
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
            if (
              ['CERRADA', 'CERRADO'].includes(
                this.form.get('statusProceeding').value
              )
            ) {
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
              const splitActa = this.form.get('acta2').value.split('/');
              const v_tipo_acta =
                splitActa[0] === 'C' ? 'RECEPCAN' : 'SUSPENSION';
              const model: IVban = {
                array: [
                  {
                    screenKey: 'FACTREFCANCELAR',
                    goodNumber: this.selectData.id,
                    identificador: this.selectData.identifier,
                    typeAct: v_tipo_acta,
                  },
                ],
              };
              console.log(model);
              this.serviceGood.getVBan(model).subscribe(
                res => {
                  v_ban = res.data[0]['ban'];
                  console.log(v_ban);
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
                            const data = JSON.parse(
                              JSON.stringify(res.data[0])
                            );
                            let newDetailProceeding: IDetailProceedingsDeliveryReception =
                              {
                                numberProceedings: data.id,
                                numberGood: this.selectData.id,
                                amount: this.selectData.quantity,
                                exchangeValue: 1,
                                received: 'S',
                                approvedUserXAdmon:
                                  localStorage.getItem('username') ==
                                  'sigebiadmon'
                                    ? localStorage.getItem('username')
                                    : localStorage
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
                                  this.goodData.push({
                                    ...this.selectData,
                                    exchangeValue: 1,
                                  });
                                  /* this.dataGoodAct.load(this.goodData); */
                                  this.getGoodsActFn();
                                  this.saveDataAct.push({
                                    ...this.selectData,
                                  });
                                  this.selectData = null;
                                },
                                err => {
                                  this.alert(
                                    'error',
                                    'Ocurrió un error inesperado al intentar mover el bien',
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
                    //!
                    /*
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

                    console.log(this.dataGoods);
                    this.goodData.push(this.selectData);
                    this.saveDataAct = this.goodData;
                    this.dataGoodAct.load(this.goodData);
                    console.log(this.dataGoodAct);
                    this.selectData = null;*/
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
        'No seleccionó bien',
        'Debe seleccionar un bien para agregar al acta'
      );
    }
  }

  deleteGoods() {
    let v_ban: boolean;
    if (
      ['CERRADO', 'CERRADA'].includes(this.form.get('statusProceeding').value)
    ) {
      this.alert(
        'warning',
        'El acta está cerrada',
        'El acta ya esta cerrada, no puede realizar modificaciones a esta'
      );
    } else if (
      this.form.get('fecElab').value != null &&
      format(this.form.get('fecElab').value, 'MM-yyyy') !=
        format(new Date(), 'MM-yyyy')
    ) {
      this.alert(
        'warning',
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
        paramsF.addFilter('numberGood', this.selectActData.good.goodId);
        paramsF.addFilter('numberProceedings', this.idProceeding);
        this.serviceDetailProc.getAllFiltered(paramsF.getParams()).subscribe(
          res => {
            console.log(res.data[0]);
            const deleteModel: IDeleteDetailProceeding = {
              numberGood: this.selectActData.good.goodId,
              numberProceedings: this.idProceeding,
            };
            console.log(deleteModel);
            this.serviceDetailProc.deleteDetailProcee(deleteModel).subscribe(
              res => {
                console.log(this.dataGoodAct);
                this.goodData = this.goodData.filter(
                  (e: any) => e.id != this.selectActData.good.id
                );
                /* this.dataGoodAct.load(this.goodData); */
                this.getGoodsActFn();
                console.log(this.goodData);
                this.saveDataAct = this.saveDataAct.filter(
                  (e: any) => e.id != this.selectActData.good.id
                );

                this.dataGoods.load(
                  this.dataGoods['data'].map((e: any) => {
                    if (e.id == this.selectActData.good.id) {
                      return { ...e, avalaible: true };
                    } else {
                      return e;
                    }
                  })
                );
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
            console.log(err);
            console.log(this.dataGoodAct);
            this.goodData = this.goodData.filter(
              (e: any) => e.id != this.selectActData.good.id
            );
            /* this.dataGoodAct.load(this.goodData); */
            this.getGoodsActFn();

            console.log(this.goodData);
            this.saveDataAct = this.saveDataAct.filter(
              (e: any) => e.id != this.selectActData.good.id
            );

            this.dataGoods.load(
              this.dataGoods['data'].map((e: any) => {
                if (e.id == this.selectActData.good.id) {
                  return { ...e, avalaible: true };
                } else {
                  return e;
                }
              })
            );
          }
        );
      }
    }
  }

  //Botones
  goParcializacion() {
    localStorage.setItem('numberExpedient', this.numberExpedient);

    this.router.navigate([
      '/pages/judicial-physical-reception/partializes-general-goods',
    ]);
  }

  goCargaMasiva() {
    this.router.navigate(['/pages/general-processes/goods-tracker']);
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

  searchKeyProceeding() {
    const acta2Input = this.form.get('folio');
    console.log(this.act2Valid);
    console.log(
      !['CERRADA', 'ABIERTA', 'CERRADO'].includes(
        this.form.get('statusProceeding').value
      )
    );
    if (
      this.act2Valid &&
      !['CERRADA', 'ABIERTA', 'CERRADO'].includes(
        this.form.get('statusProceeding').value
      )
    ) {
      const paramsF = new FilterParams();
      paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
      this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
        res => {
          console.log(res.data[0]['typeProceedings']);
          this.form.get('folio').setValue(this.form.get('folio').value + 1);
          this.alert(
            'warning',
            'El acta ya existe',
            'El acta registrado ya exista, por favor modifique el número de folio o revise los datos.'
          );
        },
        err => {
          console.log('No existe');
        }
      );
    }
  }

  newOpenProceeding() {
    const paramsF = new FilterParams();
    paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        const resData = JSON.parse(JSON.stringify(res.data))[0];
        const paramsF = new FilterParams();
        let VAL_MOVIMIENTO = 0;

        paramsF.addFilter(
          'valUser',
          localStorage.getItem('username') == 'sigebiadmon'
            ? localStorage.getItem('username')
            : localStorage.getItem('username').toLocaleUpperCase()
        );
        paramsF.addFilter('valMinutesNumber', this.idProceeding);
        this.serviceProgrammingGood
          .getTmpProgValidation(paramsF.getParams())
          .subscribe(
            res => {
              VAL_MOVIMIENTO = res.data[0]['valmovement'];
            },
            err => {
              const fec_elab = this.form.get('fecElab').value;
              if (fec_elab != null) {
                if (
                  format(fec_elab, 'MM-yyyy') != format(new Date(), 'MM-yyyy')
                ) {
                  //!TIEMPO MÁXIMO
                } else if (this.form.get('folioEscaneo').value == null) {
                  this.alert(
                    'warning',
                    'Debe introducir el valor del folio',
                    ''
                  );
                } else
                  this.serviceDocuments.getByFolio(-73378).subscribe(
                    res => {
                      const data = JSON.parse(JSON.stringify(res));
                      const scanStatus = data.data[0]['scanStatus'];
                      let vBANVAL: boolean = true;
                      if (scanStatus === 'ESCANEADO') {
                        if (this.goodData.length <= 0) {
                          this.alert(
                            'warning',
                            'No hay bienes registrados',
                            'Necesita registrar bienes en el acta para crearla'
                          );
                        } else {
                          const modelEdit: IProccedingsDeliveryReception = {
                            statusProceedings: 'ABIERTA',
                            comptrollerWitness: this.form.get('testigo').value,
                            observations: this.form.get('observaciones').value,
                            witness1: this.form.get('autoridadCancela').value,
                            witness2: this.form.get('elabora').value,
                            address: this.form.get('direccion').value,
                            elaborationDate: format(
                              this.form.get('fecElab').value,
                              'yyyy-MM,dd HH:mm'
                            ),
                            datePhysicalReception: format(
                              this.form.get('fecCierreActa').value,
                              'yyyy-MM,dd HH:mm'
                            ),
                            captureDate: format(new Date(), 'yyyy-MM,dd HH:mm'),
                          };
                          this.serviceProcVal
                            .editProceeding(resData.id, modelEdit)
                            .subscribe(
                              res => {
                                this.labelActa = 'Cerrar acta';
                                this.btnCSSAct = 'btn-primary';
                                this.form
                                  .get('statusProceeding')
                                  .setValue('ABIERTA');
                                this.reopening = true;
                                this.inputsReopenProceeding();
                                this.alert(
                                  'success',
                                  'Acta abierta',
                                  `El acta ${
                                    this.form.get('acta2').value
                                  } fue abierta con`
                                );
                              },
                              err => {
                                console.log(err);
                                this.alert(
                                  'error',
                                  'No se pudo abrir el acta',
                                  'Ocurrió un error que no permite abrir el acta'
                                );
                              }
                            );
                        }
                      } else {
                        this.alert(
                          'warning',
                          'No se ha realizado el escaneo',
                          ''
                        );
                      }
                    },
                    err => {
                      if (this.goodData.length <= 0) {
                        this.alert(
                          'warning',
                          'No hay bienes registrados',
                          'Necesita registrar bienes en el acta para crearla'
                        );
                      } else {
                        const paramsF = new FilterParams();
                        let VAL_MOVIMIENTO = 0;

                        paramsF.addFilter(
                          'valUser',
                          localStorage.getItem('username') == 'sigebiadmon'
                            ? localStorage.getItem('username')
                            : localStorage
                                .getItem('username')
                                .toLocaleUpperCase()
                        );
                        paramsF.addFilter(
                          'valMinutesNumber',
                          this.idProceeding
                        );
                        this.serviceProgrammingGood
                          .getTmpProgValidation(paramsF.getParams())
                          .subscribe(
                            res => {
                              console.log(res);
                            },
                            err => {
                              const fec_elab = this.form.get('fecElab').value;
                              if (
                                fec_elab != null &&
                                format(fec_elab, 'MM-yyyy') !=
                                  format(new Date(), 'MM-yyyy')
                              ) {
                                this.alert(
                                  'warning',
                                  'Está fuera de tiempo para cerrar el acta',
                                  ''
                                );
                              } else if (
                                this.form.get('folioEscaneo').value === null
                              ) {
                                this.alert(
                                  'warning',
                                  'Debe introducir el valor del folio',
                                  ''
                                );
                              } else {
                                let newProceeding: IProccedingsDeliveryReception =
                                  {
                                    keysProceedings:
                                      this.form.get('acta2').value,
                                    elaborationDate: format(
                                      this.form.get('fecElab').value,
                                      'yyyy-MM,dd HH:mm'
                                    ),
                                    datePhysicalReception: format(
                                      this.form.get('fecCierreActa').value,
                                      'yyyy-MM,dd HH:mm'
                                    ),
                                    address: this.form.get('direccion').value,
                                    statusProceedings: 'ABIERTA',
                                    elaborate:
                                      localStorage.getItem('username') ==
                                      'sigebiadmon'
                                        ? localStorage.getItem('username')
                                        : localStorage
                                            .getItem('username')
                                            .toLocaleUpperCase(),
                                    numFile: this.form.get('expediente').value,
                                    witness1:
                                      this.form.get('autoridadCancela').value,
                                    witness2: this.form.get('elabora').value,
                                    typeProceedings:
                                      this.form
                                        .get('acta')
                                        .value.split('/')[0] == 'C'
                                        ? 'RECEPCAN'
                                        : 'SUSPENSION',
                                    responsible: null,
                                    destructionMethod: null,
                                    observations:
                                      this.form.get('observaciones').value,
                                    approvalDateXAdmon: null,
                                    approvalUserXAdmon: null,
                                    numRegister: null,
                                    captureDate: format(
                                      new Date(),
                                      'yyyy-MM,dd HH:mm'
                                    ),
                                    numDelegation1:
                                      this.form.get('admin').value
                                        .numberDelegation2,
                                    numDelegation2:
                                      parseInt(
                                        this.form.get('admin').value
                                          .numberDelegation2
                                      ) == 11
                                        ? '11'
                                        : null,
                                    identifier: null,
                                    label: null,
                                    universalFolio: null,
                                    numeraryFolio: null,
                                    numTransfer: null,
                                    idTypeProceedings:
                                      this.form.get('acta').value,
                                    receiptKey: null,
                                    comptrollerWitness:
                                      this.form.get('testigo').value,
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
                                this.serviceProcVal
                                  .postProceeding(newProceeding)
                                  .subscribe(
                                    res => {
                                      const paramsF = new FilterParams();
                                      paramsF.addFilter(
                                        'keysProceedings',
                                        this.form.get('acta2').value
                                      );
                                      this.serviceProcVal
                                        .getByFilter(paramsF.getParams())
                                        .subscribe(res => {
                                          const resData = JSON.parse(
                                            JSON.stringify(res.data)
                                          )[0];
                                          this.form
                                            .get('fecCaptura')
                                            .setValue(new Date());
                                          this.form
                                            .get('statusProceeding')
                                            .setValue('ABIERTA');
                                          this.labelActa = 'Cerrar acta';
                                          this.btnCSSAct = 'btn-primary';
                                          this.inputsInProceedingClose();
                                          this.alert(
                                            'success',
                                            'Acta abierta',
                                            `El acta ${
                                              this.form.get('acta2').value
                                            } fue abierta con`
                                          );
                                          const btn =
                                            document.getElementById(
                                              'expedient-number'
                                            );
                                          this.render.removeClass(
                                            btn,
                                            'disabled'
                                          );
                                          this.render.addClass(btn, 'enabled');
                                          this.blockExpedient = false;
                                        });
                                    },
                                    err => {
                                      console.log(err);
                                      this.alert(
                                        'error',
                                        'No se pudo abrir el acta',
                                        'Ocurrió un error que no permite abrir el acta'
                                      );
                                    }
                                  );
                              }
                            }
                          );
                      }
                    }
                  );
              }
            }
          );
      },
      err => {}
    );
  }

  openProceeding() {
    if (
      ['CERRADO', 'CERRADA'].includes(this.form.get('statusProceeding').value)
    ) {
      this.alertQuestion(
        'warning',
        `¿Está seguro de abrir el Acta ${this.form.get('acta2').value}?`,
        ''
      ).then(q => {
        if (q.isConfirmed) {
          const paramsF = new FilterParams();
          let VAL_MOVIMIENTO = 0;

          paramsF.addFilter(
            'valUser',
            localStorage.getItem('username') == 'sigebiadmon'
              ? localStorage.getItem('username')
              : localStorage.getItem('username').toLocaleUpperCase()
          );
          paramsF.addFilter('valMinutesNumber', this.idProceeding);
          this.serviceProgrammingGood
            .getTmpProgValidation(paramsF.getParams())
            .subscribe(
              res => {
                console.log(res);
                VAL_MOVIMIENTO = res.data[0]['valmovement'];
              },
              err => {
                console.log(err);
                VAL_MOVIMIENTO = 0;
              }
            );
          const splitActa = this.form.get('acta2').value.split('/');
          const tipo_acta = ['C'].includes(splitActa[0])
            ? 'RECEPCAN'
            : 'SUSPENSION';
          const lv_TIP_ACTA = `RF,${tipo_acta}`;

          const modelPaOpen: IPAAbrirActasPrograma = {
            P_NOACTA: this.idProceeding,
            P_AREATRA: lv_TIP_ACTA,
            P_PANTALLA: 'FACTREFCANCELAR',
            P_TIPOMOV: 2,
          };
          console.log(modelPaOpen);
          this.serviceProgrammingGood
            .paOpenProceedingProgam(modelPaOpen)
            .subscribe(
              res => {
                this.labelActa = 'Cerrar acta';
                this.btnCSSAct = 'btn-primary';
                this.form.get('statusProceeding').setValue('ABIERTA');
                this.reopening = true;
                this.inputsReopenProceeding();
                this.alert(
                  'success',
                  'Acta abierta',
                  `El acta ${this.form.get('acta2').value} fue abierta`
                );
                if (VAL_MOVIMIENTO === 1) {
                  this.serviceProgrammingGood
                    .paRegresaEstAnterior(modelPaOpen)
                    .subscribe(
                      res => {
                        this.labelActa = 'Abrir acta';
                        this.btnCSSAct = 'btn-success';
                        this.form.get('statusProceeding').setValue('CERRADO');
                        this.inputsInProceedingClose();
                        this.saveDataAct = [];
                        /* const btn = document.getElementById('expedient-number');
                        this.render.removeClass(btn, 'disabled');
                        this.render.addClass(btn, 'enabled'); */
                      },
                      err => {
                        console.log(err);
                        /* const btn = document.getElementById('expedient-number');
                        this.render.removeClass(btn, 'disabled');
                        this.render.addClass(btn, 'enabled'); */
                        this.alert(
                          'error',
                          'No se pudo abrir el acta',
                          'Ocurrió un error que no permite abrir el acta'
                        );
                      }
                    );
                }
              },
              err => {
                console.log(err);
                /* const btn = document.getElementById('expedient-number');
                this.render.removeClass(btn, 'disabled');
                this.render.addClass(btn, 'enabled'); */
                this.alert(
                  'error',
                  'No se pudo abrir el acta',
                  'Ocurrió un error que no permite abrir el acta'
                );
              }
            );
        }
      });
    } else {
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
            this.form.get('fecCierreActa').value,
            'yyyy-MM,dd HH:mm'
          ),
          address: this.form.get('direccion').value,
          statusProceedings: 'ABIERTA',
          elaborate:
            localStorage.getItem('username') == 'sigebiadmon'
              ? localStorage.getItem('username')
              : localStorage.getItem('username').toLocaleUpperCase(),
          numFile: this.form.get('expediente').value,
          witness1: this.form.get('autoridadCancela').value,
          witness2: this.form.get('elabora').value,
          typeProceedings:
            this.form.get('acta').value.split('/')[0] == 'C'
              ? 'RECEPCAN'
              : 'SUSPENSION',
          responsible: null,
          destructionMethod: null,
          observations: this.form.get('observaciones').value,
          approvalDateXAdmon: null,
          approvalUserXAdmon: null,
          numRegister: null,
          captureDate: format(new Date(), 'yyyy-MM,dd HH:mm'),
          numDelegation1: this.form.get('admin').value.numberDelegation2,
          numDelegation2:
            parseInt(this.form.get('admin').value.numberDelegation2) == 11
              ? '11'
              : null,
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
        if (
          this.form.get('acta2').value != null &&
          this.form.get('fecElab').value != null &&
          this.form.get('fecCierreActa').value != null &&
          this.form.get('direccion').value != null &&
          this.form.get('autoridadCancela').value != null &&
          this.form.get('elabora').value != null &&
          this.form.get('testigo').value != null
        ) {
          this.serviceProcVal.postProceeding(newProceeding).subscribe(
            res => {
              const paramsF = new FilterParams();
              paramsF.addFilter(
                'keysProceedings',
                this.form.get('acta2').value
              );
              this.serviceProcVal
                .getByFilter(paramsF.getParams())
                .subscribe(res => {
                  const resData = JSON.parse(JSON.stringify(res.data))[0];
                  this.form.get('fecCaptura').setValue(new Date());
                  this.form.get('statusProceeding').setValue('ABIERTA');
                  this.labelActa = 'Cerrar acta';
                  this.btnCSSAct = 'btn-primary';
                  this.inputsReopenProceeding();
                  this.alert(
                    'success',
                    'Acta creada con',
                    `El acta ${this.form.get('acta2').value} fue abierta`
                  );
                });
            },
            err => {
              console.log(err);
              console.log('Error al guardar');
              this.alert(
                'warning',
                'Se presento un error',
                'Se presento un error al intentar crear el acta, intentelo nuevamente'
              );
            }
          );
        } else {
          this.alert(
            'warning',
            'Debe llenar todos los campos para abrir el acta',
            ''
          );
        }
        console.log(newProceeding);
      }
    }
  }

  saveButton() {
    if (!this.act2Valid) {
      this.alert('warning', 'Debe registrar un acta válida', '');
    } else if (!this.form.get('direccion').valid) {
      this.alert('warning', 'Debe registrar una dirección válida', '');
    } else if (!this.form.get('autoridadCancela').valid) {
      this.alert('warning', 'Debe registrar un dato de Autoridad válido', '');
    } else if (!this.form.get('direccion').valid) {
      this.alert('warning', 'Debe registrar una dirección válida', '');
    } else if (!this.form.get('fecElab').valid) {
      this.alert(
        'warning',
        'Debe registrar una fecha de elaboración válida',
        ''
      );
    } else if (!this.form.get('elabora').valid) {
      this.alert(
        'warning',
        'Debe registrar un dato de quien Elabora válido',
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
            observations: this.form.get('observaciones').value,
            witness1: this.form.get('autoridadCancela').value,
            witness2: this.form.get('elabora').value,
            address: this.form.get('direccion').value,
            captureDate: format(new Date(), 'yyyy-MM,dd HH:mm'),
            universalFolio: this.form.get('folioEscaneo').value,
          };
          const resData = JSON.parse(JSON.stringify(res.data[0]));
          console.log(modelEdit);
          this.serviceProcVal.editProceeding(resData.id, modelEdit).subscribe(
            res => {
              this.alert('success', 'Se modificaron los datos del acta', '');
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
          console.log(this.form.get('acta').value.split('/')[0]);

          let newProceeding: IProccedingsDeliveryReception = {
            keysProceedings: this.form.get('acta2').value,
            elaborationDate: format(
              this.form.get('fecElab').value,
              'yyyy-MM,dd HH:mm'
            ),
            datePhysicalReception: format(
              this.form.get('fecCierreActa').value,
              'yyyy-MM,dd HH:mm'
            ),
            address: this.form.get('direccion').value,
            elaborate:
              localStorage.getItem('username') == 'sigebiadmon'
                ? localStorage.getItem('username')
                : localStorage.getItem('username').toLocaleUpperCase(),
            numFile: this.form.get('expediente').value,
            witness1: this.form.get('autoridadCancela').value,
            witness2: this.form.get('elabora').value,
            typeProceedings:
              this.form.get('acta').value.split('/')[0] == 'C'
                ? 'RECEPCAN'
                : 'SUSPENSION',
            responsible: null,
            destructionMethod: null,
            statusProceedings: 'ABIERTA',
            observations: this.form.get('observaciones').value,
            approvalDateXAdmon: null,
            approvalUserXAdmon: null,
            numRegister: null,
            captureDate: format(new Date(), 'yyyy-MM,dd HH:mm'),
            numDelegation1: this.form.get('admin').value.numberDelegation2,
            numDelegation2:
              parseInt(this.form.get('admin').value.numberDelegation2) == 11
                ? '11'
                : null,
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
              this.initialBool = true;
              this.form.get('statusProceeding').setValue('ABIERTA');
              this.form.get('fecCaptura').setValue(new Date());
              console.log(res);
              this.proceedingData.push(res);
              this.navigateProceedings = true;
              this.idProceeding = JSON.parse(JSON.stringify(res)).id;
              this.alert('success', 'Se guardo el acta', '');
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

  refillData() {
    const paramsF = new FilterParams();
    paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        const paramsF = new FilterParams();
        paramsF.addFilter(
          'numFile',
          JSON.parse(JSON.stringify(res.data[0])).numFile.toString(),
          SearchFilter.EQ
        );
        paramsF.addFilter(
          'typeProceedings',
          'SUSPENSION,RECEPCAN',
          SearchFilter.IN
        );
        this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
          res => {
            console.log(res);
          },
          err => {
            console.log(err);
          }
        );
      },
      err => {}
    );
  }

  fnOpenProceeding() {
    if (
      ['CERRADO', 'CERRADA'].includes(this.form.get('statusProceeding').value)
    ) {
      this.alertQuestion(
        'warning',
        `¿Está seguro de abrir el Acta ${this.form.get('acta2').value}?`,
        ''
      ).then(q => {
        if (q.isConfirmed) {
          const paramsF = new FilterParams();
          let VAL_MOVIMIENTO = 0;

          paramsF.addFilter(
            'valUser',
            localStorage.getItem('username') == 'sigebiadmon'
              ? localStorage.getItem('username')
              : localStorage.getItem('username').toLocaleUpperCase()
          );
          paramsF.addFilter('valMinutesNumber', this.idProceeding);
          this.serviceProgrammingGood
            .getTmpProgValidation(paramsF.getParams())
            .subscribe(
              res => {
                console.log(res);
                VAL_MOVIMIENTO = res.data[0]['valmovement'];
              },
              err => {
                console.log(err);
                VAL_MOVIMIENTO = 0;
              }
            );
          const splitActa = this.form.get('acta2').value.split('/');
          const tipo_acta = ['C'].includes(splitActa[0])
            ? 'RECEPCAN'
            : 'SUSPENSION';
          const lv_TIP_ACTA = `RF,${tipo_acta}`;

          const modelPaOpen: IPAAbrirActasPrograma = {
            P_NOACTA: this.idProceeding,
            P_AREATRA: lv_TIP_ACTA,
            P_PANTALLA: 'FACTREFCANCELAR',
            P_TIPOMOV: 2,
          };
          console.log(modelPaOpen);
          this.serviceProgrammingGood
            .paOpenProceedingProgam(modelPaOpen)
            .subscribe(
              res => {
                this.labelActa = 'Cerrar acta';
                this.btnCSSAct = 'btn-primary';
                this.form.get('statusProceeding').setValue('ABIERTA');
                this.reopening = true;
                this.inputsReopenProceeding();
                this.alert(
                  'success',
                  'Acta abierta',
                  `El acta ${this.form.get('acta2').value} fue abierta`
                );
                if (VAL_MOVIMIENTO === 1) {
                  this.serviceProgrammingGood
                    .paRegresaEstAnterior(modelPaOpen)
                    .subscribe(
                      res => {
                        this.labelActa = 'Abrir acta';
                        this.btnCSSAct = 'btn-success';
                        this.form.get('statusProceeding').setValue('CERRADO');
                        this.inputsInProceedingClose();
                        this.saveDataAct = [];
                        this.alert('success', 'El acta fue abierta', '');
                        /* const btn = document.getElementById('expedient-number');
                        this.render.removeClass(btn, 'disabled');
                        this.render.addClass(btn, 'enabled'); */
                      },
                      err => {
                        console.log(err);
                        /* const btn = document.getElementById('expedient-number');
                        this.render.removeClass(btn, 'disabled');
                        this.render.addClass(btn, 'enabled'); */
                        this.alert(
                          'error',
                          'No se pudo abrir el acta',
                          'Ocurrió un error que no permite abrir el acta'
                        );
                      }
                    );
                }
              },
              err => {
                console.log(err);
                /* const btn = document.getElementById('expedient-number');
                this.render.removeClass(btn, 'disabled');
                this.render.addClass(btn, 'enabled'); */
                this.alert(
                  'error',
                  'No se pudo abrir el acta',
                  'Ocurrió un error que no permite abrir el acta'
                );
              }
            );
        }
      });
    } else {
      this.newOpenProceeding();
    }
  }

  closeProceeding() {
    if (this.dataGoodAct['data'].length === 0) {
      this.alert(
        'warning',
        'No se registraron bienes',
        'El Acta no contiene Bienes, no se podrá Cerrar.'
      );
    } else {
      console.log(this.reopening);
      if (this.reopening) {
        //!@
        const paramsF = new FilterParams();
        paramsF.addFilter('numberProceedings', this.idProceeding);
        this.serviceDetailProc.getAllFiltered(paramsF.getParams()).subscribe(
          res => {
            console.log(res.data);
            const idProcee = res.data[0]['numberProceedings'];
            console.log(idProcee);
            const resData = JSON.parse(JSON.stringify(res.data));
            console.log(this.saveDataAct);
            for (let item of resData) {
              this.saveDataAct = this.saveDataAct.filter(
                (e: any) => e.id != item.id
              );
            }
            console.log(this.saveDataAct);
            const paramsF = new FilterParams();
            paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
            this.serviceProcVal
              .getByFilter(paramsF.getParams())
              .subscribe(res => {
                const modelEdit: IProccedingsDeliveryReception = {
                  statusProceedings: 'CERRADA',
                  comptrollerWitness: this.form.get('testigo').value,
                  observations: this.form.get('observaciones').value,
                  witness1: this.form.get('autoridadCancela').value,
                  witness2: this.form.get('elabora').value,
                  address: this.form.get('direccion').value,
                };
                const resData = JSON.parse(JSON.stringify(res.data[0]));
                console.log(modelEdit);
                console.log(resData.id);
                this.serviceProcVal
                  .editProceeding(resData.id, modelEdit)
                  .subscribe(
                    res => {
                      this.form.get('statusProceeding').setValue('CERRADO');
                      this.idProceeding = parseInt(idProcee.toString());
                      this.labelActa = 'Abrir acta';
                      this.btnCSSAct = 'btn-success';
                      this.alert(
                        'success',
                        'Acta cerrada',
                        'El acta fue cerrada'
                      );
                      this.inputsInProceedingClose();
                      this.getGoodsActFn();
                    },
                    err => {
                      console.log(err);
                      this.alert(
                        'error',
                        'Ocurrió un error',
                        'Ocurrió un error inesperado que no permitió cerrar el acta'
                      );
                    }
                  );
              });
          },
          err => {
            console.log(err);
            this.alert(
              'error',
              'Ocurrió un error',
              'Ocurrió un error inesperdo que no permitió cerrar el acta'
            );
          }
        );
      } else {
        const paramsF = new FilterParams();
        const splitActa = this.form.get('acta2').value.split('/');
        const tipoAct = splitActa[0] === 'C' ? 'RECEPCAN' : 'SUSPENSION';

        paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
        this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(res => {
          const idProceed = JSON.parse(JSON.stringify(res.data[0])).id;
          const paramsFProg = new FilterParams();
          paramsFProg.addFilter(
            'valUser',
            localStorage.getItem('username') == 'sigebiadmon'
              ? localStorage.getItem('username')
              : localStorage.getItem('username').toLocaleUpperCase()
          );
          paramsFProg.addFilter('valMinutesNumber', idProceed);
          this.serviceProgrammingGood
            .getTmpProgValidation(paramsFProg.getParams())
            .subscribe(
              res => {
                const VAL_MOVIMIENTO = res.data[0]['valmovement'];
                if (VAL_MOVIMIENTO != 0) {
                } else {
                }
              },
              err => {
                const V_NO_ACTA = idProceed;
                const FEC_ELAB = this.form.get('fecElab').value;
                if (FEC_ELAB != null) {
                  if (
                    format(FEC_ELAB, 'MM-yyyy') != format(new Date(), 'MM-yyyy')
                  ) {
                    this.alert(
                      'error',
                      'Está fuera de tiempo para cerrar el acta',
                      ''
                    );
                  } else {
                    if (this.form.get('folioEscaneo').value === null) {
                      this.alert(
                        'warning',
                        'Debe introducir el valor del folio',
                        ''
                      );
                    } else {
                      this.serviceDocuments
                        .getByFolio(-73378)
                        .subscribe(res => {
                          const data = JSON.parse(JSON.stringify(res));
                          const scanStatus = data.data[0]['scanStatus'];
                          let vBANVAL: boolean = true;
                          if (scanStatus === 'ESCANEADO') {
                            for (let item of this.dataGoodAct['data']) {
                              const goodClass = item.goodClassNumber;
                              const newParams = `filter.numClasifGoods=$eq:${goodClass}`;
                              this.serviceSssubtypeGood
                                .getFilter(newParams)
                                .subscribe(res => {
                                  const type = JSON.parse(
                                    JSON.stringify(res.data[0]['numType'])
                                  );
                                  const subtype = JSON.parse(
                                    JSON.stringify(res.data[0]['numSubType'])
                                  );

                                  const no_type = parseInt(type.id);
                                  const no_subtype = parseInt(subtype.id);
                                  if (
                                    no_type === 7 &&
                                    item.storeNumber === null
                                  ) {
                                    if ((vBANVAL = true)) {
                                      vBANVAL = false;
                                    }
                                  } else if (
                                    no_type === 5 &&
                                    no_subtype === 16 &&
                                    item.storeNumber === null &&
                                    item.vaultNumber === null
                                  ) {
                                    if ((vBANVAL = true)) {
                                      vBANVAL = false;
                                    }
                                  } else if (
                                    no_type === 5 &&
                                    no_subtype != 16 &&
                                    item.storeNumber === NonNullAssert
                                  ) {
                                    if ((vBANVAL = true)) {
                                      vBANVAL = false;
                                    }
                                  }
                                });
                            }
                            if (!vBANVAL) {
                              this.alert(
                                'error',
                                'Hay bienes en el acta que no están guardados en un un almacén',
                                ''
                              );
                            } else {
                              const model: IPACambioStatus = {
                                P_NOACTA: idProceed,
                                P_PANTALLA: 'FACTREFCANCELAR',
                                P_FECHA_RE_FIS:
                                  this.form.get('fecCierreActa').value,
                                P_TIPO_ACTA: tipoAct,
                                usuario:
                                  localStorage.getItem('username') ==
                                  'sigebiadmon'
                                    ? localStorage.getItem('username')
                                    : localStorage
                                        .getItem('username')
                                        .toLocaleUpperCase(),
                              };
                              this.serviceProgrammingGood
                                .paChangeStatus(model)
                                .subscribe(res => {
                                  console.log(res);
                                  const modelEdit: IProccedingsDeliveryReception =
                                    {
                                      comptrollerWitness:
                                        this.form.get('testigo').value,
                                      observations:
                                        this.form.get('observaciones').value,
                                      witness1:
                                        this.form.get('autoridadCancela').value,
                                      witness2: this.form.get('elabora').value,
                                      address: this.form.get('direccion').value,
                                      universalFolio:
                                        this.form.get('folioEscaneo').value,
                                    };
                                  this.serviceProcVal
                                    .editProceeding(idProceed, modelEdit)
                                    .subscribe(
                                      res => {
                                        console.log(res);
                                        this.form
                                          .get('statusProceeding')
                                          .setValue('CERRADO');
                                        this.labelActa = 'Abrir acta';
                                        this.btnCSSAct = 'btn-success';
                                        this.idProceeding = idProceed;
                                        this.getGoodsActFn();
                                        this.alert(
                                          'success',
                                          'Acta cerrada',
                                          'El acta fue cerrada'
                                        );
                                        this.inputsInProceedingClose();
                                      },
                                      err => {
                                        console.log(err);
                                        this.alert(
                                          'error',
                                          'Ocurrió un error',
                                          'Ocurrió un error inesperado que no permitió cerrar el acta'
                                        );
                                      }
                                    );
                                });
                            }
                          } else {
                            this.alert(
                              'warning',
                              'El folio no ha sido escaneado',
                              ''
                            );
                          }
                        });
                    }
                  }
                }
              }
            );
        });
      }
    }
  }

  deleteProceeding() {
    console.log(this.form.get('fecElab').value);
    if (this.form.get('statusProceeding').value != null) {
      if (this.v_atrib_del === 0) {
        if (
          ['CERRADO', 'CERRADA'].includes(
            this.form.get('statusProceeding').value
          )
        ) {
          this.alert(
            'error',
            'No puede elimar acta',
            'No puede eliminar un Acta cerrada'
          );
        } else if (
          this.form.get('fecElab').value != null &&
          format(this.form.get('fecElab').value, 'MM-yyyy') !=
            format(new Date(), 'MM-yyyy')
        ) {
          this.alert(
            'error',
            'No puede eliminar acta',
            'No puede eliminar un Acta fuera del mes de elaboración'
          );
        } else {
          this.alertQuestion(
            'question',
            '¿Desea eliminar el acta?',
            `Se eliminará el acta ${this.form.get('acta2').value}`,
            'Eliminar'
          ).then(q => {
            if (q.isConfirmed) {
              const keysProceedings = this.form.get('acta2').value;
              const paramsF = new FilterParams();
              paramsF.addFilter(
                'keysProceedings',
                this.form.get('acta2').value
              );
              this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
                res => {
                  console.log();
                  const realData = JSON.parse(JSON.stringify(res.data[0]));
                  this.serviceDetailProc
                    .PADelActaEntrega(realData.id)
                    .subscribe(async res => {
                      this.alert(
                        'success',
                        'El acta fue eliminada',
                        'Se recargará la página'
                      );
                      this.clearInputs();
                      this.loading = true;
                      this.form;
                      this.goodsByExpediente();

                      /* this.form
                        .get('expediente')
                        .setValue(this.numberExpedient);
                      /* await this.dataGoods.load(
                        this.dataGoods['data'].map((e: any) => {
                          for (let element of this.dataGoodAct['data']) {
                            if (e.id === element.id) {
                              return { ...e, avalaible: true, acta: null };
                            } else {
                              return e;
                            }
                          }
                        })
                      ); */

                      /* this.getGoodsByExpedient();
                      this.form.get('statusProceeding').reset();
                      if (this.proceedingData.length === 1) {
                        this.navigateProceedings = false;
                        this.nextProce = true;
                        this.prevProce = true;
                        this.numberProceeding = 0;
                        this.form.get('statusProceeding').reset();
                        this.labelActa = 'Cerrar acta';
                        this.btnCSSAct = 'btn-primary';
                      } else {
                        this.proceedingData.filter((e: any) => {
                          return e.keysProceedings != keysProceedings;
                        });
                        if (this.proceedingData.length === 1) {
                          this.navigateProceedings = false;
                          this.nextProce = true;
                          this.prevProce = true;
                          this.numberProceeding = 0;
                          this.form.get('statusProceeding').reset();
                          this.labelActa = 'Cerrar acta';
                          this.btnCSSAct = 'btn-primary';
                        } else {
                          this.numberProceeding =
                            this.proceedingData.length - 1;
                          this.prevProceeding();
                        }
                      }
                      this.alert('success', 'Acta eliminada', ''); */
                    });
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
      }
    }
  }

  //NAVIGATE PROCEEDING
  nextProceeding() {
    this.prevProce = false;
    this.nextProce = false;
    this.loading = true;
    this.act2Valid = false;
    this.clearInputs();

    if (this.numberProceeding <= this.proceedingData.length - 1) {
      this.numberProceeding += 1;
      console.log(this.prevProce);
      console.log(this.numberProceeding);
      console.log(this.proceedingData.length - 1);
      if (this.numberProceeding <= this.proceedingData.length - 1) {
        console.log(this.prevProce);
        console.log(this.numberProceeding);
        this.act2Valid = false;
        const dataRes = JSON.parse(
          JSON.stringify(this.proceedingData[this.numberProceeding])
        );
        this.fillIncomeProceeding(dataRes, 'nextProceeding');
      } else {
        this.numberProceeding = 0;
        const dataRes = JSON.parse(
          JSON.stringify(this.proceedingData[this.numberProceeding])
        );
        this.fillIncomeProceeding(dataRes, 'nextProceeding');
        this.act2Valid = false;
      }
    }
  }

  prevProceeding() {
    this.initialBool = true;
    this.newAct = true;
    this.loading = true;
    this.noRequireAct1();
    this.clearInputs();

    if (
      this.numberProceeding <= this.proceedingData.length &&
      this.numberProceeding > 0
    ) {
      this.numberProceeding -= 1;
      console.log(this.numberProceeding);
      if (this.numberProceeding <= this.proceedingData.length - 1) {
        const dataRes = JSON.parse(
          JSON.stringify(this.proceedingData[this.numberProceeding])
        );
        this.fillIncomeProceeding(dataRes, 'prevProceeding');

        this.act2Valid = false;
      }
    } else {
      this.numberProceeding = this.proceedingData.length - 1;
      const dataRes = JSON.parse(
        JSON.stringify(this.proceedingData[this.numberProceeding])
      );
      this.fillIncomeProceeding(dataRes, 'prevProceeding');

      this.act2Valid = false;
    }
  }
}
