import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addDays, endOfMonth, format, subDays } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { transferenteAndAct } from 'src/app/common/validations/custom.validators';
import {
  IPAAbrirActasPrograma,
  IPACambioStatus,
} from 'src/app/core/models/good-programming/good-programming';
import {
  IAcceptGoodStatus,
  IAcceptGoodStatusScreen,
} from 'src/app/core/models/ms-good/good';
import {
  IDeleteDetailProceeding,
  IDetailProceedingsDeliveryReception,
} from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { TransferProceeding } from 'src/app/core/models/ms-proceedings/validations.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ClassifyGoodService } from 'src/app/core/services/ms-classifygood/ms-classifygood.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
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
      id: {
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
      exchangeValue: {
        title: 'Recibido',
        type: 'custom',
        filter: false,
        sort: false,
        renderComponent: CheckboxElementComponent,
        valuePrepareFunction: (isSelected: any, row: any) => {
          return row.exchangeValue == 1 ? true : false;
        },
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onSelectRow(instance),
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
  blockExpedient = false;
  isEnableEntrega = true;
  isEnableFecElabRecibo = true;
  isEnableFecEntrBien = true;
  isEnableFecElab = true;
  isEnableObservaciones = true;
  isEnableRecibe = true;
  isEnableTestigo = true;
  reopening = false;

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
    private render: Renderer2,
    private serviceClassifyGood: ClassifyGoodService,
    private serviceGoodQuery: GoodsQueryService,
    private serviceProgrammingGood: ProgrammingGoodService
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

  onSelectRow(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        if (!['CERRADO', 'CERRADA'].includes(this.statusProceeding)) {
          const modelEdit: IDetailProceedingsDeliveryReception = {
            exchangeValue: data.toggle ? 1 : null,
            numberGood: data.row.id,
            numberProceedings: this.idProceeding,
            received: data.toggle ? 'S' : null
          };
          this.serviceDetailProc.editDetailProcee(modelEdit).subscribe(
            res => {
              data.row.exchangeValue = data.toggle ? 1 : null;
              data.row.received = data.toggle ? 'S' : null
            },
            err => {
              console.log(err);
            }
          );
        } else {
          this.dataGoodAct.load(this.dataGoodAct['data']);
        }
      },
    });
  }

  searchByOthersData() {
    const paramsF = new FilterParams();
    if (this.form.get('averPrev').value != null) {
      paramsF.addFilter('preliminaryInquiry', this.form.get('averPrev').value);
      this.serviceExpedient.getAllFilter(paramsF.getParams()).subscribe(
        res => {
          console.log(res);
          this.searchByOtherData = true;
          this.dataExpedients = new DefaultSelect(res.data);
        },
        err => {
          console.log(err);
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
          console.log(res);
          this.searchByOtherData = true;
          this.dataExpedients = new DefaultSelect(res.data);
        },
        err => {
          console.log(err);
          this.form.get('causaPenal').setValue(null);
          this.dataExpedients = new DefaultSelect();
          this.alert('error', 'La causa penal colocada no tiene datos', '');
        }
      );
    }
    this.blockExpedient = false;
  }

  selectExpedient(e: any) {
    console.log(e);
    this.form.get('expediente').setValue(e.id);
    this.goodsByExpediente();
  }

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
    console.log(modelScreen);
    return new Promise((resolve, reject) => {
      this.serviceGoodProcess.getacceptGoodStatusScreen(modelScreen).subscribe(
        res => {
          console.log(res);
          console.log(res.message);
          if (typeof res == 'number' && res > 0) {
            di_disponible = true;
            console.log('Entro if');
            this.serviceGoodProcess.getacceptGoodStatus(modelStatus).subscribe(
              res => {
                const resDis = JSON.stringify(res);
                if (typeof res == 'string' && res != 'S') {
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

  statusGood(formName: string, data: any) {
    console.log(formName);
    const paramsF = new FilterParams();
    paramsF.addFilter('status', data.status);
    this.serviceGood.getStatusGood(paramsF.getParams()).subscribe(
      res => {
        this.form.get(formName).setValue(res.data[0]['description']);
      },
      err => {
        this.form.get(formName).setValue(null);
      }
    );
  }

  rowSelect(e: any) {
    const { data } = e;
    console.log(data);
    this.selectData = data;
    this.statusGood('estatusPrueba', data);
  }

  deselectRow() {
    this.selectData = null;
    this.form.get('estatusPrueba').setValue('');
  }

  selectRowGoodActa(e: any) {
    const { data } = e;
    console.log(data);
    this.selectActData = data;
    this.statusGood('etiqueta', data);
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
            this.blockExpedient = false;
            this.alert('error', 'Clave de transferente inválida', '');
            this.dataGoods.load([]);
            this.dataGoodAct.load([]);
            this.goodData = [];
          }
        );
        /* this.enableElement('acta'); */
      });
  }

  fillIncomeProceeding(dataRes: any) {
    console.log(dataRes);
    const paramsF = new FilterParams();
    this.initialBool = true;
    this.minDateFecElab = addDays(new Date(dataRes.elaborationDate), 1);
    paramsF.addFilter('numberProceedings', dataRes.id);
    paramsF.addFilter('keysProceedings', dataRes.keysProceedings);
    this.serviceDetailProc.getAllFiltered(paramsF.getParams()).subscribe(
      async res => {
        console.log(res);
        const data = this.dataGoods;
        const incomeData = res.data;
        for (let i = 0; i < incomeData.length; i++) {
          const element = JSON.parse(JSON.stringify(incomeData[i]));
          const edoFis: any = await this.getIndEdoFisAndVColumna(element.good);
          this.goodData.push({
            ...element.good,
            exchangeValue: element.exchangeValue === '1' ? 1 : null,
            indEdoFisico: edoFis.V_IND_EDO_FISICO === 1 ? true : false,
          });
          this.dataGoods.load(
            this.dataGoods['data'].map((e: any) => {
              if (e.id == element.good.id) {
                return {
                  ...e,
                  avalaible: false,
                  exchangeValue: element.exchangeValue === '1' ? 1 : null,
                  received: element.exchangeValue ? 'S' : null,
                  acta: dataRes.keysProceedings,
                };
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

  getIndEdoFisAndVColumna(data: any) {
    let V_IND_EDO_FISICO: number;
    let V_NO_COLUMNA: number;
    console.log(data.goodClassNumber);

    return new Promise((resolve, reject) => {
      const paramsF = new FilterParams();
      paramsF.addFilter('type', 'EDO_FIS');
      paramsF.addFilter('classifyGoodNumber', data.goodClassNumber);
      this.serviceClassifyGood.getChangeClass(paramsF.getParams()).subscribe(
        res => {
          V_IND_EDO_FISICO = 1;
          const paramsF2 = new FilterParams();
          paramsF2.addFilter('classifGoodNumber', data.goodClassNumber);
          paramsF2.addFilter('attribute', 'ESTADO FISICO', SearchFilter.ILIKE);
          this.serviceGoodQuery
            .getAtributeClassificationGoodFilter(paramsF2.getParams())
            .subscribe(
              res => {
                console.log(res);
                if (res.data[0]) {
                  V_NO_COLUMNA = res.data[0].columnNumber;
                  resolve({ V_NO_COLUMNA, V_IND_EDO_FISICO });
                }
              },
              err => {
                console.log(err);
                V_NO_COLUMNA = 0;
                resolve({ V_NO_COLUMNA, V_IND_EDO_FISICO });
              }
            );
        },
        err => {
          console.log(err);
          V_IND_EDO_FISICO = 0;
          V_NO_COLUMNA = 0;
          const paramsF2 = new FilterParams();
          paramsF2.addFilter('classifGoodNumber', data.goodClassNumber);
          paramsF2.addFilter('attribute', 'ESTADO FISICO', SearchFilter.ILIKE);
          this.serviceGoodQuery
            .getAtributeClassificationGoodFilter(paramsF2.getParams())
            .subscribe(
              res => {
                console.log(res);
                if (res.data[0]) {
                  V_NO_COLUMNA = res.data[0].columnNumber;
                  resolve({ V_NO_COLUMNA, V_IND_EDO_FISICO });
                }
              },
              err => {
                V_NO_COLUMNA = 0;
                resolve({ V_NO_COLUMNA, V_IND_EDO_FISICO });
              }
            );
          resolve({ V_NO_COLUMNA, V_IND_EDO_FISICO });
        }
      );
    });
  }

  saveButton() {
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
              'yyyy-MM-dd HH:mm'
            ),
            datePhysicalReception: format(
              this.form.get('fecRecepFisica').value,
              'yyyy-MM-dd HH:mm'
            ),
            dateElaborationReceipt: format(
              this.form.get('fecElabRecibo').value,
              'yyyy-MM-dd HH:mm'
            ),
            dateDeliveryGood: format(
              this.form.get('fecEntregaBienes').value,
              'yyyy-MM-dd HH:mm'
            ),
            captureDate: format(new Date(), 'yyyy-MM-dd HH:mm'),
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
              'yyyy-MM-dd HH:mm'
            ),
            datePhysicalReception: format(
              this.form.get('fecRecepFisica').value,
              'yyyy-MM-dd HH:mm'
            ),
            dateElaborationReceipt: format(
              this.form.get('fecElabRecibo').value,
              'yyyy-MM-dd HH:mm'
            ),
            dateDeliveryGood: format(
              this.form.get('fecEntregaBienes').value,
              'yyyy-MM-dd HH:mm'
            ),
            captureDate: format(new Date(), 'yyyy-MM-dd HH:mm'),

            keysProceedings: this.form.get('acta2').value,
            /* elaborate: 'SERA', */
            elaborate: localStorage.getItem('username').toLocaleUpperCase(),
            numFile: parseInt(this.numberExpedient),
            typeProceedings: 'DXCVENT',
            responsible: null,
            destructionMethod: null,
            approvalDateXAdmon: null,
            approvalUserXAdmon: null,
            numRegister: null,
            numDelegation1: this.form.get('recibe').value.numberDelegation2,
            numDelegation2:
              this.form.get('recibe').value.numberDelegation2 === 11
                ? 11
                : null,
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
          console.log(newProceeding);
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
    paramsF.addFilter('typeProceedings', 'DXCVENT');
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.blockExpedient = false;

        if (res.data != null) {
          console.log('Entro');
          console.log(res.data);
          this.proceedingData = res.data;
          const dataRes = JSON.parse(JSON.stringify(res.data[0]));
          this.fillIncomeProceeding(dataRes);
          console.log(typeof dataRes);
        } else {
          console.log('No entro');
          this.initialBool = false;
          this.minDateFecElab = new Date();
          this.checkChange();
          this.getTransfer();
        }
      },
      err => {
        console.log(err);
        this.initialBool = false;
        this.checkChange();
        this.getTransfer();
        this.blockExpedient = false;
      }
    );
  }

  blockAllInputs() {
    this.initialBool = true;
    this.isEnableEntrega = false;
    this.isEnableFecElabRecibo = false;
    this.isEnableFecEntrBien = false;
    this.isEnableFecElab = false;
    this.isEnableObservaciones = false;
    this.isEnableRecibe = false;
    this.isEnableTestigo = false;
  }

  unlockAllInputs() {
    this.initialBool = false;
    this.isEnableEntrega = true;
    this.isEnableFecElabRecibo = true;
    this.isEnableFecEntrBien = true;
    this.isEnableFecElab = true;
    this.isEnableObservaciones = true;
    this.isEnableRecibe = true;
    this.isEnableTestigo = true;
  }

  goodsByExpediente() {
    this.getDataExpedient();
    this.nextProce = true;
    this.prevProce = false;
    this.navigateProceedings = false;
    this.act2Valid = false;
    this.initialBool = true;
    this.blockExpedient = true;
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
              this.blockExpedient = false;
            }
          },
          error: (err: any) => {
            console.error(err);
            this.blockExpedient = false;
            this.blockAllInputs();
            this.alert(
              'warning',
              'No hay bienes para este expediente',
              'No existen bienes en este expediente, por favor revisa que el número que hayas ingresado sea el correcto.'
            );
          },
        });
    } else {
      this.searchByOthersData()
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
      this.newOpenProceeding();
    } else {
      this.closeProceeding();
    }
  }

  requireAct() {
    this.form.get('acta').setValidators([Validators.required]);
    this.form.get('transfer').setValidators([Validators.required]);
    this.form.get('ident').setValidators([Validators.required]);
    this.form.get('entrego').setValidators([Validators.required]);
    this.form.get('recibe').setValidators([Validators.required]);
    this.form.get('folio').setValidators([Validators.required]);

    this.form.get('acta').updateValueAndValidity();
    this.form.get('transfer').updateValueAndValidity();
    this.form.get('ident').updateValueAndValidity();
    this.form.get('entrego').updateValueAndValidity();
    this.form.get('recibe').updateValueAndValidity();
    this.form.get('folio').updateValueAndValidity();
  }

  noRequireAct() {
    this.form.get('acta').setValidators([]);
    this.form.get('transfer').setValidators([]);
    this.form.get('ident').setValidators([]);
    this.form.get('entrego').setValidators([]);
    this.form.get('recibe').setValidators([]);
    this.form.get('folio').setValidators([]);

    this.form.get('acta').updateValueAndValidity();
    this.form.get('transfer').updateValueAndValidity();
    this.form.get('ident').updateValueAndValidity();
    this.form.get('entrego').updateValueAndValidity();
    this.form.get('recibe').updateValueAndValidity();
    this.form.get('folio').updateValueAndValidity();
  }

  inputOpenProceeding() {
    this.initialBool = true;
    this.isEnableEntrega = true;
    this.isEnableFecElabRecibo = true;
    this.isEnableFecEntrBien = true;
    this.isEnableFecElab = false;
    this.isEnableObservaciones = true;
    this.isEnableRecibe = true;
    this.isEnableTestigo = true;
    this.noRequireAct();
  }

  newOpenProceeding() {
    const paramsF = new FilterParams();
    paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        if (['CERRADO', 'CERRADA'].includes(this.statusProceeding)) {
          this.alertQuestion(
            'question',
            `¿Está seguro de abrir el acta ${this.form.get('acta2')}?`,
            ''
          ).then(q => {
            if (q.isConfirmed) {
              const lv_TIP_ACTA = 'DX,DXCV';
              const modelPaOpen: IPAAbrirActasPrograma = {
                P_NOACTA: this.idProceeding,
                P_AREATRA: lv_TIP_ACTA,
                P_PANTALLA: 'FACTREFACTAENTREC',
                P_TIPOMOV: 2,
              };
              this.serviceProgrammingGood
                .paOpenProceedingProgam(modelPaOpen)
                .subscribe(
                  res => {
                    this.labelActa = 'Cerrar acta';
                    this.btnCSSAct = 'btn-primary';
                    this.statusProceeding = 'ABIERTA';
                    this.reopening = true;
                    const paramsF = new FilterParams();
                    paramsF.addFilter(
                      'valUser',
                      localStorage.getItem('username').toLocaleLowerCase()
                    );
                    paramsF.addFilter('valMinutesNumber', this.idProceeding);
                    this.serviceProgrammingGood
                      .getTmpProgValidation(paramsF.getParams())
                      .subscribe(
                        res => {
                          console.log(res);
                          const VAL_MOVIMIENTO = res.data[0]['valmovement'];
                          if (VAL_MOVIMIENTO === 1) {
                            this.serviceProgrammingGood
                              .paRegresaEstAnterior(modelPaOpen)
                              .subscribe(
                                res => {
                                  this.labelActa = 'Abrir acta';
                                  this.btnCSSAct = 'btn-primary';
                                  this.statusProceeding = 'CERRADO';
                                  const btn =
                                    document.getElementById('expedient-number');
                                  this.render.removeClass(btn, 'disabled');
                                  this.render.addClass(btn, 'enabled');
                                },
                                err => {
                                  console.log(err);
                                  const btn =
                                    document.getElementById('expedient-number');
                                  this.render.removeClass(btn, 'disabled');
                                  this.render.addClass(btn, 'enabled');
                                }
                              );
                          } else {
                            this.alert('success', 'El acta fue abierta', '');
                          }
                        },
                        err => {
                          this.alert('success', 'El acta fue abierta', '');
                        }
                      );
                  },
                  err => {
                    this.alert(
                      'error',
                      'Se presentó un error inesperado',
                      'Se presentó un error inesperado al intentar abrir el acta. Por favor intentelo nuevamente'
                    );
                  }
                );
            }
          });
        } else {
          const resData = JSON.parse(JSON.stringify(res.data))[0];
          const paramsF = new FilterParams();
          let VAL_MOVIMIENTO = 0;
          paramsF.addFilter(
            'valUser',
            localStorage.getItem('username').toLocaleLowerCase()
          );
          paramsF.addFilter('valMinutesNumber', this.idProceeding);
          this.serviceProgrammingGood
            .getTmpProgValidation(paramsF.getParams())
            .subscribe(
              res => {
                console.log(res);
                VAL_MOVIMIENTO = res.data[0]['valmovement'];
                if (VAL_MOVIMIENTO === 1) {
                  const tipo_acta = 'DXCV';
                  this.openProceedingFn();
                } else {
                  this.openProceedingFn();
                }
              },
              err => {
                this.openProceedingFn();
              }
            );
        }
      },
      err => {}
    );
  }

  openProceedingFn() {
    const modelEdit: IProccedingsDeliveryReception = {
      comptrollerWitness: this.form.get('testigo').value,
      observations: this.form.get('observaciones').value,
      witness1: this.form.get('entrega').value,
      witness2: this.form.get('recibe2').value,
      address: this.form.get('direccion').value,
      statusProceedings: 'ABIERTA',
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
    this.serviceDetailProc.editDetailProcee(modelEdit).subscribe(
      res => {
        this.statusProceeding = 'ABIERTA';
        this.labelActa = 'Cerrar acta';
        this.btnCSSAct = 'btn-primary';
        this.form.get('fecCaptura').setValue(new Date());
        this.inputOpenProceeding();
        this.alert('success', 'El acta se abrió con éxito', '');
      },
      err => {
        this.alert(
          'error',
          'Ocurrió un error inesperado',
          'Se presentó un error inesperado al intentar abrir el acta. Por favor intentelo nuevamente'
        );
      }
    );
  }

  newCloseProceeding() {
    const paramsF = new FilterParams();
    paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        const resData = JSON.parse(JSON.stringify(res.data))[0];
        const paramsF = new FilterParams();
        let VAL_MOVIMIENTO = 0;
        paramsF.addFilter(
          'valUser',
          localStorage.getItem('username').toLocaleLowerCase()
        );
        paramsF.addFilter('valMinutesNumber', this.idProceeding);
        this.serviceProgrammingGood
          .getTmpProgValidation(paramsF.getParams())
          .subscribe(
            res => {
              console.log(res);
              VAL_MOVIMIENTO = res.data[0]['valmovement'];
              if (VAL_MOVIMIENTO === 1) {
                const tipo_acta = 'DXCV';
                this.openProceedingFn();
              } else {
                this.closeProceedingFn();
              }
            },
            err => {
              this.closeProceedingFn();
            }
          );
      },
      err => {}
    );
  }

  waitVBANVAL() {
    return new Promise((resolve, reject) => {
      for (let item of this.dataGoodAct['data']) {
        const goodClass = item.goodClassNumber;
        const newParams = `filter.numClasifGoods=$eq:${goodClass}`;
        this.serviceSssubtypeGood.getFilter(newParams).subscribe(res => {
          const type = JSON.parse(JSON.stringify(res.data[0]['numType']));
          const subtype = JSON.parse(JSON.stringify(res.data[0]['numSubType']));

          const no_type = parseInt(type.id);
          const no_subtype = parseInt(subtype.id);
          if (no_type === 7 && item.storeNumber === null) {
            resolve(false);
          } else if (
            no_type === 5 &&
            no_subtype === 16 &&
            item.storeNumber === null &&
            item.vaultNumber === null
          ) {
            resolve(false);
          } else if (
            no_type === 5 &&
            no_subtype != 16 &&
            item.storeNumber === null
          ) {
            resolve(false);
          }
        });
      }
    });
  }

  closeProceedingFn() {
    const fec_elab = this.form.get('fecElab').value;
    if (
      fec_elab != null &&
      format(fec_elab, 'MM-yyyy') != format(new Date(), 'MM-yyyy')
    ) {
      //!Endoint para ver si hay más días
      let vtmp_max = 0;
      if (
        format(addDays(endOfMonth(fec_elab), vtmp_max), 'dd-MM-yyyy') <
        format(new Date(), 'dd-MM-yyyy')
      ) {
        this.alert('warning', 'Está fuera de tiempo para cerrar el acta.', '');
        //* Desahibilitar el boton de cerrar acta
      }
    } else if (this.form.get('folioEscaneo').value == null) {
      this.alert('warning', 'Debe introducir el valor del folio', '');
    } else {
      this.serviceDocuments.getByFolio(-73378).subscribe(
        async res => {
          const data = JSON.parse(JSON.stringify(res));
          const scanStatus = data.data[0]['scanStatus'];
          console.log(scanStatus);
          if (scanStatus === 'ESCANEADO') {
            for (let item of this.dataGoodAct['data']) {
              const vanbal = await this.waitVBANVAL();
              if (vanbal == false) {
                this.alert('warning', 'Debe especificar almacen', '');
              } else {
                //!Necesita validación de EDO_FISICO EN los que sean requeridos
                this.alertQuestion(
                  'question',
                  '¿Seguro que desea realizar el cierre de esta acta?',
                  ''
                ).then((q: any) => {
                  if (q.isConfirmed) {
                    const model: IPACambioStatus = {
                      P_NOACTA: this.idProceeding,
                      P_PANTALLA: 'FACTREFACTAVENT',
                      P_FECHA_RE_FIS: this.form.get('fecReception').value,
                      P_TIPO_ACTA: 'DXCV',
                    };
                    console.log(model);
                    this.serviceProgrammingGood.paChangeStatus(model).subscribe(
                      res => {
                        const paramsF = new FilterParams();
                        paramsF.addFilter(
                          'valUser',
                          localStorage.getItem('username').toLocaleLowerCase()
                        );
                        paramsF.addFilter(
                          'valMinutesNumber',
                          this.idProceeding
                        );
                        this.serviceProgrammingGood
                          .getTmpProgValidation(paramsF.getParams())
                          .subscribe(
                            res => {
                              const VAL_MOVIMIENTO = res.data[0]['valmovement'];
                              if (VAL_MOVIMIENTO != 0) {
                                this.statusProceeding = 'CERRADO';
                                this.labelActa = 'Abrir acta';
                                this.btnCSSAct = 'btn-success';
                                this.alert(
                                  'success',
                                  'El acta ha sido cerrada',
                                  ''
                                );
                              } else {
                                //!ELSE DE CERRAR
                              }
                            },
                            err => {
                              //!ELSE DE CERRAR
                            }
                          );
                        console.log(res);
                      },
                      err => {
                        console.log(err);
                        this.alert(
                          'error',
                          'Ocurrió un error inesperado',
                          'Ocurrió un error inesperado al intentar cerrar el acta. Por favor intentelo nuevamente'
                        );
                      }
                    );
                  }
                });
              }
            }
          } else {
            this.alert('warning', 'No se ha realizado el escaneo', '');
          }
        },
        err => {
          this.alert('warning', 'No se ha realizado el escaneo', '');
        }
      );
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
  newAddGood() {
    if (this.selectData != null) {
      if (['CERRADO', 'CERRADA'].includes(this.statusProceeding)) {
        this.alert(
          'warning',
          'El acta ya esta cerrada, no puede realizar modificaciones a esta',
          ''
        );
      } else if (
        format(this.form.get('fecElab').value, 'MM-yyy') !=
        format(new Date(), 'MM-yyyy')
      ) {
        this.alert(
          'warning',
          'No puede realizar modificaciones a esta acta, por estar fuera del mes',
          ''
        );
      } else {
        const available = this.selectData.avalaible;
        if (!available) {
          this.alert(
            'error',
            'Estatus no disponible',
            'El Bien no esta disponible para ser asignado a alguna acta'
          );
        } else {
          const paramsF = new FilterParams();
          paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
          this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
            res => {
              const data = JSON.parse(JSON.stringify(res.data[0]));
              const firstChart = this.selectData.identifier.charAt(0);
              if (this.selectData.quantity < 1) {
                this.alert(
                  'warning',
                  'El bien no tiene una cantidad válida',
                  ''
                );
              } else {
                //!Falta preguntar a un endpoint
                /*
              SELECT 1
                         FROM BIENES BIE,
                              ESTATUS_X_PANTALLA EXP
                        WHERE BIE.ESTATUS            = EXP.ESTATUS
                          AND EXP.CVE_PANTALLA       = vc_pantalla
                          AND BIE.NO_BIEN            = :BLK_BIE.NO_BIEN
                          AND EXP.ACCION             = v_tipo_acta
                          AND EXP.IDENTIFICADOR      = :BLK_BIE.IDENTIFICADOR
                           AND EXP.PROCESO_EXT_DOM	 = BIE.PROCESO_EXT_DOM
              */
                let newDetailProceeding: IDetailProceedingsDeliveryReception = {
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
              }
            },
            err => {
              this.alert(
                'warning',
                'Debe registrar un Acta antes de poder mover el bien',
                ''
              );
            }
          );
        }
      }
    } else {
      this.alert(
        'warning',
        'No selecciono bien',
        'Debe seleccionar un bien para agregar al acta'
      );
    }
  }

  newDeleteGoods() {
    if (this.selectActData != null) {
      if (['CERRADO', 'CERRADA'].includes(this.statusProceeding)) {
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
      }
    } else {
      this.alert(
        'warning',
        'No selecciono bien',
        'Debe seleccionar un bien que forme parte del acta primero'
      );
    }
  }

  //Botones
  goParcializacion() {
    this.router.navigate([
      '/pages/judicial-physical-reception/partializes-general-goods',
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
    }else if (this.act2Valid && this.statusProceeding != '') {
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
                  this.labelActa = 'Abrir acta';
                  this.btnCSSAct = 'btn-success';
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
