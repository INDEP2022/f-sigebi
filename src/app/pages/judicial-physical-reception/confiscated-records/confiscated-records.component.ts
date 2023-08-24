import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addDays, format } from 'date-fns';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { SelectListFilteredModalComponent } from 'src/app/@standalone/modals/select-list-filtered-modal/select-list-filtered-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
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
  IGood,
  ILvlPrograma,
  IValidaCambioEstatus,
  IValNumeOtro,
  IVban,
} from 'src/app/core/models/ms-good/good';
import { ITransfActaEntrec } from 'src/app/core/models/ms-notification/notification.model';
import {
  IDeleteDetailProceeding,
  IDetailProceedingsDeliveryReception,
  IDetailWithIndEdo,
} from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { ICveAct } from 'src/app/core/models/ms-proceedings/update-proceedings.model';
import { IBlkPost } from 'src/app/core/models/ms-proceedings/warehouse-vault.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ClassifyGoodService } from 'src/app/core/services/ms-classifygood/ms-classifygood.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { AttribGoodBadService } from 'src/app/core/services/ms-good/attrib-good-bad.service';
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
import { EdoFisicoComponent } from './edo-fisico/edo-fisico.component.component';
import { OptionsHistoryGoodDelegation } from './options-history-good-delegation/options-history-good-delegation.components';
import { columnsGood, columnsGoodAct } from './settings-tables';

@Component({
  selector: 'app-confiscated-records',
  templateUrl: './confiscated-records.component.html',
  styleUrls: ['confiscated-rcords.component.scss'],
})
export class ConfiscatedRecordsComponent extends BasePage implements OnInit {
  saveDataAct: any[] = [];

  settings1 = {
    ...TABLE_SETTINGS,
    rowClassFunction: (row: { data: { avalaible: any } }) =>
      row.data.avalaible ? 'bg-success text-white' : 'bg-dark text-white',
    actions: false,
    columns: columnsGood,
    noDataMessage: 'No se encontraron registros',
  };

