import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addDays, format } from 'date-fns';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { transferenteAndAct } from 'src/app/common/validations/custom.validators';
import { IGood, IValNumeOtro, IVban } from 'src/app/core/models/ms-good/good';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { TransferProceeding } from 'src/app/core/models/ms-proceedings/validations.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
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
  dataGoods = new LocalDataSource();
  dataGoodAct = new LocalDataSource();
  selectData: any = null;
  selectActData: any = null;
  goodData: any[] = [];
  goodDataExp: any[] = [];
  proceedingData: any[] = [];
  form: FormGroup;
  records: string[];
  itemsSelect = new DefaultSelect();
  vaultSelect = new DefaultSelect();
  warehouseSelect = new DefaultSelect();
  transferSelect = new DefaultSelect();
  adminSelect = new DefaultSelect();
  recibeSelect = new DefaultSelect();
  showFecReception = false;
  minDateFecElab = new Date();
  statusProceeding = '';
  labelActa = 'Abrir acta';
  btnCSSAct = 'btn-success';
  scanStatus = false;
  act2Valid = false;
  alldisabled = false;
  initialdisabled = true;
  idProceeding: number | string;
  navigateProceedings = false;
  nextProce = true;
  prevProce = false;
  numberProceeding = 0;
  v_atrib_del = 0;

  constructor(
    private fb: FormBuilder,
    private serviceGood: GoodService,
    private render: Renderer2,
    private serviceWarehouse: WarehouseFilterService,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private serviceDetailProc: DetailProceeDelRecService,
    private serviceDocuments: DocumentsService,
    private serviceNoty: NotificationService,
    private serviceExpedient: ExpedientService,
    private serviceRNomencla: ParametersService,
    private serviceSssubtypeGood: GoodSssubtypeService,
    private serviceVault: SafeService,
    private serviceUser: UsersService,
    private router: Router,
    private serviceGoodProcess: GoodProcessService,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    moment.locale('es');
    this.prepareForm();
    this.form.get('year').setValue(moment(new Date()).format('YYYY'));
    this.form.get('mes').setValue(moment(new Date()).format('MM'));
    if (this.form) {
      this.form.get('transfer').setValidators([transferenteAndAct('A')]);
    }

    this.serviceRNomencla
      .getPhaseEdo(`date=${format(new Date(), 'yyyy-MM-dd')}`)
      .subscribe(res => {
        let edo = JSON.parse(JSON.stringify(res));
        console.log(edo.stagecreated);
      });
  }

  prepareForm() {
    this.form = this.fb.group({
      expediente: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      averPrev: [null, []],
      causaPenal: [null, []],
      acta: [null],
      transfer: [null],
      ident: [null],
      recibe: [null],
      admin: [null],
      folio: [null],
      year: [null],
      mes: [null],
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
      folioEscaneo: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      edoFisico: [null, [, Validators.pattern(STRING_PATTERN)]],
      requerido: [false, []],
      almacen: [null, []],
      boveda: [null, []],
      estatusPrueba: [null, [, Validators.pattern(STRING_PATTERN)]],
      etiqueta: [null, [, Validators.pattern(STRING_PATTERN)]],
      estatusBienActa: [null, [Validators.pattern(STRING_PATTERN)]],
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
      this.openProceeding();
    } else if (this.labelActa === 'Cerrar acta') {
      this.closeProceeding();
      console.log('entra');
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

  /* openEdo() {
    this.modalService.show()
  } */

  //Validacion de bienes
  validateGood(good: any) {
    console.log(good);
    let cu_valnume = 1;
    let cu_valotro = 1;
    let vn_numerario = 0;
    let lv_programa = 2;
    let di_disponible = false;
    let di_numerario = false;
    let di_acta: number = null;
    let bamparo = false;
    //!VALNUME Y VALOTRO
    /* CURSOR CU_VALNUME (pc_pantalla VARCHAR2) IS
      SELECT 1
        FROM bienes bie,
             estatus_x_pantalla exp
       WHERE bie.estatus       = exp.estatus
         AND exp.cve_pantalla  = pc_pantalla
         AND bie.no_bien       = :blk_bie.no_bien
         AND NVL(EXP.ACCION,'ENTREGA') = 'NUME'
         AND EXP.IDENTIFICADOR = :blk_bie.IDENTIFICADOR
         AND EXP.PROCESO_EXT_DOM = :blk_bie.PROCESO_EXT_DOM;--AKCO201009
   CURSOR CU_VALOTRO (pc_pantalla VARCHAR2) IS
      SELECT 1
        FROM bienes bie,
             estatus_x_pantalla exp
       WHERE bie.estatus       = exp.estatus
         AND exp.cve_pantalla  = pc_pantalla
         AND bie.no_bien       = :blk_bie.no_bien
         AND NVL(EXP.ACCION,'ENTREGA') <> 'NUME'
         AND EXP.IDENTIFICADOR = :blk_bie.IDENTIFICADOR
         AND EXP.PROCESO_EXT_DOM = :blk_bie.PROCESO_EXT_DOM; */
    const valModel: IValNumeOtro = {
      pc_pantalla: 'FACTREFACTAENTREC',
      no_bien: good.id,
      identificador: good.identifier,
      proceso_ext_dom: good.extDomProcess,
    };

    console.log(valModel);

    this.serviceGoodProcess.getValNume(valModel).subscribe(
      res => {
        console.log({ valNume: res });
      },
      err => {
        console.log(err);
      }
    );

    this.serviceGoodProcess.getValOtro(valModel).subscribe(
      res => {
        console.log({ valOtro: res });
      },
      err => {
        console.log(err);
      }
    );

    //!VN_NUMERARIO
    /**
     SELECT 1
           INTO vn_numerario
           FROM BIENES
          WHERE NO_BIEN = :blk_bie.no_bien
            AND NO_CLASIF_BIEN IN (SELECT NO_CLASIF_BIEN
                                     FROM CAT_SSSUBTIPO_BIEN
                                    WHERE NO_TIPO = 7
                                      AND NO_SUBTIPO = 1);
     */
    if (vn_numerario) {
      di_numerario = true;
      if (cu_valnume > 0) {
        di_disponible = true;
      }
    } else {
      di_numerario = false;
      if (cu_valotro > 0) {
        di_disponible = true;
      }
    }

    if (di_acta != null || di_acta > 0) {
      di_disponible = false;
    }

    if (di_disponible && !di_numerario) {
      /*       SELECT COUNT(0)
              INTO lv_programa
              FROM DETALLE_ACTA_ENT_RECEP
             WHERE NO_BIEN = :blk_bie.no_bien
               AND NO_ACTA IN (SELECT NO_ACTA
                                 FROM ACTAS_ENTREGA_RECEPCION
                                WHERE TIPO_ACTA = 'EVENTREC') 
                 AND TRUNC(FEC_INDICA_USUARIO_APROBACION) BETWEEN to_date('01'||to_char(sysdate,'mmyyyy'),'ddmmyyyy') and last_day(trunc(sysdate));*/
      if (lv_programa === 0) {
        di_disponible = false;
      }
    }

    this.serviceGood.getById(`${good.id}&filter.labelNumber=$eq:6`).subscribe(
      res => {
        bamparo = true;
      },
      err => {
        bamparo = false;
      }
    );

    return {
      available: di_disponible,
      bamparo: bamparo,
    };
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

  getSafeVault(params: ListParams) {
    this.serviceVault
      .getAllFilter(`filter.description=$ilike:${params.text}`)
      .subscribe(res => {
        this.vaultSelect = new DefaultSelect(res.data, res.count);
        console.log(this.vaultSelect);
      });
  }

  getAdmin(params: ListParams) {
    const paramsF = new FilterParams();
    paramsF.addFilter('delegation', params.text, SearchFilter.ILIKE);
    this.serviceRNomencla.getRNomencla(paramsF.getParams()).subscribe(
      res => {
        this.adminSelect = new DefaultSelect(res.data, res.count);
        console.log(this.form.get(''));
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

  //Botones
  goParcializacion() {
    this.router.navigate([
      '/pages/judicial-physical-reception/partializes-general-goods-1',
    ]);
  }

  getCargaMasiva() {
    if (
      format(this.form.get('fecCaptura').value, 'MM-yyyy') !=
      format(new Date(), 'MM-yyyy')
    ) {
      this.alert(
        'error',
        'Fuera de fecha',
        `'El Acta ${
          this.form.get('acta2').value
        } fue capturada fuera de mes, no se puede generar la Carga Masiva`
      );
    } else {
      //!Falta lógica de carga masiva
    }
  }

  //Bienes y disponibilidad de bienes

  getTransfer() {
    console.log('Entra a Transfer');
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
        }
      });
  }

  goodsByExpediente() {
    console.log('Trae bienes');
    this.serviceGood
      .getAllFilterDetail(
        `filter.fileNumber=$eq:${
          this.form.get('expediente').value
        }&filter.status=$not:ADM&filter.labelNumber=$not:6&filter.detail.actNumber=$not:$null`
      )
      .subscribe({
        next: async (res: any) => {
          if (res.data.length > 0) {
            this.form.get('ident').setValue('ADM');
            this.dataGoods.load(res.data);
            console.log(res);
            const newData = await Promise.all(
              res.data.map(async (e: any) => {
                let disponible: boolean = false;
                const resVal = this.validateGood(e);
                disponible = resVal.available;
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
          this.dataGoods.load([]);
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
    this.initialdisabled = true;
    const paramsF = new FilterParams();
    this.minDateFecElab = addDays(new Date(dataRes.elaborationDate), 1);
    paramsF.addFilter('numberProceedings', dataRes.id);
    paramsF.addFilter('keysProceedings', dataRes.keysProceedings);
    this.serviceDetailProc.getAllFiltered(paramsF.getParams()).subscribe(
      res => {
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
          .get('fecElabRec')
          .setValue(addDays(new Date(dataRes.dateElaborationReceipt), 1));
        this.form
          .get('fecEntBien')
          .setValue(addDays(new Date(dataRes.dateDeliveryGood), 1));
        this.form
          .get('fecElab')
          .setValue(addDays(new Date(dataRes.elaborationDate), 1));
        this.form
          .get('fecReception')
          .setValue(addDays(new Date(dataRes.datePhysicalReception), 1));
        this.form
          .get('fecCaptura')
          .setValue(addDays(new Date(dataRes.captureDate), 1));
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
      err => console.log(err)
    );
  }

  clearInputs() {
    this.form.get('acta2').setValue(null);
    this.form.get('direccion').setValue(null);
    this.form.get('entrega').setValue(null);
    this.form.get('fecElabRec').setValue(null);
    this.form.get('fecEntBien').setValue(null);
    this.form.get('fecElab').setValue(null);
    this.form.get('fecReception').setValue(null);
    this.form.get('fecCaptura').setValue(null);
    this.form.get('observaciones').setValue(null);
    this.form.get('recibe2').setValue(null);
    this.form.get('testigo').setValue(null);
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
        this.getTransfer();
        this.minDateFecElab = new Date();
        this.clearInputs();
        this.statusProceeding = '';
        this.labelActa = 'Abrir acta';
        this.btnCSSAct = 'btn-info';
        this.act2Valid = false;
        this.navigateProceedings = true;
        this.nextProce = false;
        this.initialdisabled = false;
        this.prevProce = true;
        this.goodData = [];
        this.dataGoodAct.load(this.goodData);
      }
    } else {
      this.prevProce = true;
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

  getGoodsByExpedient() {
    //Validar si hay un acta abierta
    this.clearInputs();
    const paramsF = new FilterParams();
    paramsF.addFilter(
      'numFile',
      this.form.get('expediente').value,
      SearchFilter.EQ
    );
    paramsF.addFilter('typeProceedings', 'ENTREGA');
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        if (res.data != null) {
          this.proceedingData = res.data;
          const dataRes = JSON.parse(JSON.stringify(res.data[0]));
          this.fillIncomeProceeding(dataRes);
          console.log(typeof dataRes);
        } else {
          this.initialdisabled = false;
          this.minDateFecElab = new Date();
          this.getTransfer();
        }
      },
      err => {
        console.log(err);
        this.initialdisabled = false;
        this.minDateFecElab = new Date();
        this.getTransfer();
      }
    );

    this.goodsByExpediente();
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
          typeProceedings: ['D', 'ND'].includes(this.form.get('acta').value)
            ? 'DECOMISO'
            : 'ENTREGA',
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
              res => {},
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
    const user = localStorage.getItem('username');
    if (
      !['MARRIETA', 'SERA', 'DESARROLLO', 'ALEDESMA', 'JRAMIREZ'].includes(user)
    ) {
      if (this.statusProceeding === 'CERRADO') {
        console.log(1);
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
        console.log(2);

        this.alert(
          'error',
          'No puede eliminar acta',
          'No puede eliminar un Acta fuera del mes de elaboración'
        );
      } else if (!this.act2Valid) {
        console.log(3);

        this.alert(
          'warning',
          'Error en el acta',
          'Debe introducir un acta 2 válido'
        );
      } else {
        console.log(4);
        this.alertQuestion(
          'question',
          '¿Desea eliminar completamente el acta?',
          `Se eliminará el acta ${this.idProceeding}`,
          'Eliminar'
        ).then(q => {
          if (q.isConfirmed) {
            this.serviceProcVal
              .deleteProceeding(this.idProceeding.toString())
              .subscribe(
                res => {
                  console.log(res);
                  this.alert(
                    'success',
                    'Eliminado',
                    'Acta eliminada con éxito'
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
      }
    } else {
      this.alert('error', 'error', '');
    }

    /*  if(){
    } */
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
      paramsF.addFilter(
        'keysProceedings',
        this.form.get('acta2').value,
        SearchFilter.ILIKE
      );
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
  //Select data
  selectRow(e: any) {
    const { data } = e;
    console.log(data);
    this.selectData = data;
    this.form.get('estatusPrueba').setValue(data.goodStatus);
  }

  deselectRow() {
    this.selectData = null;
  }

  estadoFisBien(data: any) {
    const edo = this.form.get('edoFisico');
    console.log(typeof data.physicalStatus);
    switch (data.physicalStatus) {
      case '0':
        edo.setValue('MALO');
        break;
      case '1':
        edo.setValue('REGULAR');
        break;
      case '2':
        edo.setValue('BUENO');
        break;
      default:
        edo.setValue('SIN ESPECIFICAR');
        break;
    }
  }

  selectRowGoodActa(e: any) {
    const { data } = e;
    console.log(data);
    this.selectActData = data;
    this.estadoFisBien(data);
    this.form.get('estatusBienActa').setValue(data.goodStatus);
  }

  deselectRowGoodActa() {
    this.selectActData = null;
  }

  //Add good to Act

  addGood() {
    console.log(this.goodData);

    let v_ban: boolean;
    let v_tipo_acta: string;
    const acta = this.form.get('acta2').value;
    const arrAct = acta.split('/');
    const valAct = arrAct[0];
    const admin = arrAct[4];
    let no_type: number | string;
    let no_subtype: number | string;
    console.log(arrAct);

    if (this.selectData && this.selectData != null) {
      const goodClass = this.selectData.goodClassNumber;
      const available = this.selectData.avalaible;
      //Valida si es disponible
      if (!available) {
        this.alert(
          'error',
          'Estatus no disponible',
          'El bien tiene un estatus invalido para ser asignado a alguna acta'
        );
      } else if (!this.act2Valid) {
        //Valida si hay clave de acta y es válida
        this.alert(
          'error',
          'Error en el número de acta',
          'Debe registrar un Acta antes de poder mover el bien'
        );
      }
      //Valida si el acta es diferente de RT
      else if (valAct != 'RT') {
        if ([1424, 1426, 1590].includes(goodClass) && valAct[0] != 'N') {
          this.alert(
            'error',
            'Problema con el tipo de acta',
            'Para este bien la Clave de Acta debe iniciar con " N "'
          );
        }
        if ([1424, 1426, 1590].includes(goodClass) && admin != 'CCB') {
          this.alert(
            'error',
            'Problema con quien administra en la clave',
            'En la parte de Quien Administra en la clave de acta debe ser para este bien " CCB "'
          );
        }
        if (
          goodClass != 1424 &&
          goodClass != 1590 &&
          goodClass != 1426 &&
          valAct[0] === 'N'
        ) {
          this.alert(
            'error',
            'Problema con el tipo de acta',
            'Las actas con esta nomenclatura solo deben contener bienes de numerario efectivo'
          );
        }
      }

      //Tipo y subtipo de bien
      const newParams = `filter.numClasifGoods=$eq:${goodClass}`;
      this.serviceSssubtypeGood.getFilter(newParams).subscribe(
        res => {
          const type = JSON.parse(JSON.stringify(res.data[0]['numType']));
          const subtype = JSON.parse(JSON.stringify(res.data[0]['numSubType']));

          no_type = parseInt(type.id);
          no_subtype = parseInt(subtype.id);
          //Validar Admin y tipo
          if (admin === 'DEABI' && no_type != 6) {
            this.alert(
              'error',
              'Error en el tipo de bien',
              'Bien con tipo inválido para el acta (INMUEBLE)'
            );
          }
          //Valida si el acta esta cerrada
          if (this.statusProceeding === 'CERRADO') {
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
          } else if (this.form.get('fecElab').value === null) {
            this.alert(
              'warning',
              'Falta fecha de elaboración',
              'Necesita registrar el dato de fecha de elaboración para agregar un bien al acta'
            );
          } else if (
            this.form.get('fecElab').value != null &&
            format(this.form.get('fecElab').value, 'dd-MM-yyyy') <
              format(this.form.get('fecElab').value, 'dd-MM-yyyy')
          ) {
            this.alert(
              'error',
              'Error en la fecha de elaboración',
              'La fecha de elaboración debe ser igual a hoy o una fecha después'
            );
          } else {
            v_ban = true;
            if (no_type === 7 && no_subtype === 1) {
              v_tipo_acta = 'NUME';
            } else if (['D', 'ND'].includes(valAct)) {
              v_tipo_acta = 'DECOMISO';
            } else {
              v_tipo_acta = 'ENTREGA';
            }
            console.log(v_tipo_acta);
            //NECESARIO ENDPOINT QUE VALIDE EL QUERY
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
                  if (this.selectData.avalaible) {
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
                    this.goodData.push(this.selectData);
                    this.dataGoodAct.load(this.goodData);
                    console.log(this.dataGoodAct);
                    this.selectData = null;
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
    } else {
      this.alert(
        'warning',
        'No selecciono bien',
        'Debe seleccionar un bien para agregar al acta'
      );
    }
  }

  deleteGood() {
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
      if (this.selectActData == null) {
        this.alert(
          'warning',
          'No selecciono bien del acta',
          'Debe seleccionar un bien que forme parte del acta primero'
        );
      } else if (!this.act2Valid) {
        this.alert(
          'warning',
          'Problemas con el número de acta',
          'Debe especificar/buscar el acta para despues eliminar el bien de esta'
        );
      } else {
        console.log(this.dataGoodAct);
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
      }
    }
  }

  //Aplicar Bodega y Bodega
  applyWarehouseSafe() {
    //!ESTOY AQUÍ
    console.log(this.form.get('almacen').value);
    console.log(this.form.get('almacen').value.idWarehouse);
    if (this.statusProceeding === 'ABIERTA') {
      if (this.form.get('almacen').value != null) {
        for (let i = 0; i < this.dataGoodAct['data'].length; i++) {
          const element = this.dataGoodAct['data'][i];
          const newParams = `filter.numClasifGoods=$eq:${element.goodClassNumber}`;
          this.serviceSssubtypeGood.getFilter(newParams).subscribe(res => {
            const type = JSON.parse(JSON.stringify(res.data[0]['numType']));
            const subtype = JSON.parse(
              JSON.stringify(res.data[0]['numSubType'])
            );
            const ssubtype = JSON.parse(
              JSON.stringify(res.data[0]['numSsubType'])
            );
            const no_type = type.id;
            console.log(no_type);
            if (no_type === '5') {
              //Data new good
              const putGood: IGood = {
                id: element.id,
                goodId: element.id,
                storeNumber: this.form.get('almacen').value.idWarehouse,
              };
              console.log(putGood);
              console.log('Sí?');
              this.serviceGood.update(putGood).subscribe(res => {
                console.log(res);
              });
            }
            console.log('No :(');
          });
        }
      }
      console.log(this.form.get('boveda').value);
      if (this.form.get('boveda').value != null) {
        for (let i = 0; i < this.dataGoodAct['data'].length; i++) {
          const element = this.dataGoodAct['data'][i];
          let v_pasa: boolean = false;
          const newParams = `filter.numType=$eq:7&filter.numSubType=$eq:34&filter.numClasifGoods=$eq:${element.goodClassNumber}`;
          this.serviceSssubtypeGood.getFilter(newParams).subscribe(res => {
            const type = JSON.parse(JSON.stringify(res.data[0]['numType']));
            const subtype = JSON.parse(
              JSON.stringify(res.data[0]['numSubType'])
            );
            const ssubtype = JSON.parse(
              JSON.stringify(res.data[0]['numSsubType'])
            );
            const no_type = type.id;
            const no_subtype = subtype.id;
            let putGood: IGood = {
              id: element.id,
              goodId: element.id,
              vaultNumber: this.form.get('boveda').value.idSafe,
            };

            console.log(res.data.length);
            if (res.data.length != 0) {
              v_pasa = true;
            }
            if (no_type === 7 || (no_type === 5 && no_subtype === 16)) {
              if (no_type === 7 && v_pasa) {
                if (element.vaultNumber === null) {
                  putGood.vaultNumber = 9999;
                }
              } else {
                putGood.vaultNumber = this.form.get('boveda').value.idSafe;
              }
              this.serviceGood
                .update(putGood)
                .subscribe(res => console.log(res));
            }
          });
        }
      }
    }
  }
}
