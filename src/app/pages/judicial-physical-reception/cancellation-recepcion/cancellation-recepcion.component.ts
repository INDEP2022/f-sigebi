import { NonNullAssert } from '@angular/compiler';
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
import {
  IPAAbrirActasPrograma,
  IPACambioStatus,
} from 'src/app/core/models/good-programming/good-programming';
import { IAcceptGoodActa, IVban } from 'src/app/core/models/ms-good/good';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { TransferProceeding } from 'src/app/core/models/ms-proceedings/validations.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
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
  records = new DefaultSelect(['C', 'A', 'S']);
  selectActData: any = null;
  selectData: any = null;
  statusProceeding = '';
  transferSelect = new DefaultSelect();
  numberProceeding = 0;
  v_atrib_del = 0;
  reopening = false;
  scanStatus = false;
  numberExpedient = '';
  isEnableTestigo = true;
  isEnableElabora = true;
  isEnableAutoridadCancela = true;
  isEnableObservaciones = true;
  isEnableDireccion = true;
  isEnableFecElab = true;

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
    private serviceProgrammingGood: ProgrammingGoodService
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
      averPrev: [null],
      noExpedienteTransf: [null],
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
    console.log(this.form.get('acta').value);
    if (this.form.get('acta').value === 'C') {
      this.form.get('ident').setValue('CAN');
    } else if (this.form.get('acta').value === null) {
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

  validateGood(element: any) {
    let di_disponible = false;
    let bamparo: boolean;

    return new Promise((resolve, reject) => {
      if (this.form.get('expediente').value != null) {
        const modelActa: IAcceptGoodActa = {
          pNumberGood: parseInt(element.id),
          pVcScreen: 'FACTREFACTAVENT',
          pIdentify: element.identifier,
        };
        this.serviceGoodProcess.getAccepGoodActa(modelActa).subscribe(
          res => {
            di_disponible = true;
            this.serviceGood
              .getById(`${element.id}&filter.labelNumber=$eq:6`)
              .subscribe(
                res => {
                  bamparo = true;
                  resolve({ avalaible: di_disponible, bamparo: bamparo });
                },
                err => {
                  bamparo = false;
                  resolve({ avalaible: di_disponible, bamparo: bamparo });
                }
              );
          },
          err => {
            di_disponible = false;
            this.serviceGood
              .getById(`${element.id}&filter.labelNumber=$eq:6`)
              .subscribe(
                res => {
                  bamparo = true;
                  resolve({ avalaible: di_disponible, bamparo: bamparo });
                },
                err => {
                  bamparo = false;
                  resolve({ avalaible: di_disponible, bamparo: bamparo });
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
        console.log(resp);
        console.log(resp.preliminaryInquiry);
        this.form.get('averPrev').setValue(resp.preliminaryInquiry);
        console.log(resp.expTransferNumber);
        this.form.get('noExpedienteTransf').setValue(resp.expTransferNumber);
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

  statusGood(formName: string, data: any) {
    const paramsF = new FilterParams();
    paramsF.addFilter('status', data.goodStatus);
    this.serviceGood.getStatusGood(paramsF.getParams()).subscribe(
      res => {
        this.form.get(formName).setValue(data.goodStatus);
      },
      err => {
        this.form.get(formName).setValue(null);
      }
    );
  }

  goodsByExpediente() {
    //Validar si hay un acta abierta
    this.getDataExpedient();
    this.noRequireAct1();
    this.initialBool = true;
    this.nextProce = true;
    this.prevProce = false;
    this.act2Valid = false;
    this.navigateProceedings = false;
    this.statusProceeding = '';
    this.goodData = [];
    this.dataGoodAct.load(this.goodData);
    this.numberProceeding = 0;
    this.numberExpedient = this.form.get('expediente').value;
    this.form.get('folioEscaneo').reset();
    this.labelActa = 'Abrir acta';
    this.btnCSSAct = 'btn-success';

    const btn = document.getElementById('expedient-number');

    this.render.removeClass(btn, 'enabled');
    this.render.addClass(btn, 'disabled');

    this.clearInputs();

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
                let disponible: boolean;
                const resp = await this.validateGood(e);
                disponible = JSON.parse(JSON.stringify(resp)).avalaible;
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
          this.inputsReopenProceeding();
        } else {
          this.labelActa = 'Abrir acta';
          this.btnCSSAct = 'btn-success';
          this.inputsInProceedingClose();
        }
        this.act2Valid = true;
        this.navigateProceedings = true;
        this.idProceeding = dataRes.id;
      },
      err => console.log(err)
    );
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
          this.fillIncomeProceeding(dataRes);
          console.log(typeof dataRes);
        } else {
          this.initialBool = false;
          this.requireAct1();
          this.maxDate = new Date();
          this.checkChange();
          this.getTransfer();
        }
      },
      err => {
        console.log(err);
        this.initialBool = false;
        this.requireAct1();
        this.maxDate = new Date();
        this.getTransfer();
        this.checkChange();
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
  toggleActa() {
    if (this.labelActa == 'Abrir acta') {
      this.openProceeding();
    } else {
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
    this.statusGood('esatusPrueba', data);
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
    this.statusGood('esatusPrueba', data);
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
                    this.saveDataAct = this.goodData;
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
          'Debe especificar/buscar el acta para después eliminar el bien de esta'
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
        this.saveDataAct = this.saveDataAct.filter(
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
      '/pages/judicial-physical-reception/partializes-general-goods/v1',
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

  saveDetailProceeding(resData: any) {
    let newDetailProceeding: IDetailProceedingsDeliveryReception = {
      numberProceedings: resData.id,
    };

    for (let i = 0; i < this.saveDataAct.length; i++) {
      const element = this.saveDataAct[i];
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

  searchKeyProceeding() {
    const acta2Input = this.form.get('folio');
    console.log(this.act2Valid);
    console.log(!['CERRADA', 'ABIERTA'].includes(this.statusProceeding));
    if (
      this.act2Valid &&
      !['CERRADA', 'ABIERTA'].includes(this.statusProceeding)
    ) {
      const paramsF = new FilterParams();
      paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
      this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
        res => {
          console.log(res.data[0]['typeProceedings']);
          this.form.get('folio').setValue(this.form.get('folio').value + 1);
          this.fillActTwo();
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

  openProceeding() {
    if (['CERRADO', 'CERRADA'].includes(this.statusProceeding)) {
      this.alertQuestion(
        'warning',
        `¿Está seguro de abrir el Acta ${this.form.get('acta2').value}?`,
        ''
      ).then(q => {
        if (q.isConfirmed) {
          const paramsF = new FilterParams();
          let VAL_MOVIMIENTO = 0;

          paramsF.addFilter('valUser', localStorage.getItem('username'));
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
            P_PANTALLA: 'FACTREFACTAENTREC',
            P_TIPOMOV: 2,
          };
          console.log(modelPaOpen);
          this.serviceProgrammingGood
            .paOpenProceedingProgam(modelPaOpen)
            .subscribe(
              res => {
                this.labelActa = 'Cerrar acta';
                this.btnCSSAct = 'btn-primary';
                this.statusProceeding = 'ABIERTA';
                this.reopening = true;
                this.inputsReopenProceeding();
                if (VAL_MOVIMIENTO === 1) {
                  this.serviceProgrammingGood
                    .paRegresaEstAnterior(modelPaOpen)
                    .subscribe(
                      res => {
                        this.labelActa = 'Abrir acta';
                        this.btnCSSAct = 'btn-success';
                        this.statusProceeding = 'CERRADO';
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
            this.form.get('fecCierreActa').value,
            'yyyy-MM,dd HH:mm'
          ),
          address: this.form.get('direccion').value,
          statusProceedings: 'ABIERTA',
          elaborate: localStorage.getItem('username'),
          numFile: this.form.get('expediente').value,
          witness1: this.form.get('autoridadCancela').value,
          witness2: this.form.get('elabora').value,
          typeProceedings:
            this.form.get('acta').value == 'C' ? 'RECEPCAN' : 'SUSPENSION',
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
                  this.saveDetailProceeding(resData);
                  this.form.get('fecCaptura').setValue(new Date());
                  this.statusProceeding = 'ABIERTA';
                  this.labelActa = 'Cerrar acta';
                  this.btnCSSAct = 'btn-primary';
                  this.inputsReopenProceeding();
                  this.alert(
                    'success',
                    'Acta creada con éxito',
                    `El acta ${
                      this.form.get('acta2').value
                    } fue abierta exitosamente`
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
            console.log(this.saveDataAct);
            if (this.saveDataAct.length > 0) {
              this.saveDetailProceeding([
                { id: res.data[0]['numberProceedings'] },
              ]);
            }
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
                      this.statusProceeding = 'CERRADO';
                      this.idProceeding = parseInt(idProcee.toString());
                      this.labelActa = 'Abrir acta';
                      this.btnCSSAct = 'btn-success';
                      this.alert(
                        'success',
                        'Acta cerrada',
                        'El acta fue cerrada con éxito'
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
          },
          err => {
            this.alert(
              'error',
              'Ocurrió un error',
              'Ocurrió un error inesperdo que no permitió cerrar el acta'
            );
          }
        );
      } else {
        const paramsF = new FilterParams();
        const tipoAct = 'DXCV';

        paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
        this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(res => {
          const idProceed = JSON.parse(JSON.stringify(res.data[0])).id;
          const paramsFProg = new FilterParams();
          paramsFProg.addFilter('valUser', localStorage.getItem('username'));
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
                              if (this.saveDataAct.length > 0) {
                                this.saveDetailProceeding([{ id: idProceed }]);
                              }

                              const model: IPACambioStatus = {
                                P_NOACTA: idProceed,
                                P_PANTALLA: 'FACTREFCANCELAR',
                                P_FECHA_RE_FIS:
                                  this.form.get('fecCierreActa').value,
                                P_TIPO_ACTA: tipoAct,
                              };
                              this.serviceProgrammingGood
                                .paChangeStatus(model)
                                .subscribe(res => {
                                  console.log(res);
                                  const modelEdit: IProccedingsDeliveryReception =
                                    {
                                      statusProceedings: 'CERRADA',
                                      comptrollerWitness:
                                        this.form.get('testigo').value,
                                      observations:
                                        this.form.get('observaciones').value,
                                      witness1:
                                        this.form.get('autoridadCancela').value,
                                      witness2: this.form.get('elabora').value,
                                      address: this.form.get('direccion').value,
                                    };
                                  this.serviceProcVal
                                    .editProceeding(idProceed, modelEdit)
                                    .subscribe(
                                      res => {
                                        console.log(res);
                                        this.statusProceeding = 'CERRADO';
                                        this.labelActa = 'Abrir acta';
                                        this.btnCSSAct = 'btn-success';
                                        this.idProceeding = idProceed;
                                        this.alert(
                                          'success',
                                          'Acta cerrada',
                                          'El acta fue cerrada con éxito'
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

  /* closeProceeding() {
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
          let VAL_MOVIMIENTO = 0;
          const data = JSON.parse(JSON.stringify(res));
          const scanStatus = data.data[0]['scanStatus'];

          if (scanStatus === 'ESCANEADO') {
            const paramsF = new FilterParams();

            paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
            this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
              res => {
                const idProceed = JSON.parse(JSON.stringify(res.data[0])).id;
                const paramsFProg = new FilterParams();
                paramsFProg.addFilter(
                  'valUser',
                  localStorage.getItem('username')
                );
                paramsFProg.addFilter('valMinutesNumber', this.idProceeding);
                this.serviceProgrammingGood
                  .getTmpProgValidation(paramsFProg.getParams())
                  .subscribe(
                    res => {
                      console.log(res);
                      VAL_MOVIMIENTO = res.data[0]['valmovement'];
                      if (VAL_MOVIMIENTO === 0) {
                        if (
                          format(this.form.get('fecElab').value, 'MM/yyyy') !=
                          format(new Date(), 'MM/yyyy')
                        ) {
                          console.log('Diferente');
                          //!Dentro de un MS de TMP_MAX_CIERRE_ACTA_DEV
                          /* SELECT NVL(TMP_MAX,0)
                          INTO VTMP_MAX
                          FROM TMP_MAX_CIERRE_ACTA_DEV
                           WHERE TIPO_ACTA = 'RECDEC'
                           AND ACTIVADO = 'S'; //!*
                        } else {
                          console.log('Igual');
                          const modelEdit: IProccedingsDeliveryReception = {
                            statusProceedings: 'CERRADA',
                            comptrollerWitness: this.form.get('testigo').value,
                            observations: this.form.get('observaciones').value,
                            witness1: this.form.get('entrega').value,
                            witness2: this.form.get('recibe2').value,
                            address: this.form.get('direccion').value,
                          };
                          this.serviceProcVal
                            .editProceeding(idProceed, modelEdit)
                            .subscribe(
                              res => {
                                console.log(res);
                                this.statusProceeding = 'CERRADO';
                                this.labelActa = 'Abrir acta';
                                this.btnCSSAct = 'btn-successs';
                                this.idProceeding = idProceed;
                                this.alert(
                                  'success',
                                  'Acta cerrada',
                                  'El acta fue cerrada con éxito'
                                );
                                
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
                        }
                      }
                    },
                    err => {
                      console.log(err);
                      VAL_MOVIMIENTO = 0;
                      if (
                        format(this.form.get('fecElab').value, 'MM/yyyy') !=
                        format(new Date(), 'MM/yyyy')
                      ) {
                        console.log('Diferente');
                        //!Dentro de un MS de TMP_MAX_CIERRE_ACTA_DEV
                        /* SELECT NVL(TMP_MAX,0)
                          INTO VTMP_MAX
                          FROM TMP_MAX_CIERRE_ACTA_DEV
                           WHERE TIPO_ACTA = 'RECDEC'
                           AND ACTIVADO = 'S'; //!*
                      } else {
                        console.log('Igual');
                        const modelEdit: IProccedingsDeliveryReception = {
                          statusProceedings: 'CERRADA',
                          comptrollerWitness: this.form.get('testigo').value,
                          observations: this.form.get('observaciones').value,
                          witness1: this.form.get('autoridadCancela').value,
                          witness2: this.form.get('elabora').value,
                          address: this.form.get('direccion').value,
                        };
                        this.serviceProcVal
                          .editProceeding(idProceed, modelEdit)
                          .subscribe(
                            res => {
                              console.log(res);
                              this.statusProceeding = 'CERRADO';
                              this.labelActa = 'Abrir acta';
                              this.btnCSSAct = 'btn-successs';
                              this.idProceeding = idProceed;
                              this.alert(
                                'success',
                                'Acta cerrada',
                                'El acta fue cerrada con éxito'
                              );
                              
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
                      }
                    }
                  );
              },
              err => {
                console.log(err);
              }
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
  } */

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
      `Se eliminará el acta ${this.form.get('acta2').value}`,
      'Eliminar'
    ).then(q => {
      if (q.isConfirmed) {
        const paramsF = new FilterParams();
        paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
        this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
          res => {
            console.log();
            const realData = JSON.parse(JSON.stringify(res.data[0]));
            this.serviceDetailProc
              .PADelActaEntrega(realData.id)
              .subscribe(res => {
                this.form.get('expediente').setValue(this.numberExpedient);
                this.dataGoods.load(
                  this.dataGoods['data'].map((e: any) => {
                    for (let element of this.dataGoodAct['data']) {
                      if (e.id === element.id) {
                        return { ...e, avalaible: true };
                      }
                    }
                  })
                );
                this.clearInputs();
                this.getGoodsByExpedient();
                this.alert('success', 'Acta eliminada con éxito', '');
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
        this.requireAct1();
        this.inputsNewProceeding();
      }
    }
  }

  prevProceeding() {
    this.initialBool = true;
    this.noRequireAct1();
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