  settings2 = {
    ...TABLE_SETTINGS,
    actions: false,
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

  form: FormGroup;

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
  cveScreen = 'FACTREFACTAENTREC';
  nameReport = 'RGERGENSOLICDIGIT';

  dataGoods = new LocalDataSource();
  dataGoodAct = new LocalDataSource();

  adminSelect = new DefaultSelect();
  dataExpedients = new DefaultSelect();
  records = new DefaultSelect();
  warehouseSelect = new DefaultSelect();
  dataEdoFisico = new DefaultSelect(['MALO', 'REGULAR', 'BUENO']);
  itemsSelect = new DefaultSelect();
  recibeSelect = new DefaultSelect();
  transferSelect = new DefaultSelect();
  vaultSelect = new DefaultSelect();

  btnCSSAct = 'btn-primary';
  labelActa = 'Cerrar acta';

  selectData: any = null;
  selectActData: any = null;
  goodData: any[] = [];
  goodDataExp: any[] = [];
  proceedingData: any[] = [];

  act2Valid = false;
  alldisabled = false;
  blockExpedient = false;
  clave_transferente: string | number;
  idProceeding: string;
  initialdisabled = true;
  isAlmacen = false;
  isBoveda = false;
  isEnableDireccion = true;
  isEnableEntrega = true;
  isEnablefecElab = true;
  isEnablefecElabRec = true;
  isEnableObservaciones = true;
  isEnableRecibe2 = true;
  isEnableTestigo = true;
  isSelectGood = false;
  minDateFecElab = new Date();
  navigateProceedings = false;
  newAct = true;
  nextProce = true;
  numberExpedient = '';
  numberProceeding = 0;
  prevProce = true;
  reopening = false;
  research = false;
  scanStatus = false;
  searchByOtherData = false;
  shouldReselect = true;
  showFecReception = false;
  v_atrib_del = 0;

  //DATOS DE USUARIO
  delUser: string;
  subDelUser: string;
  departmentUser: string;

  //VALIDAR SUSCRIPCION
  private unsubscribe$ = new Subject<void>();
  private acta2Subscription: Subscription;

  //DOBLE CLICK
  lastClick: number = 0;

  //IDs PARA STATUS
  idGood: number = null;
  idGoodAct: number = null;

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
    private modalService: BsModalService,
    private serviceProgrammingGood: ProgrammingGoodService,
    private serviceProceeding: ProceedingsService,
    private serviceClassifyGood: ClassifyGoodService,
    private serviceGoodQuery: GoodsQueryService,
    private serviceTransferent: TransferenteService,
    private serviceHistoryGood: HistoryGoodService,
    private serviceNotification: NotificationService,
    private attribGoodBadService: AttribGoodBadService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
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

    this.paramsDataGoods
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        console.log(params);
        this.limitDataGoods = new FormControl(params.limit);
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
        paramsF.addFilter(
          'typeProceedings',
          'ENTREGA,DECOMISO',
          SearchFilter.IN
        ); //!Un in
        this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
          res => {
            console.log(res);
            const dataRes = JSON.parse(JSON.stringify(res.data[0]));
            this.fillIncomeProceeding(dataRes, '');
          },
          err => {
            this.loading = false;
          }
        );
      });

    if (localStorage.getItem('numberExpedient')) {
      this.loading = true;
      this.form
        .get('expediente')
        .setValue(localStorage.getItem('numberExpedient'));
      this.newSearchExp();
      localStorage.removeItem('numberExpedient');
    }

    this.getDataUser();

    this.form.get('statusProceeding').valueChanges.subscribe(res => {
      if (['CERRADO', 'CERRADA'].includes(res)) {
        this.labelActa = 'Abrir acta';
        this.btnCSSAct = 'btn-success';
      } else {
        this.labelActa = 'Cerrar acta';
        this.btnCSSAct = 'btn-primary';
      }
    });
  }

  queryParamsFn(){
    this.activatedRoute.queryParams.pipe(
      takeUntil(this.$unSubscribe),
        tap(params => {
          console.log(params)
        })
    ).subscribe()
  }

  getDataUser() {
    const token = this.authService.decodeToken();
    const routeUser = `?filter.id=$eq:${token.preferred_username}`;
    this.serviceUser.getAllSegUsers(routeUser).subscribe(res => {
      console.log(res);
      const resJson = JSON.parse(JSON.stringify(res.data[0]));
      this.delUser = resJson.usuario.delegationNumber;
      this.subDelUser = resJson.usuario.subdelegationNumber;
      this.departmentUser = resJson.usuario.departamentNumber;
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      listExpedients: [null],
      expediente: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      statusProceeding: [null, []],
      averPrev: [null, []],
      causaPenal: [null, []],
      acta: [null],
      transfer: [null],
      ident: [null],
      recibe: [null],
      admin: [null],
      folio: [null, [Validators.pattern(NUMBERS_PATTERN)]],
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
      indEdoFisico: [null],
      almacen: [null, []],
      boveda: [null, []],
      estatusPrueba: [null, [, Validators.pattern(STRING_PATTERN)]],
      etiqueta: [null, [, Validators.pattern(STRING_PATTERN)]],
      estatusBienActa: [null, [Validators.pattern(STRING_PATTERN)]],
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
            received: data.toggle ? 'S' : null,
            exchangeValue: data.toggle ? 1 : null,
            numberGood: data.row.good.goodId,
            numberProceedings: this.idProceeding,
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

  //Enable and disabled buttons

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

  enableElement(elmt: string) {
    const element = document.getElementById(elmt);
    this.render.removeClass(element, 'disabled');
  }

  toggleActaBtn() {
    const btn = document.getElementById('expedient-number');
    this.render.removeClass(btn, 'enabled');
    this.render.addClass(btn, 'disabled');
    this.loading = true;
    if (this.labelActa == 'Abrir acta') {
      this.fnOpenProceeding();
    } else if (this.labelActa == 'Cerrar acta') {
      this.newCloseProceeding();
    }
  }

  openModalSelect(
    context?: Partial<SelectListFilteredModalComponent>,
    callback?: Function
  ) {
    const modalRef = this.modalService.show(SelectListFilteredModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered modal-not-top-padding',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSelect.subscribe(data => {
      if (data) callback(data, this);
    });
  }

  getNulls() {
    this.attribGoodBadService.selectedProceeding = parseInt(this.idProceeding);
    this.attribGoodBadService.selectedGoods = this.dataGoodAct['data'].map(
      (item: any) => item.good.goodId
    );
    console.log(this.dataGoodAct['data']);
    console.log({
      msg: 'Elements',
      data: this.dataGoodAct['data'].map((item: any) => item.good.goodId),
    });
    this.openModalSelect(
      {
        title: 'Listado de Bienes con información requerida nula',
        columnsType: {
          id: {
            title: 'No. Bien',
            type: 'string',
            sort: false,
          },
          motive: {
            title: 'Motivo',
            type: 'string',
            sort: false,
          },
        },
        service: this.attribGoodBadService,
        dataObservableFn: this.attribGoodBadService.getAllModalSelectedGoods,
        searchFilter: null,
        type: 'text',
        showError: false,
        widthButton: false,
        placeholder: 'Buscar',
      },
      this.selectGoodNull
    );
  }

  selectGoodNull(good: any, self: ConfiscatedRecordsComponent) {
    console.log(good);
    localStorage.setItem('selectedBad', JSON.stringify(good));
    self.router.navigate(['pages/general-processes/goods-characteristics']);
  }

  requireAct1() {
    this.form.get('acta').setValidators([Validators.required]);
    this.form.get('transfer').setValidators([Validators.required]);
    this.form.get('ident').setValidators([Validators.required]);
    this.form.get('recibe').setValidators([Validators.required]);
    this.form.get('admin').setValidators([Validators.required]);
    this.form.get('folio').setValidators([Validators.required]);
    this.form.get('year').setValidators([Validators.required]);
    this.form.get('mes').setValidators([Validators.required]);

    this.form.get('acta').updateValueAndValidity();
    this.form.get('transfer').updateValueAndValidity();
    this.form.get('ident').updateValueAndValidity();
    this.form.get('recibe').updateValueAndValidity();
    this.form.get('admin').updateValueAndValidity();
    this.form.get('folio').updateValueAndValidity();
    this.form.get('year').updateValueAndValidity();
    this.form.get('mes').updateValueAndValidity();
  }

  noRequireAct1() {
    this.form.get('acta').setValidators([]);
    this.form.get('transfer').setValidators([]);
    this.form.get('ident').setValidators([]);
    this.form.get('recibe').setValidators([]);
    this.form.get('admin').setValidators([]);
    this.form.get('folio').setValidators([]);
    this.form.get('year').setValidators([]);
    this.form.get('mes').setValidators([]);

    this.form.get('acta').updateValueAndValidity();
    this.form.get('transfer').updateValueAndValidity();
    this.form.get('ident').updateValueAndValidity();
    this.form.get('recibe').updateValueAndValidity();
    this.form.get('admin').updateValueAndValidity();
    this.form.get('folio').updateValueAndValidity();
    this.form.get('year').updateValueAndValidity();
    this.form.get('mes').updateValueAndValidity();
  }

  tunOffOtherData() {
    this.serviceExpedient.getById(this.form.get('expediente').value).subscribe(
      resp => {
        console.log(this.form.get('causaPenal').value != resp.criminalCase);
        console.log(this.form.get('averPrev').value != resp.preliminaryInquiry);
      },
      err => {
        console.log(err);
      }
    );
  }

  getDataExpedient() {
    this.serviceExpedient.getById(this.form.get('expediente').value).subscribe(
      resp => {
        console.log(resp.criminalCase);
        this.form.get('causaPenal').setValue(resp.criminalCase);
        console.log(resp.preliminaryInquiry);
        this.form.get('averPrev').setValue(resp.preliminaryInquiry);
        console.log(resp);
      },
      err => {
        console.log(err);
      }
    );
  }

  //Conditional functions

  verifyDateAndFill() {
    console.log(this.form.get('fecElab').value);
    let fecElab = new Date(this.form.get('fecElab').value);
    if (this.form.get('fecElab').value != null) {
      //SETEAR FECHA DE RECEPCIÓN Y ACTIVARLA
      this.form.get('fecReception').setValue(new Date(fecElab));
      this.showFecReception = true;
      //SETEAR NUEVOS VALORES
      const year = fecElab.getFullYear();
      const month = fecElab.getMonth() + 1;
      const day = fecElab.getDate();
      const hour = new Date().getHours();
      const minute = new Date().getMinutes();
      if (fecElab.getHours() != hour || fecElab.getMinutes() != minute) {
        this.form
          .get('fecElab')
          .setValue(new Date(`${year}-${month}-${day} ${hour}:${minute}`));
      }
    } else {
      {
        this.form.get('fecReception').setValue('');
        this.showFecReception = false;
      }
    }
  }

  verifyActAndTransfer() {
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

  //Validations

  validateFolio() {
    this.serviceDocuments
      .getByFolio(this.form.get('folioEscaneo').value)
      .subscribe(
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

  //Validacion de bienes
  validateGood(good: any) {
    console.log(good);
    let cu_valnume: number;
    let cu_valotro: number;
    let vn_numerario: number;
    let lv_programa: number;
    let di_disponible = false;
    let di_numerario = false;
    let di_acta: number = null;
    let bamparo = false;
    //!VALNUME Y VALOTRO

    const valModel: IValNumeOtro = {
      pc_pantalla: 'FACTREFACTAENTREC',
      no_bien: good.id,
      identificador: good.identifier,
      proceso_ext_dom: good.extDomProcess,
    };

    const getAmparo = () => {
      this.serviceGood.getById(`${good.id}&filter.labelNumber=$eq:6`).subscribe(
        res => {
          bamparo = true;
        },
        err => {
          bamparo = false;
        }
      );
    };
    return new Promise((resolve, reject) => {
      //¿ES NUMERARIO?
      this.serviceGoodProcess.getVnNumerario(good.id).subscribe(
        res => {
          //SI ES NUMERARIO
          console.log({ msg: 'Si es numerario', data: res });
          di_numerario = true;
          this.serviceGoodProcess.getValNume(valModel).subscribe(
            res => {
              console.log({ msg: 'Es Val nume', data: res });
              di_disponible = true;
              const modelPosQuery: IBlkPost = {
                no_bien: parseInt(good.id),
                no_expediente: this.form.get('expediente').value,
              };
              console.log(modelPosQuery);
              this.serviceProceeding.getBiePosquery(modelPosQuery).subscribe(
                res => {
                  console.log({ msg: 'Res en biePosquery', data: res });
                  if (res.data.length != 0) {
                    di_disponible = false;
                    getAmparo();
                    resolve({
                      avalaible: di_disponible,
                      bamparo: bamparo,
                      acta: null,
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
                  console.log({ msg: 'Error en biePosquery', data: err });
                }
              );
            },
            err => {
              console.log({ msg: 'No es Val nume', data: res });
              getAmparo();
              di_disponible = false;
              resolve({
                avalaible: di_disponible,
                bamparo: bamparo,
                acta: null,
              });
            }
          );
        },
        //NO ES NUMERARIO
        err => {
          console.log({ msg: 'No es numerario', data: err });
          di_numerario = false;
          this.serviceGoodProcess.getValOtro(valModel).subscribe(
            res => {
              console.log({ msg: 'Es Val otro', data: res });
              di_disponible = true;
              console.log(res);
              const modelPosQuery: IBlkPost = {
                no_bien: parseInt(good.id),
                no_expediente: this.form.get('expediente').value,
              };
              console.log(modelPosQuery);
              this.serviceProceeding.getBiePosquery(modelPosQuery).subscribe(
                res => {
                  console.log('Valida acta en bienes');
                  console.log(res.data);
                  if (res.data.length != 0) {
                    di_disponible = false;
                    getAmparo();
                    resolve({
                      avalaible: di_disponible,
                      bamparo: bamparo,
                      acta: res.data[0]['cve_acta'],
                    });
                  } else {
                    console.log('Entró a Val Otro');
                    const modelLvlPrograma: ILvlPrograma = {
                      no_bien: parseInt(good.id),
                      no_expediente: this.form.get('expediente').value,
                    };
                    console.log(modelLvlPrograma);

                    this.serviceGoodProcess
                      .getLvlPrograma(modelLvlPrograma)
                      .subscribe(
                        res => {
                          console.log(res);
                          lv_programa = JSON.parse(
                            JSON.stringify(res)
                          ).lv_programa;
                          if (lv_programa != 0) {
                            di_disponible = true;
                            getAmparo();
                            resolve({
                              avalaible: di_disponible,
                              bamparo: bamparo,
                              acta: null,
                            });
                          } else {
                            di_disponible = false;
                            getAmparo();
                            resolve({
                              avalaible: di_disponible,
                              bamparo: bamparo,
                              acta: null,
                            });
                          }
                        },
                        err => {
                          lv_programa = 0;
                          di_disponible = false;
                          getAmparo();
                          resolve({
                            avalaible: di_disponible,
                            bamparo: bamparo,
                            acta: null,
                          });
                        }
                      );
                  }
                },
                err => {
                  console.log('Entró a Val Otro');
                  const modelLvlPrograma: ILvlPrograma = {
                    no_bien: parseInt(good.id),
                    no_expediente: this.form.get('expediente').value,
                  };
                  console.log(modelLvlPrograma);

                  this.serviceGoodProcess
                    .getLvlPrograma(modelLvlPrograma)
                    .subscribe(
                      res => {
                        lv_programa = JSON.parse(
                          JSON.stringify(res)
                        ).lv_programa;
                        console.log(lv_programa);
                        if (lv_programa != 0) {
                          getAmparo();
                          resolve({
                            avalaible: di_disponible,
                            bamparo: bamparo,
                            acta: null,
                          });
                        } else {
                          di_disponible = false;
                          getAmparo();
                          resolve({
                            avalaible: di_disponible,
                            bamparo: bamparo,
                            acta: null,
                          });
                        }
                      },
                      err => {
                        lv_programa = 0;
                        di_disponible = false;
                        getAmparo();
                        const model: ICveAct = {
                          pExpedientNumber: this.numberExpedient,
                          pGoodNumber: good.id,
                          pVarTypeActa1: 'ENTREGA',
                          pVarTypeActa2: 'DECOMISO',
                        };
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
                                avalaible: true,
                                bamparo: bamparo,
                                acta: null,
                              });
                            }
                          },
                          err => {
                            resolve({
                              avalaible: true,
                              bamparo: bamparo,
                              acta: null,
                            });
                          }
                        );
                      }
                    );
                }
              );
            },
            err => {
              console.log({ msg: 'No es Val otro', data: err });
              console.log(err);
              di_disponible = false;
              getAmparo();
              const model: ICveAct = {
                pExpedientNumber: this.numberExpedient,
                pGoodNumber: good.id,
                pVarTypeActa1: 'ENTREGA',
                pVarTypeActa2: 'DECOMISO',
              };
              this.serviceProceeding.getCveAct(model).subscribe(
                res => {
                  if (res.data.length > 0) {
                    resolve({
                      avalaible: di_disponible,
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
              /* resolve({ avalaible: di_disponible, bamparo: bamparo }); */
              /*  */
            }
          );
        }
      );
    });
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

  validatePreInsert(e: any) {
    let v_no_clasif_camb: number;
    let v_no_etiqueta: number;
    const edoFis: any = this.getIndEdoFisAndVColumna(e);
    return new Promise((resolve, reject) => {
      if (e.indEdoFisico) {
        if (e[`val${edoFis.V_NO_COLUMNA}`] == 'MALO') {
          const paramsF = new FilterParams();
          paramsF.addFilter('type', 'EDO_FIS');
          paramsF.addFilter('classifyGoodNumber', e.good.goodClassNumber);
          this.serviceClassifyGood
            .getChangeClass(paramsF.getParams())
            .subscribe(
              res => {
                v_no_clasif_camb = res.data[0]['classifyChangeNumber'];
                const paramsF2 = new FilterParams();
                paramsF2.addFilter('classifyGoodNumber', v_no_clasif_camb);
                this.serviceClassifyGood
                  .getEtiqXClasif(paramsF2.getParams())
                  .subscribe(
                    res => {
                      v_no_etiqueta = parseInt(res.data[0]['labelNumber']);

                      const generalModel: Map<string, any> = new Map();
                      generalModel.set('id', e.good.id);
                      generalModel.set('goodId', e.good.goodId);
                      v_no_clasif_camb > 0
                        ? generalModel.set(`goodClassNumber`, v_no_clasif_camb)
                        : '';
                      v_no_etiqueta > 0
                        ? generalModel.set(`labelNumber`, v_no_etiqueta)
                        : '';
                      const jsonModel = JSON.parse(
                        JSON.stringify(Object.fromEntries(generalModel))
                      );
                      this.serviceGood.updateWithoutId(jsonModel).subscribe(
                        res => {
                          console.log(res);
                        },
                        err => {
                          console.log(err);
                        }
                      );

                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    },
                    err => {
                      v_no_etiqueta = 0;
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    }
                  );
              },
              err => {
                v_no_clasif_camb = 0;
                const paramsF2 = new FilterParams();
                paramsF2.addFilter('classifyGoodNumber', v_no_clasif_camb);
                this.serviceClassifyGood
                  .getEtiqXClasif(paramsF2.getParams())
                  .subscribe(
                    res => {
                      v_no_etiqueta = parseInt(res.data[0]['labelNumber']);
                      const generalModel: Map<string, any> = new Map();
                      generalModel.set('id', e.good.id);
                      generalModel.set('goodId', e.good.goodId);
                      v_no_clasif_camb > 0
                        ? generalModel.set(`goodClassNumber`, v_no_clasif_camb)
                        : '';
                      v_no_etiqueta > 0
                        ? generalModel.set(`labelNumber`, v_no_etiqueta)
                        : '';
                      const jsonModel = JSON.parse(
                        JSON.stringify(Object.fromEntries(generalModel))
                      );
                      this.serviceGood.updateWithoutId(jsonModel).subscribe(
                        res => {
                          console.log(res);
                        },
                        err => {
                          console.log(err);
                        }
                      );
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    },
                    err => {
                      v_no_etiqueta = 0;
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    }
                  );
              }
            );
        } else if (e[`val${edoFis.V_NO_COLUMNA}`] == 'REGULAR') {
          const paramsF = new FilterParams();
          paramsF.addFilter('type', 'EDO_FIS');
          paramsF.addFilter('classifyGoodNumber', e.good.goodClassNumber);
          this.serviceClassifyGood
            .getChangeClass(paramsF.getParams())
            .subscribe(
              res => {
                if (res.data.length > 1) {
                  v_no_clasif_camb = e.good.goodClassNumber;
                } else {
                  v_no_clasif_camb = res.data[0]['classifyChangeNumber'];
                }
                const paramsF2 = new FilterParams();
                paramsF2.addFilter('classifyGoodNumber', v_no_clasif_camb);
                this.serviceClassifyGood
                  .getEtiqXClasif(paramsF2.getParams())
                  .subscribe(
                    res => {
                      v_no_etiqueta = parseInt(res.data[0]['labelNumber']);
                      const generalModel: Map<string, any> = new Map();
                      generalModel.set('id', e.good.id);
                      generalModel.set('goodId', e.good.goodId);
                      v_no_clasif_camb > 0
                        ? generalModel.set(`goodClassNumber`, v_no_clasif_camb)
                        : '';
                      v_no_etiqueta > 0
                        ? generalModel.set(`labelNumber`, v_no_etiqueta)
                        : '';
                      const jsonModel = JSON.parse(
                        JSON.stringify(Object.fromEntries(generalModel))
                      );
                      this.serviceGood.updateWithoutId(jsonModel).subscribe(
                        res => {
                          console.log(res);
                        },
                        err => {
                          console.log(err);
                        }
                      );
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    },
                    err => {
                      v_no_etiqueta = 0;
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    }
                  );
              },
              err => {
                v_no_clasif_camb = 0;
                const paramsF2 = new FilterParams();
                paramsF2.addFilter('classifyGoodNumber', v_no_clasif_camb);
                this.serviceClassifyGood
                  .getEtiqXClasif(paramsF2.getParams())
                  .subscribe(
                    res => {
                      v_no_etiqueta = parseInt(res.data[0]['labelNumber']);
                      const generalModel: Map<string, any> = new Map();
                      generalModel.set('id', e.good.id);
                      generalModel.set('goodId', e.good.goodId);
                      v_no_clasif_camb > 0
                        ? generalModel.set(`goodClassNumber`, v_no_clasif_camb)
                        : '';
                      v_no_etiqueta > 0
                        ? generalModel.set(`labelNumber`, v_no_etiqueta)
                        : '';
                      const jsonModel = JSON.parse(
                        JSON.stringify(Object.fromEntries(generalModel))
                      );
                      this.serviceGood.updateWithoutId(jsonModel).subscribe(
                        res => {
                          console.log(res);
                        },
                        err => {
                          console.log(err);
                        }
                      );
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    },
                    err => {
                      v_no_etiqueta = 0;
                      resolve({ v_no_clasif_camb, v_no_etiqueta });
                    }
                  );
              }
            );
        }
      }
    });
  }

  getGoodsFn() {
    this.loading = true;

    const paramsF = new FilterParams();
    paramsF.page = this.paramsDataGoods.getValue().page;
    paramsF.limit = this.paramsDataGoods.getValue().limit;

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
        this.loading = false;
        this.validateWarehouseAndVault(res.data);
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

  newGetGoods() {
    const btn = document.getElementById('expedient-number');

    this.render.removeClass(btn, 'enabled');
    this.render.addClass(btn, 'disabled');

    const paramsF = new FilterParams();
    paramsF.page = this.paramsDataGoods.getValue().page;
    paramsF.limit = this.paramsDataGoods.getValue().limit;
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
            this.getGoodsByExpedient();
            this.alert(
              'success',
              'Se encontraron Bienes',
              'El número de expediente registrado tiene Bienes'
            );
            this.render.removeClass(btn, 'disabled');
            this.render.addClass(btn, 'enabled');
            this.blockExpedient = false;
          } else {
            this.initialdisabled = false;
            this.loading = false;
            this.requireAct1();
            this.inputsInProceedingClose();
            this.minDateFecElab = new Date();
            this.alert(
              'warning',
              'Sin Bienes válidos',
              'El número de expediente registrado no tiene Bienes válidos'
            );
            this.render.removeClass(btn, 'disabled');
            this.render.addClass(btn, 'enabled');
            this.blockExpedient = false;
          }
        },
        error: (err: any) => {
          console.error(err);
          this.inputsInProceedingClose();
          this.dataGoods.load([]);
          this.loading = false;
          if (err.status === 404) {
            this.initialdisabled = true;
            this.loading = false;
            this.minDateFecElab = new Date();
            this.render.removeClass(btn, 'disabled');
            this.render.addClass(btn, 'enabled');
            this.alert(
              'warning',
              'No hay Bienes para este expediente',
              'No existen Bienes en este expediente, por favor revisa que el número que hayas ingresado sea el correcto.'
            );
            this.blockExpedient = false;
          }
          if (err.status === 400) {
            this.initialdisabled = true;
            this.minDateFecElab = new Date();
            this.render.removeClass(btn, 'disabled');
            this.render.addClass(btn, 'enabled');
            this.alert(
              'warning',
              'No hay Bienes para este expediente',
              'No existen Bienes en este expediente, por favor revisa que el número que hayas ingresado sea el correcto.'
            );
          }
          this.blockExpedient = false;
        },
      });
  }

  searchButton() {
    this.loading = true;
    this.newAct = true;
    this.act2Valid = false;
    this.totalItemsDataGoods = 0;
    this.totalItemsDataGoodsAct = 0;
    this.paramsActNavigate.next(new ListParams());
    this.paramsDataGoods.next(new ListParams());
    this.paramsDataGoodsAct.next(new ListParams());

    this.idProceeding = null;
    const newParams = new ListParams();
    newParams.limit = 1;
    this.paramsActNavigate.next(newParams);

    this.unsubscribe$.next();

    if (this.form.get('expediente').value != null) {
      this.newSearchExp();
    } else {
      this.searchByOthersData();
    }
  }

  newSearchExp() {
    this.blockExpedient = true;
    this.nextProce = true;
    this.prevProce = true;
    this.navigateProceedings = false;
    this.initialdisabled = true;
    this.act2Valid = false;
    this.research = false;
    this.goodData = [];
    this.dataGoodAct.load(this.goodData);
    this.numberProceeding = 0;
    this.form.get('folioEscaneo').reset();
    this.form.get('statusProceeding').reset();
    this.numberExpedient = this.form.get('expediente').value;
    this.noRequireAct1();
    this.transferSelect = new DefaultSelect();
    this.tunOffOtherData();

    const btn = document.getElementById('expedient-number');

    this.render.removeClass(btn, 'enabled');
    this.render.addClass(btn, 'disabled');

    this.clearInputs();

    this.serviceExpedient.getById(this.form.get('expediente').value).subscribe(
      resp => {
        console.log(resp);
        console.log(resp.criminalCase);
        this.form.get('causaPenal').setValue(resp.criminalCase);
        console.log(resp.preliminaryInquiry);
        this.form.get('averPrev').setValue(resp.preliminaryInquiry);
        if (resp.expedientType == 'T') {
          this.records = new DefaultSelect(['RT']);
        } else {
          this.records = new DefaultSelect(['A', 'NA', 'D', 'NS']);
        }
        this.goodsByExpediente();
      },
      err => {
        this.alert(
          'error',
          'Hubo un error al buscar el expediente',
          'El número de expediente buscado presentó un error, puede que no exista, por favor verificar y volver a intentar.'
        );
        this.blockExpedient = false;
        this.loading = false;
        this.dataGoods.load([]);
        this.dataGoodAct.load([]);
        this.goodData = [];
      }
    );
  }

  getWarehouses(params: ListParams) {
    const paramsF = new FilterParams();
    !isNaN(parseInt(params.text))
      ? paramsF.addFilter('idWarehouse', params.text)
      : paramsF.addFilter('description', params.text, SearchFilter.ILIKE);
    this.serviceWarehouse.getWarehouseFilter(paramsF.getParams()).subscribe(
      async res => {
        console.log(res.data);
        const newData = await Promise.all(
          res.data.map((e: any) => {
            return { ...e, visualData: `${e.idWarehouse} - ${e.description}` };
          })
        );
        this.warehouseSelect = new DefaultSelect(newData, res.count);
      },
      err => {
        console.log(err);
      }
    );
  }

  setVaultNumerary() {
    const paramsF = new FilterParams();
    paramsF.addFilter('idWarehouse', 9999);
    this.serviceVault.getAllFilter(paramsF.getParams()).subscribe(
      async res => {
        const newData = await Promise.all(
          res.data.map((e: any) => {
            return { ...e, visualData: `${e.idSafe} - ${e.description}` };
          })
        );
        this.vaultSelect = new DefaultSelect(newData, res.count);
        this.form.get('boveda').setValue(newData[0]);
      },
      err => {
        this.alert('warning', 'No se encontraron Bóvedas', '');
        this.vaultSelect = new DefaultSelect();
      }
    );
  }

  getSafeVault(params: ListParams) {
    const paramsF = new FilterParams();
    !isNaN(parseInt(params.text))
      ? paramsF.addFilter('idSafe', params.text)
      : paramsF.addFilter('description', params.text, SearchFilter.LIKE);
    this.serviceVault.getAllFilter(paramsF.getParams()).subscribe(
      async res => {
        console.log(res);
        const newData = await Promise.all(
          res.data.map((e: any) => {
            return { ...e, visualData: `${e.idSafe} - ${e.description}` };
          })
        );
        this.vaultSelect = new DefaultSelect(newData, res.count);
        console.log(this.vaultSelect);
      },
      err => {
        this.alert('warning', 'No se encontraron Bóvedas', '');
        this.vaultSelect = new DefaultSelect();
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
      err => {
        this.adminSelect = new DefaultSelect();
      }
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
    localStorage.setItem('numberExpedient', this.numberExpedient);

    this.router.navigate([
      '/pages/judicial-physical-reception/partializes-general-goods',
    ]);
  }

  goCargaMasiva() {
    this.router.navigate(['/pages/general-processes/goods-tracker']);
  }

  getCargaMasiva() {
    if (
      format(this.form.get('fecCaptura').value, 'MM-yyyy') !=
      format(new Date(), 'MM-yyyy')
    ) {
      this.alert(
        'warning',
        'Fuera de fecha',
        `'El Acta ${
          this.form.get('acta2').value
        } fue capturada fuera de mes, no se puede generar la Carga Masiva`
      );
    } else {
      //!Falta lógica de carga masiva
    }
  }

  replicateFolio() {
    this.alert('info', 'El apartado de folios está en construcción', '');
  }

  //Bienes y disponibilidad de bienes

  checkChange() {
    if (this.research) {
      console.log('No');
    } else {
      this.form.get('acta').valueChanges.subscribe(res => {
        if (res != null && res != undefined) {
          this.verifyActAndTransfer();
          this.fillActTwo();
        }
      });
      this.form
        .get('transfer')
        .valueChanges.subscribe(res => this.fillActTwo());
      this.form.get('ident').valueChanges.subscribe(res => this.fillActTwo());
      this.form.get('recibe').valueChanges.subscribe(res => {
        console.log(res);
        console.log(this.delUser);
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
      this.form.get('admin').valueChanges.subscribe(res => {
        const acta = this.form.get('acta2').value;
        const arrAct = acta.split('/');
        const valAct = arrAct[0];
        if (!['NA', 'ND'].includes(valAct)) {
          if (res != null && res != undefined && res.numberDelegation2) {
            if (res.numberDelegation2 != this.delUser) {
              this.alert(
                'warning',
                'La delegación seleccionada es diferente a la del usuario',
                ''
              );
              this.adminSelect = new DefaultSelect();
              this.form.get('admin').reset();
            } else {
              this.fillActTwo();
            }
          }
        } else {
          if (res.delegation != 'CCB') {
            if (res != null && res != undefined && res.numberDelegation2) {
              if (res.numberDelegation2 != this.delUser) {
                this.alert(
                  'warning',
                  'La delegación seleccionada es diferente a la del usuario',
                  ''
                );
                this.adminSelect = new DefaultSelect();
                this.form.get('admin').reset();
              } else {
                this.fillActTwo();
              }
            }
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

  goodsByExpediente() {
    this.blockExpedient = true;
    this.nextProce = true;
    this.prevProce = true;
    this.navigateProceedings = false;
    this.initialdisabled = true;
    this.act2Valid = false;
    this.goodData = [];
    this.dataGoodAct.load(this.goodData);
    this.numberProceeding = 0;
    this.form.get('folioEscaneo').reset();
    this.form.get('statusProceeding').reset();
    this.numberExpedient = this.form.get('expediente').value;
    this.noRequireAct1();

    const btn = document.getElementById('expedient-number');

    this.render.removeClass(btn, 'enabled');
    this.render.addClass(btn, 'disabled');

    this.clearInputs();
    console.log(this.form.get('expediente').value);
    if (this.form.get('expediente').value != null) {
      const paramsF = new FilterParams();
      paramsF.page = this.paramsDataGoods.getValue().page;
      paramsF.limit = this.paramsDataGoods.getValue().limit;

      this.serviceGood
        .getAllFilterDetail(
          `filter.fileNumber=$eq:${
            this.form.get('expediente').value
          }&filter.status=$not:ADM&filter.labelNumber=$not:6&${paramsF.getParams()}`
        )
        .subscribe({
          next: async (res: any) => {
            if (res.data.length > 0) {
              this.form.get('ident').setValue('ADM');
              this.dataGoods.load(res.data);
              console.log(res);
              const newData = await Promise.all(
                res.data.map(async (e: any) => {
                  console.log(e);
                  let disponible: boolean;
                  const resp = await this.validateGood(e);
                  const ind = await this.validateRequired(e);
                  console.log(ind);
                  console.log(resp);
                  disponible = JSON.parse(JSON.stringify(resp)).avalaible;
                  const acta = JSON.parse(JSON.stringify(resp)).acta;
                  return {
                    ...e,
                    avalaible: disponible,
                    indEdoFisico: ind,
                    acta: acta,
                  };
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
              this.initialdisabled = false;
              this.requireAct1();
              this.minDateFecElab = new Date();
              this.inputsNewProceeding();

              this.loading = false;
              /* this.newSearchExp(); */
              this.alert(
                'warning',
                'Sin Bienes válidos',
                'El número de expediente registrado no tiene Bienes válidos'
              );
              this.render.removeClass(btn, 'disabled');
              this.render.addClass(btn, 'enabled');
              this.blockExpedient = false;
            }
          },
          error: (err: any) => {
            console.error(err);
            this.dataGoods.load([]);
            if (err.status === 404) {
              this.initialdisabled = true;

              this.minDateFecElab = new Date();
              this.render.removeClass(btn, 'disabled');
              this.render.addClass(btn, 'enabled');
              this.alert(
                'warning',
                'No hay Bienes para este expediente',
                'No existen Bienes en este expediente, por favor revisa que el número que hayas ingresado sea el correcto.'
              );
              this.blockExpedient = false;
            }
            if (err.status === 400) {
              this.initialdisabled = true;
              this.minDateFecElab = new Date();
              this.render.removeClass(btn, 'disabled');
              this.render.addClass(btn, 'enabled');
              this.alert(
                'warning',
                'No hay Bienes para este expediente',
                'No existen Bienes en este expediente, por favor revisa que el número que hayas ingresado sea el correcto.'
              );
            }
            this.blockExpedient = false;
          },
        });
    } else {
      this.searchByOthersData();
    }
  }

  inputsInProceedingClose() {
    this.isEnableDireccion = false;
    this.isEnableEntrega = false;
    this.isEnablefecElab = false;
    this.isEnablefecElabRec = false;
    this.isEnableObservaciones = false;
    this.isEnableRecibe2 = false;
    this.isEnableTestigo = false;
  }

  inputsNewProceeding() {
    this.checkChange();
    this.isEnableDireccion = true;
    this.isEnableEntrega = true;
    this.isEnablefecElab = true;
    this.isEnablefecElabRec = true;
    this.isEnableObservaciones = true;
    this.isEnableRecibe2 = true;
    this.isEnableTestigo = true;
  }

  inputsReopenProceeging() {
    this.isEnableDireccion = true;
    this.isEnableEntrega = true;
    this.isEnablefecElab = false;
    this.isEnablefecElabRec = false;
    this.isEnableObservaciones = true;
    this.isEnableRecibe2 = true;
    this.isEnableTestigo = true;
  }

  fillIncomeProceeding(dataRes: any, action: string) {
    console.log(dataRes.id);
    console.log(dataRes.keysProceedings);
    console.log({ msg: 'Respuesta fill', data: dataRes });
    const realDate = new Date(dataRes.elaborationDate).toLocaleString('en-US', {
      timeZone: 'GMT',
    });
    console.log({
      msg: 'Fecha de la BD',
      data: new Date(
        new Date(dataRes.elaborationDate).toLocaleString('en-US', {
          timeZone: 'GMT',
        })
      ),
    });
    console.log({ msg: 'Fecha de la BD', data: dataRes.datePhysicalReception });
    /* console.log({msg: 'Fecha de la BD pasada por New Date', data: dataRes.elaborationDate.getTime()}) */
    this.initialdisabled = true;
    this.noRequireAct1();
    this.idProceeding = dataRes.id;
    this.minDateFecElab = new Date(dataRes.elaborationDate);

    const modelDetail: IDetailWithIndEdo = {
      no_acta: dataRes.id,
      page: this.paramsDataGoodsAct.getValue().page,
      perPage: this.paramsDataGoodsAct.getValue().limit,
    };

    this.serviceDetailProc.getAllwithEndFisico(modelDetail).subscribe(
      async res => {
        console.log(res);
        const data = this.dataGoods;
        const incomeData = res.data;
        this.totalItemsDataGoodsAct = res.count;

        this.dataGoodAct.load(incomeData);
        this.validateWarehouseAndVault(incomeData);

        this.form.get('statusProceeding').setValue(dataRes.statusProceedings);
        this.form.get('direccion').setValue(dataRes.address);
        this.form.get('entrega').setValue(dataRes.witness1);
        this.form
          .get('fecElabRec')
          .setValue(addDays(new Date(dataRes.dateElaborationReceipt), 1));
        this.form
          .get('fecEntBien')
          .setValue(addDays(new Date(dataRes.dateDeliveryGood), 1));
        this.form.get('fecElab').setValue(
          new Date(
            new Date(dataRes.elaborationDate).toLocaleString('en-US', {
              timeZone: 'GMT',
            })
          )
        );

        console.log({
          msg: 'Fecha ya guardada',
          data: this.form.get('fecElab').value,
        });

        this.form
          .get('fecReception')
          .setValue(addDays(new Date(dataRes.datePhysicalReception), 1));
        this.form
          .get('fecCaptura')
          .setValue(addDays(new Date(dataRes.captureDate), 1));
        this.form.get('observaciones').setValue(dataRes.observations);
        this.form.get('recibe2').setValue(dataRes.witness2);
        this.form.get('testigo').setValue(dataRes.comptrollerWitness);
        this.form.get('folioEscaneo').setValue(dataRes.universalFolio);
        this.form.get('acta2').setValue(dataRes.keysProceedings);
        const splitActa = dataRes.keysProceedings.split('/');
        console.log(splitActa);
        if (['NA', 'ND'].includes(splitActa[0])) {
          this.setVaultNumerary();
        }

        if (this.form.get('statusProceeding').value === 'ABIERTA') {
          this.labelActa = 'Cerrar acta';
          this.btnCSSAct = 'btn-primary';
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
        }
        this.act2Valid = true;
        console.log('Está activando aquí');
        this.navigateProceedings = true;
        this.loading = false;
      },
      err => {
        this.form.get('statusProceeding').setValue(dataRes.statusProceedings);

        this.form.get('direccion').setValue(dataRes.address);
        this.form.get('entrega').setValue(dataRes.witness1);
        this.form
          .get('fecElabRec')
          .setValue(addDays(new Date(dataRes.dateElaborationReceipt), 1));
        this.form
          .get('fecEntBien')
          .setValue(addDays(new Date(dataRes.dateDeliveryGood), 1));
        this.form.get('fecElab').setValue(
          new Date(
            new Date(dataRes.elaborationDate).toLocaleString('en-US', {
              timeZone: 'GMT',
            })
          )
        );
        console.log({
          msg: 'Fecha ya guardada',
          data: this.form.get('fecElab').value,
        });
        this.form
          .get('fecReception')
          .setValue(addDays(new Date(dataRes.datePhysicalReception), 1));
        this.form
          .get('fecCaptura')
          .setValue(addDays(new Date(dataRes.captureDate), 1));
        this.form.get('observaciones').setValue(dataRes.observations);
        this.form.get('recibe2').setValue(dataRes.witness2);
        this.form.get('testigo').setValue(dataRes.comptrollerWitness);
        this.form.get('folioEscaneo').setValue(dataRes.universalFolio);
        this.form.get('acta2').setValue(dataRes.keysProceedings);

        const splitActa = dataRes.keysProceedings.split('/');
        console.log(splitActa);
        if (['NA', 'ND'].includes(splitActa[0])) {
          this.setVaultNumerary();
        }

        if (this.form.get('statusProceeding').value === 'ABIERTA') {
          this.labelActa = 'Cerrar acta';
          this.btnCSSAct = 'btn-primary';
          this.inputsReopenProceeging();
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
        this.act2Valid = true;
        console.log('Está activando aquí');
        this.loading = false;
        this.navigateProceedings = true;
      }
    );
  }

  clearAll() {
    this.clearInputs();
    this.form.get('expediente').reset();
    this.form.get('averPrev').reset();
    this.form.get('causaPenal').reset();
    this.form.get('statusProceeding').reset();
    this.totalItemsDataGoods = 0;
    this.totalItemsDataGoodsAct = 0;

    this.idProceeding = null;
    this.numberExpedient = null;

    this.dataGoods.load([]);
    this.dataGoodAct.load([]);

    /* this.paramsActNavigate.next(new ListParams());
    this.paramsDataGoods.next(new ListParams());
    this.paramsDataGoodsAct.next(new ListParams()); */
    this.unsubscribe$.next();

    this.blockExpedient = false;
    this.navigateProceedings = false;
    this.searchByOtherData = false;

    this.dataExpedients = new DefaultSelect([]);
    this.numberProceeding = 0;
  }

  clearInputs() {
    this.form.get('acta2').reset();
    this.form.get('ident').reset();
    this.form.get('direccion').reset();
    this.form.get('entrega').reset();
    this.form.get('fecElabRec').reset();
    this.form.get('fecEntBien').reset();
    this.form.get('fecElab').reset();
    this.form.get('fecReception').reset();
    this.form.get('fecCaptura').reset();
    this.form.get('observaciones').reset();
    this.form.get('recibe2').reset();
    this.form.get('testigo').reset();
    this.form.get('acta').reset();
    this.form.get('transfer').reset();
    this.form.get('recibe').reset();
    this.form.get('admin').reset();
    this.form.get('folio').reset();
    this.form.get('almacen').reset();
    this.form.get('boveda').reset();
    this.form.get('folioEscaneo').reset();

    this.goodData = [];
    this.dataGoodAct.load(this.goodData);
    this.saveDataAct = [];
    this.act2Valid = false;
  }

  nextProceeding() {
    this.loading = true;
    this.unsubscribe$.next();
    if (this.numberProceeding <= this.proceedingData.length - 1) {
      this.numberProceeding += 1;
      console.log(this.numberProceeding);
      if (this.numberProceeding <= this.proceedingData.length - 1) {
        const dataRes = JSON.parse(
          JSON.stringify(this.proceedingData[this.numberProceeding])
        );
        this.clearInputs();
        this.fillIncomeProceeding(dataRes, 'nextProceeding');
      } else {
        this.numberProceeding = 0;
        const dataRes = JSON.parse(
          JSON.stringify(this.proceedingData[this.numberProceeding])
        );
        this.clearInputs();
        this.fillIncomeProceeding(dataRes, 'nextProceeding');
      }
    } else {
      this.numberProceeding = 0;
      const dataRes = JSON.parse(
        JSON.stringify(this.proceedingData[this.numberProceeding])
      );
      this.fillIncomeProceeding(dataRes, 'nextProceeding');
    }
  }

  prevProceeding() {
    console.log(this.numberProceeding);
    console.log(this.proceedingData.length);
    this.loading = true;
    this.unsubscribe$.complete();

    /* this.prevProce = false;
    this.nextProce = false; */
    if (
      this.numberProceeding <= this.proceedingData.length &&
      this.numberProceeding > 0
    ) {
      this.numberProceeding -= 1;
      console.log(this.numberProceeding);
      if (this.numberProceeding <= this.proceedingData.length - 1) {
        this.act2Valid = false;
        this.newAct = true;
        const dataRes = JSON.parse(
          JSON.stringify(this.proceedingData[this.numberProceeding])
        );
        this.clearInputs();
        this.fillIncomeProceeding(dataRes, 'prevProceeding');
        /*  if (this.numberProceeding == 0) {

          /* this.prevProce = false;
        } */
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

  searchByOthersData() {
    const paramsF = new FilterParams();
    if (this.form.get('averPrev').value != null) {
      paramsF.addFilter('preliminaryInquiry', this.form.get('averPrev').value);
      this.serviceExpedient.getAllFilter(paramsF.getParams()).subscribe(
        res => {
          this.loading = false;
          console.log(res);
          this.searchByOtherData = true;
          this.dataExpedients = new DefaultSelect(res.data);
        },
        err => {
          console.log(err);
          this.loading = false;

          this.form.get('averPrev').setValue(null);
          this.dataExpedients = new DefaultSelect();
          this.alert(
            'warning',
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
          this.loading = false;

          this.searchByOtherData = true;
          this.dataExpedients = new DefaultSelect(res.data);
        },
        err => {
          console.log(err);
          this.loading = false;
          this.form.get('causaPenal').setValue(null);
          this.dataExpedients = new DefaultSelect();
          this.alert('warning', 'La causa penal colocada no tiene datos', '');
        }
      );
    }
    this.blockExpedient = false;
  }

  selectExpedient(e: any) {
    this.loading = true;
    console.log(e);
    this.form.get('expediente').setValue(e.id);
    this.newSearchExp();
  }

  getGoodsByExpedient() {
    //Validar si hay un acta abiert
    const paramsF = new FilterParams();
    paramsF.limit = 1;
    paramsF.addFilter('numFile', this.form.get('expediente').value);
    paramsF.addFilter('typeProceedings', 'ENTREGA,DECOMISO', SearchFilter.IN); //!Un in
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        console.log(res.data);
        if (res.data.length > 0) {
          console.log('Entró');
          this.proceedingData = res.data;
          this.totalItemsNavigate = res.count;
          console.log(this.proceedingData);
          const dataRes = JSON.parse(JSON.stringify(res.data[0]));
          this.idProceeding = dataRes.id;
          console.log(dataRes);
          this.fillIncomeProceeding(dataRes, '');
          console.log(typeof dataRes);
        } else {
          console.log('Entro en else de res');
          this.initialdisabled = false;
          this.loading = false;
          this.requireAct1();
          this.inputsNewProceeding();
          this.minDateFecElab = new Date();
        }
      },
      err => {
        console.log('Entro a error');
        console.log(err);
        this.loading = false;
        this.initialdisabled = false;
        this.requireAct1();
        this.inputsNewProceeding();
        this.minDateFecElab = new Date();
      }
    );
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
    } else if (!this.form.get('fecElabRec').valid) {
      this.alert(
        'warning',
        'Debe registrar una fecha de elaboración recibo válida',
        ''
      );
    } else if (!this.form.get('fecEntBien').valid) {
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
    } else if (
      ['CERRADO', 'CERRADA'].includes(this.form.get('statusProceeding').value)
    ) {
      this.alert('warning', 'El acta está cerrada', '');
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
              universalFolio: parseInt(this.form.get('folioEscaneo').value),
              elaborationDate: new Date(
                this.form.get('fecElab').value
              ).getTime(),
              datePhysicalReception: new Date(
                this.form.get('fecReception').value
              ).getTime(),
              dateElaborationReceipt: new Date(
                this.form.get('fecElabRec').value
              ).getTime(),
              dateDeliveryGood: new Date(
                this.form.get('fecEntBien').value
              ).getTime(),
            };
            const resData = JSON.parse(JSON.stringify(res.data[0]));
            console.log(modelEdit);
            this.serviceProcVal.editProceeding(resData.id, modelEdit).subscribe(
              res => {
                this.research = true;
                this.alert('success', 'Se modificaron los datos del acta', '');
              },
              err => {
                console.log(err);
                this.alert(
                  'error',
                  'Se presentó un error inesperado',
                  'No se puede guardar el acta'
                );
              }
            );
          } else {
            if (res != null) {
              console.log('Busco validacion de acta 2');
              this.alert('warning', 'El número de acta existe', '');
              this.form.get('folio').setValue(this.form.get('folio').value + 1);
            }
          }
        },
        err => {
          const paramsF = new FilterParams();
          paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
          this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
            res => {
              if (res != null) {
                console.log('Busco validacion de acta 2');
                this.alert('warning', 'El número de acta existe', '');
                this.form
                  .get('folio')
                  .setValue(this.form.get('folio').value + 1);
              }
            },
            err => {
              let newProceeding: IProccedingsDeliveryReception = {
                keysProceedings: this.form.get('acta2').value,
                statusProceedings: 'ABIERTA',
                elaborationDate: new Date(
                  this.form.get('fecElab').value
                ).getTime(),
                datePhysicalReception: new Date(
                  this.form.get('fecReception').value
                ).getTime(),
                address: this.form.get('direccion').value,
                elaborate:
                  localStorage.getItem('username') == 'sigebiadmon'
                    ? localStorage.getItem('username')
                    : localStorage.getItem('username').toLocaleUpperCase(),
                numFile: this.form.get('expediente').value,
                witness1: this.form.get('entrega').value,
                witness2: this.form.get('recibe2').value,
                typeProceedings: ['D', 'ND'].includes(
                  this.form.get('acta').value
                )
                  ? 'DECOMISO'
                  : 'ENTREGA',
                dateElaborationReceipt: new Date(
                  this.form.get('fecElabRec').value
                ).getTime(),
                dateDeliveryGood: new Date(
                  this.form.get('fecEntBien').value
                ).getTime(),
                responsible: null,
                destructionMethod: null,
                observations: this.form.get('observaciones').value,
                approvalDateXAdmon: null,
                approvalUserXAdmon: null,
                numRegister: null,
                captureDate: new Date().getTime(),
                numDelegation1: this.form.get('admin').value.numberDelegation2,
                numDelegation2:
                  this.form.get('admin').value.numberDelegation2 == 11
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
                  console.log(res);
                  this.initialdisabled = true;
                  this.idProceeding = JSON.parse(JSON.stringify(res)).id;
                  this.research = true;
                  this.unsubscribe$.next();

                  this.form.get('statusProceeding').setValue('ABIERTA');
                  this.form.get('fecCaptura').setValue(new Date());
                  this.alert('success', 'Se guardó el acta', '');

                  const splitActa = this.form.get('acta2').value.split('/');
                  if (['NA', 'ND'].includes(splitActa[0])) {
                    this.setVaultNumerary();
                  }
                },
                err => {
                  console.log(err);
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
      );
    }
  }

  fnOpenProceeding() {
    if (
      ['CERRADO', 'CERRADA'].includes(this.form.get('statusProceeding').value)
    ) {
      this.alertQuestion(
        'question',
        `¿Está seguro de abrir el Acta ${this.form.get('acta2').value} ?`,
        ''
      ).then(q => {
        if (q.isConfirmed) {
          const paramsF = new FilterParams();
          let VAL_MOVIMIENTO = 0;
          const user =
            localStorage.getItem('username') == 'sigebiadmon'
              ? localStorage.getItem('username')
              : localStorage.getItem('username').toLocaleUpperCase();

          paramsF.addFilter('valUser', user);
          paramsF.addFilter('valMinutesNumber', this.idProceeding);
          this.loading = true;

          const splitActa = this.form.get('acta2').value.split('/');
          const tipo_acta = ['D', 'ND'].includes(splitActa[0])
            ? 'DECOMISO'
            : 'ENTREGA';
          const lv_TIP_ACTA = `RF,${tipo_acta}`;

          const modelPaOpen: IPAAbrirActasPrograma = {
            P_NOACTA: this.idProceeding,
            P_AREATRA: lv_TIP_ACTA,
            P_PANTALLA: 'FACTREFACTAENTREC',
            P_TIPOMOV: 2,
            USUARIO: user,
          };
          console.log(modelPaOpen);
          this.serviceProgrammingGood
            .paOpenProceedingProgam(modelPaOpen)
            .subscribe(
              res => {
                this.serviceProgrammingGood
                  .getTmpProgValidation(paramsF.getParams())
                  .subscribe(
                    res => {
                      console.log(res);
                      VAL_MOVIMIENTO = res.data[0]['valmovement'];
                      console.log(VAL_MOVIMIENTO);
                      if (VAL_MOVIMIENTO == 1) {
                        this.serviceProgrammingGood
                          .paRegresaEstAnterior(modelPaOpen)
                          .subscribe(
                            res => {
                              this.labelActa = 'Cerrar acta';
                              this.btnCSSAct = 'btn-primary';
                              this.form
                                .get('statusProceeding')
                                .setValue('ABIERTA');
                              this.reopening = true;
                              this.inputsReopenProceeging();
                              this.loading = false;
                              this.research = true;
                              this.getGoodsActFn();
                              this.getGoodsFn();

                              this.alert(
                                'success',
                                'Acta abierta',
                                `El acta ${
                                  this.form.get('acta2').value
                                } fue abierta`
                              );
                            },
                            err => {
                              this.alert('warning', 'Error al abrir acta', '');
                            }
                          );
                      } else {
                        this.loading = false;
                        this.alert(
                          'warning',
                          'Error al abrir acta',
                          'Por favor intente nuevamente'
                        );
                      }
                    },
                    err => {
                      console.log(err);
                      this.loading = false;
                      VAL_MOVIMIENTO = 0;
                      this.alert('warning', 'Error en tmp', '');
                    }
                  );
              },
              err => {
                console.log(err);
                const btn = document.getElementById('expedient-number');
                this.render.removeClass(btn, 'disabled');
                this.render.addClass(btn, 'enabled');
                this.loading = false;
                this.alert(
                  'error',
                  'No se pudo abrir el acta',
                  err.error.message
                );
              }
            );
        } else {
          this.loading = false;
        }
      });
    } else {
      this.newOpenProceeding();
    }
  }

  newOpenProceeding() {
    console.log(this.dataGoodAct['data']);
    const paramsF = new FilterParams();
    paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        const resData = JSON.parse(JSON.stringify(res.data))[0];
        const model: IValidaCambioEstatus = {
          p1: 3,
          p2: resData.id.toString(),
          p3: null,
          p4: null,
        };
        this.serviceGood.PAValidaCambio(model).subscribe(
          res => {
            const { P5 } = res;
            console.log(P5);
            if (P5 > 0) {
            } else {
              if (this.goodData.length <= 0) {
                this.alert(
                  'warning',
                  'No hay Bienes registrados',
                  'Necesita registrar Bienes en el acta para crearla'
                );
              } else {
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
                      } else if (this.form.get('folioEscaneo').value === null) {
                        this.alert(
                          'warning',
                          'Debe introducir el valor del folio',
                          ''
                        );
                      } else {
                        const modelEdit: IProccedingsDeliveryReception = {
                          statusProceedings: 'ABIERTA',
                          comptrollerWitness: this.form.get('testigo').value,
                          observations: this.form.get('observaciones').value,
                          witness1: this.form.get('entrega').value,
                          witness2: this.form.get('recibe2').value,
                          address: this.form.get('direccion').value,
                          elaborationDate: new Date(
                            this.form.get('fecElab').value
                          ).getDate(),
                          datePhysicalReception: new Date(
                            this.form.get('fecReception').value
                          ).getTime(),
                          dateElaborationReceipt: new Date(
                            this.form.get('fecElabRec').value
                          ).getTime(),
                          dateDeliveryGood: new Date(
                            this.form.get('fecEntBien').value
                          ).getTime(),
                          captureDate: new Date().getTime(),
                        };
                        this.serviceProcVal
                          .editProceeding(resData.id, modelEdit)
                          .subscribe(res => {
                            this.labelActa = 'Cerrar acta';
                            this.btnCSSAct = 'btn-primary';
                            this.form
                              .get('statusProceeding')
                              .setValue('ABIERTA');
                            this.reopening = true;
                            this.inputsReopenProceeging();
                            this.research = true;
                            this.alert(
                              'success',
                              'Acta abierta',
                              `El acta ${
                                this.form.get('acta2').value
                              } fue abierta`
                            );
                          });
                      }
                    }
                  );
              }
            }
          },
          err => {
            console.log(err);
          }
        );
      },
      err => {
        if (this.goodData.length <= 0) {
          this.alert(
            'warning',
            'No hay Bienes registrados',
            'Necesita registrar Bienes en el acta para crearla'
          );
        } else {
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
              },
              err => {
                const fec_elab = this.form.get('fecElab').value;
                if (
                  fec_elab != null &&
                  format(fec_elab, 'MM-yyyy') != format(new Date(), 'MM-yyyy')
                ) {
                  this.alert(
                    'warning',
                    'Está fuera de tiempo para cerrar el acta',
                    ''
                  );
                } else if (this.form.get('folioEscaneo').value === null) {
                  this.alert(
                    'warning',
                    'Debe introducir el valor del folio',
                    ''
                  );
                } else {
                  let newProceeding: IProccedingsDeliveryReception = {
                    keysProceedings: this.form.get('acta2').value,
                    elaborationDate: new Date(
                      this.form.get('fecElab').value
                    ).getTime(),
                    datePhysicalReception: new Date(
                      this.form.get('fecReception').value
                    ).getTime(),
                    address: this.form.get('direccion').value,
                    statusProceedings: 'ABIERTA',
                    /* elaborate: 'SERA', */
                    elaborate:
                      localStorage.getItem('username') == 'sigebiadmon'
                        ? localStorage.getItem('username')
                        : localStorage.getItem('username').toLocaleUpperCase(),
                    numFile: parseInt(this.idProceeding.toString()),
                    witness1: this.form.get('entrega').value,
                    witness2: this.form.get('recibe2').value,
                    typeProceedings: ['D', 'ND'].includes(
                      this.form.get('acta').value
                    )
                      ? 'DECOMISO'
                      : 'ENTREGA',
                    dateElaborationReceipt: new Date(
                      this.form.get('fecElabRec').value
                    ).getTime(),
                    dateDeliveryGood: new Date(
                      this.form.get('fecEntBien').value
                    ).getTime(),
                    responsible: null,
                    destructionMethod: null,
                    observations: this.form.get('observaciones').value,
                    approvalDateXAdmon: null,
                    approvalUserXAdmon: null,
                    numRegister: null,
                    captureDate: new Date().getTime(),
                    numDelegation1:
                      this.form.get('admin').value.numberDelegation2,
                    numDelegation2:
                      this.form.get('admin').value.numberDelegation2 === 11
                        ? 11
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
                          this.form.get('fecCaptura').setValue(new Date());
                          this.form.get('statusProceeding').setValue('ABIERTA');
                          this.labelActa = 'Cerrar acta';
                          this.btnCSSAct = 'btn-primary';
                          this.inputsInProceedingClose();
                          this.research = true;
                          this.alert(
                            'success',
                            'Acta abierta',
                            `El acta ${
                              this.form.get('acta2').value
                            } fue abierta`
                          );
                          const btn =
                            document.getElementById('expedient-number');
                          this.render.removeClass(btn, 'disabled');
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

  async validateIsInWarehouseOrVault() {
    return new Promise((resolve, reject) => {
      for (let item of this.dataGoodAct['data']) {
        console.log(item);
        const newParams = `filter.numClasifGoods=$eq:${item.good.goodClassNumber}`;
        this.serviceSssubtypeGood.getFilter(newParams).subscribe(
          res => {
            const type = JSON.parse(JSON.stringify(res.data[0]['numType']));
            const subtype = JSON.parse(
              JSON.stringify(res.data[0]['numSubType'])
            );

            const no_type = parseInt(type.id);
            const no_subtype = parseInt(subtype.id);
            console.log(no_type);
            console.log(no_subtype);
            if (no_type == 7 && item.good.vaultNumber == null) {
              resolve(true);
            } else if (
              no_type == 5 &&
              no_subtype == 16 &&
              item.good.storeNumber == null &&
              item.good.vaultNumber == null
            ) {
              resolve(true);
            } else if (
              no_type == 5 &&
              no_subtype != 16 &&
              item.good.storeNumber == null
            ) {
              resolve(true);
            }
          },
          err => {}
        );
      }
      resolve(false);
    });
  }

  async newCloseProceeding() {
    this.validateFolio();
    const validate = await this.validateIsInWarehouseOrVault();
    console.log(validate);
    console.log({
      tipo: typeof validate,
      valor: validate,
      msg: 'Validar bodega',
    });
    if (this.dataGoodAct['data'].length == 0) {
      this.alert(
        'warning',
        'No se registraron Bienes',
        'El Acta no contiene Bienes, no se podrá Cerrar.'
      );
      this.loading = false;
    } else if (
      ['CERRADO', 'CERRADA'].includes(this.form.get('statusProceeding').value)
    ) {
      this.loading = false;
      this.alert('warning', 'El acta ya se encuentra cerrada', '');
    } else if (
      this.dataGoodAct['data'].find(
        (e: any) => e.indEdoFisico && e.good[`val${e.vNoColumna}`] == null
      )
    ) {
      this.loading = false;
      this.alert(
        'warning',
        'Hay Bienes con estado físico requerido sin establecer',
        ''
      );
    } else if (this.dataGoodAct['data'].find((e: any) => e.received != 'S')) {
      this.loading = false;
      this.alert('warning', 'Hay Bienes no marcados como recibido', '');
    } else if (validate) {
      this.loading = false;
      this.alert(
        'warning',
        'Se debe especificar el Almacén y/o la Bóveda para cerrar el Acta, favor de ingresar',
        ''
      );
    } else if (this.form.get('folioEscaneo').value == null) {
      this.loading = false;
      this.alert('warning', 'No se registro número de folio', '');
    } else {
      const paramsF = new FilterParams();
      paramsF.addFilter('keysProceedings', this.form.get('acta2').value);
      this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
        res => {
          const resData = JSON.parse(JSON.stringify(res.data))[0];
          const idProcee = resData.id;
          const model: IValidaCambioEstatus = {
            p1: 3,
            p2: resData.id.toString(),
            p3: null,
            p4: null,
          };
          this.serviceGood.PAValidaCambio(model).subscribe(res => {
            const { P5 } = JSON.parse(JSON.stringify(res));
            console.log(P5);
            //!Forzando debería ser mayor y esta menor
            if (P5 > 0) {
              this.alert(
                'warning',
                'Bienes sin información requerida',
                'Se encontraron Bienes sin información requerida para este proceso'
              );
              localStorage.setItem('numberExpedient', this.numberExpedient);
              this.getNulls();
              this.loading = false;
            } else {
              if (this.scanStatus) {
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
                      if (VAL_MOVIMIENTO == 1) {
                        const splitActa = this.form
                          .get('acta2')
                          .value.split('/');
                        const tipo_acta = ['D', 'ND'].includes(splitActa[0])
                          ? 'DECOMISO'
                          : 'ENTREGA';
                        this.loading = true;
                        const fec_elab = this.form.get('fecElab').value;
                        if (
                          fec_elab != null &&
                          format(fec_elab, 'MM-yyyy') !=
                            format(new Date(), 'MM-yyyy')
                        ) {
                          this.loading = false;
                          this.alert(
                            'warning',
                            'Está fuera de tiempo para cerrar el acta',
                            ''
                          );
                        } else {
                          const splitActa = this.form
                            .get('acta2')
                            .value.split('/');
                          const tipo_acta = ['D', 'ND'].includes(splitActa[0])
                            ? 'DECOMISO'
                            : 'ENTREGA';
                          const model: IPACambioStatus = {
                            P_NOACTA: idProcee,
                            P_PANTALLA: 'FACTREFACTAENTREC',
                            P_FECHA_RE_FIS: this.form.get('fecReception').value,
                            P_TIPO_ACTA: tipo_acta,
                            USUARIO:
                              localStorage.getItem('username') == 'sigebiadmon'
                                ? localStorage.getItem('username')
                                : localStorage
                                    .getItem('username')
                                    .toLocaleUpperCase(),
                          };
                          this.serviceProgrammingGood
                            .paChangeStatus(model)
                            .subscribe(
                              res => {
                                console.log(res);
                                const modelEdit: IProccedingsDeliveryReception =
                                  {
                                    comptrollerWitness:
                                      this.form.get('testigo').value,
                                    observations:
                                      this.form.get('observaciones').value,
                                    witness1: this.form.get('entrega').value,
                                    witness2: this.form.get('recibe2').value,
                                    address: this.form.get('direccion').value,
                                    universalFolio:
                                      this.form.get('folioEscaneo').value,
                                  };
                                this.serviceProcVal
                                  .editProceeding(idProcee, modelEdit)
                                  .subscribe(
                                    res => {
                                      console.log(res);
                                      this.form
                                        .get('statusProceeding')
                                        .setValue('CERRADO');
                                      this.labelActa = 'Abrir acta';
                                      this.btnCSSAct = 'btn-success';
                                      this.idProceeding = idProcee;
                                      this.getGoodsActFn();
                                      this.getGoodsFn(); //*Agregué esto
                                      this.alert(
                                        'success',
                                        'Acta cerrada',
                                        '' //Era repetivo el msj
                                      );
                                      this.loading = false;
                                      this.inputsInProceedingClose();
                                    },
                                    err => {
                                      console.log(err);
                                      this.alert(
                                        'error',
                                        'Ocurrió un error', //Son repetitivos los msj de alerta, solo mostrar uno en general, doble "Ocurrió un error"
                                        'Ocurrió un error inesperado que no permitió cerrar el acta'
                                      );
                                      this.loading = false;
                                    }
                                  );
                              },
                              err => {
                                this.loading = false;
                                this.alert(
                                  'warning',
                                  'Se presentó un error al cerrar el acta',
                                  'Por favor verifique que el cambio se dio'
                                );
                              }
                            );
                        }
                      } else {
                      }
                    },
                    err => {
                      console.log(err);
                      VAL_MOVIMIENTO = 0;
                      this.closeProceedingFn(this.idProceeding);
                      this.loading = false;
                    }
                  );
              } else {
                this.loading = false;
                this.alert('warning', 'El folio no ha sido escaneado', '');
              }
            }
          });
        },
        err => {
          this.loading = false;
          console.log(err);
        }
      );
    }
  }

  closeProceedingFn(idProcee: any) {
    this.alertQuestion(
      'question',
      '¿Seguro que desea realizar el cierre de este acta?',
      ''
    ).then(q => {
      if (q.isConfirmed) {
        const splitActa = this.form.get('acta2').value.split('/');
        const tipo_acta = ['D', 'ND'].includes(splitActa[0])
          ? 'DECOMISO'
          : 'ENTREGA';
        this.loading = true;
        const model: IPACambioStatus = {
          P_NOACTA: idProcee,
          P_PANTALLA: 'FACTREFACTAENTREC',
          P_FECHA_RE_FIS: this.form.get('fecReception').value,
          P_TIPO_ACTA: tipo_acta,
          USUARIO:
            localStorage.getItem('username') == 'sigebiadmon'
              ? localStorage.getItem('username')
              : localStorage.getItem('username').toLocaleUpperCase(),
        };
        this.serviceProgrammingGood.paChangeStatus(model).subscribe(
          res => {
            console.log(res);
            const modelEdit: IProccedingsDeliveryReception = {
              comptrollerWitness: this.form.get('testigo').value,
              observations: this.form.get('observaciones').value,
              witness1: this.form.get('entrega').value,
              witness2: this.form.get('recibe2').value,
              address: this.form.get('direccion').value,
              universalFolio: this.form.get('folioEscaneo').value,
            };
            this.serviceProcVal.editProceeding(idProcee, modelEdit).subscribe(
              res => {
                console.log(res);
                this.form.get('statusProceeding').setValue('CERRADO');
                this.labelActa = 'Abrir acta';
                this.btnCSSAct = 'btn-success';
                this.idProceeding = idProcee;
                this.getGoodsActFn();
                this.getGoodsFn(); //*Agregué esto
                this.alert('success', 'Acta cerrada', 'El acta fue cerrada');
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
          },
          err => {
            this.loading = false;
            this.alert(
              'warning',
              'Se presentó un error al cerrar el acta',
              'Por favor verifique que el cambio se dio'
            );
          }
        );
      }
    });
  }

  closeProceeding() {
    console.log(this.saveDataAct);
    console.log(this.goodData);

    if (this.dataGoodAct['data'].length == 0) {
      this.alert(
        'warning',
        'No se registraron Bienes',
        'El Acta no contiene Bienes, no se podrá Cerrar.'
      );
    } else {
      console.log(this.reopening);
      if (this.reopening) {
        if (
          this.dataGoodAct['data'].find(
            (e: any) => e.indEdoFisico && e.good[`val${e.vNoColumna}`] == null
          )
        ) {
          this.alert(
            'warning',
            'Hay Bienes con estado físico requerido sin establecer',
            ''
          );
        } else if (
          this.dataGoodAct['data'].find((e: any) => e.received != 'S')
        ) {
          this.alert('warning', 'Hay Bienes no marcados como recibido', '');
        } else if (
          this.dataGoodAct['data'].find(
            (e: any) => e.good.storeNumber == null
          ) &&
          this.isAlmacen
        ) {
          this.alert('warning', 'Hay Bienes no guardados en almacén', '');
        } else if (
          this.dataGoodAct['data'].find(
            (e: any) => e.good.vaultNumber == null
          ) &&
          this.isBoveda
        ) {
          this.alert('warning', 'Hay Bienes no guardados en Bóveda', '');
        } else {
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
              const paramsF = new FilterParams();
              paramsF.addFilter(
                'keysProceedings',
                this.form.get('acta2').value
              );
              this.serviceProcVal
                .getByFilter(paramsF.getParams())
                .subscribe(res => {
                  const splitActa = this.form.get('acta2').value.split('/');
                  const tipo_acta = ['D', 'ND'].includes(splitActa[0])
                    ? 'DECOMISO'
                    : 'ENTREGA';
                  const model: IPACambioStatus = {
                    P_NOACTA: idProcee,
                    P_PANTALLA: 'FACTREFACTAENTREC',
                    P_FECHA_RE_FIS: this.form.get('fecReception').value,
                    P_TIPO_ACTA: tipo_acta,
                    USUARIO:
                      localStorage.getItem('username') == 'sigebiadmon'
                        ? localStorage.getItem('username')
                        : localStorage.getItem('username').toLocaleUpperCase(),
                  };

                  const modelEdit: IProccedingsDeliveryReception = {
                    statusProceedings: 'CERRADA',
                    comptrollerWitness: this.form.get('testigo').value,
                    observations: this.form.get('observaciones').value,
                    witness1: this.form.get('entrega').value,
                    witness2: this.form.get('recibe2').value,
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
                        this.idProceeding = idProcee.toString();
                        this.labelActa = 'Abrir acta';
                        this.btnCSSAct = 'btn-success';
                        this.inputsInProceedingClose();
                        this.research = true;
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
              this.alert(
                'error',
                'Ocurrió un error',
                'Ocurrió un error inesperdo que no permitió cerrar el acta'
              );
            }
          );
        }
      } else {
        if (this.form.get('folioEscaneo').value != null) {
          this.serviceDocuments
            .getByFolio(this.form.get('folioEscaneo').value)
            .subscribe(
              res => {
                const data = JSON.parse(JSON.stringify(res));
                const scanStatus = data.data[0]['scanStatus'];

                if (scanStatus === 'ESCANEADO') {
                  const paramsF = new FilterParams();
                  if (
                    this.dataGoodAct['data'].find(
                      (e: any) =>
                        e.indEdoFisico && e.good[`val${e.vNoColumna}`] == null
                    )
                  ) {
                    this.alert(
                      'warning',
                      'Hay Bienes con estado físico requerido sin establecer',
                      ''
                    );
                  } else if (
                    this.dataGoodAct['data'].find((e: any) => e.received != 'S')
                  ) {
                    this.alert(
                      'warning',
                      'Hay Bienes no marcados como recibido',
                      ''
                    );
                  } else if (
                    this.dataGoodAct['data'].find(
                      (e: any) => e.good.storeNumber == null
                    )
                  ) {
                    this.alert(
                      'warning',
                      'Hay Bienes no guardados en almacén',
                      ''
                    );
                  } else if (
                    this.dataGoodAct['data'].find(
                      (e: any) => e.good.vaultNumber == null
                    ) &&
                    this.isBoveda
                  ) {
                    this.alert(
                      'warning',
                      'Hay Bienes no guardados en Bóveda',
                      ''
                    );
                  } else {
                    paramsF.addFilter(
                      'keysProceedings',
                      this.form.get('acta2').value
                    );
                    this.serviceProcVal
                      .getByFilter(paramsF.getParams())
                      .subscribe(
                        res => {
                          console.log(res);
                          const resData = JSON.parse(
                            JSON.stringify(res.data[0])
                          );
                          console.log(resData.id);
                          const noActa = resData.id;
                          const model: IValidaCambioEstatus = {
                            p1: 3,
                            p2: resData.id.toString(),
                            p3: null,
                            p4: null,
                          };
                          this.serviceGood
                            .PAValidaCambio(model)
                            .subscribe(res => {
                              const { P5 } = JSON.parse(JSON.stringify(res));
                              console.log(P5);
                              //!Forzando debería ser mayor y esta menor
                              if (P5 > 0) {
                                this.alert(
                                  'warning',
                                  'Bienes sin informacion requerida',
                                  'Se encontraron Bienes sin información requerida para este proceso'
                                );
                              } else {
                                const modelEdit: IProccedingsDeliveryReception =
                                  {
                                    statusProceedings: 'CERRADA',
                                    universalFolio:
                                      this.form.get('folioEscaneo').value,
                                  };
                                const splitActa = this.form
                                  .get('acta2')
                                  .value.split('/');
                                const tipo_acta = ['D', 'ND'].includes(
                                  splitActa[0]
                                )
                                  ? 'DECOMISO'
                                  : 'ENTREGA';
                                const model: IPACambioStatus = {
                                  P_NOACTA: noActa,
                                  P_PANTALLA: 'FACTREFACTAENTREC',
                                  P_FECHA_RE_FIS:
                                    this.form.get('fecReception').value,
                                  P_TIPO_ACTA: tipo_acta,
                                  USUARIO:
                                    localStorage.getItem('username') ==
                                    'sigebiadmon'
                                      ? localStorage.getItem('username')
                                      : localStorage
                                          .getItem('username')
                                          .toLocaleUpperCase(),
                                };
                                console.log(model);
                                const found = this.dataGoodAct['data'].find(
                                  (e: any) => {
                                    return e.storeNumber === null;
                                  }
                                );
                                console.log(found);
                                if (found === undefined) {
                                  this.serviceProgrammingGood
                                    .paChangeStatus(model)
                                    .subscribe(
                                      res => {
                                        console.log(res);
                                        console.log(modelEdit);
                                        this.serviceProcVal
                                          .editProceeding(resData.id, modelEdit)
                                          .subscribe(
                                            res => {
                                              console.log(res);
                                              this.form
                                                .get('statusProceeding')
                                                .setValue('CERRADO');
                                              this.labelActa = 'Abrir acta';
                                              this.btnCSSAct = 'btn-success';
                                              const btn =
                                                document.getElementById(
                                                  'expedient-number'
                                                );
                                              this.render.removeClass(
                                                btn,
                                                'disabled'
                                              );
                                              this.render.addClass(
                                                btn,
                                                'enabled'
                                              );
                                              this.research = true;
                                              this.getGoodsActFn();

                                              this.alert(
                                                'success',
                                                'El acta ha sido cerrada',
                                                ''
                                              );
                                            },
                                            err => {
                                              console.log(err);
                                              this.alert(
                                                'error',
                                                'Ocurrió un error inesperado',
                                                'No se pudo cerrar el acta, ocurrió un error inesperado'
                                              );
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
                                    'Debe guardar los Bienes en un almacen',
                                    ''
                                  );
                                }
                              }
                            });
                        },
                        err => {
                          console.log(err);
                        }
                      );
                  }
                } else {
                  this.alert(
                    'warning',
                    'FALTA ESCANEAR FOLIO',
                    'El número de folio debe ser escaneado para poder cerrar el acta.'
                  );
                  const btn = document.getElementById('expedient-number');
                  this.render.removeClass(btn, 'disabled');
                  this.render.addClass(btn, 'enabled');
                  this.blockExpedient = false;
                }
                console.log(this.scanStatus);
              },
              err => {
                this.alert(
                  'warning',
                  'FALTA ESCANEAR FOLIO',
                  'El número de folio debe ser escaneado para poder cerrar el acta.'
                );
                const btn = document.getElementById('expedient-number');
                this.render.removeClass(btn, 'disabled');
                this.render.addClass(btn, 'enabled');
              }
            );
        } else {
          this.alert('warning', 'Debe registrar un número de folio', '');
        }
      }
    }
  }

  deleteProceeding() {
    if (!this.act2Valid) {
      this.alert('warning', 'No se registro un número de acta válido', '');
    } else {
      const user =
        localStorage.getItem('username') == 'sigebiadmon'
          ? localStorage.getItem('username')
          : localStorage.getItem('username').toLocaleUpperCase();
      if (this.form.get('statusProceeding').value != '') {
        if (
          !['MARRIETA', 'SERA', 'DESARROLLO', 'ALEDESMA', 'JRAMIREZ'].includes(
            user
          )
        ) {
          if (
            ['CERRADO', 'CERRADA'].includes(
              this.form.get('statusProceeding').value
            )
          ) {
            console.log(1);
            this.alert('warning', 'No puede eliminar un acta cerrada', '');
          } else if (
            this.form.get('fecElab').value != null &&
            format(this.form.get('fecElab').value, 'MM-yyyy') !=
              format(new Date(), 'MM-yyyy')
          ) {
            console.log(2);

            this.alert(
              'warning',
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
              '¿Desea eliminar el acta?',
              `Se eliminará el acta ${this.form.get('acta2').value}`,
              'Eliminar'
            ).then(q => {
              if (q.isConfirmed) {
                const keysProceedings = this.form.get('acta2').value;
                const paramsF = new FilterParams();
                paramsF.addFilter('keysProceedings', keysProceedings);
                this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
                  res => {
                    const realData = JSON.parse(JSON.stringify(res.data[0]));
                    this.serviceDetailProc
                      .PADelActaEntrega(realData.id)
                      .subscribe(async res => {
                        this.clearInputs();
                        this.alert(
                          'success',
                          'El acta fue eliminada',
                          'Se recargará la página'
                        );
                        this.loading = true;
                        this.newSearchExp();
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
        } else {
          this.alert(
            'warning',
            'El usuario no tiene permiso para eliminar acta',
            ''
          );
        }
      } else {
        this.alert('warning', 'No puede eliminar un acta no guardada', '');
      }
    }
  }

  newProceeding() {
    this.numberProceeding = this.proceedingData.length;
    this.clearInputs();
    this.form.get('ident').setValue('ADM');
    this.minDateFecElab = new Date();
    this.form.get('statusProceeding').reset();
    this.totalItemsDataGoodsAct = 0;
    this.labelActa = 'Cerrar acta';
    this.btnCSSAct = 'btn-primary';
    this.act2Valid = false;
    this.navigateProceedings = true;
    this.nextProce = false;
    this.initialdisabled = false;
    this.newAct = false;
    this.requireAct1();
    this.prevProce = true;
    this.goodData = [];
    this.saveDataAct = [];
    this.dataGoodAct.load(this.goodData);
    this.inputsNewProceeding();
  }

  //"Acta 2"

  fillActTwo() {
    this.act2Valid = false;
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
        ? this.form.get('transfer').value.clave_transferente
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
      console.log('Está activando aquí');
      countAct = 0;
      this.searchKeyProceeding();
    } else {
      this.act2Valid = false;
    }
  }

  searchKeyProceeding() {
    /*     const acta2Input = this.form.get('folio');
    console.log({acta: this.act2Valid});
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
          this.form.get('folio').reset();
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
    } */
  }
  //Select data
  statusGood(formName: string, data: any) {
    const paramsF = new FilterParams();
    paramsF.addFilter('status', data.status || data.good.status);
    this.serviceGood.getStatusGood(paramsF.getParams()).subscribe(
      res => {
        this.form.get(formName).setValue(res.data[0]['description']);
      },
      err => {
        this.form.get(formName).setValue(`${data.status} FUERA DEL MES`);
      }
    );
  }

  async selectEdoFisRow(data: any, formName: string) {
    const edoFis: any = await this.getIndEdoFisAndVColumna(data.good);
    console.log(edoFis);
    if (edoFis.V_NO_COLUMNA === 0) {
      console.log(edoFis.V_NO_COLUMNA);
      this.form.get(formName).setValue('OTRO');
      await this.validatePreInsert(data);
    } else {
      console.log(edoFis.V_NO_COLUMNA);
      this.form.get(formName).setValue(data.good[`val${edoFis.V_NO_COLUMNA}`]);
      await this.validatePreInsert(data);
    }
  }

  selectRow(e: any) {
    const { data } = e;
    console.log(data);
    this.selectData = data;
    this.statusGood('estatusPrueba', data);
    this.validateGood(data);
    console.log(e);
    this.idGood = data.goodId;

    this.lastClick += 1;
    setTimeout(() => {
      if (this.lastClick > 1) {
        this.openOptionsHistory(data);
      } else {
        if (this.lastClick > 0) {
          console.log('single clik');
        }
      }
      this.lastClick = 0;
    }, 500);
  }

  deselectRow() {
    this.selectData = null;
    this.form.get('estatusPrueba').reset();
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

  selectRowBovedaAlmacen(data: any) {
    const paramsF = new FilterParams();
    paramsF.addFilter('idWarehouse', data.good.storeNumber);
    this.serviceWarehouse.getWarehouseFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.form.get('almacen').setValue(res.data[0]);
      },
      err => {
        console.log(err);
      }
    );
    this.serviceVault
      .getAllFilter(`filter.idSafe=$eq:${data.good.vaultNumber}`)
      .subscribe(
        res => {
          this.form.get('boveda').setValue(res.data[0]);
        },
        err => {
          console.log(err);
        }
      );
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
        edo.setValue('OTRO');
        break;
    }
  }

  selectRowGoodActa(e: any) {
    console.log('Se activo');
    const { data } = e;
    console.log(this.saveDataAct);
    this.idGoodAct = data.good.goodId;

    if (data != null) {
      const isSelect = e.isSelected;
      console.log(e);
      console.log(isSelect);
      console.log(this.saveDataAct);
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

      this.selectEdoFisRow(data, 'edoFisico');
      this.statusGood('estatusBienActa', data);

      this.form.get('indEdoFisico').setValue(data.indEdoFisico);
      this.selectRowBovedaAlmacen(data);
    }
  }

  deselectRowGoodActa() {
    this.selectActData = null;

    console.log(this.selectActData);
    this.isSelectGood = false;
    this.form.get('edoFisico').setValue(null);
    this.form.get('estatusBienActa').setValue(null);
  }

  async applyEdoFisOne(e: any) {
    console.log(this.selectActData);
    console.log(e);
    const edoFis: any = await this.getIndEdoFisAndVColumna(
      this.selectActData.good
    );
    console.log(edoFis);
    const generalModel: Map<string, any> = new Map();
    generalModel.set('id', parseInt(this.selectActData.good.id.toString()));
    generalModel.set(
      'goodId',
      parseInt(this.selectActData.good.goodId.toString())
    );
    generalModel.set(`val${edoFis.V_NO_COLUMNA}`, e);
    const jsonModel = JSON.parse(
      JSON.stringify(Object.fromEntries(generalModel))
    );
    this.serviceGood.updateWithoutId(jsonModel).subscribe(
      res => {
        this.getGoodsActFn();
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

  //Add good to Act

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
    console.log(this.selectData);

    if (this.selectData && this.selectData != null) {
      const goodClass = this.selectData.goodClassNumber;
      const available = this.selectData.avalaible;
      //Valida si es disponible
      if (!available) {
        this.alert(
          'warning',
          'Estatus no disponible',
          'El Bien tiene un estatus inválido para ser asignado a alguna acta'
        );
      } else if (!this.act2Valid) {
        //Valida si hay clave de acta y es válida
        this.alert(
          'warning',
          'Error en el número de acta',
          'Debe registrar un Acta antes de poder mover el Bien'
        );
      }
      //Valida si el acta es diferente de RT
      else if (valAct != 'RT') {
        if ([1424, 1426, 1590].includes(goodClass) && valAct[0] != 'N') {
          this.alert(
            'warning',
            'Problema con el tipo de acta',
            'Para este Bien la Clave de Acta debe iniciar con " N "'
          );
        } else if ([1424, 1426, 1590].includes(goodClass) && admin != 'CCB') {
          this.alert(
            'warning',
            'Problema con quien administra en la clave',
            'En la parte de Quien Administra en la clave de acta debe ser para este Bien " CCB "'
          );
        } else if (
          goodClass != 1424 &&
          goodClass != 1590 &&
          goodClass != 1426 &&
          valAct[0] === 'N'
        ) {
          this.alert(
            'warning',
            'Problema con el tipo de acta',
            'Las actas con esta nomenclatura solo deben contener Bienes de numerario efectivo'
          );
        } else {
          const newParams = `filter.numClasifGoods=$eq:${goodClass}`;
          this.serviceSssubtypeGood.getFilter(newParams).subscribe(
            res => {
              console.log(res);
              const type = JSON.parse(JSON.stringify(res.data[0]['numType']));
              const subtype = JSON.parse(
                JSON.stringify(res.data[0]['numSubType'])
              );

              no_type = parseInt(type.id);
              no_subtype = parseInt(subtype.id);
              //Validar Admin y tipo
              if (admin === 'DEABI' && no_type != 6) {
                this.alert(
                  'warning',
                  'Error en el tipo de Bien',
                  'Bien con tipo inválido para el acta (INMUEBLE)'
                );
              } else if (
                ['CERRADO', 'CERRADA'].includes(
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
                  'warning',
                  'Error en la fecha de elaboración',
                  'No puede realizar modificaciones a esta acta, por estar fuera del mes'
                );
              } else if (this.form.get('fecElab').value === null) {
                this.alert(
                  'warning',
                  'Falta fecha de elaboración',
                  'Necesita registrar el dato de fecha de elaboración para agregar un Bien al acta'
                );
              } else if (
                this.form.get('fecElab').value != null &&
                format(this.form.get('fecElab').value, 'dd-MM-yyyy') <
                  format(new Date(), 'dd-MM-yyyy')
              ) {
                this.alert(
                  'warning',
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

                if (no_type === 7 || (no_type === 5 && no_subtype === 16)) {
                  this.isBoveda = true;
                }
                if (no_type === 5) {
                  this.isAlmacen = true;
                }
                console.log(v_tipo_acta);
                //NECESARIO ENDPOINT QUE VALIDE EL QUERY
                v_ban = true;
                const model: IVban = {
                  array: [
                    {
                      screenKey: 'FACTREFACTAENTREC',
                      goodNumber: this.selectData.id,
                      identificador: this.selectData.identifier,
                      typeAct: v_tipo_acta,
                    },
                  ],
                };
                console.log(model);
                this.serviceGood.getVBan(model).subscribe(
                  res => {
                    console.log(res);
                    v_ban = res.data[0]['ban'];
                    console.log(v_ban);
                    v_ban = false; //!Forzando el false
                    if (v_ban) {
                      this.alert(
                        'warning',
                        'Bien no valido',
                        'El Bien no es válido para esta acta'
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
                              this.idProceeding = data.id;
                              let newDetailProceeding: IDetailProceedingsDeliveryReception =
                                {
                                  numberProceedings: data.id,
                                  numberGood: this.selectData.goodId,
                                  amount: this.selectData.quantity,
                                  exchangeValue: 1,
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
                                    this.getGoodsActFn();
                                    /* this.dataGoodAct.load(this.goodData); */
                                    this.saveDataAct.push({
                                      ...this.selectData,
                                    });
                                    this.selectData = null;
                                    this.alert(
                                      'success',
                                      'El Bien fue agregado',
                                      ''
                                    );
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
                              this.alert(
                                'warning',
                                'Debe registrar un Acta antes de poder mover el Bien',
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
            err => {
              console.log(err);
            }
          );
        }
      } else {
        //Tipo y subtipo de bien
        const newParams = `filter.numClasifGoods=$eq:${goodClass}`;
        this.serviceSssubtypeGood.getFilter(newParams).subscribe(
          res => {
            console.log(res);
            const type = JSON.parse(JSON.stringify(res.data[0]['numType']));
            const subtype = JSON.parse(
              JSON.stringify(res.data[0]['numSubType'])
            );

            no_type = parseInt(type.id);
            no_subtype = parseInt(subtype.id);
            //Validar Admin y tipo
            if (admin === 'DEABI' && no_type != 6) {
              this.alert(
                'warning',
                'Error en el tipo de Bien',
                'Bien con tipo inválido para el acta (INMUEBLE)'
              );
            } else if (
              ['CERRADO', 'CERRADA'].includes(
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
                'warning',
                'Error en la fecha de elaboración',
                'No puede realizar modificaciones a esta acta, por estar fuera del mes'
              );
            } else if (this.form.get('fecElab').value === null) {
              this.alert(
                'warning',
                'Falta fecha de elaboración',
                'Necesita registrar el dato de fecha de elaboración para agregar un Bien al acta'
              );
            } else if (
              this.form.get('fecElab').value != null &&
              format(this.form.get('fecElab').value, 'dd-MM-yyyy') <
                format(new Date(), 'dd-MM-yyyy')
            ) {
              this.alert(
                'warning',
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

              if (no_type === 7 || (no_type === 5 && no_subtype === 16)) {
                this.isBoveda = true;
              }
              if (no_type === 5) {
                this.isAlmacen = true;
              }
              console.log(v_tipo_acta);
              //NECESARIO ENDPOINT QUE VALIDE EL QUERY
              v_ban = true;
              const model: IVban = {
                array: [
                  {
                    screenKey: 'FACTREFACTAENTREC',
                    goodNumber: this.selectData.id,
                    identificador: this.selectData.identifier,
                    typeAct: v_tipo_acta,
                  },
                ],
              };
              console.log(model);
              this.serviceGood.getVBan(model).subscribe(
                res => {
                  console.log(res);
                  v_ban = res.data[0]['ban'];
                  console.log(v_ban);
                  v_ban = false; //!Forzando el false
                  if (v_ban) {
                    this.alert(
                      'warning',
                      'Bien no valido',
                      'El Bien no es válido para esta acta'
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
                            this.idProceeding = data.id;
                            let newDetailProceeding: IDetailProceedingsDeliveryReception =
                              {
                                numberProceedings: data.id,
                                numberGood: this.selectData.goodId,
                                amount: this.selectData.quantity,
                                exchangeValue: 1,
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
                                  this.getGoodsActFn();
                                  /* this.dataGoodAct.load(this.goodData); */
                                  this.saveDataAct.push({
                                    ...this.selectData,
                                  });
                                  this.selectData = null;
                                  this.alert(
                                    'success',
                                    'El Bien fue agregado',
                                    ''
                                  );
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
                            this.alert(
                              'warning',
                              'Debe registrar un Acta antes de poder mover el Bien',
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
          err => {
            console.log(err);
          }
        );
      }
    } else {
      this.alert(
        'warning',
        'No selecciono Bien',
        'Debe seleccionar un Bien para agregar al acta'
      );
    }
  }

  deleteGood() {
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
      if (this.selectActData == null) {
        this.alert(
          'warning',
          'No selecciono Bien del acta',
          'Debe seleccionar un Bien que forme parte del acta primero'
        );
      } else if (!this.act2Valid) {
        this.alert(
          'warning',
          'Problemas con el número de acta',
          'Debe especificar/buscar el acta para después eliminar el Bien de esta'
        );
      } else {
        //REGISTRAR EN HISTORICO ANTES DE BORRAR
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
                this.getGoodsActFn();

                this.dataGoods.load(
                  this.dataGoods['data'].map((e: any) => {
                    console.log(e);
                    console.log(this.selectActData.good.id);
                    if (e.id == this.selectActData.good.id) {
                      return { ...e, avalaible: true };
                    } else {
                      return e;
                    }
                  })
                );
              },
              err => {
                console.log(err);
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
              (e: any) => e.id != this.selectActData.id
            );
            this.goodData = this.goodData.filter(
              (e: any) => e.id != this.selectActData.good.id
            );
            this.dataGoodAct.load(this.goodData);
            this.getGoodsFn();
          }
        );
      }
    }
  }

  //Aplicar Bodega y Bodega
  applyWarehouseSafe() {
    console.log('Prueba');
    if (this.form.get('statusProceeding').value === 'ABIERTA') {
      console.log(this.form.get('almacen').value);
      if (this.isAlmacen) {
        if (this.form.get('almacen').value != null) {
          for (let i = 0; i < this.dataGoodAct['data'].length; i++) {
            const element = this.dataGoodAct['data'][i];
            const newParams = `filter.numClasifGoods=$eq:${element.good.goodClassNumber}`;
            this.serviceSssubtypeGood.getFilter(newParams).subscribe(
              res => {
                console.log(res);
                const type = JSON.parse(JSON.stringify(res.data[0]['numType']));
                const subtype = JSON.parse(
                  JSON.stringify(res.data[0]['numSubType'])
                );
                const ssubtype = JSON.parse(
                  JSON.stringify(res.data[0]['numSsubType'])
                );
                const no_type = type.id;
                console.log(element);
                console.log(no_type);
                if (no_type === '5') {
                  //Data new good
                  const putGood: IGood = {
                    id: element.good.id,
                    goodId: element.good.goodId,
                    storeNumber: this.form.get('almacen').value.idWarehouse,
                  };
                  console.log(putGood);
                  console.log('Sí?');
                  this.serviceGood.update(putGood).subscribe(
                    res => {
                      console.log(res);
                      this.getGoodsActFn();
                    },
                    err => {
                      console.log(err);
                    }
                  );
                } else {
                  console.log({ message: 'No :(', type: no_type });
                }
              },
              err => {
                console.log(err);
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
      }

      if (this.isBoveda) {
        if (this.form.get('boveda').value != null) {
          for (let i = 0; i < this.dataGoodAct['data'].length; i++) {
            const element = this.dataGoodAct['data'][i];
            let v_pasa: boolean = false;
            const newParams = `filter.numType=$eq:7&filter.numSubType=$eq:34&filter.numClasifGoods=$eq:${element.good.goodClassNumber}`;
            this.serviceSssubtypeGood.getFilter(newParams).subscribe(res => {
              console.log(res);
              if (res.data.length != 0) {
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
                  id: element.good.id,
                  goodId: element.good.id,
                  vaultNumber: this.form.get('boveda').value.idSafe,
                };

                console.log(res.data.length);
                if (res.data.length != 0) {
                  v_pasa = true;
                }
                if (no_type === 7 || (no_type === 5 && no_subtype === 16)) {
                  if (no_type === 7 && v_pasa) {
                    if (element.good.vaultNumber === null) {
                      putGood.vaultNumber = 9999;
                    }
                  } else {
                    putGood.vaultNumber = this.form.get('boveda').value.idSafe;
                  }
                  this.serviceGood.update(putGood).subscribe(res => {
                    this.getGoodsActFn();
                  });
                }
              } else {
                let putGood: IGood = {
                  id: element.good.id,
                  goodId: element.good.id,
                  vaultNumber: this.form.get('boveda').value.idSafe,
                };
                this.serviceGood.update(putGood).subscribe(res => {
                  this.getGoodsActFn();
                });
              }
            });
          }
          this.alert('success', 'Se registró los Bienes en la Bóveda', '');
        } else {
          this.alert(
            'warning',
            'No se seleccionó Boveda',
            'Debe seleccionar una Bóveda válida'
          );
        }
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
          console.log(data);
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
                console.log(err);
                V_NO_COLUMNA = 0;
                resolve({ V_NO_COLUMNA, V_IND_EDO_FISICO });
              }
            );
          resolve({ V_NO_COLUMNA, V_IND_EDO_FISICO });
        }
      );
    });
  }

  openOptionsHistory(e: any) {
    console.log(e);
    let modalConfig = MODAL_CONFIG;
    modalConfig = {
      initialState: {
        idGood: e.goodId,
        numberExpedient: this.numberExpedient,
      },
      class: 'modal-lg modal-dialog-centered',
    };
    this.modalService.show(OptionsHistoryGoodDelegation, modalConfig);
  }

  openEdoFisico() {
    if (
      ['CERRADO', 'CERRADA'].includes(this.form.get('statusProceeding').value)
    ) {
      this.alert('warning', 'El acta está cerrada', '');
    } else {
      console.log(this.dataGoodAct['data']);
      if (this.dataGoodAct['data'].length === 0) {
        this.alert(
          'warning',
          'No hay Bienes en el acta',
          'No tiene Bienes para poder modificar el estado físico'
        );
      } else {
        console.log(this.dataGoodAct['data']);
        console.log(this.dataGoodAct['data'].filter(item => item.indEdoFisico));
        let modalConfig = MODAL_CONFIG;
        modalConfig = {
          initialState: {
            idProceeding: this.idProceeding,
          },
          class: 'modal-lg modal-dialog-centered',
        };
        this.modalService.show(EdoFisicoComponent, modalConfig);
      }
    }
  }
}
