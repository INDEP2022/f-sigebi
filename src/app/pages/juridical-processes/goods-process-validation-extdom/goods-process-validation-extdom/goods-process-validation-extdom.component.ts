/** BASE IMPORT */
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  NUM_POSITIVE,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GoodsProcessValidationExtdomService } from '../services/goods-process-validation-extdom.service';
import { COLUMNS_GOODS_LIST_EXTDOM } from './process-extdoom-columns';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-goods-process-validation-extdom',
  templateUrl: './goods-process-validation-extdom.component.html',
  styleUrls: ['./goods-process-validation-extdom.component.scss'],
})
export class GoodsProcessValidationExtdomComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  // TABLA DATA
  tableSettings = {
    ...this.settings,
  };
  dataTable: LocalDataSource = new LocalDataSource();
  dataTableParams = new BehaviorSubject<ListParams>(new ListParams());
  loadingGoods: boolean = false;
  totalGoods: number = 0;
  goodData: IGood;
  tableSettings2 = {
    ...this.settings,
  };
  dataTable2: LocalDataSource = new LocalDataSource();
  dataTableParams2 = new BehaviorSubject<ListParams>(new ListParams());
  loadingGoods2: boolean = false;
  totalGoods2: number = 0;
  goodData2: IGood;

  tableSettingsHistorico = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: { title: 'No. Bien' }, //*
      fechaCambio: { title: 'Fecha Cambio' },
      usuarioCambio: { title: 'Usuario Cambio' },
      folioUnivCambio: { title: 'Folio Univ Cambio' },
      fechaLibera: { title: 'Fecha Libera' },
      usuarioLibera: { title: 'Usuario Libera' },
      folioUnivLibera: { title: 'Folio Univ Libera' },
    },
  };
  // Data table
  dataTableHistorico = [
    {
      noBien: 'No. Bien',
      fechaCambio: 'Fecha Cambio',
      usuarioCambio: 'Usuario Cambio',
      folioUnivCambio: 'Folio Univ Cambio',
      fechaLibera: 'Fecha Libera',
      usuarioLibera: 'Usuario Libera',
      folioUnivLibera: 'Folio Univ Libera',
    },
  ];
  public listadoHistorico: boolean = false;
  // Data
  notificationData: INotification;
  // Forms
  public form: FormGroup;
  public formEscaneo: FormGroup;
  // Params
  origin: string = '';
  P_NO_TRAMITE: number = null;
  P_GEST_OK: number = null;
  // SELECTS
  selectAffairkey = new DefaultSelect();
  selectIndiciadoNumber = new DefaultSelect();
  selectMinpubNumber = new DefaultSelect();
  selectCourtNumber = new DefaultSelect();
  selectDelegationNumber = new DefaultSelect();
  selectEntFedKey = new DefaultSelect();
  selectCityNumber = new DefaultSelect();
  selectTransference = new DefaultSelect();
  selectStationNumber = new DefaultSelect();
  selectAuthority = new DefaultSelect();
  // Goods Selects
  selectedGooods: IGood[] = [];
  goods: IGood[] | any[] = [];
  goodsValid: any[] = [];

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private svGoodsProcessValidationExtdomService: GoodsProcessValidationExtdomService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.tableSettings = {
      ...this.settings,
      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
      },
      columns: COLUMNS_GOODS_LIST_EXTDOM,
    };
    this.tableSettings2 = {
      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
      },
      ...this.settings,
      columns: COLUMNS_GOODS_LIST_EXTDOM,
    };
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        this.origin = params['origin'] ?? null;
        this.P_NO_TRAMITE = params['P_NO_TRAMITE'] ?? null;
        this.P_GEST_OK = params['P_GEST_OK'] ?? null;
      });
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      expedientNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.pattern(NUM_POSITIVE),
        ],
      ], //* EXPEDIENTE
      wheelNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.pattern(NUM_POSITIVE),
        ],
      ], //* VOLANTE
      receiptDate: [null, [Validators.required, Validators.maxLength(11)]], //* FECHA DE RECEPCION
      expedientTransferenceNumber: [
        '',
        [(Validators.maxLength(400), Validators.pattern(STRING_PATTERN))],
      ], //* NO EXPEDIENTES TRANSFERENTES
      officeExternalKey: [
        '',
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.maxLength(35)],
      ], //* CLAVE OFICIO EXTERNO
      externalOfficeDate: [null, [Validators.maxLength(11)]], //* FECHA OFICIO EXTERNO
      externalRemitter: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ], //* REMITENTE EXTERNO
      protectionKey: [
        '',
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.maxLength(100)],
      ], //* CVE AMPARO
      touchPenaltyKey: [
        '',
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.maxLength(30)],
      ], //* CVE TOCA PENAL
      circumstantialRecord: [
        '',
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.maxLength(30)],
      ], //* ACTA CIRCUNSTANCIADA
      preliminaryInquiry: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(200)],
      ], //* AVERIGUACION PREVIA
      criminalCase: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ], //* CAUSA PENAL
      affairKey: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ], // extenso ASUNTO SELECT
      indiciadoNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ], // extenso INDICIADO
      minpubNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ], // extenso MINISTERIO PUBLICO
      courtNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ], // extenso JUZGADO
      delegationNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ], // extenso DELEGACION
      entFedKey: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ], // extenso ENTIDAD FEDERATIVA
      cityNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ], // extenso CIUDAD
      transference: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ], // extenso TRANSFERENTE
      stationNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ], // extenso EMISORA
      authority: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ], // extenso AUROTIDAD
    });
    this.formEscaneo = this.fb.group({
      folioEscaneo: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
    });
  }

  initForm() {
    if (this.P_GEST_OK == 1) {
      // GESTION TRAMITE UPDATE
      // CONDICION DE VOLANTE O EXPEDIENTE
    }
  }

  cleanDataform() {
    this.form.reset();
    this.formEscaneo.reset();
    this.notificationData = null;
  }

  searchNotification() {}

  getNotificationData() {
    this.loading = true;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('fileNumber', this.form.get('expedientNumber').value);
    params.addFilter('wheelNumber', this.form.get('wheelNumber').value);
    this.svGoodsProcessValidationExtdomService
      .getNotificationByFilters(params.getParams())
      .subscribe({
        next: data => {
          console.log('NOTIFICACION DATA ', data);
          this.notificationData = data.data[0];
          this.loading = false;
          this.setDataNotification();
          this.dataTableParams
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.loadGoods());
          this.dataTableParams2
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.loadGoods2());
        },
        error: error => {
          console.log(error);
          this.loading = false;
        },
      });
  }

  setDataNotification() {
    let data: INotification = {
      ...this.notificationData,
      receiptDate: new Date(this.notificationData.receiptDate),
      externalOfficeDate: new Date(this.notificationData.externalOfficeDate),
    };
    this.form.patchValue(data);
    console.log(this.form.value);
    setTimeout(() => {
      if (data.affairKey) {
        this.getAffair(new ListParams(), true);
      }
      if (data.indiciadoNumber) {
        this.getIndiciadoNumber(new ListParams(), true);
      }
      if (data.minpubNumber) {
        this.getMinpubNumber(new ListParams(), true);
      }
      if (data.courtNumber) {
        this.getCourtNumber(new ListParams(), true);
      }
      if (data.delegationNumber) {
        this.getDelegationNumber(new ListParams(), true);
      }
      if (data.entFedKey) {
        this.getEntFedKey(new ListParams(), true);
      }
      if (data.cityNumber) {
        this.getCityNumber(new ListParams(), true);
      }
      if (data.transference) {
        this.getTransference(new ListParams(), true);
      }
      if (data.stationNumber) {
        this.getStationNumber(new ListParams(), true);
      }
      if (data.authority) {
        this.getAuthority(new ListParams(), true);
      }
    }, 200);
  }

  loadGoods() {
    this.loadingGoods = true;
    this.totalGoods = 0;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('fileNumber', this.notificationData.expedientNumber);
    params.addFilter('extDomProcess', 'ASEG_EXTDOM', SearchFilter.NOT);
    params.limit = this.dataTableParams.value.limit;
    params.page = this.dataTableParams.value.page;
    this.svGoodsProcessValidationExtdomService
      .getGoods(params.getParams())
      .subscribe({
        next: res => {
          this.loadingGoods = false;
          console.log('GOODS', res);
          this.totalGoods = res.count;
          this.dataTable.load(res.data);
          this.dataTable.refresh();
        },
        error: error => {
          this.loadingGoods = false;
          console.log(error);
          this.dataTable.load([]);
          this.dataTable.refresh();
        },
      });
  }

  loadGoods2() {
    this.loadingGoods2 = true;
    this.totalGoods2 = 0;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter(
      'proceedingsNumber',
      this.notificationData.expedientNumber
    );
    params.addFilter('userfree', SearchFilter.NULL);
    params.addFilter('datefree', SearchFilter.NULL);
    params.limit = this.dataTableParams2.value.limit;
    params.page = this.dataTableParams2.value.page;
    this.svGoodsProcessValidationExtdomService
      .getHistoryGood(params.getParams())
      .subscribe({
        next: res => {
          this.loadingGoods2 = false;
          console.log('GOODS 2', res);
          this.totalGoods2 = res.count;
          this.dataTable2.load(res.data);
          this.dataTable2.refresh();
        },
        error: error => {
          this.loadingGoods2 = false;
          console.log(error);
          this.dataTable2.load([]);
          this.dataTable2.refresh();
        },
      });
  }

  btnAgregar() {
    console.log('Agregar');
  }

  btnEliminar() {
    console.log('Eliminar');
  }
  btnEjecutarCambios() {
    console.log('EjecutarCambios');
  }

  btnConsultarHistorico() {
    console.log('ConsultarHistorico');
    this.listadoHistorico = true;
  }

  btnSalir() {
    console.log('Salir');
    this.listadoHistorico = false;
  }

  addSelectedGoods() {
    console.log('this.selectedGooods', this.selectedGooods);
    if (this.selectedGooods.length > 0) {
      this.selectedGooods.forEach((good: any) => {
        if (!this.goodsValid.some(v => v === good)) {
          let indexGood = this.goods.findIndex(_good => _good.id == good.id);
          console.log('aaa', this.goods);
          console.log('indexGood', indexGood);
          if (indexGood != -1) {
            // if (this.goods[indexGood].goodDictaminado == true) {
            //   this.onLoadToast(
            //     'warning',
            //     `El bien ${this.goods[indexGood].id} ya se encuentra dictaminado`,
            //     ''
            //   );
            //   return;
            // } else if (
            //   this.goods[indexGood].est_disponible == 'N' ||
            //   this.goods[indexGood].di_disponible == 'N'
            // ) {
            //   return;
            // } else if (
            //   this.goods[indexGood].di_es_numerario == 'S' &&
            //   this.goods[indexGood].di_esta_conciliado == 'N' &&
            //   typeDict
            // ) {
            //   this.onLoadToast(
            //     'warning',
            //     'El numerario no está conciliado',
            //     ''
            //   );
            //   return;
            // }

            // IF: bienes.DI_ES_NUMERARIO = 'S' AND: bienes.DI_ESTA_CONCILIADO = 'N' AND: VARIABLES.TIPO_DICTA = 'PROCEDENCIA' THEN
            // LIP_MENSAJE('El numerario no está conciliado', 'S');
            this.goods[indexGood].est_disponible = 'N';
            this.goods[indexGood].di_disponible = 'N';
          }

          this.goodsValid.push(good);
          this.goodsValid = [...this.goodsValid];
          // this.totalItems3 = this.goodsValid.length;
        } else {
          if (good.di_disponible == 'N') {
            this.alert('warning', `El bien ${good.goodId} ya existe`, '');
          }
        }
      });
    }
  }

  /**
   * SELECTS PANTALLA
   */

  getAffair(paramsData: ListParams, getByValue: boolean = false) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('id', this.form.get('affairKey').value);
    } else {
      params['description'] = paramsData['search'];
    }
    params['sortBy'] = 'description:ASC';
    this.svGoodsProcessValidationExtdomService
      .getAffair(params.getParams())
      .subscribe({
        next: data => {
          this.selectAffairkey = new DefaultSelect(
            data.data.map((i: any) => {
              i['dataDesc'] = i.id + ' -- ' + i.description;
              return i;
            }),
            data.count
          );
          console.log(data, this.selectAffairkey);
        },
        error: error => {
          this.selectAffairkey = new DefaultSelect();
        },
      });
  }
  getIndiciadoNumber(paramsData: ListParams, getByValue: boolean = false) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('id', this.form.get('indiciadoNumber').value);
    } else {
      params['name'] = paramsData['search'];
    }
    params['sortBy'] = 'name:ASC';
    this.svGoodsProcessValidationExtdomService
      .getIndiciados(params.getParams())
      .subscribe({
        next: data => {
          this.selectIndiciadoNumber = new DefaultSelect(
            data.data.map((i: any) => {
              i['dataDesc'] = i.id + ' -- ' + i.name;
              return i;
            }),
            data.count
          );
          console.log(data, this.selectIndiciadoNumber);
        },
        error: error => {
          this.selectIndiciadoNumber = new DefaultSelect();
        },
      });
  }
  getMinpubNumber(paramsData: ListParams, getByValue: boolean = false) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('id', this.form.get('minpubNumber').value);
    } else {
      params['description'] = paramsData['search'];
    }
    params['sortBy'] = 'description:ASC';
    this.svGoodsProcessValidationExtdomService
      .getMinpub(params.getParams())
      .subscribe({
        next: data => {
          this.selectMinpubNumber = new DefaultSelect(
            data.data.map((i: any) => {
              i['dataDesc'] = i.id + ' -- ' + i.description;
              return i;
            }),
            data.count
          );
          console.log(data, this.selectMinpubNumber);
        },
        error: error => {
          this.selectMinpubNumber = new DefaultSelect();
        },
      });
  }
  getCourtNumber(paramsData: ListParams, getByValue: boolean = false) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('id', this.form.get('courtNumber').value);
    } else {
      params['description'] = paramsData['search'];
    }
    params['sortBy'] = 'description:ASC';
    this.svGoodsProcessValidationExtdomService
      .getCourt(params.getParams())
      .subscribe({
        next: data => {
          this.selectCourtNumber = new DefaultSelect(
            data.data.map((i: any) => {
              i['dataDesc'] = i.id + ' -- ' + i.description;
              return i;
            }),
            data.count
          );
          console.log(data, this.selectCourtNumber);
        },
        error: error => {
          this.selectCourtNumber = new DefaultSelect();
        },
      });
  }
  getDelegationNumber(paramsData: ListParams, getByValue: boolean = false) {
    if (!this.notificationData) {
      if (paramsData['search'] != undefined && paramsData['search'] != null) {
        this.alertInfo(
          'warning',
          'Se requiere cargar una Notificación para búscar la Delegación',
          ''
        );
      }
      this.selectDelegationNumber = new DefaultSelect();
      return;
    }
    if (!this.notificationData.captureDate) {
      if (paramsData['search'] != undefined && paramsData['search'] != null) {
        this.alertInfo(
          'warning',
          'Se requiere cargar una Fecha de Captura de la Notificación para búscar la Delegación',
          ''
        );
      }
      this.selectDelegationNumber = new DefaultSelect();
      return;
    }

    let dateStage = this.datePipe.transform(
      this.notificationData.captureDate,
      'yyyy-MM-dd'
    );
    this.svGoodsProcessValidationExtdomService
      .faStageCreda(dateStage)
      .subscribe({
        next: data => {
          console.log(data);
          let stageDate = data.stagecreated;
          const params: any = new FilterParams();
          if (
            paramsData['search'] == undefined ||
            paramsData['search'] == null
          ) {
            paramsData['search'] = '';
          }
          params.removeAllFilters();
          if (getByValue) {
            params.addFilter('id', this.form.get('delegationNumber').value);
          } else {
            params['description'] = paramsData['search'];
          }
          params.addFilter('etapaEdo', stageDate);
          params['sortBy'] = 'description:ASC';
          this.svGoodsProcessValidationExtdomService
            .getDelegation(params.getParams())
            .subscribe({
              next: data => {
                this.selectDelegationNumber = new DefaultSelect(
                  data.data.map((i: any) => {
                    i['dataDesc'] = i.id + ' -- ' + i.description;
                    return i;
                  }),
                  data.count
                );
                console.log(data, this.selectDelegationNumber);
              },
              error: error => {
                this.selectDelegationNumber = new DefaultSelect();
              },
            });
        },
        error: error => {
          console.log(error);
          this.selectDelegationNumber = new DefaultSelect();
          this.onLoadToast(
            'error',
            'Ocurrió un error al obtener la etapa para la delegación',
            ''
          );
        },
      });
  }
  getEntFedKey(paramsData: ListParams, getByValue: boolean = false) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('id', this.form.get('entFedKey').value);
    } else {
      params['descCondition'] = paramsData['search'];
    }
    params['sortBy'] = 'descCondition:ASC';
    this.svGoodsProcessValidationExtdomService
      .getStateOfRepublic(params.getParams())
      .subscribe({
        next: data => {
          this.selectEntFedKey = new DefaultSelect(
            data.data.map((i: any) => {
              i['dataDesc'] = i.id + ' -- ' + i.descCondition;
              return i;
            }),
            data.count
          );
          console.log(data, this.selectEntFedKey);
        },
        error: error => {
          this.selectEntFedKey = new DefaultSelect();
        },
      });
  }
  getCityNumber(paramsData: ListParams, getByValue: boolean = false) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('idCity', this.form.get('cityNumber').value);
    } else {
      params['descCondition'] = paramsData['search'];
    }
    params['sortBy'] = 'descCondition:ASC';
    this.svGoodsProcessValidationExtdomService
      .getCity(params.getParams())
      .subscribe({
        next: data => {
          this.selectCityNumber = new DefaultSelect(
            data.data.map((i: any) => {
              i['dataDesc'] = i.idCity + ' -- ' + i.nameCity;
              return i;
            }),
            data.count
          );
          console.log(data, this.selectCityNumber);
        },
        error: error => {
          this.selectCityNumber = new DefaultSelect();
        },
      });
  }
  getTransference(paramsData: ListParams, getByValue: boolean = false) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('id', this.form.get('transference').value);
    } else {
      params['keyTransferent'] = paramsData['search'];
    }
    params['sortBy'] = 'keyTransferent:ASC';
    this.svGoodsProcessValidationExtdomService
      .getTransferente(params.getParams())
      .subscribe({
        next: data => {
          this.selectTransference = new DefaultSelect(
            data.data.map((i: any) => {
              i['dataDesc'] = i.id + ' -- ' + i.keyTransferent;
              return i;
            }),
            data.count
          );
          console.log(data, this.selectTransference);
        },
        error: error => {
          this.selectTransference = new DefaultSelect();
        },
      });
  }
  getStationNumber(paramsData: ListParams, getByValue: boolean = false) {
    if (!this.form.get('transference').value) {
      if (paramsData['search'] != undefined && paramsData['search'] != null) {
        this.alertInfo(
          'warning',
          'Se requiere cargar una Transferente para poder búscar una Emisora',
          ''
        );
      }
      this.selectStationNumber = new DefaultSelect();
      return;
    }
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('id', this.form.get('stationNumber').value);
    } else {
      params['stationName'] = paramsData['search'];
    }
    params.addFilter('idTransferent', this.form.get('transference').value);
    params['sortBy'] = 'keyTransferent:ASC';
    this.svGoodsProcessValidationExtdomService
      .getStation(params.getParams())
      .subscribe({
        next: data => {
          this.selectStationNumber = new DefaultSelect(
            data.data.map((i: any) => {
              i['dataDesc'] = i.id + ' -- ' + i.stationName;
              return i;
            }),
            data.count
          );
          console.log(data, this.selectStationNumber);
        },
        error: error => {
          this.selectStationNumber = new DefaultSelect();
        },
      });
  }
  getAuthority(paramsData: ListParams, getByValue: boolean = false) {
    if (!this.form.get('transference').value) {
      if (paramsData['search'] != undefined && paramsData['search'] != null) {
        this.alertInfo(
          'warning',
          'Se requiere cargar una Transferente para poder búscar una Emisora',
          ''
        );
      }
      this.selectAuthority = new DefaultSelect();
      return;
    }
    if (!this.form.get('stationNumber').value) {
      if (paramsData['search'] != undefined && paramsData['search'] != null) {
        this.alertInfo(
          'warning',
          'Se requiere cargar una Emisora para poder búscar una Autoridad',
          ''
        );
      }
      this.selectAuthority = new DefaultSelect();
      return;
    }
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('idAuthority', this.form.get('authority').value);
    } else {
      params['authorityName'] = paramsData['search'];
    }
    params.addFilter('idTransferer', this.form.get('transference').value);
    params.addFilter('idStation', this.form.get('stationNumber').value);
    params['sortBy'] = 'authorityName:ASC';
    this.svGoodsProcessValidationExtdomService
      .getAuthority(params.getParams())
      .subscribe({
        next: data => {
          this.selectAuthority = new DefaultSelect(
            data.data.map((i: any) => {
              i['dataDesc'] = i.idAuthority + ' -- ' + i.authorityName;
              return i;
            }),
            data.count
          );
          console.log(data, this.selectAuthority);
        },
        error: error => {
          this.selectAuthority = new DefaultSelect();
        },
      });
  }
}
