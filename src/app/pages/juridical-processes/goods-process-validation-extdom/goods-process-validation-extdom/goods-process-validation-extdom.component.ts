/** BASE IMPORT */
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
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
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
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
import { EmailGoodProcessValidationComponent } from '../email/email.component';
import { HistoricalGoodsExtDomComponent } from '../historical-goods-extdom/historical-goods-extdom.component';
import { ModalScanningFoilTableHistoricalGoodsComponent } from '../modal-scanning-foil/modal-scanning-foil.component';
import { GoodsProcessValidationExtdomService } from '../services/goods-process-validation-extdom.service';
import {
  COLUMNS_GOODS_LIST_EXTDOM,
  COLUMNS_GOODS_LIST_EXTDOM_2,
  COLUMNS_GOODS_LIST_EXTDOM_3,
  COLUMNS_GOODS_LIST_EXTDOM_4,
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
  // Bienes Disponibles
  tableSettings = {
    ...this.settings,
  };
  dataTable: LocalDataSource = new LocalDataSource();
  dataTableParams = new BehaviorSubject<ListParams>(new ListParams());
  loadingGoods: boolean = false;
  totalGoods: number = 0;
  goodData: IGood[] | any[] = [];
  // Bienes para Procesar para ASEG_EXTDOM
  tableSettings3 = {
    ...this.settings,
  };
  dataTable3: LocalDataSource = new LocalDataSource();
  dataTableParams3 = new BehaviorSubject<ListParams>(new ListParams());
  loadingGoods3: boolean = false;
  totalGoods3: number = 0;
  goodData3: IGood[] | any[] = [];
  // Bienes en ASEG_EXTDOM
  tableSettings2 = {
    ...this.settings,
  };
  dataTable2: LocalDataSource = new LocalDataSource();
  dataTableParams2 = new BehaviorSubject<ListParams>(new ListParams());
  loadingGoods2: boolean = false;
  totalGoods2: number = 0;
  goodData2: IGood[] | any[] = [];
  // Bienes en ASEG_EXTDOM para Liberar
  tableSettings4 = {
    ...this.settings,
  };
  dataTable4: LocalDataSource = new LocalDataSource();
  dataTableParams4 = new BehaviorSubject<ListParams>(new ListParams());
  loadingGoods4: boolean = false;
  totalGoods4: number = 0;
  goodData4: IGood[] | any[] = [];
  // Historico Modal
  params = new BehaviorSubject(new ListParams());
  filterParams = new BehaviorSubject(new FilterParams());
  // Data
  notificationData: INotification;
  // Forms
  public form: FormGroup;
  public formScan: FormGroup;
  public formReserved: FormGroup;
  // Params
  origin: string = '';
  P_NO_TRAMITE: number = null;
  P_GEST_OK: number = null;
  P_VOLANTE: number = null;
  P_EXPEDIENTE: number = null;
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
  selectedDeletedGoodsValid: IGood[] | any[] = [];
  countSelectedGoods: number = 0;
  countGoodsValid: number = 0;
  localStorage_selectedGoods: string = 'selectedGoods_aseg';
  localStorage_goodData3: string = 'goodData3_aseg';
  localStorage_totalGoods3: string = 'totalGoods3_aseg';
  localStorage_selectedGoods2: string = 'selectedGoods2_aseg';
  localStorage_goodData4: string = 'goodData4_aseg';
  localStorage_totalGoods4: string = 'totalGoods4_aseg';
  // Variables Ejecutar proceso
  errorsCount: number = 0;
  executionType: string = 'X';
  loadingProcess: boolean = false;
  // Scanning
  showScanForm: boolean = false;
  // Reservado
  showReservedForm: boolean = false;
  // Usuario actual
  dataUserLogged: any;
  // Good Loop
  goodLoopCurrent: number = 0;
  goodLoopTotal: number = 0;
  goodLoopPage: number = 0;
  goodLoopLimit: number = 0;
  goodLoopTmp: IGood[] | any[] = [];
  goodLoopLoading: boolean = false;
  // Good Loop Free
  goodLoopFreeCurrent: number = 0;
  goodLoopFreeTotal: number = 0;
  goodLoopFreePage: number = 0;
  goodLoopFreeLimit: number = 0;
  goodLoopFreeTmp: IGood[] | any[] = [];
  goodLoopFreeLoading: boolean = false;
  // Nombres de tablas
  nameTable1: string = '"Bienes Disponibles"';
  nameTable2: string = '"Bienes a Procesar para Validación ASEG_EXTDOM"';
  nameTable3: string = '"Bienes en Validación ASEG_EXTDOM"';
  nameTable4: string = '"Bienes en Validación ASEG_EXTDOM para Liberar"';
  newSearch: boolean = false;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private svGoodsProcessValidationExtdomService: GoodsProcessValidationExtdomService,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private documentsService: DocumentsService,
    private authService: AuthService,
    private msUsersService: UsersService,
    private router: Router,
    private siabService: SiabService,
    private sanitizer: DomSanitizer
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
      rowClassFunction: (row: any) => {
        if (row.data.disponible == this.freeLabel) {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };
    // CONFIG PARA LOS REGISTROS EXISTENTES EN EXTDOM QUE SE VAN A LIBERAR
    COLUMNS_GOODS_LIST_EXTDOM_4.seleccion = {
      ...COLUMNS_GOODS_LIST_EXTDOM_4.seleccion,
      onComponentInitFunction: this.onClickSelectDelete_ExistExtDom.bind(this),
    };
    this.tableSettings4 = {
      ...this.settings,
      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
      },
      columns: { ...COLUMNS_GOODS_LIST_EXTDOM_4 },
      rowClassFunction: (row: any) => {
        if (row.data.register_type == this.registerExistType) {
          return 'bg-success text-white';
        } else {
          return '';
        }
      },
    };
  }

  ngOnInit(): void {
    this.showReservedForm = false;
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
    this.newSearch = false;
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        this.origin = params['origin'] ?? null;
        this.P_NO_TRAMITE = params['P_NO_TRAMITE'] ?? null;
        this.P_GEST_OK = params['P_GEST_OK'] ?? null;
        this.P_VOLANTE = params['P_VOLANTE'] ?? null;
        this.P_EXPEDIENTE = params['P_EXPEDIENTE'] ?? null;
        if (this.P_VOLANTE) {
          this.form.get('wheelNumber').setValue(this.P_VOLANTE);
          this.form.get('wheelNumber').updateValueAndValidity();
        }
        if (this.P_EXPEDIENTE) {
          this.form.get('expedientNumber').setValue(this.P_EXPEDIENTE);
          this.form.get('expedientNumber').updateValueAndValidity();
        }
        // let e_aseg = localStorage.getItem('e_aseg');
        // let v_aseg = localStorage.getItem('v_aseg');
        // console.log('LOCALSTORAGE ', e_aseg, v_aseg);
        // let valid = true;
        // if (!e_aseg && this.P_EXPEDIENTE) {
        //   valid = false;
        // }
        // if (!v_aseg && this.P_VOLANTE) {
        //   valid = false;
        // }
        // if (valid == false) {
        //   localStorage.removeItem('f_aseg');
        //   localStorage.removeItem('e_aseg');
        //   localStorage.removeItem('v_aseg');
        //   // Para crear
        //   localStorage.removeItem(this.localStorage_selectedGoods);
        //   localStorage.removeItem(this.localStorage_goodData3);
        //   localStorage.removeItem(this.localStorage_totalGoods3);
        //   // Para liberar
        //   localStorage.removeItem(this.localStorage_selectedGoods2);
        //   localStorage.removeItem(this.localStorage_goodData4);
        //   localStorage.removeItem(this.localStorage_totalGoods4);
        // }
        // if (this.P_NO_TRAMITE == null) {
        //   localStorage.removeItem('f_aseg');
        //   localStorage.removeItem('e_aseg');
        //   localStorage.removeItem('v_aseg');
        //   // Para crear
        //   localStorage.removeItem(this.localStorage_selectedGoods);
        //   localStorage.removeItem(this.localStorage_goodData3);
        //   localStorage.removeItem(this.localStorage_totalGoods3);
        //   // Para liberar
        //   localStorage.removeItem(this.localStorage_selectedGoods2);
        //   localStorage.removeItem(this.localStorage_goodData4);
        //   localStorage.removeItem(this.localStorage_totalGoods4);
        // }
        this.initForm();
      });
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

  updatePaginatedTable4() {
    this.dataTableParams4.subscribe(params4 => {
      this.loadingGoods4 = true;
      const { page, limit } = params4;
      let paginated = offlinePagination(this.goodData4, limit, page);
      this.dataTable4.load(paginated);
      this.dataTable4.refresh();
      this.loadingGoods4 = false;
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
        console.log('SELECIONADOS AL MOMENTO ###### ', this.selectedGoods);
      });
    }
  }

  onClickSelect_ExtDom(event: any) {
    // console.log('EVENTO ', event);
    if (event != undefined) {
      event.toggle.subscribe((data: any) => {
        console.log('DATA LOG DELETE #### ', data);
        // data.row.selection = data.toggle;
        if (data.row.register_type == this.registerType) {
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
          // this.alert(
          //   'warning',
          //   'Este Registro no se puede Eliminar, sólo es posible Liberar',
          //   ''
          // );
        }
        console.log(
          'SELECIONADOS AL MOMENTO ###### ',
          this.selectedDeleteGoods
        );
      });
    }
  }

  onClickSelect_ExistExtDom(event: any) {
    // console.log('EVENTO ', event);
    if (event != undefined) {
      event.toggle.subscribe((data: any) => {
        // console.log('DATA LOG #### ', data);
        // data.row.selection = data.toggle;
        if (data.row.disponible == this.freeLabel) {
          let row: IGood = data.row;
          const index = this.goodsValid.findIndex(
            _good => _good.goodId == row.goodId
          ); //.indexOf(row);
          // console.log('INDICE ', index);
          if (index == -1 && data.toggle == true) {
            this.goodsValid.push(row);
          } else if (index != -1 && data.toggle == false) {
            this.goodsValid.splice(index, 1);
          }
        } else {
          const index: number = this.goodsValid.findIndex(
            _good => _good.goodId == data.row.goodId
          );
          this.goodData2[index].seleccion = 0;
          this.dataTable2.load(this.goodData2);
          this.dataTable2.refresh();
        }
        console.log('SELECIONADOS AL MOMENTO ###### ', this.goodsValid);
      });
    }
    // if (event != undefined) {
    //   event.toggle.subscribe((data: any) => {
    //     console.log('DATA LOG EXT_DOM #### ', data);
    //     // data.row.selection = data.toggle;
    //     if (data.row.register_type == this.registerExistType) {
    //       let row: IGood = data.row;
    //       const index = this.goodsValid.findIndex(
    //         _good => _good.goodId == row.goodId
    //       ); //.indexOf(row);
    //       console.log('INDICE EXT_DOM', index);
    //       if (index == -1 && data.toggle == true) {
    //         this.goodsValid.push(row);
    //       } else if (index != -1 && data.toggle == false) {
    //         this.goodsValid.splice(index, 1);
    //       }
    //     } else {
    //       this.alert(
    //         'warning',
    //         'Este Registro no se puede Eliminar, sólo es posible Liberar',
    //         ''
    //       );
    //     }
    //     console.log('SELECIONADOS AL MOMENTO ###### ', this.goodsValid);
    //   });
    // }
  }

  onClickSelectDelete_ExistExtDom(event: any) {
    // console.log('EVENTO ', event);
    if (event != undefined) {
      event.toggle.subscribe((data: any) => {
        console.log('DATA LOG EXT_DOM #### ', data, this.registerExistType);
        // data.row.selection = data.toggle;
        if (data.row.register_type == this.registerExistType) {
          let row: IGood = data.row;
          const index = this.selectedDeletedGoodsValid.findIndex(
            _good => _good.goodId == row.goodId
          ); //.indexOf(row);
          console.log('INDICE EXT_DOM', index);
          if (index == -1 && data.toggle == true) {
            this.selectedDeletedGoodsValid.push(row);
          } else if (index != -1 && data.toggle == false) {
            this.selectedDeletedGoodsValid.splice(index, 1);
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
          this.selectedDeletedGoodsValid
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
      receiptDate: [
        { value: '', disabled: true },
        ,
        [Validators.required, Validators.maxLength(11)],
      ], //* FECHA DE RECEPCION
      expedientTransferenceNumber: [
        '',
        [(Validators.maxLength(400), Validators.pattern(STRING_PATTERN))],
      ], //* NO EXPEDIENTES TRANSFERENTES
      officeExternalKey: [
        '',
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.maxLength(35)],
      ], //* CLAVE OFICIO EXTERNO
      externalOfficeDate: [
        { value: '', disabled: true },
        ,
        [Validators.maxLength(11)],
      ], //* FECHA OFICIO EXTERNO
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
    this.formReserved = this.fb.group({
      reserved: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(200)],
      ],
    });
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
              this.alert('error', 'Error', 'Error al Búscar el Trámite');
            } else {
              this.alert('warning', 'No se Encontró el Trámite', '');
            }
            this.loading = false;
          },
        });
    } else {
      if (this.P_EXPEDIENTE != null && this.P_VOLANTE != null) {
        this.getNotificationData();
      }
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
            this.alert('error', 'Error', 'Error al Búscar el Trámite');
          } else {
            this.alert('warning', 'No se Encontró el Trámite', '');
          }
        },
      });
  }

  cleanDataform() {
    this.showScanForm = false;
    this.form.reset();
    this.formScan.reset();
    this.notificationData = null;
    setTimeout(() => {
      this.showScanForm = true;
      // localStorage.removeItem('f_aseg');
      // localStorage.removeItem('e_aseg');
      // localStorage.removeItem('v_aseg');
      // // Para crear
      // localStorage.removeItem(this.localStorage_selectedGoods);
      // localStorage.removeItem(this.localStorage_goodData3);
      // localStorage.removeItem(this.localStorage_totalGoods3);
      // // Para liberar
      // localStorage.removeItem(this.localStorage_selectedGoods2);
      // localStorage.removeItem(this.localStorage_goodData4);
      // localStorage.removeItem(this.localStorage_totalGoods4);
      // Listado Tabla Bienes Disponibles
      this.dataTable.load([]);
      this.dataTable.refresh();
      this.goodData = [];
      this.totalGoods = 0;
      // Listado Tabla Bienes para Procesar ASEG_EXTDOM
      this.dataTable2.load([]);
      this.dataTable2.refresh();
      this.goodData2 = [];
      this.totalGoods2 = 0;
      // Listado Tabla Bienes en Validacion EXT_DOM
      this.dataTable3.load([]);
      this.dataTable3.refresh();
      this.goodData3 = [];
      this.totalGoods3 = 0;
      // Listado Tabla Bienes en Validacion EXT_DOM para Liberar
      this.dataTable4.load([]);
      this.dataTable4.refresh();
      this.goodData4 = [];
      this.totalGoods4 = 0;
    }, 200);
  }

  reloadPage() {
    this.loading = true;
    this.reviewLocalStorage();
    this.dataTableParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.loadGoods());
    this.dataTableParams2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.loadGoods2());
    this.updatePaginatedTable3();
    this.loading = false;
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
    this.newSearch = true;
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
          // this.getDocumentsByExpedient();
        },
        error: error => {
          console.log(error);
          this.loading = false;
          this.alert(
            'error',
            'No se Encontraron Registros',
            'Intente Nuevamente con otro Expediente y/o Volante'
          );
          // localStorage.removeItem('e_aseg');
          // localStorage.removeItem('v_aseg');
          // // Para crear
          // localStorage.removeItem(this.localStorage_selectedGoods);
          // localStorage.removeItem(this.localStorage_goodData3);
          // localStorage.removeItem(this.localStorage_totalGoods3);
          // // Para liberar
          // localStorage.removeItem(this.localStorage_selectedGoods2);
          // localStorage.removeItem(this.localStorage_goodData4);
          // localStorage.removeItem(this.localStorage_totalGoods4);
        },
      });
  }

  getDocumentsByExpedient() {
    const params = new FilterParams();
    // params.addFilter('scanStatus', 'ESCANEADO');
    // params.addFilter('keyTypeDocument', 'ASEGEXTDOM'); // 'AMPA');
    params.addFilter(
      'numberProceedings',
      this.notificationData.expedientNumber
    );
    params.addFilter('flyerNumber', this.notificationData.wheelNumber);
    this.hideError();
    return this.documentsService.getAllFilter(params.getParams()).subscribe({
      next: data => {
        console.log('FOLIO DATA ', data);
        this.showScanForm = false;
        this.universalFolio = Number(data.data[0].id);
        this.formScan.get('scanningFoli').setValue(data.data[0].id);
        this.formScan.get('scanningFoli').updateValueAndValidity();
        setTimeout(() => {
          this.showScanForm = true;
        }, 200);
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
    // localStorage.setItem('e_aseg', '' + this.notificationData.expedientNumber);
    // localStorage.setItem('v_aseg', '' + this.notificationData.wheelNumber);
    console.log(this.form.value);

    this.formReserved.get('reserved').setValue(data.reserved);
    this.formReserved.get('reserved').updateValueAndValidity();
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
      // let e_aseg = localStorage.getItem('e_aseg');
      // let v_aseg = localStorage.getItem('v_aseg');
      // console.log('LOCALSTORAGE ', e_aseg, v_aseg);
      // let valid = false;
      // if (this.notificationData == null) {
      //   valid = false;
      // } else {
      //   if (this.notificationData.expedientNumber) {
      //     if (e_aseg != this.notificationData.expedientNumber.toString()) {
      //       valid = false;
      //     }
      //   }
      //   if (this.notificationData.wheelNumber) {
      //     if (v_aseg != this.notificationData.wheelNumber.toString()) {
      //       valid = false;
      //     }
      //   }
      // }
      // if (valid == false) {
      //   localStorage.removeItem('e_aseg');
      //   localStorage.removeItem('v_aseg');
      //   // Para crear
      //   localStorage.removeItem(this.localStorage_selectedGoods);
      //   localStorage.removeItem(this.localStorage_goodData3);
      //   localStorage.removeItem(this.localStorage_totalGoods3);
      //   // Para liberar
      //   localStorage.removeItem(this.localStorage_selectedGoods2);
      //   localStorage.removeItem(this.localStorage_goodData4);
      //   localStorage.removeItem(this.localStorage_totalGoods4);
      // }
    }, 200);
    this.reviewLocalStorage();
    // setTimeout(() => {
    //   this.formScan.get('scanningFoli').setValue(null);
    //   this.formScan.get('scanningFoli').updateValueAndValidity();
    //   this.showScanForm = true; // Mostrar parte de escaneo
    // }, 200);
  }

  reviewLocalStorage() {
    // let f_aseg = localStorage.getItem('f_aseg');
    // let e_aseg = localStorage.getItem('e_aseg');
    // let v_aseg = localStorage.getItem('v_aseg');
    // console.log('LOCALSTORAGE ', f_aseg, e_aseg, v_aseg);
    // let valid = true;
    // if (this.notificationData == null) {
    //   valid = false;
    // } else {
    //   if (this.notificationData.expedientNumber) {
    //     if (e_aseg != this.notificationData.expedientNumber.toString()) {
    //       valid = false;
    //     }
    //   }
    //   if (this.notificationData.wheelNumber) {
    //     if (v_aseg != this.notificationData.wheelNumber.toString()) {
    //       valid = false;
    //     }
    //   }
    // }
    // if (valid == false) {
    // localStorage.removeItem('f_aseg');
    // localStorage.removeItem('e_aseg');
    // localStorage.removeItem('v_aseg');
    // // Para crear
    // localStorage.removeItem(this.localStorage_selectedGoods);
    // localStorage.removeItem(this.localStorage_goodData3);
    // localStorage.removeItem(this.localStorage_totalGoods3);
    // // Para liberar
    // localStorage.removeItem(this.localStorage_selectedGoods2);
    // localStorage.removeItem(this.localStorage_goodData4);
    // localStorage.removeItem(this.localStorage_totalGoods4);
    this.showScanForm = false;
    this.universalFolio = null;
    this.formScan.get('scanningFoli').setValue(null);
    setTimeout(() => {
      this.formScan.get('scanningFoli').updateValueAndValidity();
      // this.showScanForm = true;
      this.getFolioDocument();
    }, 200);
    // } else {
    // Para crear
    // let _selectedGoods = localStorage.getItem(
    //   this.localStorage_selectedGoods
    // );
    // let _goodData3 = localStorage.getItem(this.localStorage_goodData3);
    // let _totalGoods3 = localStorage.getItem(this.localStorage_totalGoods3);
    // if (_selectedGoods) {
    //   this.selectedGoods = JSON.parse(_selectedGoods);
    // }
    // if (_goodData3) {
    //   this.goodData3 = JSON.parse(_goodData3);
    // }
    // if (_totalGoods3) {
    //   this.totalGoods3 = JSON.parse(_totalGoods3);
    // }
    // this.updatePaginatedTable3();
    // // Para liberar
    // let _selectedGoods2 = localStorage.getItem(
    //   this.localStorage_selectedGoods2
    // );
    // let _goodData4 = localStorage.getItem(this.localStorage_goodData4);
    // let _totalGoods4 = localStorage.getItem(this.localStorage_totalGoods4);
    // if (_selectedGoods2) {
    //   this.goodsValid = JSON.parse(_selectedGoods2);
    // }
    // if (_goodData4) {
    //   this.goodData4 = JSON.parse(_goodData4);
    // }
    // if (_totalGoods4) {
    //   this.totalGoods4 = JSON.parse(_totalGoods4);
    // }
    // this.updatePaginatedTable4();
    // console.log('LOCALSTORAGE PASS VALID ', f_aseg, e_aseg, v_aseg);
    // this.showScanForm = false;
    // this.universalFolio = f_aseg ? Number(f_aseg) : null;
    // this.formScan.get('scanningFoli').setValue(f_aseg);
    // setTimeout(() => {
    //   this.formScan.get('scanningFoli').updateValueAndValidity();
    //   this.showScanForm = true;
    // }, 200);
    // }
  }

  getFolioDocument() {
    const params = new FilterParams();
    params.addFilter('flyerNumber', this.notificationData.wheelNumber);
    // params.addFilter('scanStatus', 'ESCANEADO');
    // params.addFilter('keyTypeDocument', 'ASEGEXTDOM');
    // params.addFilter('id', this.universalFolio);
    this.hideError();
    return this.documentsService.getAllFilter(params.getParams()).subscribe({
      next: data => {
        console.log('FOLIO DATA DATA ', data);
        this.universalFolio = Number(data.data[0].id);
        this.formScan.get('scanningFoli').setValue(data.data[0].id);
        setTimeout(() => {
          this.formScan.get('scanningFoli').updateValueAndValidity();
          this.showScanForm = true;
        }, 200);
      },
      error: error => {
        console.log(error);
        if (error.status >= 500) {
          this.alert(
            'error',
            'Ocurrió un Error al Obtener el Folio de Escaneo',
            ''
          );
        }
        this.showScanForm = true;
      },
    });
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
    params.addFilter('userfree', SearchFilter.NULL, SearchFilter.NULL);
    params.addFilter('datefree', SearchFilter.NULL, SearchFilter.NULL);
    params.limit = this.dataTableParams2.value.limit;
    params.page = this.dataTableParams2.value.page;
    this.svGoodsProcessValidationExtdomService
      .getHistoryGood(params.getParams())
      .subscribe({
        next: res => {
          console.log('GOODS 2 ', res);
          this.loadingGoods2 = false;
          let data = res.data.map((i: any) => {
            i.goods['register_type'] = this.registerExistType;
            i.goods['dateChange'] = i.dateChange;
            i.goods['datefree'] = i.datefree;
            i.goods['goodNumber'] = i.goodNumber;
            i.goods['invoiceUnivChange'] = i.invoiceUnivChange;
            i.goods['invoiceUnivfree'] = i.invoiceUnivfree;
            i.goods['proceedingsNumber'] = i.proceedingsNumber;
            i.goods['processExtSun'] = i.processExtSun;
            i.goods['recordNumber'] = i.recordNumber;
            i.goods['userChange'] = i.userChange;
            i.goods['userfree'] = i.userfree;
            const index2: number = this.goodsValid.findIndex(
              (_good: IGood) => _good.goodId == i.goods.goodId
            );
            if (index2 > -1) {
              i.goods['disponible'] = this.blockLabel;
              i.goods['seleccion'] = 0;
              return i.goods;
            } else {
              i.goods['disponible'] = this.freeLabel;
              i.goods['seleccion'] = 0;
              return i.goods;
            }
            // i = { i, ...i.goods };
            // return i;
          });
          console.log(data);
          this.totalGoods2 = res.count;
          // this.dataTable2.load(res.data);
          this.dataTable2.load(data);
          this.dataTable2.refresh();
          this.goodData2 = data;
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
    if (this.selectedGoods.length == 0) {
      this.alert(
        'warning',
        'Se Requiere Seleccionar por lo Menos un Bien de la Tabla ' +
          this.nameTable1,
        ''
      );
      return;
    }
    if (this.universalFolio == null) {
      this.alert(
        'warning',
        'No se puede Continuar con el Proceso',
        'Se Requiere un Folio de Escaneo con Documentos Previamente Cargados'
      );
      return;
    }
    this.loadingProcess = true;
    const params = new FilterParams();
    params.addFilter('id', this.universalFolio);
    params.addFilter('scanStatus', 'ESCANEADO');
    this.documentsService.getAllFilter(params.getParams()).subscribe({
      next: resp => {
        this.loadingProcess = false;
        console.log(resp);

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
        this.afterAddSelect();
        // setTimeout(() => {
        //   localStorage.setItem(
        //     this.localStorage_selectedGoods,
        //     JSON.stringify(this.selectedGoods)
        //   );
        //   localStorage.setItem(
        //     this.localStorage_goodData3,
        //     JSON.stringify(this.goodData3)
        //   );
        //   localStorage.setItem(
        //     this.localStorage_totalGoods3,
        //     JSON.stringify(this.totalGoods3)
        //   );
        //   // Update data table bienes
        //   this.dataTable.load(this.goodData);
        //   this.dataTable.refresh();
        //   this.loadingGoods = false; // Detener loading de tabla bienes
        //   this.loadingGoods3 = false; // Detener loading de tabla a procesar
        //   this.updatePaginatedTable3();
        // }, 500);
      },
      error: error => {
        this.loadingProcess = false;
        console.log(error);
        if (error.status >= 500) {
          this.alert(
            'error',
            'Ocurrió un error al validar los Documentos relacionados al Folio Universal',
            ''
          );
        } else {
          this.alert(
            'warning',
            'No se puede Continuar con el Proceso',
            'Se Requiere un Folio de Escaneo con Documentos Previamente Cargados'
          );
        }
      },
    });
  }

  afterAddSelect() {
    setTimeout(() => {
      // localStorage.setItem(
      //   this.localStorage_selectedGoods,
      //   JSON.stringify(this.selectedGoods.slice(0, 100))
      // );
      // localStorage.setItem(
      //   this.localStorage_goodData3,
      //   JSON.stringify(this.goodData3.slice(0, 100))
      // );
      // localStorage.setItem(
      //   this.localStorage_totalGoods3,
      //   JSON.stringify(this.totalGoods3 > 100 ? 100 : this.totalGoods3)
      // );
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
    if (this.selectedDeleteGoods.length == 0) {
      this.alert(
        'warning',
        'Se Requiere Seleccionar por lo Menos un Bien de la Tabla ' +
          this.nameTable2,
        ''
      );
      return;
    }
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
      // localStorage.setItem(
      //   this.localStorage_selectedGoods,
      //   JSON.stringify(this.selectedGoods)
      // );
      // localStorage.setItem(
      //   this.localStorage_goodData3,
      //   JSON.stringify(this.goodData3)
      // );
      // localStorage.setItem(
      //   this.localStorage_totalGoods3,
      //   JSON.stringify(this.totalGoods3)
      // );
      // Update data table bienes
      // this.dataTable.load(this.goodData);
      // this.dataTable.refresh();
      this.dataTableParams
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.loadGoods());
      this.loadingGoods = false; // Detener loading de tabla bienes
      this.loadingGoods3 = false; // Detener loading de tabla a procesar
      this.updatePaginatedTable3();
    }, 500);
  }

  async addAll() {
    console.log('Agregar Todos');
    if (this.goodData.length == 0) {
      this.alert(
        'warning',
        'Sin Bienes Para Continuar',
        'Se Requiere por lo Menos un Bien de la Tabla ' + this.nameTable1
      );
      return;
    }
    let confirm = await this.alertQuestion(
      'question',
      'Agregar TODOS los Bienes',
      'Se van a Agregar TODOS los Bienes de ' +
        this.nameTable1 +
        ' a ' +
        this.nameTable2 +
        '. ¿Deseas continuar?'
    );
    if (confirm.isConfirmed == false) {
      return;
    }
    if (this.universalFolio == null) {
      this.alert(
        'warning',
        'No se puede Continuar con el Proceso',
        'Se Requiere un Folio de Escaneo con Documentos Previamente Cargados'
      );
      return;
    }
    this.loadingProcess = true;
    const params = new FilterParams();
    params.addFilter('id', this.universalFolio);
    params.addFilter('scanStatus', 'ESCANEADO');
    this.documentsService.getAllFilter(params.getParams()).subscribe({
      next: resp => {
        this.loadingProcess = false;
        console.log(resp);
        this.startLoopGoods();
      },
      error: error => {
        this.loadingProcess = false;
        console.log(error);
        if (error.status >= 500) {
          this.alert(
            'error',
            'Ocurrió un error al validar los Documentos relacionados al Folio Universal',
            ''
          );
        } else {
          this.alert(
            'warning',
            'No se puede Continuar con el Proceso',
            'Se Requiere un Folio de Escaneo con Documentos Previamente Cargados'
          );
        }
      },
    });
  }

  async removeAll() {
    console.log('Eliminar Todos');
    if (this.goodData3.length == 0) {
      this.alert(
        'warning',
        'Sin Bienes Para Continuar',
        'La Tabla ' + this.nameTable2 + ' NO Tiene Bienes'
      );
      return;
    }
    let confirm = await this.alertQuestion(
      'question',
      'Eliminar los Bienes',
      'Se van a Eliminar TODOS los Bienes de la Tabla ' +
        this.nameTable2 +
        '. ¿Deseas continuar?'
    );
    if (confirm.isConfirmed == false) {
      return;
    }
    this.loadingGoods = true; // Iniciar loading de tabla bienes
    this.loadingGoods3 = true; // Iniciar loading de tabla a procesar
    for (let index = 0; index < this.goodData.length; index++) {
      this.goodData[index].disponible = this.freeLabel; // Cambiar a no disponible
      this.goodData[index].seleccion = 0; // Quitar el check del registro
    }
    this.selectedDeleteGoods = [];
    this.selectedGoods = [];
    this.goodData3 = [];
    this.totalGoods3 = 0;
    this.dataTableParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.loadGoods());
    this.loadingGoods = false; // Detener loading de tabla bienes
    this.loadingGoods3 = false; // Detener loading de tabla a procesar
    this.updatePaginatedTable3();
  }

  addSelectFree() {
    console.log('Agregar');
    if (this.goodsValid.length == 0) {
      this.alert(
        'warning',
        'Se Requiere Seleccionar por lo Menos un Bien de la Tabla ' +
          this.nameTable3,
        ''
      );
      return;
    }
    if (this.universalFolio == null) {
      this.alert(
        'warning',
        'No se puede Continuar con el Proceso',
        'Se Requiere un Folio de Escaneo con Documentos Previamente Cargados'
      );
      return;
    }
    this.loadingProcess = true;
    const params = new FilterParams();
    params.addFilter('id', this.universalFolio);
    params.addFilter('scanStatus', 'ESCANEADO');
    this.documentsService.getAllFilter(params.getParams()).subscribe({
      next: resp => {
        this.loadingProcess = false;
        console.log(resp);
        this.loadingGoods2 = true; // Iniciar loading de tabla bienes
        this.loadingGoods4 = true; // Iniciar loading de tabla a procesar
        this.goodsValid.forEach((data: IGood | any, count: number) => {
          // VALIDAR QUE NO EXISTA YA EN LA TABLA A PROCESAR
          const index3: number = this.goodData4.findIndex(
            (_good: IGood) => _good.goodId == data.goodId
          );
          console.log('INDICE 3 ADD SELECT ', index3);
          if (index3 == -1) {
            this.goodData4.push({
              ...data,
              register_type: this.registerExistType,
            }); // Agregar registro a la data
            this.totalGoods4++; // Aumentar si se agrego registro
            // VALIDAR CON LA DATA DEL ENDPOINT IGUAL
            const index2: number = this.goodData2.findIndex(
              (_good: IGood) => _good.goodId == data.goodId
            );
            if (index2 > -1) {
              this.goodData2[index2].disponible = this.blockLabel; // Cambiar a no disponible
              this.goodData2[index2].seleccion = 0; // Quitar el check del registro
            }
          }
        });
        setTimeout(() => {
          console.log(
            ' LISTADOS ###### ',
            this.goodsValid,
            this.goodData4,
            this.totalGoods4,
            this.goodData2
          );
          // localStorage.setItem(
          //   this.localStorage_selectedGoods2,
          //   JSON.stringify(this.goodsValid)
          // );
          // localStorage.setItem(
          //   this.localStorage_goodData4,
          //   JSON.stringify(this.goodData4)
          // );
          // localStorage.setItem(
          //   this.localStorage_totalGoods4,
          //   JSON.stringify(this.totalGoods4)
          // );
          // Update data table bienes
          this.dataTable2.load(this.goodData2);
          this.dataTable2.refresh();
          this.loadingGoods2 = false; // Detener loading de tabla bienes
          this.loadingGoods4 = false; // Detener loading de tabla a procesar
          this.updatePaginatedTable4();
        }, 500);
      },
      error: error => {
        this.loadingProcess = false;
        console.log(error);
        if (error.status >= 500) {
          this.alert(
            'error',
            'Ocurrió un error al validar los Documentos relacionados al Folio Universal',
            ''
          );
        } else {
          this.alert(
            'warning',
            'No se puede Continuar con el Proceso',
            'Se Requiere un Folio de Escaneo con Documentos Previamente Cargados'
          );
        }
      },
    });
  }

  removeSelectFree() {
    console.log('Eliminar');
    if (this.selectedDeletedGoodsValid.length == 0) {
      this.alert(
        'warning',
        'Se Requiere Seleccionar por lo Menos un Bien de la Tabla ' +
          this.nameTable4,
        ''
      );
      return;
    }
    this.loadingGoods2 = true; // Iniciar loading de tabla bienes
    this.loadingGoods4 = true; // Iniciar loading de tabla a procesar
    let removeSelectedGoods: number[] = []; // Guardar contadores para eliminar del listado de seleccion
    let removeGoodsSelected: number[] = []; // Guardar contadores para eliminar del listado de elimnar seleccion
    this.selectedDeletedGoodsValid.forEach(
      (data: IGood | any, count: number) => {
        // VALIDAR QUE EXISTA YA EN EL LISTADO DE SELECCIONADOS
        const index1: number = this.goodData4.findIndex(
          (_good: IGood) => _good.goodId == data.goodId
        );
        console.log('INDICE 1 DELETE SELECT ', index1);
        if (index1 > -1) {
          this.goodData4.splice(index1, 1); // Eliminar registro del arreglo
          this.totalGoods4--; // Dismunuye si se quito el registro
          // VALIDAR CON LA DATA DEL ENDPOINT IGUAL
          const index3: number = this.goodData2.findIndex(
            (_good: IGood) => _good.goodId == data.goodId
          );
          if (index3 > -1) {
            this.goodData2[index3].disponible = this.freeLabel; // Cambiar disponible
            this.goodData2[index3].seleccion = 0; // Quitar el check del registro
          }
          const index4: number = this.goodsValid.findIndex(
            (_good: IGood) => _good.goodId == data.goodId
          );
          if (index4 > -1) {
            removeSelectedGoods.push(index4); // Guardar posicion para eliminar los seleccionados
          }
          const index2: number = this.selectedDeletedGoodsValid.findIndex(
            (_good: IGood) => _good.goodId == data.goodId
          );
          if (index2 > -1) {
            removeGoodsSelected.push(index2); // Guardar posicion para eliminar los seleccionados
          }
        }
      }
    );
    setTimeout(() => {
      console.log('REMOVE FROM ARRAY DELETE ', removeGoodsSelected);
      if (removeGoodsSelected.length > 0) {
        removeGoodsSelected.forEach(elementCount => {
          this.selectedDeletedGoodsValid.splice(elementCount, 1); // Eliminar registro del arreglo
        });
      }
      console.log('REMOVE FROM ARRAY SELECTED', removeSelectedGoods);
      if (removeSelectedGoods.length > 0) {
        removeSelectedGoods.forEach(elementCount => {
          this.goodsValid.splice(elementCount, 1); // Eliminar registro del arreglo
        });
      }
      console.log(
        'LISTADOS DE SELECCIONADOS ###########',
        this.goodsValid,
        this.selectedDeletedGoodsValid,
        this.goodData4,
        this.goodData2
      );
      // localStorage.setItem(
      //   this.localStorage_selectedGoods2,
      //   JSON.stringify(this.goodsValid)
      // );
      // localStorage.setItem(
      //   this.localStorage_goodData4,
      //   JSON.stringify(this.goodData4)
      // );
      // localStorage.setItem(
      //   this.localStorage_totalGoods4,
      //   JSON.stringify(this.totalGoods4)
      // );
      // Update data table bienes
      // this.dataTable2.load(this.goodData2);
      // this.dataTable2.refresh();
      this.dataTableParams2
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.loadGoods2());
      this.loadingGoods2 = false; // Detener loading de tabla bienes
      this.loadingGoods4 = false; // Detener loading de tabla a procesar
      this.updatePaginatedTable4();
    }, 500);
  }

  async addAllFree() {
    console.log('Agregar Todos');
    if (this.goodData2.length == 0) {
      this.alert(
        'warning',
        'Sin Bienes Para Continuar',
        'Se Requiere por lo Menos un Bien de la Tabla ' + this.nameTable3
      );
      return;
    }
    let confirm = await this.alertQuestion(
      'question',
      'Agregar TODOS los Bienes',
      'Se van a Agregar TODOS los Bienes de ' +
        this.nameTable3 +
        ' a ' +
        this.nameTable4 +
        '. ¿Deseas continuar?'
    );
    if (confirm.isConfirmed == false) {
      return;
    }
    if (this.universalFolio == null) {
      this.alert(
        'warning',
        'No se puede Continuar con el Proceso',
        'Se Requiere un Folio de Escaneo con Documentos Previamente Cargados'
      );
      return;
    }
    this.loadingProcess = true;
    const params = new FilterParams();
    params.addFilter('id', this.universalFolio);
    params.addFilter('scanStatus', 'ESCANEADO');
    this.documentsService.getAllFilter(params.getParams()).subscribe({
      next: resp => {
        this.loadingProcess = false;
        console.log(resp);
        this.startLoopGoodsFree();
      },
      error: error => {
        this.loadingProcess = false;
        console.log(error);
        if (error.status >= 500) {
          this.alert(
            'error',
            'Ocurrió un error al validar los Documentos relacionados al Folio Universal',
            ''
          );
        } else {
          this.alert(
            'warning',
            'No se puede Continuar con el Proceso',
            'Se Requiere un Folio de Escaneo con Documentos Previamente Cargados'
          );
        }
      },
    });
  }

  async removeAllFree() {
    console.log('Eliminar Todos');
    if (this.goodData4.length == 0) {
      this.alert(
        'warning',
        'Sin Bienes Para Continuar',
        'La Tabla ' + this.nameTable4 + ' NO Tiene Bienes'
      );
      return;
    }
    let confirm = await this.alertQuestion(
      'question',
      'Eliminar los Bienes',
      'Se van a Eliminar TODOS los Bienes de la Tabla ' +
        this.nameTable4 +
        '. ¿Deseas continuar?'
    );
    if (confirm.isConfirmed == false) {
      return;
    }
    this.loadingGoods2 = true; // Iniciar loading de tabla bienes
    this.loadingGoods4 = true; // Iniciar loading de tabla a procesar
    for (let index = 0; index < this.goodData2.length; index++) {
      this.goodData2[index].disponible = this.freeLabel; // Cambiar a no disponible
      this.goodData2[index].seleccion = 0; // Quitar el check del registro
    }
    this.goodsValid = [];
    this.selectedDeletedGoodsValid = [];
    this.goodData4 = [];
    this.totalGoods4 = 0;
    this.dataTableParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.loadGoods2());
    this.loadingGoods2 = false; // Detener loading de tabla bienes
    this.loadingGoods4 = false; // Detener loading de tabla a procesar
    this.updatePaginatedTable4();
  }

  btnEjecutarCambios() {
    console.log('EjecutarCambios');
    this.executionType = 'X';
    this.errorsCount = 0;
    // -- Verificamos si en el bloque existen registros nuevos
    if (this.selectedGoods.length > 0) {
      this.executionType = this.registerType;
    }
    if (this.executionType == 'X') {
      // -- Verificamos si en el bloque existen registros para liberar
      if (this.goodsValid.length > 0) {
        this.executionType = this.registerExistType;
      }
    }
    if (this.executionType == 'X') {
      this.alert('warning', 'No Existen Cambios para Ejecutar', '');
      return;
    } else if (this.executionType == this.registerType) {
      this.confirmMessageValidFolio(
        // 'Se identificó que existen nuevos bienes, sólo se aplicará el cambio de Proceso a ASEG_EXTDOM. ¿Quiere continuar con el proceso?',
        'Existen Nuevos Bienes',
        'Aplicar el Cambio de Proceso a ASEG_EXTDOM. ¿Desea Continuar con el Proceso?'
      );
    } else if (this.executionType == this.registerExistType) {
      this.confirmMessageValidFolio(
        'Se Identificó que Existen Bienes para Liberar',
        'Se Aplicará el Cambio para Liberación. ¿Quiere Continuar con el Proceso?'
      );
    }
  }

  confirmMessageValidFolio(message: string, folioMessage: string) {
    this.alertQuestion('question', message, folioMessage).then(response => {
      if (response.isConfirmed) {
        if (!this.universalFolio) {
          this.alert(
            'warning',
            'Sin Folio de Escaneo',
            'No Existe Folio de Escaneo, Favor de Generar un Folio de Escaneo'
          );
          return;
        } else {
          this.loadingProcess = true;
          this.validDocumentsByFolio(); // Validar documentos relacionados al folio
        }
      }
    });
  }

  validDocumentsByFolio() {
    this.getDocumentsCount().subscribe(count => {
      console.log('COUNT ', count);
      if (count == 0) {
        this.loadingProcess = false;
        this.alert(
          'warning',
          'El Folio Universal no Existe',
          'NO se Han Agregado Imágenes o NO Corresponde a "Admisión de Demanda de Extinción de Dominio"'
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
    console.log(
      'startLoopSelectedGoods ',
      this.errorsCount,
      this.countSelectedGoods,
      this.selectedGoods
    );
    this.updateGoods(false);
  }

  continueLoopSelectedGoods() {
    this.countSelectedGoods++;
    if (this.selectedGoods[this.countSelectedGoods]) {
      this.updateGoods(false);
    } else {
      this.removeSelect(); // Quitar los registros procesados
      this.loadingProcess = false;
      this.reloadPage();
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
      this.removeSelectFree(); // Quitar los registros procesados
      this.loadingProcess = false;
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
      extDomProcess:
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
          this.selectedDeletedGoodsValid.push(
            this.goodsValid[this.countGoodsValid]
          ); // Guardar registros a eliminar terminando el proceso
          this.continueLoopGoodsValid();
        }
      },
      error: error => {
        console.log(error);
        if (onlyUpdate == false) {
          this.errorsCount++;
          // this.countSelectedGoods++;
          this.continueLoopSelectedGoods();
        } else {
          this.errorsCount++;
          // this.countGoodsValid++;
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
          this.selectedDeleteGoods.push(
            this.selectedGoods[this.countSelectedGoods]
          ); // Guardar registros a eliminar terminando el proceso
          this.continueLoopSelectedGoods();
        },
        error: error => {
          // this.countSelectedGoods++;
          this.errorsCount++;
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
      this.goodsValid[this.countGoodsValid].goodId
    );
    params.addFilter('userfree', SearchFilter.NULL, SearchFilter.NULL);
    params.addFilter('datefree', SearchFilter.NULL, SearchFilter.NULL);
    params.limit = this.dataTableParams2.value.limit;
    params.page = this.dataTableParams2.value.page;
    this.svGoodsProcessValidationExtdomService
      .getHistoryGood(params.getParams())
      .subscribe({
        next: res => {
          console.log('GET GOOD HISTORIAL', res);
          let body: Partial<IHistoricGoodsAsegExtdom> = {
            proceedingsNumber: this.goodsValid[this.countGoodsValid].fileNumber,
            goodNumber: this.goodsValid[this.countGoodsValid].goodId,
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
                // this.countGoodsValid++;
                this.errorsCount++;
                console.log(error);
                this.continueLoopGoodsValid();
                // this.alert('error', 'Error al Actualizar el Estatus del Bien', '');
              },
            });
        },
        error: error => {
          // this.countGoodsValid++;
          this.errorsCount++;
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
    this.loadingProcess = true;
    const params = new FilterParams();
    params.addFilter('id', this.universalFolio);
    params.addFilter('scanStatus', 'ESCANEADO');
    this.documentsService.getAllFilter(params.getParams()).subscribe({
      next: resp => {
        this.loadingProcess = false;
        console.log(resp);
        // NOTIFICACIONES.RESERVADO
        this.showReservedForm = true;
      },
      error: error => {
        console.log(error);
        this.loadingProcess = false;
        if (error.status >= 500) {
          this.alert(
            'error',
            'Ocurrió un error al validar los Documentos relacionados al Folio Universal',
            ''
          );
        } else {
          if (['13', '14'].includes(this.form.get('affairKey').value)) {
            this.alert('warning', 'Se debe ingresar el Folio de Escaneo', '');
          } else {
            this.alert(
              'warning',
              'Se Requieren Documentos Cargados a este Folio: ' +
                this.universalFolio,
              ''
            );
          }
        }
      },
    });
  }
  closeApplyReserved() {
    this.showReservedForm = false;
  }
  cleanReserved() {
    this.formReserved.get('reserved').reset();
  }
  applyReserved() {
    if (this.formReserved.invalid) {
      this.alert('warning', 'Complete el Campo Reservado Correctamente', '');
      return;
    }
    // if (this.P_NO_TRAMITE == null) {
    //   this.alert(
    //     'warning',
    //     'Se Requiere un Número de Trámite para Continuar con este Proceso',
    //     ''
    //   );
    //   return;
    // }
    let bodyNotification: Partial<INotification> = {
      dictumKey: 'CONOCIMIENTO',
      wheelNumber: this.notificationData.wheelNumber,
      reserved: this.formReserved.value.reserved,
    };
    this.svGoodsProcessValidationExtdomService
      .updateNotification(this.notificationData.wheelNumber, bodyNotification)
      .subscribe({
        next: data => {
          console.log('UPDATE NOTIFICATION ', data);
          if (this.P_NO_TRAMITE == null) {
            this.closeApplyReserved();
            this.openModalMail();
          } else {
            // GESTION TRAMITE UPDATE
            let body: Partial<IProceduremanagement> = {
              id: this.P_NO_TRAMITE,
              status: 'FNI',
            };
            this.svGoodsProcessValidationExtdomService
              .updateProcedureManagement(this.P_NO_TRAMITE, body)
              .subscribe({
                next: data => {
                  console.log('UPDATE GESTION TRAMITE DATA ', data);
                  this.closeApplyReserved();
                  this.openModalMail();
                },
                error: error => {
                  console.log(error);
                  this.alert(
                    'error',
                    'Ocurrió un Error al Actualizar el Estatus del Trámite',
                    ''
                  );
                },
              });
          }
        },
        error: error => {
          console.log(error);
          this.alert(
            'error',
            'Ocurrió un Error al Actualizar la Clave del Dictamen de la Notificación',
            ''
          );
        },
      });
  }
  btnEnvioCorreos() {
    if (this.notificationData == null) {
      this.alert('warning', 'Realice una búsqueda para ver está opción', '');
      return;
    }
    if (this.notificationData.wheelNumber == null) {
      this.alert('warning', 'Se requiere de un Volante', '');
      return;
    }
    if (this.notificationData.expedientNumber == null) {
      this.alert('warning', 'Se requiere de un Expediente', '');
      return;
    }
    this.openModalMail();
  }
  btnMantenimientoCorreo() {
    if (this.notificationData == null) {
      this.alert('warning', 'Realice una búsqueda para ver está opción', '');
      return;
    }
    if (this.notificationData.wheelNumber == null) {
      this.alert('warning', 'Se requiere de un Volante/Expediente', '');
      return;
    }
    this.router.navigate(['/pages/parameterization/mail'], {
      queryParams: {
        origin: this.screenKey,
        origin2: this.origin ? this.origin : null,
        P_CVE_PANTALLA: this.screenKey,
        P_NO_TRAMITE: this.newSearch == false ? this.P_NO_TRAMITE : null,
        P_GEST_OK: this.newSearch == false ? this.P_GEST_OK : null,
        P_VOLANTE: this.P_VOLANTE
          ? this.P_VOLANTE
          : this.notificationData.wheelNumber,
        P_EXPEDIENTE: this.P_EXPEDIENTE
          ? this.P_EXPEDIENTE
          : this.notificationData.expedientNumber,
      },
    });
  }
  changeFolio(event: any) {
    console.log(event);
    if (event) {
      this.formScan.get('scanningFoli').setValue(event);
      this.universalFolio = event;
    } else {
      this.formScan.get('scanningFoli').setValue(null);
      this.universalFolio = null;
    }
  }
  scanRequest(event: any) {
    console.log(event);
    if (event == true) {
      this.confirmScanRequest();
    }
  }
  async confirmScanRequest() {
    const response = await this.alertQuestion(
      'question',
      'Se Generará un Nuevo Folio de Escaneo para el Amparo',
      '¿Deseas Continuar?'
    );

    if (!response.isConfirmed) {
      return;
    }

    const expedient = this.notificationData.expedientNumber;
    if (!expedient) {
      this.alert(
        'error',
        'Error',
        'Al Localizar la Información de Volante: ' +
          this.notificationData.wheelNumber +
          ' y Expediente: ' +
          expedient
      );
      return;
    }
    const document = {
      numberProceedings: this.notificationData.expedientNumber,
      keySeparator: '60',
      keyTypeDocument: 'ASEGEXTDOM', //'AMPA',
      natureDocument: 'ORIGINAL',
      descriptionDocument: `Validación ASEG_EXTDOM EXPEDIENTE ${this.notificationData.expedientNumber}`, //`AMPARO EXPEDIENTE ${this.notificationData.expedientNumber}`, // Clave de Oficio Armada
      significantDate: format(new Date(), 'MM-yyyy'),
      scanStatus: 'SOLICITADO',
      userRequestsScan:
        this.dataUserLogged.user == 'SIGEBIADMON'
          ? this.dataUserLogged.user.toLocaleLowerCase()
          : this.dataUserLogged.user,
      scanRequestDate: new Date(),
      numberDelegationRequested: this.dataUserLogged.delegationNumber,
      numberSubdelegationRequests: this.dataUserLogged.subdelegationNumber,
      numberDepartmentRequest: this.dataUserLogged.departamentNumber,
      flyerNumber: this.notificationData.wheelNumber,
    };

    this.createDocument(document)
      .pipe(
        tap(_document => {
          this.formScan.get('scanningFoli').setValue(_document.id);
          this.universalFolio = Number(_document.id);
          // localStorage.setItem('f_aseg', '' + _document.id);
          // localStorage.setItem('e_aseg', '' + document.numberProceedings);
          // localStorage.setItem('v_aseg', '' + document.flyerNumber);
        }),
        switchMap(_document => this.generateScanRequestReport())
      )
      .subscribe();
  }

  createDocument(document: IDocuments) {
    return this.documentsService.create(document).pipe(
      tap(_document => {
        // END PROCESS
      }),
      catchError(error => {
        this.onLoadToast(
          'error',
          'Ocurrió un Error al Generar la Solicitud',
          ''
        );
        return throwError(() => error);
      })
    );
  }

  generateScanRequestReport() {
    const pn_folio = this.formScan.get('scanningFoli').value;
    return this.siabService.fetchReport('RGERGENSOLICDIGIT', { pn_folio }).pipe(
      catchError(error => {
        console.log(error);
        return throwError(() => error);
      }),
      tap(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      })
    );
  }

  showScanningPage(event: any) {
    console.log(event);
    if (event == true) {
      if (this.formScan.get('scanningFoli').value && this.universalFolio) {
        this.alertQuestion(
          'question',
          'Abrir Escaneo y Digitalizacion de Documentos',
          '¿Deseas continuar?',
          'Aceptar',
          'Cancelar'
        ).then(res => {
          console.log(res);
          if (res.isConfirmed) {
            this.router.navigate(['/pages/general-processes/scan-documents'], {
              queryParams: {
                origin: this.screenKey,
                folio: this.formScan.get('scanningFoli').value,
                origin2: this.origin ? this.origin : null,
                P_NO_TRAMITE:
                  this.newSearch == false ? this.P_NO_TRAMITE : null,
                P_GEST_OK: this.newSearch == false ? this.P_GEST_OK : null,
                P_VOLANTE: this.P_VOLANTE
                  ? this.P_VOLANTE
                  : this.notificationData.wheelNumber,
                P_EXPEDIENTE: this.P_EXPEDIENTE
                  ? this.P_EXPEDIENTE
                  : this.notificationData.expedientNumber,
              },
            });
          }
        });
      } else {
        this.alertInfo(
          'warning',
          'No tiene Folio de Escaneo para Continuar a la Pantalla de Escaneo',
          ''
        );
      }
    }
  }
  messageDigitalization(event: any) {
    console.log(event);
    if (event == true) {
      if (this.formScan.get('scanningFoli').value && this.universalFolio) {
        const pn_folio = this.formScan.get('scanningFoli').value;
        console.log(pn_folio);
        this.siabService
          .fetchReport('RGERGENSOLICDIGIT', { pn_folio })
          .subscribe(response => {
            console.log(response);
            if (response !== null) {
              const blob = new Blob([response], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              let config = {
                initialState: {
                  documento: {
                    urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                    type: 'pdf',
                  },
                  callback: (data: any) => {},
                },
                class: 'modal-lg modal-dialog-centered',
                ignoreBackdropClick: true,
              };
              this.modalService.show(PreviewDocumentsComponent, config);
            } else {
              this.alert('warning', 'Reporte no disponible por el momento', '');
            }
          });
      } else {
        this.alertInfo(
          'warning',
          'No tiene Folio de Escaneo para Imprimir',
          ''
        );
      }
    }
  }

  viewPictures(event: any) {
    console.log(event);
    if (event == true) {
      if (this.formScan.get('scanningFoli').value && this.universalFolio) {
        this.getDocumentsByFlyer();
      } else {
        this.alertInfo(
          'warning',
          'No Tiene Folio de Escaneo para Visualizar',
          ''
        );
      }
    }
  }

  getDocumentsByFlyer() {
    const title = 'Folios Relacionados al Expediente';
    const modalRef = this.openDocumentsModal(title);
    modalRef.content.selected
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(document => this.getPicturesFromFolio(document));
  }

  openDocumentsModal(title: string) {
    const params = new FilterParams();
    // params.addFilter('flyerNumber', flyerNum);
    params.addFilter('fileNumber', this.notificationData.expedientNumber);
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
        // wheelNumber: this.notificationData.wheelNumber,
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

  openModalMail() {
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        // userSelected: this.form.value.representanteSAE,
        // message: '',
        dataTypeSelect: {
          expedientNumber: this.notificationData.expedientNumber,
          previous: '',
          wheelNumber: this.notificationData.wheelNumber,
        },
        asunto: 'Aviso de Amparo',
      },
    };
    return this.modalService.show(EmailGoodProcessValidationComponent, config);
  }

  /** LOOP BIENES DISPONIBLES */

  startLoopGoods() {
    this.goodLoopCurrent = 0;
    this.goodLoopPage = 1;
    this.goodLoopTotal = 0;
    this.goodLoopLimit = 100;
    this.goodLoopTmp = [];
    this.goodLoopLoading = true; // Iniciar loading de procesando todos los bienes
    this.loadingGoods = true; // Iniciar loading de tabla bienes
    this.loadingGoods3 = true; // Iniciar loading de tabla a procesar
    this.loopGoods();
  }

  loopGoods() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('fileNumber', this.notificationData.expedientNumber);
    params.addFilter('extDomProcess', 'ASEG_EXTDOM', SearchFilter.NOT);
    params.limit = this.goodLoopLimit;
    params.page = this.goodLoopPage;
    this.svGoodsProcessValidationExtdomService
      .getGoods(params.getParams())
      .subscribe({
        next: res => {
          this.goodLoopTotal = res.count;
          // this.goodLoopTotal = 23;
          let data = res.data.map((i: any) => {
            const index2: number = this.selectedGoods.findIndex(
              (_good: IGood) => _good.goodId == i.goodId
            );
            if (index2 == -1) {
              i['disponible'] = this.freeLabel;
              i['seleccion'] = 0;
              return i;
            } else {
              i['disponible'] = this.blockLabel;
              i['seleccion'] = 0;
              return i;
            }
          });
          this.goodLoopTmp = data;
          this.goodLoopTmp.forEach(element => {
            if (element.disponible == this.freeLabel) {
              let row: IGood = element;
              const index = this.selectedGoods.findIndex(
                _good => _good.goodId == row.goodId
              );
              if (index == -1) {
                this.selectedGoods.push(row);
              }
            }
          });
          this.goodLoopCurrent =
            this.goodLoopCurrent + this.goodLoopLimit > this.goodLoopTotal
              ? this.goodLoopTotal
              : this.goodLoopCurrent + this.goodLoopLimit;
          this.goodLoopPage++; // Next page
          this.controlGoodLoop();
        },
        error: error => {
          console.log(error);
          this.goodLoopCurrent =
            this.goodLoopCurrent + this.goodLoopLimit > this.goodLoopTotal
              ? this.goodLoopTotal
              : this.goodLoopCurrent + this.goodLoopLimit;
          this.goodLoopPage++; // Next page
          this.controlGoodLoop();
        },
      });
  }

  controlGoodLoop() {
    this.goodLoopTmp = [];
    if (this.goodLoopCurrent < this.goodLoopTotal) {
      this.loopGoods();
    } else if ((this.goodLoopCurrent = this.goodLoopTotal)) {
      // FIN PROCESO
      this._endProcess_LooopGood();
    }
  }

  _endProcess_LooopGood() {
    this.goodLoopLoading = false;
    this.selectedGoods.forEach(selected => {
      this.goodData3.push({
        ...selected,
        register_type: this.registerType,
      }); // Agregar registro a la data
      // VALIDAR CON LA DATA DEL ENDPOINT IGUAL
      const index2: number = this.goodData.findIndex(
        (_good: IGood) => _good.goodId == selected.goodId
      );
      if (index2 > -1) {
        this.goodData[index2].disponible = this.blockLabel; // Cambiar a no disponible
        this.goodData[index2].seleccion = 0; // Quitar el check del registro
      }
    });
    console.log('FIN PROCESO', this.selectedGoods, this.goodData3);
    this.totalGoods3 = this.selectedGoods.length; // Aumentar si se agrego registro
    this.afterAddSelect();
  }

  /** LOOP BIENES DISPONIBLES */

  /** LOOP BIENES A LIBERAR */

  startLoopGoodsFree() {
    this.goodLoopFreeCurrent = 0;
    this.goodLoopFreePage = 1;
    this.goodLoopFreeTotal = 0;
    this.goodLoopFreeLimit = 100;
    this.goodLoopFreeTmp = [];
    this.goodLoopFreeLoading = true; // Iniciar loading de procesando todos los bienes
    this.loadingGoods2 = true; // Iniciar loading de tabla bienes
    this.loadingGoods4 = true; // Iniciar loading de tabla a procesar
    this.loopGoodsFree();
  }

  loopGoodsFree() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter(
      'proceedingsNumber',
      this.notificationData.expedientNumber
    );
    params.addFilter('userfree', SearchFilter.NULL, SearchFilter.NULL);
    params.addFilter('datefree', SearchFilter.NULL, SearchFilter.NULL);
    params.limit = this.goodLoopFreeLimit;
    params.page = this.goodLoopFreePage;
    this.svGoodsProcessValidationExtdomService
      .getHistoryGood(params.getParams())
      .subscribe({
        next: res => {
          this.goodLoopFreeTotal = res.count;
          // this.goodLoopFreeTotal = 23;
          // let data = res.data.map((i: any) => {
          //   const index2: number = this.goodsValid.findIndex(
          //     (_good: IGood) => _good.goodId == i.goodId
          //   );
          //   if (index2 == -1) {
          //     i['disponible'] = this.freeLabel;
          //     i['seleccion'] = 0;
          //     return i;
          //   } else {
          //     i['disponible'] = this.blockLabel;
          //     i['seleccion'] = 0;
          //     return i;
          //   }
          // });
          let data = res.data.map((i: any) => {
            i.goods['register_type'] = this.registerExistType;
            i.goods['dateChange'] = i.dateChange;
            i.goods['datefree'] = i.datefree;
            i.goods['goodNumber'] = i.goodNumber;
            i.goods['invoiceUnivChange'] = i.invoiceUnivChange;
            i.goods['invoiceUnivfree'] = i.invoiceUnivfree;
            i.goods['proceedingsNumber'] = i.proceedingsNumber;
            i.goods['processExtSun'] = i.processExtSun;
            i.goods['recordNumber'] = i.recordNumber;
            i.goods['userChange'] = i.userChange;
            i.goods['userfree'] = i.userfree;
            const index2: number = this.goodsValid.findIndex(
              (_good: IGood) => _good.goodId == i.goods.goodId
            );
            if (index2 > -1) {
              i.goods['disponible'] = this.blockLabel;
              i.goods['seleccion'] = 0;
              return i.goods;
            } else {
              i.goods['disponible'] = this.freeLabel;
              i.goods['seleccion'] = 0;
              return i.goods;
            }
          });
          this.goodLoopFreeTmp = data;
          this.goodLoopFreeTmp.forEach(element => {
            if (element.disponible == this.freeLabel) {
              let row: IGood = element;
              const index = this.goodsValid.findIndex(
                _good => _good.goodId == row.goodId
              );
              if (index == -1) {
                this.goodsValid.push(row);
              }
            }
          });
          this.goodLoopFreeCurrent =
            this.goodLoopFreeCurrent + this.goodLoopFreeLimit >
            this.goodLoopFreeTotal
              ? this.goodLoopFreeTotal
              : this.goodLoopFreeCurrent + this.goodLoopFreeLimit;
          this.goodLoopFreePage++; // Next page
          this.controlGoodLoopFree();
        },
        error: error => {
          console.log(error);
          this.goodLoopFreeCurrent =
            this.goodLoopFreeCurrent + this.goodLoopFreeLimit >
            this.goodLoopFreeTotal
              ? this.goodLoopFreeTotal
              : this.goodLoopFreeCurrent + this.goodLoopFreeLimit;
          this.goodLoopFreePage++; // Next page
          this.controlGoodLoopFree();
        },
      });
  }

  controlGoodLoopFree() {
    this.goodLoopFreeTmp = [];
    if (this.goodLoopFreeCurrent < this.goodLoopFreeTotal) {
      this.loopGoodsFree();
    } else if ((this.goodLoopFreeCurrent = this.goodLoopFreeTotal)) {
      // FIN PROCESO
      this._endProcess_LooopGoodFree();
    }
  }

  _endProcess_LooopGoodFree() {
    this.goodLoopFreeLoading = false;
    this.goodsValid.forEach(selected => {
      this.goodData4.push({
        ...selected,
        register_type: this.registerExistType,
      }); // Agregar registro a la data
      // VALIDAR CON LA DATA DEL ENDPOINT IGUAL
      const index2: number = this.goodData2.findIndex(
        (_good: IGood) => _good.goodId == selected.goodId
      );
      if (index2 > -1) {
        this.goodData2[index2].disponible = this.blockLabel; // Cambiar a no disponible
        this.goodData2[index2].seleccion = 0; // Quitar el check del registro
      }
    });
    console.log('FIN PROCESO', this.goodsValid, this.goodData4);
    this.totalGoods4 = this.goodsValid.length; // Aumentar si se agrego registro
    // Update data table bienes
    this.dataTable2.load(this.goodData2);
    this.dataTable2.refresh();
    this.loadingGoods2 = false; // Detener loading de tabla bienes
    this.loadingGoods4 = false; // Detener loading de tabla a procesar
    this.updatePaginatedTable4();
  }

  /** LOOP BIENES A LIBERAR */
}
