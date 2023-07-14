/** BASE IMPORT */
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  map,
  of,
  takeUntil,
  throwError,
} from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IHistoricGoodsAsegExtdom } from 'src/app/core/models/administrative-processes/history-good.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { IProceduremanagement } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  NUM_POSITIVE,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { offlinePagination } from 'src/app/utils/functions/offline-pagination';
import { HistoricalGoodsExtDomComponent } from '../historical-goods-extdom/historical-goods-extdom.component';
import { ModalScanningFoilTableHistoricalGoodsComponent } from '../modal-scanning-foil/modal-scanning-foil.component';
import { GoodsProcessValidationExtdomService } from '../services/goods-process-validation-extdom.service';
import {
  COLUMNS_GOODS_LIST_EXTDOM,
  COLUMNS_GOODS_LIST_EXTDOM_2,
  COLUMNS_GOODS_LIST_EXTDOM_3,
  RELATED_FOLIO_COLUMNS,
} from './process-extdoom-columns';

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
  goodDataSelected: IGood | any[];
  screenKey: string = 'FADMAPROEXTDOM';
  freeLabel: string = 'X';
  blockLabel: string = 'N';
  registerType: string = 'N';
  registerExistType: string = 'E';
  universalFolio: number = null;
  // TABLA DATA
  tableSettings = {
    ...this.settings,
  };
  dataTable: LocalDataSource = new LocalDataSource();
  dataTableParams = new BehaviorSubject<ListParams>(new ListParams());
  loadingGoods: boolean = false;
  totalGoods: number = 0;
  goodData: IGood[] | any[] = [];
  tableSettings2 = {
    ...this.settings,
  };
  dataTable2: LocalDataSource = new LocalDataSource();
  dataTableParams2 = new BehaviorSubject<ListParams>(new ListParams());
  loadingGoods2: boolean = false;
  totalGoods2: number = 0;
  goodData2: IGood[] | any[] = [];
  tableSettings3 = {
    ...this.settings,
  };
  dataTable3: LocalDataSource = new LocalDataSource();
  dataTableParams3 = new BehaviorSubject<ListParams>(new ListParams());
  loadingGoods3: boolean = false;
  totalGoods3: number = 0;
  goodData3: IGood[] | any[] = [];
  // Historico Modal
  params = new BehaviorSubject(new ListParams());
  filterParams = new BehaviorSubject(new FilterParams());
  // Data
  notificationData: INotification;
  // Forms
  public form: FormGroup;
  public formScan: FormGroup;
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
  selectedGoods: IGood[] = [];
  selectedDeleteGoods: IGood[] | any[] = [];
  goodsValid: IGood[] | any[] = [];
  countSelectedGoods: number = 0;
  countGoodsValid: number = 0;
  // Variables Ejecutar proceso
  errorsCount: number = 0;
  executionType: string = 'X';
  // Scanning
  showScanForm: boolean = false;
  // Usuario actual
  dataUserLogged: any;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private svGoodsProcessValidationExtdomService: GoodsProcessValidationExtdomService,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private documentsService: DocumentsService,
    private authService: AuthService,
    private msUsersService: UsersService,
    private router: Router
  ) {
    super();
    // CONFIG PARA REGISTROS DISPONIBLES PARA EXTDOM
    COLUMNS_GOODS_LIST_EXTDOM.seleccion = {
      ...COLUMNS_GOODS_LIST_EXTDOM.seleccion,
      onComponentInitFunction: this.onClickSelect.bind(this),
    };
    this.tableSettings = {
      ...this.settings,
      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
      },
      columns: { ...COLUMNS_GOODS_LIST_EXTDOM },
      rowClassFunction: (row: any) => {
        if (row.data.disponible == this.freeLabel) {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };
    // CONFIG PARA LOS REGISTROS EXISTENTES EN EXTDOM
    COLUMNS_GOODS_LIST_EXTDOM_2.seleccion = {
      ...COLUMNS_GOODS_LIST_EXTDOM_2.seleccion,
      onComponentInitFunction: this.onClickSelect_ExistExtDom.bind(this),
    };
    this.tableSettings2 = {
      ...this.settings,
      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
      },
      columns: { ...COLUMNS_GOODS_LIST_EXTDOM_2 },
    };
    // CONFIG PARA NUEVOS REGISTROS PARA EXTDOM
    COLUMNS_GOODS_LIST_EXTDOM_3.seleccion = {
      ...COLUMNS_GOODS_LIST_EXTDOM_3.seleccion,
      onComponentInitFunction: this.onClickSelect_ExtDom.bind(this),
    };
    this.tableSettings3 = {
      ...this.settings,
      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
      },
      columns: { ...COLUMNS_GOODS_LIST_EXTDOM_3 },
      rowClassFunction: (row: any) => {
        if (row.data.register_type == this.registerType) {
          return 'bg-success text-white';
        } else {
          return '';
        }
      },
    };
  }

  ngOnInit(): void {
    const token = this.authService.decodeToken();
    console.log(token);
    if (token.preferred_username) {
      this.getUserDataLogged(
        token.preferred_username
          ? token.preferred_username.toLocaleUpperCase()
          : token.preferred_username
      );
    } else {
      this.alertInfo(
        'warning',
        'Error al obtener los datos del Usuario de la sesión actual',
        ''
      );
    }
    this.prepareForm();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        this.origin = params['origin'] ?? null;
        this.P_NO_TRAMITE = params['P_NO_TRAMITE'] ?? null;
        this.P_GEST_OK = params['P_GEST_OK'] ?? null;
        this.initForm();
      });
    this.updatePaginatedTable3();
  }

  updatePaginatedTable3() {
    this.dataTableParams3.subscribe(params3 => {
      this.loadingGoods3 = true;
      const { page, limit } = params3;
      let paginated = offlinePagination(this.goodData3, limit, page);
      this.dataTable3.load(paginated);
      this.dataTable3.refresh();
      this.loadingGoods3 = false;
    });
  }

  onClickSelect(event: any) {
    // console.log('EVENTO ', event);
    if (event != undefined) {
      event.toggle.subscribe((data: any) => {
        // console.log('DATA LOG #### ', data);
        // data.row.selection = data.toggle;
        if (data.row.disponible == this.freeLabel) {
          let row: IGood = data.row;
          const index = this.selectedGoods.findIndex(
            _good => _good.goodId == row.goodId
          ); //.indexOf(row);
          // console.log('INDICE ', index);
          if (index == -1 && data.toggle == true) {
            this.selectedGoods.push(row);
          } else if (index != -1 && data.toggle == false) {
            this.selectedGoods.splice(index, 1);
          }
        } else {
          const index: number = this.selectedGoods.findIndex(
            _good => _good.goodId == data.row.goodId
          );
          this.goodData[index].seleccion = 0;
          this.dataTable.load(this.goodData);
          this.dataTable.refresh();
        }
        // console.log('SELECIONADOS AL MOMENTO ###### ', this.selectedGoods);
      });
    }
  }

  onClickSelect_ExtDom(event: any) {
    // console.log('EVENTO ', event);
    if (event != undefined) {
      event.toggle.subscribe((data: any) => {
        console.log('DATA LOG DELETE #### ', data);
        // data.row.selection = data.toggle;
        if (data.row.register_type == this.registerExistType) {
          let row: IGood = data.row;
          const index = this.selectedDeleteGoods.findIndex(
            _good => _good.goodId == row.goodId
          ); //.indexOf(row);
          console.log('INDICE DELETE', index);
          if (index == -1 && data.toggle == true) {
            this.selectedDeleteGoods.push(row);
          } else if (index != -1 && data.toggle == false) {
            this.selectedDeleteGoods.splice(index, 1);
          }
        } else {
          this.alert(
            'warning',
            'Este Registro no se puede Eliminar, sólo es posible Liberar',
            ''
          );
        }
        console.log(
          'SELECIONADOS AL MOMENTO ###### ',
          this.selectedDeleteGoods
        );
      });
    }
  }

  onClickSelect_ExistExtDom(event: any) {
    console.log('EVENTO ', event);
    if (event != undefined) {
      event.toggle.subscribe((data: any) => {
        console.log('DATA LOG EXT_DOM #### ', data);
        // data.row.selection = data.toggle;
        if (data.row.register_type == this.registerExistType) {
          let row: IGood = data.row;
          const index = this.goodsValid.findIndex(
            _good => _good.goodId == row.goodId
          ); //.indexOf(row);
          console.log('INDICE EXT_DOM', index);
          if (index == -1 && data.toggle == true) {
            this.goodsValid.push(row);
          } else if (index != -1 && data.toggle == false) {
            this.goodsValid.splice(index, 1);
          }
        } else {
          this.alert(
            'warning',
            'Este Registro no se puede Eliminar, sólo es posible Liberar',
            ''
          );
        }
        console.log(
          'SELECIONADOS AL MOMENTO ###### ',
          this.selectedDeleteGoods
        );
      });
    }
  }

  getUserDataLogged(userId: string) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter(
      'user',
      userId == 'SIGEBIADMON' ? userId.toLocaleLowerCase() : userId
    );
    this.msUsersService.getInfoUserLogued(params.getParams()).subscribe({
      next: (res: any) => {
        console.log('USER INFO', res);
        this.dataUserLogged = res.data[0];
      },
      error: error => {
        console.log(error);
        this.alertInfo(
          'warning',
          'Error al obtener los datos del Usuario de la sesión actual',
          error.error.message
        );
      },
    });
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
    this.formScan = this.fb.group({
      scanningFoli: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
    });
    this.showScanForm = true; // Mostrar parte de escaneo
  }

  initForm() {
    if (this.P_GEST_OK == 1 && this.P_NO_TRAMITE) {
      this.loading = true;
      this.svGoodsProcessValidationExtdomService
        .getProcedureManagementById(this.P_NO_TRAMITE)
        .subscribe({
          next: data => {
            console.log('GESTION TRAMITE DATA ', data);
            if (data.status == 'AMI') {
              // GESTION TRAMITE UPDATE
              let body: Partial<IProceduremanagement> = {
                id: this.P_NO_TRAMITE,
                status: 'AMP',
              };
              this.svGoodsProcessValidationExtdomService
                .updateProcedureManagement(this.P_NO_TRAMITE, body)
                .subscribe({
                  next: data => {
                    console.log('UPDATE GESTION TRAMITE DATA ', data);
                    this.getProcedureManagement();
                  },
                  error: error => {
                    console.log(error);
                    this.loading = false;
                  },
                });
            } else {
              this.getProcedureManagement();
            }
          },
          error: error => {
            console.log(error);
            if (error.status >= 500) {
              this.alert('error', 'Error', 'Error al búscar el trámite');
            } else {
              this.alert('warning', 'No se encontró el trámite', '');
            }
            this.loading = false;
          },
        });
    }
  }

  getProcedureManagement() {
    this.svGoodsProcessValidationExtdomService
      .getProcedureManagementById(this.P_NO_TRAMITE)
      .subscribe({
        next: data => {
          console.log('GESTION TRAMITE DATA ', data);
          // CONDICION DE VOLANTE O EXPEDIENTE
          if (data.expedient != null || data.flierNumber != null) {
            if (data.flierNumber != null) {
              this.form.get('wheelNumber').setValue(data.flierNumber);
              this.form.get('wheelNumber').updateValueAndValidity();
            } else {
              this.form.get('expedientNumber').setValue(data.expedient);
              this.form.get('expedientNumber').updateValueAndValidity();
            }
            this.getNotificationData();
          }
        },
        error: error => {
          console.log(error);
          if (error.status >= 500) {
            this.alert('error', 'Error', 'Error al búscar el trámite');
          } else {
            this.alert('warning', 'No se encontró el trámite', '');
          }
        },
      });
  }

  cleanDataform() {
    this.form.reset();
    this.formScan.reset();
    this.notificationData = null;
  }

  searchNotification() {
    if (
      this.form.get('wheelNumber').invalid &&
      this.form.get('expedientNumber').invalid
    ) {
      this.alert('warning', 'Ingrese un Volante o un Expediente correcto', '');
      return;
    }
    if (
      this.form.get('wheelNumber').value &&
      this.form.get('wheelNumber').invalid
    ) {
      this.alert('warning', 'Ingrese un Volante correcto', '');
      return;
    }
    if (
      this.form.get('expedientNumber').value &&
      this.form.get('expedientNumber').invalid
    ) {
      this.alert('warning', 'Ingrese un Expediente correcto', '');
      return;
    }
    let flierNumber = this.form.get('wheelNumber').value;
    let expedientNumber = this.form.get('expedientNumber').value;
    this.form.reset();
    this.formScan.reset();
    this.notificationData = null;
    if (flierNumber) {
      this.form.get('wheelNumber').setValue(flierNumber);
      this.form.get('wheelNumber').updateValueAndValidity();
    }
    if (expedientNumber) {
      this.form.get('expedientNumber').setValue(expedientNumber);
      this.form.get('expedientNumber').updateValueAndValidity();
    }
    this.getNotificationData();
  }

  getNotificationData() {
    this.loading = true;
    const params = new FilterParams();
    params.removeAllFilters();
    // if (
    //   this.form.get('wheelNumber').value ||
    //   this.form.get('expedientNumber').value
    // ) {
    if (this.form.get('wheelNumber').value) {
      params.addFilter('wheelNumber', this.form.get('wheelNumber').value);
    } else {
      params.addFilter('fileNumber', this.form.get('expedientNumber').value);
    }
    // }
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
    this.showScanForm = false; // Mostrar parte de escaneo
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
    setTimeout(() => {
      this.formScan.get('scanningFoli').setValue(null);
      this.formScan.get('scanningFoli').updateValueAndValidity();
      this.showScanForm = true; // Mostrar parte de escaneo
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
          let data = res.data.map((i: any) => {
            const index2: number = this.selectedGoods.findIndex(
              (_good: IGood) => _good.goodId == i.goodId
            );
            if (index2 > -1) {
              i['disponible'] = this.blockLabel;
              i['seleccion'] = 0;
              return i;
            } else {
              i['disponible'] = this.freeLabel;
              i['seleccion'] = 0;
              return i;
            }
          });
          this.dataTable.load(data);
          this.dataTable.refresh();
          this.goodData = data;
        },
        error: error => {
          this.loadingGoods = false;
          console.log(error);
          this.dataTable.load([]);
          this.dataTable.refresh();
          this.goodData = [];
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
          let data = res.data.map((i: any) => {
            i['register_type'] = this.registerExistType;
            return i;
          });
          this.totalGoods2 = res.count;
          // this.dataTable2.load(res.data);
          this.dataTable2.load(data);
          this.dataTable2.refresh();
          this.goodData2 = res.data;
        },
        error: error => {
          this.loadingGoods2 = false;
          console.log(error);
          this.dataTable2.load([]);
          this.dataTable2.refresh();
          this.goodData2 = [];
        },
      });
  }

  addSelect() {
    console.log('Agregar');
    this.loadingGoods = true; // Iniciar loading de tabla bienes
    this.loadingGoods3 = true; // Iniciar loading de tabla a procesar
    this.selectedGoods.forEach((data: IGood | any, count: number) => {
      // VALIDAR QUE NO EXISTA YA EN LA TABLA A PROCESAR
      const index3: number = this.goodData3.findIndex(
        (_good: IGood) => _good.goodId == data.goodId
      );
      console.log('INDICE 3 ADD SELECT ', index3);
      if (index3 == -1) {
        this.goodData3.push({ ...data, register_type: this.registerType }); // Agregar registro a la data
        this.totalGoods3++; // Aumentar si se agrego registro
        // VALIDAR CON LA DATA DEL ENDPOINT IGUAL
        const index2: number = this.goodData.findIndex(
          (_good: IGood) => _good.goodId == data.goodId
        );
        if (index2 > -1) {
          this.goodData[index2].disponible = this.blockLabel; // Cambiar a no disponible
          this.goodData[index2].seleccion = 0; // Quitar el check del registro
        }
      }
    });
    setTimeout(() => {
      // Update data table bienes
      this.dataTable.load(this.goodData);
      this.dataTable.refresh();
      this.loadingGoods = false; // Detener loading de tabla bienes
      this.loadingGoods3 = false; // Detener loading de tabla a procesar
      this.updatePaginatedTable3();
    }, 500);
  }

  removeSelect() {
    console.log('Eliminar');
    this.loadingGoods = true; // Iniciar loading de tabla bienes
    this.loadingGoods3 = true; // Iniciar loading de tabla a procesar
    let removeSelectedGoods: number[] = []; // Guardar contadores para eliminar del listado de seleccion
    let removeGoodsSelected: number[] = []; // Guardar contadores para eliminar del listado de elimnar seleccion
    this.selectedDeleteGoods.forEach((data: IGood | any, count: number) => {
      // VALIDAR QUE EXISTA YA EN EL LISTADO DE SELECCIONADOS
      const index1: number = this.goodData3.findIndex(
        (_good: IGood) => _good.goodId == data.goodId
      );
      console.log('INDICE 1 DELETE SELECT ', index1);
      if (index1 > -1) {
        this.goodData3.splice(index1, 1); // Eliminar registro del arreglo
        this.totalGoods3--; // Dismunuye si se quito el registro
        // VALIDAR CON LA DATA DEL ENDPOINT IGUAL
        const index3: number = this.goodData.findIndex(
          (_good: IGood) => _good.goodId == data.goodId
        );
        if (index3 > -1) {
          this.goodData[index3].disponible = this.freeLabel; // Cambiar disponible
          this.goodData[index3].seleccion = 0; // Quitar el check del registro
        }
        const index4: number = this.selectedGoods.findIndex(
          (_good: IGood) => _good.goodId == data.goodId
        );
        if (index4 > -1) {
          removeSelectedGoods.push(index4); // Guardar posicion para eliminar los seleccionados
        }
        const index2: number = this.selectedDeleteGoods.findIndex(
          (_good: IGood) => _good.goodId == data.goodId
        );
        if (index2 > -1) {
          removeGoodsSelected.push(index2); // Guardar posicion para eliminar los seleccionados
        }
      }
    });
    setTimeout(() => {
      console.log('REMOVE FROM ARRAY DELETE ', removeGoodsSelected);
      if (removeGoodsSelected.length > 0) {
        removeGoodsSelected.forEach(elementCount => {
          this.selectedDeleteGoods.splice(elementCount, 1); // Eliminar registro del arreglo
        });
      }
      console.log('REMOVE FROM ARRAY SELECTED', removeSelectedGoods);
      if (removeSelectedGoods.length > 0) {
        removeSelectedGoods.forEach(elementCount => {
          this.selectedGoods.splice(elementCount, 1); // Eliminar registro del arreglo
        });
      }
      console.log(
        'LISTADOS DE SELECCIONADOS ###########',
        this.selectedGoods,
        this.selectedDeleteGoods,
        this.goodData3,
        this.goodData
      );
      // Update data table bienes
      this.dataTable.load(this.goodData);
      this.dataTable.refresh();
      this.loadingGoods = false; // Detener loading de tabla bienes
      this.loadingGoods3 = false; // Detener loading de tabla a procesar
      this.updatePaginatedTable3();
    }, 500);
  }

  addAll() {
    console.log('Agregar Todos');
  }

  removeAll() {
    console.log('Eliminar Todos');
  }

  btnEjecutarCambios() {
    console.log('EjecutarCambios');
    this.executionType = 'X';
    this.errorsCount = 0;
    // -- Verificamos si en el bloque existen registros nuevos
    if (this.selectedGoods.length > 0) {
      this.executionType = this.registerType;
    }
    // -- Verificamos si en el bloque existen registros para liberar
    if (this.goodsValid.length > 0) {
      this.executionType = this.registerExistType;
    }
    if (this.executionType == 'X') {
      this.alert('warning', 'No Existen Cambios para Ejecutar', '');
      return;
    } else if (this.executionType == this.registerType) {
      this.confirmMessageValidFolio(
        'Se identificó que existen nuevos bienes, sólo se aplicará el cambio de Proceso a ASEG_EXTDOM. ¿Quiere continuar con el proceso?',
        ''
      );
    } else if (this.executionType == this.registerExistType) {
      this.confirmMessageValidFolio(
        'Se identificó que existen bienes para Liberar, se aplicara el cambio. ¿Quiere continuar con el proceso?',
        'para Liberación'
      );
    }
  }

  confirmMessageValidFolio(message: string, folioMessage: string) {
    this.alertQuestion('question', message, '').then(response => {
      if (response.isConfirmed) {
        if (!this.universalFolio) {
          this.alert(
            'warning',
            'No Existe Folio de Escaneo' +
              folioMessage +
              ', Favor de Ingresar...',
            ''
          );
          return;
        } else {
          this.validDocumentsByFolio(); // Validar documentos relacionados al folio
        }
      }
    });
  }

  validDocumentsByFolio() {
    this.getDocumentsCount().subscribe(count => {
      console.log('COUNT ', count);
      if (count == 0) {
        this.alert(
          'warning',
          'El Folio Universal no Existe, NO se Han Agregado Imágenes o NO Corresponde a "Admisión de Demanda de Extinción de Dominio"',
          ''
        );
      } else {
        if (this.executionType == this.registerType) {
          this.alertInfo(
            'warning',
            'Los Bienes se Relacionarán a la Documentación del Folio:  ' +
              this.universalFolio,
            ''
          ).then(response => {
            this.startLoopSelectedGoods();
          });
        } else if (this.executionType == this.registerExistType) {
          this.alertInfo(
            'warning',
            'La Liberación de los Bienes se Relacionará a la Documentación del Folio: ' +
              this.universalFolio,
            ''
          ).then(response => {
            this.startLoopGoodsValid();
          });
        }
      }
    });
  }

  getDocumentsCount() {
    const params = new FilterParams();
    params.addFilter('scanStatus', 'ESCANEADO');
    params.addFilter('keyTypeDocument', 'ASEGEXTDOM');
    params.addFilter('id', this.universalFolio);
    this.hideError();
    return this.documentsService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        if (error.status < 500) {
          return of({ count: 0 });
        }
        return throwError(() => error);
      }),
      map(response => response.count)
    );
  }

  startLoopSelectedGoods() {
    this.errorsCount = 0;
    this.countSelectedGoods = 0;
    this.updateGoods(false);
  }

  continueLoopSelectedGoods() {
    this.countSelectedGoods++;
    if (this.selectedGoods[this.countSelectedGoods]) {
      this.updateGoods(false);
    } else {
      if (this.errorsCount == 0) {
        this.alert('success', 'Proceso Completado Correctamente', '');
      } else {
        this.alert('error', 'Ocurrieron Errores Durante el Proceso', '');
      }
    }
  }

  startLoopGoodsValid() {
    this.errorsCount = 0;
    this.countGoodsValid = 0;
    this.updateHistoricalGoodAsegExtDom();
  }

  continueLoopGoodsValid() {
    this.countGoodsValid++;
    if (this.goodsValid[this.countGoodsValid]) {
      this.updateHistoricalGoodAsegExtDom();
    } else {
      if (this.errorsCount == 0) {
        this.alert('success', 'Proceso Completado Correctamente', '');
      } else {
        this.alert('error', 'Ocurrieron Errores Durante el Proceso', '');
      }
    }
  }

  updateGoods(onlyUpdate: boolean = false) {
    // if (insertHistorical == false) {
    //   this.updateHistoricalGoodAsegExtDom();
    // } else {
    let body: any = {
      status:
        this.executionType == this.registerType
          ? 'ASEG_EXTDOM'
          : this.goodsValid[this.countGoodsValid].extDomProcess,
      goodId:
        this.executionType == this.registerType
          ? this.selectedGoods[this.countSelectedGoods].goodId
          : this.goodsValid[this.countGoodsValid].goodId,
      id:
        this.executionType == this.registerType
          ? this.selectedGoods[this.countSelectedGoods].id
          : this.goodsValid[this.countGoodsValid].id,
    };
    console.log(body);

    this.svGoodsProcessValidationExtdomService.updateGood(body).subscribe({
      next: data => {
        console.log('UPDATE STATUS', data);
        if (onlyUpdate == false) {
          this.insertHistoricalGoodAsegExtDom();
        } else {
          this.continueLoopGoodsValid();
        }
      },
      error: error => {
        console.log(error);
        if (onlyUpdate == false) {
          this.countSelectedGoods++;
          this.continueLoopSelectedGoods();
        } else {
          this.countGoodsValid++;
          this.continueLoopGoodsValid();
        }
        // this.alert('error', 'Error al Actualizar el Estatus del Bien', '');
      },
    });
    // }
  }

  insertHistoricalGoodAsegExtDom() {
    let body: Partial<IHistoricGoodsAsegExtdom> = {
      proceedingsNumber: this.selectedGoods[this.countSelectedGoods].fileNumber,
      goodNumber: this.selectedGoods[this.countSelectedGoods].goodId,
      dateChange: new Date(),
      userChange: this.dataUserLogged.user,
      processExtSun: this.selectedGoods[this.countSelectedGoods].extDomProcess,
      invoiceUnivChange: this.universalFolio,
    };
    this.svGoodsProcessValidationExtdomService
      .createHistoryGood(body)
      .subscribe({
        next: data => {
          console.log('CREATE GOOD HISTORIAL', data);
          this.continueLoopSelectedGoods();
        },
        error: error => {
          this.countSelectedGoods++;
          console.log(error);
          this.continueLoopSelectedGoods();
          // this.alert('error', 'Error al Actualizar el Estatus del Bien', '');
        },
      });
  }

  updateHistoricalGoodAsegExtDom() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter(
      'goodNumber',
      this.selectedGoods[this.countSelectedGoods].goodId
    );
    params.addFilter('userfree', SearchFilter.NULL);
    params.addFilter('datefree', SearchFilter.NULL);
    params.limit = this.dataTableParams2.value.limit;
    params.page = this.dataTableParams2.value.page;
    this.svGoodsProcessValidationExtdomService
      .getHistoryGood(params.getParams())
      .subscribe({
        next: res => {
          console.log('GET GOOD HISTORIAL', res);
          let body: Partial<IHistoricGoodsAsegExtdom> = {
            // proceedingsNumber: this.selectedGoods[this.countSelectedGoods].fileNumber,
            goodNumber: this.selectedGoods[this.countSelectedGoods].goodId,
            datefree: new Date(),
            userfree: this.dataUserLogged.user,
            invoiceUnivfree: this.universalFolio,
          };
          this.svGoodsProcessValidationExtdomService
            .updateHistoryGood(body)
            .subscribe({
              next: data => {
                console.log('UPDATE GOOD HISTORIAL', data);
                this.updateGoods(true);
              },
              error: error => {
                this.countGoodsValid++;
                console.log(error);
                this.continueLoopGoodsValid();
                // this.alert('error', 'Error al Actualizar el Estatus del Bien', '');
              },
            });
        },
        error: error => {
          this.countGoodsValid++;
          console.log(error);
          this.continueLoopGoodsValid();
        },
      });
  }

  btnConsultarHistorico() {
    if (this.notificationData == null) {
      this.alert('warning', 'Realice una búsqueda para ver está opción', '');
      return;
    }
    if (this.notificationData.expedientNumber == null) {
      this.alert(
        'warning',
        'Se requiere de un Expediente para poder ver está opción',
        ''
      );
      return;
    }
    console.log('ConsultarHistorico');
    // this.listadoHistorico = true;
    //descomentar si usan FilterParams ejemplo de consulta
    this.filterParams
      .getValue()
      .addFilter(
        'proceedingsNumber',
        this.notificationData.expedientNumber,
        SearchFilter.EQ
      );
    //this.filterParams.getValue().addFilter('keyTypeDocument', 'ENTRE', SearchFilter.ILIKE)

    //ejemplo de uso con ListParams
    //this.params.getValue()['filter.id'] = '$eq:3429640'

    let config: ModalOptions = {
      initialState: {
        //filtros
        paramsList: this.params,
        filterParams: this.filterParams, // en caso de no usar FilterParams no enviar
        callback: (next: boolean, data: IHistoricGoodsAsegExtdom) => {
          console.log(next);

          if (next) {
            //mostrar datos de la búsqueda
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(HistoricalGoodsExtDomComponent, config);
  }
  btnConocimiento() {
    if (this.notificationData == null) {
      this.alert('warning', 'Realice una búsqueda para ver está opción', '');
      return;
    }
    if (this.notificationData.wheelNumber == null) {
      this.alert('warning', 'Se requiere de un Volante/Expediente', '');
      return;
    }
    if (this.selectedGoods.length > 0) {
      this.alert(
        'warning',
        'Se tiene al menos 1 bien amparado, no puede concluir por este medio',
        ''
      );
      return;
    }
    if (!this.universalFolio) {
      this.alert('warning', 'Se Requiere un Folio de Escaneo', '');
      return;
    }
    const params = new FilterParams();
    params.addFilter('id', this.universalFolio);
    params.addFilter('scanStatus', 'ESCANEADO');
    this.documentsService.getAllFilter(params.getParams()).subscribe({
      next: resp => {
        console.log(resp);
        // NOTIFICACIONES.RESERVADO
      },
      error: error => {
        if (error.status >= 500) {
          this.alert(
            'error',
            'Ocurrió un error al validar los Documentos relacionados al Folio Universal',
            ''
          );
        } else {
          if (['13', '14'].includes(this.form.get('affairKey').value)) {
            this.alert('warning', 'Se debe ingresar el Folio de Escaneo', '');
          }
        }
      },
    });
  }
  btnEnvioCorreos() {}
  btnMantenimientoCorreo() {
    this.router.navigate(['/pages/parameterization/mail'], {
      queryParams: {
        origin: this.screenKey,
        origin2: this.origin ? this.origin : null,
        P_CVE_PANTALLA: this.screenKey,
        P_NO_TRAMITE: this.P_NO_TRAMITE,
        P_GEST_OK: this.P_GEST_OK,
      },
    });
  }
  scanRequest(event: any) {
    console.log(event);
  }

  showScanningPage(event: any) {
    console.log(event);
  }
  messageDigitalization(event: any) {
    console.log(event);
  }

  viewPictures(event: any) {
    console.log(event);
    // if (!this.dictationData.wheelNumber) {
    //   this.onLoadToast(
    //     'error',
    //     'Error',
    //     'Este trámite no tiene volante asignado'
    //   );
    //   return;
    // }
    this.getDocumentsByFlyer(this.notificationData.wheelNumber);
  }

  getDocumentsByFlyer(flyerNum: string | number) {
    const title = 'Folios relacionados al Volante';
    const modalRef = this.openDocumentsModal(flyerNum, title);
    modalRef.content.selected
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(document => this.getPicturesFromFolio(document));
  }

  openDocumentsModal(flyerNum: string | number, title: string) {
    const params = new FilterParams();
    params.addFilter('flyerNumber', flyerNum);
    const $params = new BehaviorSubject(params);
    const $obs = this.documentsService.getAllFilter;
    const service = this.documentsService;
    const columns = RELATED_FOLIO_COLUMNS;
    // const body = {
    //   proceedingsNum: this.dictationData.expedientNumber,
    //   flierNum: this.dictationData.wheelNumber,
    // };
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        $obs,
        service,
        columns,
        title,
        $params,
        proceedingsNumber: this.notificationData.expedientNumber,
        wheelNumber: this.notificationData.wheelNumber,
        showConfirmButton: true,
      },
    };
    return this.modalService.show(
      ModalScanningFoilTableHistoricalGoodsComponent<IDocuments>,
      config
    );
  }

  getPicturesFromFolio(document: IDocuments) {
    let folio = document.id;
    if (document.associateUniversalFolio) {
      folio = document.associateUniversalFolio;
    }
    console.log('PICTURES ', folio, document);
    const config = {
      ...MODAL_CONFIG,
      ignoreBackdropClick: false,
      initialState: {
        folio,
      },
    };
    this.modalService.show(DocumentsViewerByFolioComponent, config);
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
          // console.log(data, this.selectAffairkey);
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
          // console.log(data, this.selectIndiciadoNumber);
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
          // console.log(data, this.selectMinpubNumber);
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
          // console.log(data, this.selectCourtNumber);
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
          // console.log(data);
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
                // console.log(data, this.selectDelegationNumber);
              },
              error: error => {
                this.selectDelegationNumber = new DefaultSelect();
              },
            });
        },
        error: error => {
          // console.log(error);
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
          // console.log(data, this.selectEntFedKey);
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
          // console.log(data, this.selectCityNumber);
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
          // console.log(data, this.selectTransference);
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
          // console.log(data, this.selectStationNumber);
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
          // console.log(data, this.selectAuthority);
        },
        error: error => {
          this.selectAuthority = new DefaultSelect();
        },
      });
  }
}
