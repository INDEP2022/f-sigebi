import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { addDays, endOfMonth, format, subDays } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { transferenteAndAct } from 'src/app/common/validations/custom.validators';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import {
  IPAAbrirActasPrograma,
  IPACambioStatus,
} from 'src/app/core/models/good-programming/good-programming';
import {
  IAcceptGoodStatusScreen,
  IGood,
} from 'src/app/core/models/ms-good/good';
import { ITransfActaEntrec } from 'src/app/core/models/ms-notification/notification.model';
import {
  IDeleteDetailProceeding,
  IDetailProceedingsDeliveryReception,
  IDetailWithIndEdo,
} from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { ICveAct } from 'src/app/core/models/ms-proceedings/update-proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ClassifyGoodService } from 'src/app/core/services/ms-classifygood/ms-classifygood.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { WarehouseFilterService } from 'src/app/core/services/ms-warehouse-filter/warehouse-filter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { EdoFisicoComponent } from '../confiscated-records/edo-fisico/edo-fisico.component.component';
import { columnsGoodAct } from '../confiscated-records/settings-tables';

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
      row.data.avalaible
        ? 'bg-success text-white'
        : 'bg-dark text-white hover-c',
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
      status: {
        title: 'Estatus',
        tipe: 'string',
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
      ...columnsGoodAct,
      received: {
        title: 'Recibido',
        type: 'custom',
        filter: false,
        sort: false,
        renderComponent: CheckboxElementComponent,
        valuePrepareFunction: (isSelected: any, row: any) => {
          return row.received == 'S' ? true : false;
        },
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onSelectRow(instance),
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  //NAVEGACION DE ACTAS
  paramsActNavigate = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsNavigate: number = 0;
  newLimitparamsActNavigate = new FormControl(1);

  //NAVEGACION DE TABLA DE BIENES
  paramsDataGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsDataGoods: number = 0;
  limitDataGoods = new FormControl(10);

  //NAVEGACION DE TABLA DE BIENES DE ACTA
  paramsDataGoodsAct = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsDataGoodsAct: number = 0;
  limitDataGoodsAct = new FormControl(10);

  //FOLIO DE ESCANEO
  folioEscaneo = 'folioEscaneo';
  cveScreen = 'FACTREFACTAVENT';
  nameReport = 'RGERGENSOLICDIGIT';

  //VARIABLES GENERALES
  idProceeding: string;

  //IDs para bienes
  idGood: number = null;
  idGoodAct: number = null;

  searchByOtherData = false;
  dataExpedients = new DefaultSelect();
  act2Valid: boolean = false;
  btnCSSAct = 'btn-primary';
  dataGoodAct = new LocalDataSource();
  dataGoods = new LocalDataSource();
  form: FormGroup;
  goodData: any[] = [];
  initialBool = true;
  labelActa = 'Cerrar acta';
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
  isEnableDireccion = true;
  warehouseSelect = new DefaultSelect();
  vaultSelect = new DefaultSelect();
  reopening = false;
  newAct = true;
  isSelectGood = false;
  isBoveda = false;
  isAlmacen = false;
  research = false;
  dataEdoFisico = new DefaultSelect(['MALO', 'REGULAR', 'BUENO']);

  //DATOS DE USUARIO
  delUser: string;
  subDelUser: string;
  departmentUser: string;

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
    private serviceProgrammingGood: ProgrammingGoodService,
    private serviceWarehouse: WarehouseFilterService,
    private serviceVault: SafeService,
    private modalService: BsModalService,
    private serviceNotification: NotificationService,
    private serviceProceeding: ProceedingsService,
    private serviceHistoryGood: HistoryGoodService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.form.get('year').setValue(format(new Date(), 'yyyy'));
    this.form.get('mes').setValue(format(new Date(), 'MM'));

    this.initalizateProceeding();

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
        console.log(params);
        this.limitDataGoodsAct = new FormControl(params.limit);
        this.getGoodsActFn();
      });

    this.paramsActNavigate
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.loading = true;
        this.dataGoodAct.load([]);
        this.clearInputs();
        const paramsF = new FilterParams();
        paramsF.page = params.page;
        paramsF.limit = 1;
        paramsF.addFilter('numFile', this.form.get('expediente').value);
        paramsF.addFilter('typeProceedings', 'DXCVENT'); //!Un in
        this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
          res => {
            console.log(res);
            const dataRes = JSON.parse(JSON.stringify(res.data[0]));
            this.fillIncomeProceeding(dataRes);
          },
          err => {
            this.loading = false;
          }
        );
      });

    this.getDataUser();

    this.form.get('statusProceeding').valueChanges.subscribe(res => {
      if (['CERRADA', 'CERRADO'].includes(res)) {
        this.labelActa = 'Abrir acta';
        this.btnCSSAct = 'btn-success';
        this.inputCloseProceeding();
      } else {
        this.labelActa = 'Cerrar acta';
        this.btnCSSAct = 'btn-primary';
      }
    });
  }

  getDataUser() {
    const token = this.authService.decodeToken();
    console.log(token);
    const user =
      localStorage.getItem('username') == 'sigebiadmon'
        ? localStorage.getItem('username')
        : localStorage.getItem('username').toLocaleUpperCase();
    const routeUser = `?filter.id=$eq:${token.preferred_username}`;
    this.serviceUser.getAllSegUsers(routeUser).subscribe(res => {
      const resJson = JSON.parse(JSON.stringify(res.data[0]));
      this.delUser = resJson.usuario.delegationNumber;
      this.subDelUser = resJson.usuario.subdelegationNumber;
      this.departmentUser = resJson.usuario.departamentNumber;
    });
  }

  goToHistorico(site: string) {
    localStorage.setItem('numberExpedient', this.numberExpedient);
    if (site == 'generalGood' && this.idGood != null) {
      this.router.navigate(
        ['/pages/general-processes/historical-good-situation'],
        { queryParams: { noBien: this.idGood } }
      );
    } else if (site == 'goodActa' && this.idGoodAct != null) {
      this.router.navigate(
        ['/pages/general-processes/historical-good-situation'],
        { queryParams: { noBien: this.idGoodAct } }
      );
    }
  }

  prepareForm() {
    this.form = this.fb.group({
      listExpedients: [null],
      expediente: [null, [Validators.required]],
      statusProceeding: [null],
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
      indEdoFisico: [null],
    });
  }

  onSelectRow(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        if (
          !['CERRADO', 'CERRADA'].includes(
            this.form.get('statusProceeding').value
          )
        ) {
          const modelEdit: IDetailProceedingsDeliveryReception = {
            exchangeValue: data.toggle ? 1 : null,
            numberGood: data.row.id,
            numberProceedings: this.idProceeding,
            received: data.toggle ? 'S' : null,
          };
          this.serviceDetailProc.editDetailProcee(modelEdit).subscribe(
            res => {
              data.row.exchangeValue = data.toggle ? 1 : null;
              data.row.received = data.toggle ? 'S' : null;
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
    if (
      this.form.get('acta').value != null &&
      this.form.get('acta').value != undefined
    ) {
      this.getTransfer();
    }
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

  validateRequired(data: any) {
    return new Promise((resolve, reject) => {
      let edoFis: boolean;
      const paramsF = new FilterParams();
      paramsF.addFilter('type', 'EDO_FIS');
      paramsF.addFilter('classifyGoodNumber', data.goodClassNumber);
      this.serviceClassifyGood.getChangeClass(paramsF.getParams()).subscribe(
        res => {
          resolve(true);
        },
        err => {
          resolve(false);
        }
      );
    });
  }

  validateWarehouseAndVault(data: any) {
    for (let item of data) {
      const newParams = `filter.numClasifGoods=$eq:${item.good.goodClassNumber}`;
      this.serviceSssubtypeGood.getFilter(newParams).subscribe(res => {
        const type = JSON.parse(JSON.stringify(res.data[0]['numType']));
        const subtype = JSON.parse(JSON.stringify(res.data[0]['numSubType']));

        const no_type = parseInt(type.id);
        const no_subtype = parseInt(subtype.id);

        if (no_type === 7 || (no_type === 5 && no_subtype === 16)) {
          this.isBoveda = true;
        }
        if (no_type === 5) {
          this.isAlmacen = true;
        }
      });
    }
  }

  validateGood(element: any) {
    let di_disponible: boolean;
    /* return new Promise((resolve, reject) => { */
    const modelScreen: IAcceptGoodStatusScreen = {
      pNumberGood: parseInt(element.goodId),
      pVcScreen: 'FACTREFACTAVENT',
    };

    const model: ICveAct = {
      pExpedientNumber: this.numberExpedient,
      pGoodNumber: element.goodId,
      pVarTypeActa1: 'DXCVENT',
      pVarTypeActa2: 'DXCVENT',
    };
    console.log(modelScreen);
    return new Promise((resolve, reject) => {
      this.serviceGoodProcess.getacceptGoodStatusScreen(modelScreen).subscribe(
        res => {
          console.log(res);
          if (typeof res == 'number' && res > 0) {
            di_disponible = true;
            this.serviceProceeding.getCveAct(model).subscribe(
              res => {
                if (res.data.length > 0) {
                  resolve({
                    avalaible: false,
                    acta: res.data[0]['cve_acta'],
                  });
                } else {
                  resolve({
                    avalaible: di_disponible,
                    acta: null,
                  });
                }
              },
              err => {
                resolve({
                  avalaible: di_disponible,
                  acta: null,
                });
              }
            );
          } else {
            di_disponible = false;

            this.serviceProceeding.getCveAct(model).subscribe(
              res => {
                if (res.data.length > 0) {
                  resolve({
                    avalaible: false,
                    acta: res.data[0]['cve_acta'],
                  });
                } else {
                  resolve({
                    avalaible: di_disponible,
                    acta: null,
                  });
                }
              },
              err => {
                resolve({
                  avalaible: di_disponible,
                  acta: null,
                });
              }
            );
          }
        },
        err => {
          di_disponible = false;

          this.serviceProceeding.getCveAct(model).subscribe(
            res => {
              if (res.data.length > 0) {
                resolve({
                  avalaible: false,
                  acta: res.data[0]['cve_acta'],
                });
              } else {
                resolve({
                  avalaible: di_disponible,
                  acta: null,
                });
              }
            },
            err => {
              resolve({
                avalaible: di_disponible,
                acta: null,
              });
            }
          );
        }
      );
    });

    /*     }); */
  }

  //Select Rows

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

  rowSelect(e: any) {
    const { data } = e;
    console.log(data);
    this.selectData = data;
    this.idGood = data.goodId;
    this.statusGood('estatusPrueba', data);
  }

  deselectRow() {
    this.selectData = null;
    this.form.get('estatusPrueba').setValue('');
  }

  async selectEdoFisRow(data: any, formName: string) {
    const edoFis: any = await this.getIndEdoFisAndVColumna(data.good);
    console.log(edoFis);
    if (edoFis.V_NO_COLUMNA === 0) {
      console.log(edoFis.V_NO_COLUMNA);
      this.form.get(formName).setValue('OTRO');
      /* await this.validatePreInsert(data); */
    } else {
      console.log(edoFis.V_NO_COLUMNA);
      this.form.get(formName).setValue(data[`val${edoFis.V_NO_COLUMNA}`]);
      /* await this.validatePreInsert(data); */
    }
  }

  selectRowBovedaAlmacen(data: any) {
    const paramsF = new FilterParams();
    paramsF.addFilter('idWarehouse', data.good.storeNumber);
    this.serviceWarehouse.getWarehouseFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.form.get('noAlmacen').setValue(res.data[0]);
      },
      err => {
        console.log(err);
      }
    );
    this.serviceVault
      .getAllFilter(`filter.idSafe=$eq:${data.good.vaultNumber}`)
      .subscribe(
        res => {
          this.form.get('noBoveda').setValue(res.data[0]);
        },
        err => {
          console.log(err);
        }
      );
  }

  selectRowGoodActa(e: any) {
    const { data } = e;
    console.log(data);
    this.selectActData = data;
    this.idGoodAct = data.good.goodId;
    this.statusGood('etiqueta', data);

    if (data != null) {
      const isSelect = e.isSelected;
      console.log(e);
      console.log(isSelect);
      /* console.log(this.saveDataAct); */
      console.log(data);
      if (
        !['CERRADO', 'CERRADA'].includes(
          this.form.get('statusProceeding').value
        ) &&
        data.indEdoFisico
      ) {
        this.isSelectGood = true;
      } else {
        this.isSelectGood = false;
      }

      this.selectActData = data;
      /* this.estadoFisBien(data); */
      this.selectEdoFisRow(data, 'edoFisico');
      this.statusGood('estatusBienActa', data);
      this.form.get('indEdoFisico').setValue(data.indEdoFisico);
      this.selectRowBovedaAlmacen(data);
    }
  }

  deselectRowGoodActa() {
    this.isSelectGood = false;
    this.selectActData = null;
    this.form.get('etiqueta').setValue('');
  }

  async applyEdoFisOne(e: any) {
    console.log(this.selectActData);
    console.log(e);
    const edoFis: any = await this.getIndEdoFisAndVColumna(
      this.selectActData.good
    );
    console.log(edoFis);
    const generalModel: Map<string, any> = new Map();
    generalModel.set('id', parseInt(this.selectActData.id.toString()));
    generalModel.set('goodId', parseInt(this.selectActData.id.toString()));
    generalModel.set(`val${edoFis.V_NO_COLUMNA}`, e);
    const jsonModel = JSON.parse(
      JSON.stringify(Object.fromEntries(generalModel))
    );
    this.serviceGood.updateWithoutId(jsonModel).subscribe(
      res => {
        this.alert('success', 'El estado físico del Bien fue cambiado', '');
      },
      err => {
        this.alert(
          'error',
          'Ocurrió un error',
          'No se pudo concretar el cambio del estado físico del Bien'
        );
      }
    );
  }

  //*Traer bienes
  getTransfer() {
    let modelTransf: ITransfActaEntrec = {
      indcap: '',
      no_expediente: this.form.get('expediente').value,
      id_tipo_acta: this.form.get('acta').value,
    };

    this.serviceNotification.getTransferenteentrec(modelTransf).subscribe(
      res => {
        this.transferSelect = new DefaultSelect(res.data);
      },
      err => {
        this.transferSelect = new DefaultSelect();
        this.loading = false;
        this.alert('warning', 'No se encontraron transferentes', '');
      }
    );
  }

  fillIncomeProceeding(dataRes: any) {
    console.log(dataRes);
    this.initialBool = true;
    this.minDateFecElab = new Date(dataRes.elaborationDate);

    const modelDetail: IDetailWithIndEdo = {
      no_acta: dataRes.id,
      page: this.paramsDataGoodsAct.getValue().page,
      perPage: this.paramsDataGoodsAct.getValue().limit,
    };

    this.serviceDetailProc.getAllwithEndFisico(modelDetail).subscribe(
      async res => {
        console.log(res);
        this.totalItemsDataGoodsAct = res.count;
        const data = this.dataGoods;
        const incomeData = res.data;
        for (let i = 0; i < incomeData.length; i++) {
          const element = JSON.parse(JSON.stringify(incomeData[i]));
          this.dataGoods.load(
            this.dataGoods['data'].map((e: any) => {
              if (e.id == element.good.id) {
                return {
                  ...e,
                  avalaible: false,
                  acta: dataRes.keysProceedings,
                };
              } else {
                return e;
              }
            })
          );
        }
        this.dataGoodAct.load(incomeData);
        this.validateWarehouseAndVault(incomeData);

        this.form.get('acta2').setValue(dataRes.keysProceedings);
        this.form.get('direccion').setValue(dataRes.address);
        this.form.get('entrega').setValue(dataRes.witness1);
        this.form.get('fecElab').setValue(
          new Date(
            new Date(dataRes.elaborationDate).toLocaleString('en-US', {
              timeZone: 'GMT',
            })
          )
        );
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
        this.form.get('statusProceeding').setValue(dataRes.statusProceedings);
        this.form.get('folioEscaneo').setValue(dataRes.universalFolio);
        console.log(this.form.get('statusProceeding').value);
        console.log(dataRes.statusProceedings);
        /*         if (this.form.get('statusProceeding').value === 'ABIERTA') {
          this.labelActa = 'Cerrar acta';
          this.btnCSSAct = 'btn-primary';
        } else {
          this.labelActa = 'Abrir acta';
          this.btnCSSAct = 'btn-success';
        } */
        this.act2Valid = true;
        this.navigateProceedings = true;
        this.idProceeding = dataRes.id;
        this.loading = false;
      },
      err => {
        this.form.get('acta2').setValue(dataRes.keysProceedings);
        this.form.get('direccion').setValue(dataRes.address);
        this.form.get('entrega').setValue(dataRes.witness1);
        this.form.get('fecElab').setValue(
          new Date(
            new Date(dataRes.elaborationDate).toLocaleString('en-US', {
              timeZone: 'GMT',
            })
          )
        );
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
        this.form.get('statusProceeding').setValue(dataRes.statusProceedings);
        this.form.get('folioEscaneo').setValue(dataRes.universalFolio);
        /*         if (this.form.get('statusProceeding').value === 'ABIERTA') {
          this.labelActa = 'Cerrar acta';
          this.btnCSSAct = 'btn-primary';
        } else {
          this.labelActa = 'Abrir acta';
          this.btnCSSAct = 'btn-success';
        } */
        this.act2Valid = true;
        this.navigateProceedings = true;
        this.loading = false;
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
          if (this.form.get('statusProceeding').value != null) {
            const modelEdit: IProccedingsDeliveryReception = {
              comptrollerWitness: this.form.get('testigo').value,
              observations: this.form.get('observaciones').value,
              witness1: this.form.get('entrega').value,
              witness2: this.form.get('recibe2').value,
              address: this.form.get('direccion').value,
              elaborationDate: new Date(
                this.form.get('fecElab').value
              ).getTime(),
              datePhysicalReception: new Date(
                this.form.get('fecRecepFisica').value
              ).getTime(),
              dateElaborationReceipt: new Date(
                this.form.get('fecElabRecibo').value
              ).getTime(),
              dateDeliveryGood: new Date(
                this.form.get('fecEntregaBienes').value
              ).getTime(),
              captureDate: new Date().getTime(),
              universalFolio: this.form.get('folioEscaneo').value,
            };
            const resData = JSON.parse(JSON.stringify(res.data[0]));
            console.log(modelEdit);
            this.serviceProcVal.editProceeding(resData.id, modelEdit).subscribe(
              res => {
                console.log(res);
                this.alert('success', 'Se modificaron los datos del acta', '');
              },
              err => {
                this.alert(
                  'error',
                  'Se presentó un error inesperado',
                  'No se puede guardar el acta'
                );
              }
            );
          } else {
            console.log('Busco validacion de acta 2');
            this.alert('warning', 'El número de acta existe', '');
            this.form.get('folio').setValue(this.form.get('folio').value + 1);
          }
        },
        err => {
          let newProceeding: IProccedingsDeliveryReception = {
            comptrollerWitness: this.form.get('testigo').value,
            observations: this.form.get('observaciones').value,
            witness1: this.form.get('entrega').value,
            witness2: this.form.get('recibe2').value,
            address: this.form.get('direccion').value,
            elaborationDate: new Date(this.form.get('fecElab').value).getTime(),
            datePhysicalReception: new Date(
              this.form.get('fecRecepFisica').value
            ).getTime(),
            dateElaborationReceipt: new Date(
              this.form.get('fecElabRecibo').value
            ).getTime(),
            dateDeliveryGood: new Date(
              this.form.get('fecEntregaBienes').value
            ).getTime(),
            captureDate: new Date().getTime(),

            keysProceedings: this.form.get('acta2').value,
            /* elaborate: 'SERA', */
            elaborate: localStorage.getItem('username').toLocaleUpperCase(),
            numFile: parseInt(this.numberExpedient),
            typeProceedings: 'DXCVENT',
            statusProceedings: 'ABIERTA',
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
              this.idProceeding = JSON.parse(JSON.stringify(res)).id;
              this.form.get('statusProceeding').setValue('ABIERTA');
              this.alert('success', 'Se guardó el acta', '');
              console.log(res);
            },
            err => {
              this.alert(
                'error',
                'Se presentó un error inesperado',
                'No se puede guardar el acta'
              );
            }
          );
        }
      );
    }
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
          this.form.get('expediente').value
        }&${paramsF.getParams()}`
      )
      .subscribe({
        next: async (res: any) => {
          if (res.data.length > 0) {
            const newData = await Promise.all(
              res.data.map(async (e: any) => {
                let disponible: boolean;
                const resp = await this.validateGood(e);

                const ind = await this.validateRequired(e);
                console.log(ind);
                console.log(resp);
                disponible = JSON.parse(JSON.stringify(resp)).avalaible;
                const cveAct = JSON.parse(JSON.stringify(resp)).acta;
                return {
                  ...e,
                  avalaible: disponible,
                  indEdoFisico: ind,
                  acta: cveAct,
                };
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
          this.dataGoods.load([]);
          this.totalItemsDataGoods = 0;
        },
      });
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

    const model: IDetailWithIndEdo = {
      no_acta: parseInt(this.idProceeding),
      page: this.paramsDataGoodsAct.getValue().page,
      perPage: this.paramsDataGoodsAct.getValue().limit,
    };

    this.serviceDetailProc.getAllwithEndFisico(model).subscribe(
      res => {
        console.log(res.data);
        this.dataGoodAct.load(res.data);
        this.totalItemsDataGoodsAct = res.count;
        this.validateWarehouseAndVault(res.data);
        this.loading = false;
      },
      err => {
        console.log(err);
        this.loading = false;
        this.dataGoodAct.load([]);
        this.form.get('almacen').reset();
        this.form.get('boveda').reset();
        this.isAlmacen = false;
        this.isBoveda = false;
        this.totalItemsDataGoodsAct = 0;
      }
    );
  }

  getGoodsByExpedient() {
    this.research = false;
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
          this.totalItemsNavigate = res.count;

          const dataRes = JSON.parse(JSON.stringify(res.data[0]));
          this.fillIncomeProceeding(dataRes);
          console.log(typeof dataRes);
          console.log('No entro');
          this.loading = false;
          this.initialBool = false;
          this.minDateFecElab = new Date();
          this.checkChange();
        }
      },
      err => {
        console.log(err);
        this.initialBool = false;
        this.loading = false;
        this.checkChange();
        this.blockExpedient = false;
        this.form.get('ident').setValue('DEV');
        this.form.get('entrego').setValue('PART');
        this.minDateFecElab = new Date();
        this.inputsnewProceeding();
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
    this.loading = true;
    this.goodData = [];
    this.dataGoodAct.load(this.goodData);
    this.numberProceeding = 0;
    this.form.get('statusProceeding').reset();
    this.numberExpedient = this.form.get('expediente').value;
    this.form.get('folioEscaneo').reset();

    const newParams = new ListParams();
    newParams.limit = 1;
    this.paramsActNavigate.next(newParams);

    /*     this.labelActa = 'Abrir acta';
    this.btnCSSAct = 'btn-success'; */

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
                  const cveAct = JSON.parse(JSON.stringify(resp)).acta;
                  console.log(resp);
                  disponible = JSON.parse(JSON.stringify(resp)).avalaible;
                  return { ...e, avalaible: disponible, acta: cveAct };
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
                'Sin Bienes válidos',
                'El número de expediente registrado no tiene Bienes válidos'
              );
              this.blockExpedient = false;
              this.loading = false;
            }
          },
          error: (err: any) => {
            console.error(err);
            this.loading = false;
            this.blockExpedient = false;
            this.blockAllInputs();
            this.alert(
              'warning',
              'No hay Bienes para este expediente',
              'No existen Bienes en este expediente, por favor revisa que el número que hayas ingresado sea el correcto.'
            );
          },
        });
    } else {
      this.searchByOthersData();
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

  fecElabFn() {
    let fecElab = new Date(this.form.get('fecElab').value);
    console.log(fecElab);
    if (this.form.get('fecElab').value != null) {
      this.form.get('fecRecepFisica').setValue(new Date(fecElab));
    } else {
      {
        this.form.get('fecRecepFisica').setValue('');
      }
    }
  }

  checkChange() {
    if (this.research) {
      console.log('No');
    } else {
      this.form
        .get('transfer')
        .valueChanges.subscribe(res => this.fillActTwo());
      this.form.get('ident').valueChanges.subscribe(res => this.fillActTwo());
      this.form.get('recibe').valueChanges.subscribe(res => {
        if (res != null && res != undefined && res.numberDelegation2) {
          if (res.numberDelegation2 != this.delUser) {
            this.form.get('recibe').reset();
            this.recibeSelect = new DefaultSelect();
            this.alert(
              'warning',
              'La delegación es diferente a la del usuario',
              ''
            );
            return;
          } else {
            this.fillActTwo();
          }
        }
      });
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
        ? this.form.get('transfer').value.clave_transferente
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
    this.loading = true;
    if (this.labelActa == 'Abrir acta') {
      this.newOpenProceeding();
    } else {
      this.newCloseProceeding();
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

  inputCloseProceeding() {
    this.initialBool = false;
    this.isEnableEntrega = false;
    this.isEnableFecElabRecibo = false;
    this.isEnableFecEntrBien = false;
    this.isEnableFecElab = false;
    this.isEnableObservaciones = false;
    this.isEnableRecibe = false;
    this.isEnableTestigo = false;
  }

  inputsnewProceeding() {
    this.initialBool = false;
    this.isEnableEntrega = true;
    this.isEnableFecElabRecibo = true;
    this.isEnableFecEntrBien = true;
    this.isEnableFecElab = true;
    this.isEnableObservaciones = true;
    this.isEnableRecibe = true;
    this.isEnableTestigo = true;
    this.noRequireAct();
  }

  newOpenProceeding() {
    const paramsF = new FilterParams();
    paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(res => {
      if (
        ['CERRADO', 'CERRADA'].includes(this.form.get('statusProceeding').value)
      ) {
        this.alertQuestion(
          'question',
          `¿Está seguro de abrir el acta ${this.form.get('acta2').value}?`,
          ''
        ).then(q => {
          if (q.isConfirmed) {
            const lv_TIP_ACTA = 'DX,DXCV';
            const modelPaOpen: IPAAbrirActasPrograma = {
              P_NOACTA: this.idProceeding,
              P_AREATRA: lv_TIP_ACTA,
              P_PANTALLA: 'FACTREFACTAVENT',
              P_TIPOMOV: 2,
              USUARIO:
                localStorage.getItem('username') == 'sigebiadmon'
                  ? localStorage.getItem('username')
                  : localStorage.getItem('username').toLocaleUpperCase(),
            };
            this.serviceProgrammingGood
              .paOpenProceedingProgam(modelPaOpen)
              .subscribe(
                res => {
                  const paramsF = new FilterParams();
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
                        const VAL_MOVIMIENTO = res.data[0]['valmovement'];
                        if (VAL_MOVIMIENTO == 1) {
                          this.serviceProgrammingGood
                            .paRegresaEstAnterior(modelPaOpen)
                            .subscribe(
                              res => {
                                /*  this.labelActa = 'Cerrar acta';
                                this.btnCSSAct = 'btn-primary'; */
                                this.form
                                  .get('statusProceeding')
                                  .setValue('ABIERTA');
                                this.reopening = true;
                                this.loading = true;
                                const btn =
                                  document.getElementById('expedient-number');
                                this.render.removeClass(btn, 'disabled');
                                this.render.addClass(btn, 'enabled');
                                this.getGoodsActFn();
                                this.getGoodsFn();
                                this.alert(
                                  'success',
                                  'El acta fue abierta',
                                  ''
                                );
                              },
                              err => {
                                console.log(err);
                                const btn =
                                  document.getElementById('expedient-number');
                                this.render.removeClass(btn, 'disabled');
                                this.render.addClass(btn, 'enabled');
                                this.loading = false;
                              }
                            );
                        } else {
                          this.alert(
                            'warning',
                            'Error al abrir acta',
                            'El estatus de los Bienes no regresaron a su estado anterior, por favor volver a intentar abrir el acta'
                          );
                          this.loading = false;
                        }
                      },
                      err => {
                        this.alert(
                          'warning',
                          'Hubo un error al abrir el acta',
                          'Lo Bienes no regresaron a su estado anterior'
                        );
                        this.loading = false;
                      }
                    );
                },
                err => {
                  this.alert(
                    'error',
                    'Se presentó un error inesperado',
                    err.error.message
                  );
                  this.loading = false;
                }
              );
          }
        });
      } else {
        this.alert('info', 'El acta ya está abierta', '');
        this.loading = false;
      }
    });
  }

  newCloseProceeding() {
    if (this.dataGoodAct['data'].length == 0) {
      this.alert(
        'warning',
        'No se registraron Bienes',
        'El Acta no contiene Bienes, no se podrá Cerrar.'
      );
      this.loading = false;
    } else if (
      this.dataGoodAct['data'].find(
        (e: any) => e.indEdoFisico && e.good[`val${e.vNoColumna}`] == null
      )
    ) {
      this.alert(
        'warning',
        'Hay Bienes con estado físico requerido sin establecer',
        ''
      );
      this.loading = false;
    } else if (this.dataGoodAct['data'].find((e: any) => e.received != 'S')) {
      this.alert('warning', 'Hay Bienes no marcados como recibido', '');
      this.loading = false;
    } else if (
      this.isAlmacen &&
      this.dataGoodAct['data'].find((e: any) => e.good.storeNumber == null)
    ) {
      this.alert('warning', 'Hay Bienes no guardados en almacén', '');
      this.loading = false;
    } else if (this.form.get('folioEscaneo').value == null) {
      this.alert('warning', 'No se ha ingresado un número de folio', '');
      this.loading = false;
    } else {
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
                  this.closeProceedingFn();
                } else {
                  this.closeProceedingFn();
                }
              },
              err => {
                this.closeProceedingFn();
              }
            );
        },
        err => {
          console.log(err);
          this.loading = false;
        }
      );
    }
  }

  waitVBANVAL() {
    return new Promise((resolve, reject) => {
      for (let item of this.dataGoodAct['data']) {
        const goodClass = item.good.goodClassNumber;
        const newParams = `filter.numClasifGoods=$eq:${goodClass}`;
        this.serviceSssubtypeGood.getFilter(newParams).subscribe(
          res => {
            console.log(res);
            const type = JSON.parse(JSON.stringify(res.data[0]['numType']));
            const subtype = JSON.parse(
              JSON.stringify(res.data[0]['numSubType'])
            );

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
            } else {
              resolve(true);
            }
          },
          err => {
            resolve(true);
          }
        );
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
        this.loading = false;
        //* Desahibilitar el boton de cerrar acta
      }
    } else if (this.form.get('folioEscaneo').value == null) {
      this.alert('warning', 'Debe introducir el valor del folio', '');
      this.loading = false;
    } else {
      this.serviceDocuments
        .getByFolio(this.form.get('folioEscaneo').value)
        .subscribe(
          async res => {
            console.log(res);
            const data = JSON.parse(JSON.stringify(res));
            const scanStatus = data.data[0]['scanStatus'];
            console.log(scanStatus);
            if (scanStatus == 'ESCANEADO') {
              const vanbal = await this.waitVBANVAL();
              console.log(vanbal);
              if (vanbal == false) {
                this.alert('warning', 'Debe especificar almacen', '');
                this.loading = false;
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
                      P_FECHA_RE_FIS: this.form.get('fecRecepFisica').value,
                      P_TIPO_ACTA: 'DXCV',
                      USUARIO:
                        localStorage.getItem('username') == 'sigebiadmon'
                          ? localStorage.getItem('username')
                          : localStorage
                              .getItem('username')
                              .toLocaleUpperCase(),
                    };
                    console.log(model);
                    this.serviceProgrammingGood.paChangeStatus(model).subscribe(
                      res => {
                        console.log(res);
                        this.getGoodsActFn();
                        this.getGoodsFn();
                        this.form.get('statusProceeding').setValue('CERRADO');
                        this.labelActa = 'Abrir acta';
                        this.btnCSSAct = 'btn-success';
                      },
                      err => {
                        this.alert(
                          'error',
                          'Ocurrió un error inesperado',
                          'Ocurrió un error inesperado al intentar cerrar el acta. Por favor intentelo nuevamente'
                        );
                        this.loading = false;
                      }
                    );
                  }
                });
              }
            } else {
              this.alert('warning', 'No se ha realizado el escaneo', '');
              this.loading = false;
            }
          },
          err => {
            this.alert('warning', 'No se ha realizado el escaneo', '');
            this.loading = false;
          }
        );
    }
  }

  closeProceeding() {
    console.log(this.dataGoodAct['data']);
    if (this.dataGoodAct['data'].length == 0) {
      this.alert(
        'warning',
        'No se registraron Bienes',
        'El Acta no contiene Bienes, no se podrá Cerrar.'
      );
    } else {
      this.serviceDocuments
        .getByFolio(this.form.get('folioEscaneo').value)
        .subscribe(
          res => {
            const data = JSON.parse(JSON.stringify(res));
            const scanStatus = data.data[0]['scanStatus'];

            if (scanStatus === 'ESCANEADO') {
              this.form.get('statusProceeding').setValue('CERRADO');
              /*  this.labelActa = 'Abrir acta';
              this.btnCSSAct = 'btn-info'; */
              const paramsF = new FilterParams();

              paramsF.addFilter(
                'keysProceedings',
                this.form.get('acta2').value
              );
              this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
                res => {
                  console.log(res);
                  this.alert('success', 'El acta ha sido cerrada', '');
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

  async validateFolio() {
    await this.serviceDocuments
      .getByFolio(this.form.get('folioEscaneo').value)
      .subscribe(res => {
        const data = JSON.parse(JSON.stringify(res));
        const scanStatus = data.data[0]['scanStatus'];
        console.log(scanStatus);
        if (scanStatus === 'ESCANEADO') {
          this.scanStatus = true;
        } else {
          this.scanStatus = false;
        }
      });
  }

  //*Agregar bienes
  newAddGood() {
    console.log();
    if (this.selectData != null) {
      if (
        ['CERRADO', 'CERRADA'].includes(this.form.get('statusProceeding').value)
      ) {
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
                  'El Bien no tiene una cantidad válida',
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

                const user =
                  localStorage.getItem('username') == 'sigebiadmon'
                    ? localStorage.getItem('username')
                    : localStorage.getItem('username').toLocaleUpperCase();

                let newDetailProceeding: IDetailProceedingsDeliveryReception = {
                  numberProceedings: data.id,
                  numberGood: this.selectData.goodId,
                  amount: this.selectData.quantity,
                  exchangeValue: 1,
                  received: 'S',
                  approvedUserXAdmon: user,
                };

                const modelHistoryGood: IHistoryGood = {
                  propertyNum: this.selectData.goodId,
                  status: this.selectData.status,
                  changeDate: new Date().toISOString(),
                  userChange: user,
                  statusChangeProgram: 'FACTREFACTAVENT',
                  reasonForChange: 'Estatus actual al agregar a acta',
                  extDomProcess: this.selectData.extDomProcess,
                };

                this.serviceHistoryGood.create(modelHistoryGood).subscribe(
                  res => {
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
                          this.getGoodsActFn();

                          /* console.log(this.dataGoods);
                        this.goodData.push(this.selectData);
                        this.dataGoodAct.load(this.goodData);
                        console.log(this.dataGoodAct);
                        this.selectData = null; */
                        },
                        err => {
                          this.alert(
                            'error',
                            'Ocurrió un error inesperado al intentar mover el Bien',
                            'Ocurrió un error inesperado al intentar mover el Bien. Por favor intentelo nuevamente'
                          );
                        }
                      );
                  },
                  err => {
                    if (
                      err.error.message ==
                      'duplicate key value violates unique constraint "his_est_bie_pk"'
                    ) {
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
                            this.getGoodsActFn();

                            /* console.log(this.dataGoods);
                        this.goodData.push(this.selectData);
                        this.dataGoodAct.load(this.goodData);
                        console.log(this.dataGoodAct);
                        this.selectData = null; */
                          },
                          err => {
                            this.alert(
                              'error',
                              'Ocurrió un error inesperado al intentar mover el Bien',
                              'Ocurrió un error inesperado al intentar mover el Bien. Por favor intentelo nuevamente'
                            );
                          }
                        );
                    } else {
                      this.alert(
                        'error',
                        'Se presentó un error inesperado',
                        ''
                      );
                    }
                  }
                );
              }
            },
            err => {
              this.alert(
                'warning',
                'Debe registrar un Acta antes de poder mover el Bien',
                ''
              );
            }
          );
        }
      }
    } else {
      this.alert(
        'warning',
        'No selecciono Bien',
        'Debe seleccionar un Bien para agregar al acta'
      );
    }
  }

  newDeleteGoods() {
    if (this.selectActData != null) {
      if (
        ['CERRADO', 'CERRADA'].includes(this.form.get('statusProceeding').value)
      ) {
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
      } else if (this.selectActData == null) {
      }
      {
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
            /*this.dataGoodAct.load(this.goodData);
            console.log(this.goodData); */
            this.getGoodsActFn();

            this.dataGoods.load(
              this.dataGoods['data'].map((e: any) => {
                if (e.id == this.selectActData.good.id) {
                  return { ...e, avalaible: true, acta: null };
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
      }
    } else {
      this.alert(
        'warning',
        'No selecciono Bien',
        'Debe seleccionar un Bien que forme parte del acta primero'
      );
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

  //NAVIGATE
  //NAVIGATE PROCEEDING
  clearAll() {
    this.clearInputs();
    this.form.get('expediente').reset();
    this.form.get('averPrev').reset();
    this.form.get('causaPenal').reset();
    this.form.get('statusProceeding').reset();
    this.form.get('acta2').reset();
    this.transferSelect = new DefaultSelect();

    //LIMPIAR TABLAS
    this.totalItemsDataGoods = 0;
    this.totalItemsDataGoodsAct = 0;
    this.paramsDataGoods.next(new ListParams());
    this.paramsDataGoodsAct.next(new ListParams());

    //Marcar en 1
    const newParams = new ListParams();
    newParams.limit = 1;
    this.paramsActNavigate.next(newParams);

    this.limitDataGoods = new FormControl(10);
    this.limitDataGoodsAct = new FormControl(10);

    this.dataGoods.load([]);
    this.dataGoodAct.load([]);

    this.blockExpedient = false;
    this.navigateProceedings = false;
    this.searchByOtherData = false;

    this.dataExpedients = new DefaultSelect([]);
    this.numberProceeding = 0;
  }

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
    this.form.get('folioEscaneo').reset();
    this.form.get('testigo').reset();
  }

  newProceeding() {
    /* this.inputsNewProceeding(); */
    this.numberProceeding = this.proceedingData.length;
    this.clearInputs();
    this.form.get('ident').setValue('DEV');
    this.form.get('entrego').setValue('PART');
    this.checkChange();
    this.minDateFecElab = new Date();
    this.form.get('statusProceeding').reset();
    /* this.labelActa = 'Abrir acta';
    this.btnCSSAct = 'btn-success'; */
    this.act2Valid = false;
    this.navigateProceedings = true;
    this.nextProce = false;
    this.initialBool = false;
    this.idProceeding = null;
    /* this.newAct = false;
    this.requireAct1(); */
    this.prevProce = true;
    this.goodData = [];
    /* this.saveDataAct = []; */
    this.dataGoodAct.load(this.goodData);
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
        this.form.get('statusProceeding').reset();
        /* this.labelActa = 'Abrir acta';
        this.btnCSSAct = 'btn-info'; */
        this.act2Valid = false;
        this.navigateProceedings = true;
        this.nextProce = false;
        this.initialBool = false;
        this.goodData = [];
        this.dataGoodAct.load(this.goodData);
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

    console.log('delete');
    if (perm == 1) {
      if (
        ['CERRADO', 'CERRADA'].includes(this.form.get('statusProceeding').value)
      ) {
        this.alert('error', 'No puede eliminar un acta cerrada', '');
      } else if (
        format(this.form.get('fecElab').value, 'MM-yyyy') !=
        format(new Date(), 'MM-yyyy')
      ) {
        this.alert(
          'error',
          'No puede eliminar acta',
          'No puede eliminar un Acta fuera del mes de elaboración'
        );
      } else if (
        this.act2Valid &&
        this.form.get('statusProceeding').value != null
      ) {
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
                    this.alert('success', 'Acta eliminada', '');
                    /* this.labelActa = 'Abrir acta';
                  this.btnCSSAct = 'btn-success'; */
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

  openEdoFisico() {
    console.log(this.dataGoodAct['data']);
    if (this.dataGoodAct['data'].length === 0) {
      this.alert(
        'warning',
        'No hay Bienes en el acta',
        'No tiene Bienes para poder modificar el estado físico'
      );
    } else {
      let modalConfig = MODAL_CONFIG;
      modalConfig = {
        initialState: {
          idProceeding: this.idProceeding,
          /* goodData: this.dataGoodAct['data'].filter(item => item.indEdoFisico),
          callback: (next: any) => {
            console.log(next);
            for (let item of next) {
              console.log(item);
              this.dataGoodAct.load(
                this.dataGoodAct['data'].map((e: any) => {
                  if (e.id === item.id) {
                    console;
                    console.log('cambio');
                    return { ...e, [`val${item.columna}`]: item.estadoFisico };
                  } else {
                    return e;
                  }
                })
              );
            }
          }, */
        },
        class: 'modal-lg modal-dialog-centered',
      };
      this.modalService.show(EdoFisicoComponent, modalConfig);
    }
  }

  applyWarehouseSafe() {
    console.log('Prueba');
    if (this.form.get('statusProceeding').value === 'ABIERTA') {
      if (this.form.get('noAlmacen').value != null) {
        for (let i = 0; i < this.dataGoodAct['data'].length; i++) {
          const element = this.dataGoodAct['data'][i].good;
          console.log(element);
          const newParams = `filter.numClasifGoods=$eq:${element.goodClassNumber}`;
          this.serviceSssubtypeGood.getFilter(newParams).subscribe(
            res => {
              const type = JSON.parse(JSON.stringify(res.data[0]['numType']));
              const subtype = JSON.parse(
                JSON.stringify(res.data[0]['numSubType'])
              );
              const ssubtype = JSON.parse(
                JSON.stringify(res.data[0]['numSsubType'])
              );
              const no_type = type.id;
              console.log(no_type);
              if (no_type == '5') {
                //Data new good
                const putGood: IGood = {
                  id: element.id,
                  goodId: element.id,
                  storeNumber: this.form.get('noAlmacen').value.idWarehouse,
                };
                console.log(putGood);
                console.log('Sí?');
                this.serviceGood.update(putGood).subscribe(res => {
                  this.getGoodsActFn();
                });
              } else {
                console.log({ message: 'No :(', type: no_type });
              }
            },
            err => {
              console.log(err);
              console.log({ msg: 'err', data: element });
            }
          );
        }
        this.alert('success', 'Se registró el almacén en los Bienes', '');
      } else {
        this.alert(
          'warning',
          'No se seleccionó almacén',
          'Debe seleccionar un almacén válido'
        );
      }
    } else if (
      ['CERRADA', 'CERRADO'].includes(this.form.get('statusProceeding').value)
    ) {
      this.alert(
        'warning',
        'El acta está cerrada',
        'El acta está cerrada por lo que no se puede hacer más modificaciones'
      );
    }
  }
}
