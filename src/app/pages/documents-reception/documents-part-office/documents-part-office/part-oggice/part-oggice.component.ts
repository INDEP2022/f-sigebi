import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  map,
  of,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { SatInterfaceService } from 'src/app/core/services/sat-interface/sat-interface.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { DocumentsPartOfficeService } from '../../documents-part-office.service';
//Models
import { IManagementArea } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
/*Redux NgRX Global Vars Service*/
import { BsModalService } from 'ngx-bootstrap/modal';
import { GlobalVarsService } from 'src/app//shared/global-vars/services/global-vars.service';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { HistoryIndicatorService } from 'src/app/core/services/ms-history-indicator/history-indicator.service';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { HistoricalProcedureManagementService } from 'src/app/core/services/ms-procedure-management/historical-procedure-management.service';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { isEmpty } from 'src/app/utils/validations/is-empty';

import { addDays, subDays } from 'date-fns';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { DocumentsPartOfficeModalTableComponent } from '../components/documents-part-office-modal-table/documents-part-office-modal-table.component';
import {
  CONFIRM_CANCEL,
  CONFIRM_FINISH,
  NO_FLYER_NUMBER,
  NO_INDICATORS_FOUND,
} from '../utils/documents-part-office-messages';
import { FLYER_HISTORY_COLUMNS } from '../utils/flyer-history-columns';
import { INDICATORS_HISTORY_COLUMNS } from '../utils/indicators-history-columns';
import {
  ANTECEDENTE_TITLE,
  BIENES_TITLE,
  FLYER_HISTORY_TITLE,
  INDICATORS_HISTORY_TITLE,
  RELATED_FOLIO_TITLE,
} from '../utils/modal-titles';
import { RELATED_FOLIO_COLUMNS } from '../utils/related-folio-columns';
import {
  DOCUMENT_PART_OFFCIE_COLUMNS2,
  WORK_ANTECEDENTES_COLUMNS,
  WORK_BIENES_COLUMNS,
} from './documents-part-office-columns';

import { DomSanitizer } from '@angular/platform-browser';
import { maxDate, minDate } from 'src/app/common/validations/date.validators';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { TurnPaperworkComponent } from '../components/turn-paperwork/turn-paperwork.component';

@Component({
  selector: 'app-part-oggice',
  templateUrl: './part-oggice.component.html',
  styles: [
    `
      form-check .form-control {
        padding-top: -15px !important;
        padding-bottom: -15px !important;
        margin-top: -15px !important;
        margin-bottom: -15px !important;
      }
    `,
  ],
})
export class PartOggiceComponent extends BasePage implements OnInit {
  //TODO: TYPE ALL
  dataTable: LocalDataSource = new LocalDataSource();
  data: any[] = [];
  dataSelect: any = {};

  selectedRow: any = null;
  P_SAT_TIPO_EXP: string = '';
  satTypeProceedings: string = null;
  testurl: any;
  //Filters
  priority$: string = null;

  selectedArea: string;
  //users$: any = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  columnFilters: any = [];

  form: FormGroup = this.fb.group({
    verTramite: [null],
    actualizarBuzon: [null],
    pendientes: [null],
    observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
  });

  filterForm: FormGroup = this.fb.group({
    managementArea: [null],
    user: [null],
    verTramiteG: [false],
    actualizarBuzon: [true],
    pendientes: [false],
    predetermined: [true],
    priority: [null],
    processStatus: [null],
    observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
    startDate: [null],
    endDate: [null],
  });

  /*PERMISSION*/
  groupNumber: number;
  managementArea: string = null;
  predetermined: string = null;
  send: string = null;
  turnar: string = null;
  watch: string = null;

  /*Redux NgRX Global Vars Model*/
  globalVars: IGlobalVars;

  managementAreas = new DefaultSelect<IManagementArea>();
  users$ = new DefaultSelect<ISegUsers>();
  areas$ = new DefaultSelect<IManagementArea>();

  get user() {
    return this.filterForm.controls['user'];
  }
  get managementAreaF() {
    return this.filterForm.controls['managementArea'];
  }
  get verTramiteG() {
    return this.filterForm.controls['verTramiteG'];
  }
  get actualizarBuzon() {
    return this.filterForm.controls['actualizarBuzon'];
  }
  get pendientes() {
    return this.filterForm.controls['pendientes'];
  }
  get predeterminedF() {
    return this.filterForm.controls['predetermined'];
  }
  get startDate() {
    return this.filterForm.controls['startDate'];
  }
  get endDate() {
    return this.filterForm.controls['endDate'];
  }

  constructor(
    private fb: FormBuilder,
    private workService: DocumentsPartOfficeService,
    private satInterface: SatInterfaceService,
    private docsDataService: DocumentsReceptionDataService,
    private procedureManagementService: ProcedureManagementService,
    private router: Router,
    private globalVarsService: GlobalVarsService,
    private authService: AuthService,
    private historicalProcedureManagementService: HistoricalProcedureManagementService,
    private goodsQueryService: GoodsQueryService,
    private historyIndicatorService: HistoryIndicatorService,
    private documentsService: DocumentsService,
    private fileBrowserService: FileBrowserService,
    private usersService: UsersService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private goodsParamerterService: GoodParametersService,
    private notificationsService: NotificationService
  ) {
    super();
    this.settings.actions = true;
    this.settings.columns = DOCUMENT_PART_OFFCIE_COLUMNS2;
    this.settings = {
      ...this.settings,
      mode: 'inline',
      actions: {
        ...this.settings.actions,
        delete: false,
        add: false,
        edit: true,
        columnTitle: 'Acciones',
        position: 'right',
      },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.dataTable
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe), debounceTime(700))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'processNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'processStatus':
                searchFilter = SearchFilter.EQ;
                filter.search = filter.search.toUpperCase();
                break;
              case 'flierNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'issueType':
                searchFilter = SearchFilter.EQ;
                break;
              case 'count':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '' && filter.search.length >= 3) {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else if (filter.search !== '' && filter.field == 'issueType') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else if (filter.search !== '' && filter.field == 'count') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          console.log(this.columnFilters);
          if (this.predeterminedF.value) {
            this.getUser();
          } else {
            this.getData();
          }
        }

        // this.workService.getStatus().subscribe({
        //   next: (resp: any) => {
        //     console.log(resp);
        //
        //   }
        // })
      });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      console.log('se ejecutó');
      if (this.predeterminedF.value) {
        this.getUser();
      } else {
        this.getData();
      }
    });

    //this.getAreas();
    //this.getGroupWork();

    //this.loadPermissions();
    /*this.workService.getView().subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.data) {
          resp.data.forEach((item: any) => {
            this.data.push({
              columname: item.royalProceesDate,
              columname2: item.naturalDays,
              columname3: item.processEntryDate,
              columname4: item.processStatus,
              columname5: item.flierNumber,
              columname6: item.turnadoiUser,
              columname7: item.priority,
              idOffice: item.officeNumber,
            });
          });

          this.dataTable.load(this.data);
        }
      },
    });*/
  }

  getUser(): void {
    const token = this.authService.decodeToken();
    let userId = token.preferred_username;
    let params = new FilterParams();
    params.addFilter('id', userId.toUpperCase(), SearchFilter.EQ);
    this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: data => {
        console.log(data);
        this.filterParams.getValue().removeAllFilters();
        data.data.map(user => {
          user.userAndName = `${user.id}- ${user.name}`;
          return user;
        });
        this.filterForm.controls['user'].setValue(data.data[0]);
        let $params = new ListParams();
        this.getGroupWork($params);
      },
      error: () => {
        //this.users$ = new DefaultSelect();
      },
    });
  }

  /*BUILD FILTERS*/
  buildFilters(): void {
    console.log(this.managementAreaF.value);
    this.filterParams.getValue().removeAllFilters();
    this.filterForm.controls['priority'].setValue(this.priority$);

    let {
      priority,
      managementArea,
      user,
      verTramite,
      actualizarBuzon,
      pendientes,
      predeterminedF,
      processStatus,
      startDate,
      endDate,
    } = this.filterForm.value;

    let field = `filter.processEntryDate`;

    /*DATEFILTER*/
    if (startDate !== null && endDate !== null) {
      const startTemp = `${startDate.getFullYear()}-0${
        startDate.getUTCMonth() + 1
      }-0${startDate.getDate()}`;
      const endTemp = `${endDate.getFullYear()}-0${
        endDate.getUTCMonth() + 1
      }-0${endDate.getDate()}`;

      this.columnFilters[field] = `$btw:${startTemp},${endTemp}`;
    } else {
      delete this.columnFilters[field];
    }
    console.log(this.filterForm.value);

    console.log(priority);
    field = `filter.processStatus`;
    if (managementArea !== null) {
      switch (priority) {
        case 'toDo':
          processStatus = `${managementArea.id}I`;
          break;
        case 'inProgress':
          processStatus = `${managementArea.id}P`;
          break;
        case 'done':
          processStatus = `${managementArea.id}S`;
          break;
        case 'delayed':
          processStatus = `${managementArea.id}D`;
          break;
        default:
          processStatus = null;
          break;
      }
      if (processStatus !== null) {
        //this.filterParams.getValue().addFilter('processStatus',processStatus,SearchFilter.EQ);

        this.columnFilters[field] = `$eq:${processStatus}`;
      } else {
        delete this.columnFilters[field];
      }
    } else {
      switch (priority) {
        case 'toDo':
          processStatus = `I`;
          break;
        case 'inProgress':
          processStatus = `P`;
          break;
        case 'done':
          processStatus = `S`;
          break;
        case 'delayed':
          processStatus = `D`;
          break;
        default:
          processStatus = null;
          break;
      }

      if (processStatus !== null) {
        //this.filterParams.getValue().addFilter('processStatus',processStatus,SearchFilter.EQ);

        this.columnFilters[field] = `$ilike:${processStatus}`;
      } else {
        delete this.columnFilters[field];
      }
    }

    let isSegAreas = false;
    field = `filter.turnadoiUser`;
    if (this.verTramiteG.value && user !== null) {
      this.getSegXAreas(user)
        .then(resp => {
          console.log(resp);
          isSegAreas = resp;
          if (isSegAreas) {
            const token = this.authService.decodeToken();
            let userId = token.preferred_username;
            //this.columnFilters[field] = `$eq:${userId}`;
            let field = `search`;
            let searchBy = `searchBy`;
            this.columnFilters[field] = `${userId.toUpperCase()}`;
            this.columnFilters[searchBy] = `turnadoiUser`;
          } else if (user !== null) {
            //this.columnFilters[field] = `$eq:${user.id}`;
            let field = `search`;
            let searchBy = `searchBy`;
            this.columnFilters[field] = `${user.id}`;
            this.columnFilters[searchBy] = `turnadoiUser`;
          } else {
            delete this.columnFilters[field];
          }
          this.getData();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log(this.predeterminedF.value);
      field = `filter.turnadoiUser`;

      if (this.predeterminedF.value) {
        const token = this.authService.decodeToken();
        let userId = token.preferred_username; //'FGAYTAN'; //
        this.columnFilters[field] = `$eq:${userId}`;
        //let field = `search`;
        //let searchBy = `searchBy`;
        this.columnFilters[field] = `${userId.toUpperCase()}`;
        //this.columnFilters[searchBy] = `turnadoiUser`;
      } else if (user !== null) {
        this.columnFilters[field] = `$eq:${user.id}`;
        //let field = `search`;
        //let searchBy = `searchBy`;
        this.columnFilters[field] = `${user.id}`;
        //this.columnFilters[searchBy] = `turnadoiUser`;
      } else {
        delete this.columnFilters[field];
      }
      this.getData();
    }

    //TODO:VALIDAR CAMPO ESCANEADO
    field = `filter.count`;
    if (this.pendientes.value) {
      this.columnFilters[field] = `$eq:0`;
    }
    //Filtros por columna
    /**BLK_CTR_CRITERIOS.CHK_FILTROS_PREDEFINIDOS = 'S'**/
    /*:BLK_CTR_CRITERIOS.TIPO_ASUNTO IN (1,2,3,4,5)*/

    /*if () {
      field = `filter.turnadoiUser`;

    }*/
  }

  /*IF CHK_USR_GRUPO*/
  getSegXAreas(user: any): Promise<any> {
    /*?filter.delegationNumber=0&filter.user=sigebiadmon*/
    let params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('delegationNumber', user.usuario.delegationNumber);
    params.addFilter('user', user.id);
    return new Promise((resolve, reject) => {
      this.usersService.getAllSegXAreasByParams(params.getParams()).subscribe({
        next: data => {
          if (data.data.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: error => {
          reject(error);
          //this.users$ = new DefaultSelect();
        },
      });
    });
  }

  /*PROCEDURE PUP_CARGA_PERMISOS_BUZON*/
  loadPermissions(): void {
    /*const token = this.authService.decodeToken();
    let userId = 'FGAYTAN'; //token.preferred_username;
    const params = new FilterParams();
    params.addFilter('user', userId);
    params.addFilter('predetermined', 'S');*/
    /*this.procedureManagementService
      .getManagamentGroupWork(params.getParams())
      .subscribe({
        next: (resp) => {
          if (resp.data) {
            this.groupNumber = resp.data[0].groupNumber
            this.managementArea = resp.data[0].managementArea
            this.predetermined = resp.data[0].predetermined
            this.send = resp.data[0].send
            this.turnar = resp.data[0].turnar
            this.watch = resp.data[0].watch

            console.log(resp.data)
          }
        },
        error: error => (this.loading = false),
      })*/
  }

  getData() {
    /*console.log(this.filterParams.getValue());
    let filters : FilterParams =this.filterParams.getValue()*/
    console.log(this.predeterminedF.value);
    let field = `filter.turnadoiUser`;
    //let field = `search`;
    //let searchBy = `searchBy`;
    if (this.predeterminedF.value) {
      const token = this.authService.decodeToken();
      let userId = token.preferred_username;
      this.columnFilters[field] = `$eq:${userId.toUpperCase()}`;
      //this.columnFilters[field] = `${userId.toUpperCase()}`;
      //this.columnFilters[searchBy] = `turnadoiUser`;
    } /* else {
      delete this.columnFilters[field];
    }*/

    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    console.log(params);
    this.workService.getView(params).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.data) {
          this.data = resp.data;
          this.totalItems = resp.count || 0;
          this.dataTable.load(resp.data);
          this.dataTable.refresh();
          this.loading = false;
        }
      },
      error: error => {
        console.log(error);
        this.dataTable.load([]);
        this.totalItems = 0;
        this.dataTable.refresh();
        //this.onLoadToast('warning', 'Advertencia','No se encontrarón registros');
        this.loading = false;
      },
    });
  }

  selectEvent(e: any) {
    console.log(e);
    this.dataSelect = {};
    if (e.selected.length > 0) {
      this.selectedRow = e.data;
      //NO_TRAMITE
      const { processNumber, officeNumber, flierNumber } = this.selectedRow;
      /*this.filterParams.getValue().removeAllFilters();
      this.filterParams.getValue().page = 1;
      this.filterParams.getValue().addFilter('procedureNumber', processNumber, SearchFilter.EQ);*/
      //GET TIPO_TRAMITE|| typeManagement
      this.workService.getProcedureManagement(processNumber).subscribe({
        next: (resp: any) => {
          if (resp) {
            console.log(resp);
            this.selectedRow = {
              ...this.selectedRow,
              typeManagement: resp?.typeManagement || null,
            };
            //GET  MAX(FEC_TURNADO)
            this.workService
              .getProcedureManagementHistorical(processNumber)
              .subscribe({
                next: (resp: any) => {
                  this.selectedRow = {
                    ...this.selectedRow,
                    processLastDate:
                      resp.data[0]?.dateturned ||
                      this.selectedRow.processEntryDate ||
                      null,
                  };

                  //GET  FEC_CAPTURA
                  if (flierNumber !== null) {
                    this.workService
                      .getNotificationsFilter(flierNumber)
                      .subscribe({
                        next: (resp: any) => {
                          this.selectedRow = {
                            ...this.selectedRow,
                            dateFlier: resp.data[0]?.captureDate || null,
                            wheelType: resp.data[0]?.wheelType || null,
                          };

                          //this.getSatOfficeType(officeNumber)
                        },
                        error: error => (this.loading = false),
                      });
                  } else {
                    /*this.onLoadToast(
                      'warning',
                      '',
                      'No se pudo cargar la fecha de captura'
                    );*/
                    this.selectedRow = {
                      ...this.selectedRow,
                      dateFlier: resp.data[0]?.captureDate || null,
                      wheelType: resp.data[0]?.wheelType || null,
                    };
                  }

                  //
                  /*this.satInterface.getSatTransfer(body).subscribe({
                  next: (resp: any) => {
                    console.log(resp);
                    if (resp) {
                      this.P_SAT_TIPO_EXP = resp.data[0].satTypeProceedings;
                    }
                    this.loading = false
                  },
                error: error => (this.loading = false),
                });*/
                },
                error: error => (this.loading = false),
              });
          }
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
    }
  }

  //GET TIPO_TRAMITE|| typeManagement

  work2() {
    //Substring 2 FIRST LETTER STATUS
    let processStatus = this.selectedRow.processStatus.substring(0, 2);
    console.log(processStatus);
    this.procedureManagementService
      .getManagamentArea({ 'filter.id': processStatus })
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          if (resp) {
            if (resp.data[0].screenKey === 'FACTJURDICTAMASG') {
              console.log('PUP_LANZA_DICTAMEN_ABANDONO');
              let TIPO_DIC = 'ABANDONO';
              let wheelType = this.selectedRow.wheelType;
              if (wheelType !== null) {
                console.log('call FACTJURDICTAMASG');
                this.getGlobalVars();
                this.globalVars = {
                  ...this.globalVars,
                  EXPEDIENTE: this.selectedRow.proceedingsNumber,
                  TIPO_DIC: TIPO_DIC,
                  VOLANTE: this.selectedRow.flierNumber,
                  CONSULTA: 'N',
                  TIPO_VO: wheelType,
                  P_GEST_OK: 1,
                  P_NO_TRAMITE: this.selectedRow.processNumber,
                };

                this.globalVarsService.updateGlobalVars(this.globalVars);
                this.router.navigateByUrl('/pages/juridical/juridical-ruling/');
              } else {
                this.alert(
                  'info',
                  `${resp.data[0].screenKey}`,
                  'No se encuentra disponible en este momento'
                );
              }
            } else if (resp.data[0].screenKey === 'FACTOFPREGRECDOCM') {
              console.log(this.docsDataService.flyersRegistrationParams);
              this.docsDataService.flyersRegistrationParams = {
                pIndicadorSat: null,
                pGestOk: 1,
                pNoVolante: null,
                pNoTramite: parseInt(this.selectedRow.processNumber),
                pSatTipoExp: this.P_SAT_TIPO_EXP || null,
                noTransferente: null,
              };
              console.log(this.selectedRow);
              console.log(this.docsDataService.flyersRegistrationParams);
              this.router.navigateByUrl(
                '/pages/documents-reception/flyers-registration'
              );
            } else {
              resp.data[0].screenKey !== null
                ? this.alert(
                    'info',
                    `${resp.data[0].screenKey}`,
                    'No se encuentra disponible en este momento'
                  )
                : this.alert(
                    'info',
                    `Pantalla`,
                    'No disponible en este momento'
                  );
              console.log('other screenKey');
              //TODO:MAP SCREENS AND ROUTING
            }
          }
        },
      });
  }

  work() {
    const { processNumber, officeNumber, flierNumber, processStatus } =
      this.selectedRow;

    if (processStatus !== 'FNI') {
      this.workService.getSatOfficeType(officeNumber).subscribe({
        next: (resp: any) => {
          if (resp.data) {
            console.log(resp.data);
            this.P_SAT_TIPO_EXP = resp.data[0]?.satTypeProceedings || null;
            console.log(this.P_SAT_TIPO_EXP);
            // if (this.P_SAT_TIPO_EXP !== '') {
            let typeManagement = this.selectedRow.typeManagement;
            let folio = this.selectedRow.folioRep;
            //TODO: CHECK BUZON
            switch (typeManagement) {
              case '2':
                folio !== 0
                  ? this.work2()
                  : this.alert(
                      'info',
                      'Este trámite es un asunto SAT',
                      'No se puede trabajar hasta que se genere un folio de recepción'
                    );
                break;
              case '3':
                folio !== 0
                  ? this.work2()
                  : this.alert(
                      'info',
                      'Este trámite es un asunto PGR',
                      'No se puede trabajar hasta que se genere un folio de recepción'
                    );
                break;
              default:
                //console.log('No es 2 ni 3, work()');
                this.work2();
                break;
            }

            //this.router.navigateByUrl('/pages/documents-reception/flyers-registration')
          } else {
            this.alert(
              'info',
              'Proceso incompleto',
              'Este trámite no se puede trabajar'
            );
          }
          this.loading = false;
          /*} else {
            this.alert(
              'info',
              'Sin clave de pantalla',
              'La clave de pantalla no ha sido encontrada'
            );
          }*/
        },
        error: error => (this.loading = false),
      });
    } else {
      this.alert(
        'info',
        'No permitido',
        'Este oficio no se puede trabajar, el estatus está finalizado'
      );
    }
  }

  /*Redux NgRX Global Vars Get Initial State*/
  getGlobalVars() {
    this.globalVarsService
      .getGlobalVars$()
      .subscribe((globalVars: IGlobalVars) => {
        this.globalVars = globalVars;
        console.log(globalVars);
      });
  }

  getAreas() {
    this.procedureManagementService.getManagamentArea({ limit: 20 }).subscribe({
      next: (resp: any) => {
        this.areas$ = resp.data;
      },
      error: error => (this.loading = false),
    });
  }

  getGroupWork($params: ListParams) {
    const token = this.authService.decodeToken();
    let userId = token.preferred_username;
    const params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    let predetermined = this.predeterminedF.value;

    predetermined
      ? (params.addFilter('predetermined', 'S'),
        params.addFilter('user', userId.toUpperCase()))
      : params.removeAllFilters();

    this.procedureManagementService
      .getManagamentGroupWork(params.getParams())
      .subscribe({
        next: (respGW: any) => {
          if (respGW.data) {
            let groups = respGW.data;
            this.procedureManagementService
              .getManagamentArea({ limit: 20 })
              .subscribe({
                next: (resp: any) => {
                  /*VALIDAR AREAS POR GRUPO*/
                  let assignedArea = resp.data.filter((area: any) => {
                    return groups.some((g: any) => {
                      return area.id === g.managementArea;
                    });
                  });

                  /*this.areas$.map((area:any)=>{
                  let filter = groups.findIndex((group:any) =>
                    group.managementArea === area.id)

                  console.log(filter)
                  if(filter != -1){
                    return area
                  }
                });*/
                  let data = resp.data.map((area: any) => {
                    area.description = `${area.id} - ${area.description}`;
                    return area;
                  });

                  this.areas$ = new DefaultSelect(data, resp.count);

                  //let managementArea=this.areas$.filter(ar=>ar.managementArea===groups.)
                  console.log(assignedArea);
                  predetermined
                    ? this.filterForm.controls['managementArea'].setValue(
                        assignedArea[0]
                      )
                    : this.filterForm.controls['managementArea'].setValue({});

                  this.groupNumber = resp.data[0].groupNumber;
                  this.managementArea = resp.data[0].managementArea;
                  this.predetermined = resp.data[0].predetermined;
                  this.send = resp.data[0].send;
                  this.turnar = resp.data[0].turnar;
                  this.watch = resp.data[0].watch;
                  console.log(this.areas$);
                  this.getData();
                },
                error: error => (this.loading = false),
              });
          }
        },
        error: error => (this.loading = false),
      });
  }

  viewFlyerHistory() {
    const $obs = this.historicalProcedureManagementService.getAllFiltered;
    const service = this.historicalProcedureManagementService;
    const columns = FLYER_HISTORY_COLUMNS;
    const title = FLYER_HISTORY_TITLE;
    const params = new FilterParams();
    params.addFilter('procedureNumber', this.selectedRow.processNumber);
    const $params = new BehaviorSubject(params);
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        $obs,
        service,
        columns,
        title,
        $params,
      },
    };
    this.modalService.show(DocumentsPartOfficeModalTableComponent, config);
  }

  viewIndicatorsHistory() {
    if (
      isEmpty(this.selectedRow.proceedingsNumber) &&
      isEmpty(this.selectedRow.flierNumber)
    ) {
      this.onLoadToast('warning', 'Advertencia', NO_INDICATORS_FOUND);
      return;
    }

    const $obs = this.historyIndicatorService.getHistoryIndicatorView;
    const service = this.historyIndicatorService;
    const columns = INDICATORS_HISTORY_COLUMNS;
    const title = INDICATORS_HISTORY_TITLE;
    const params = new FilterParams();
    const body = {
      proceedingsNum: this.selectedRow.proceedingsNumber,
      flierNum: this.selectedRow.flierNumber,
    };
    const $params = new BehaviorSubject(params);
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        $obs,
        service,
        columns,
        title,
        $params,
        body,
      },
    };
    this.modalService.show(DocumentsPartOfficeModalTableComponent, config);
  }

  viewPictures() {
    if (!this.selectedRow?.flierNumber) {
      this.onLoadToast('error', 'Error', NO_FLYER_NUMBER);
      return;
    }
    this.getDocumentsByFlyer(this.selectedRow.flierNumber);
  }

  openDocumentsModal(flyerNum: string | number, title: string) {
    const params = new FilterParams();
    params.addFilter('flyerNumber', flyerNum);
    const $params = new BehaviorSubject(params);
    const $obs = this.documentsService.getAllFilter;
    const service = this.documentsService;
    const columns = RELATED_FOLIO_COLUMNS;
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        $obs,
        service,
        columns,
        title,
        $params,
        showConfirmButton: true,
      },
    };
    return this.modalService.show(
      DocumentsPartOfficeModalTableComponent<IDocuments>,
      config
    );
  }

  getDocumentsByFlyer(flyerNum: string | number) {
    const title = RELATED_FOLIO_TITLE;
    const modalRef = this.openDocumentsModal(flyerNum, title);
    modalRef.content.selected
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(document => this.getPicturesFromFolio(document));
  }

  getPicturesFromFolio(document: IDocuments) {
    let folio = document.id;
    if (document.associateUniversalFolio) {
      folio = document.associateUniversalFolio;
    }
    const config = {
      ...MODAL_CONFIG,
      ignoreBackdropClick: false,
      initialState: {
        folio,
      },
    };
    this.modalService.show(DocumentsViewerByFolioComponent, config);
  }

  turnPaperwork() {
    if (!this.selectedRow) {
      this.onLoadToast('error', 'Error', 'Primero selecciona un trámite');
      return;
    }
    // TODO: descomentar cuando los permisos esten habilitados
    // if(!this.turnar) {
    //   this.onLoadToast('error', 'Error', TURN_PAPERWORK_UNAVAILABLE);
    //   return
    // }
    const config: any = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
      initialState: {
        callback: (user: any) => {
          this.turnToUser(user);
        },
        paperwork: this.selectedRow,
      },
    };
    this.modalService.show(TurnPaperworkComponent, config);
  }

  turnToUser(user: any) {
    console.log(user);
  }

  async onCancelPaperwork() {
    if (!this.selectedRow) {
      this.onLoadToast('error', 'Error', 'Primero selecciona un tramite');
      return;
    }
    const result = await this.alertQuestion(
      'question',
      'Advertencia',
      CONFIRM_CANCEL
    );

    if (result.isConfirmed) {
      this.cancelPaperwork().subscribe();
    }
  }

  async onFinishPaperwork() {
    if (!this.selectedRow) {
      this.onLoadToast('error', 'Error', 'Primero selecciona un tramite');
      return;
    }
    const result = await this.alertQuestion(
      'question',
      'Advertencia',
      CONFIRM_FINISH
    );

    if (result.isConfirmed) {
      this.finishPaperwork().subscribe();
    }
  }

  cancelPaperwork() {
    const { processNumber, turnadoiUser } = this.selectedRow;
    const body = {
      status: 'CNI',
      userTurned: turnadoiUser,
      situation: 1,
    };
    return this.procedureManagementService.update(processNumber, body).pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al cancelar el trámite'
        );
        return throwError(() => error);
      }),
      tap(() => {
        this.onLoadToast('success', 'El trámite se cancelo correctamente', '');
        this.getData();
      })
    );
  }

  finishPaperwork() {
    const { processNumber, turnadoiUser } = this.selectedRow;
    const body = {
      status: 'FNI',
      userTurned: turnadoiUser,
      situation: 1,
    };
    return this.procedureManagementService.update(processNumber, body).pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al cancelar el trámite'
        );
        return throwError(() => error);
      }),
      tap(() => {
        this.onLoadToast('success', 'El trámite se finalizo correctamente', '');
        this.getData();
      })
    );
  }

  validDoc() {
    this.getValidDocParamter().subscribe();
  }

  getValidDocParamter() {
    return this.goodsParamerterService.getById('PATHVALDOCSAT').pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Error al Obtener el link para validar el archivo'
        );
        return throwError(() => error);
      }),
      tap(parameter => window.open(parameter.initialValue, '_blank'))
    );
  }

  scanDocuments() {
    if (!this.selectedRow?.flierNumber) {
      this.onLoadToast('error', 'Error', NO_FLYER_NUMBER);
      return;
    }
    const title = RELATED_FOLIO_TITLE;
    const modalRef = this.openDocumentsModal(
      this.selectedRow?.flierNumber,
      title
    );
    modalRef.content.selected
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(document => this.goToScanDocuments(document));
  }

  goToScanDocuments(document: IDocuments) {
    const { id } = document;
    const url = this.router.createUrlTree(
      ['/pages/general-processes/scan-documents'],
      {
        queryParams: {
          folio: id,
        },
      }
    );
    window.open(url.toString(), '_blank');
  }

  replicate() {
    if (!this.selectedRow) {
      this.onLoadToast('error', 'Error', 'Primero elige un trámite');
      return;
    }
    if (!this.selectedRow.flierNumber) {
      this.onLoadToast(
        'error',
        'Error',
        'El trámite no tiene un número de volante'
      );
      return;
    }

    this.getDocumentsCount().subscribe(count => {
      if (count == 0) {
        this.getNotificationByFlyer().subscribe(notification => {
          if (!notification) {
            this.alert(
              'error',
              'Error',
              'No existe un folio universal escaneado para replicar'
            );
            return;
          }
          this.getNotificationsByCveAndDate(
            notification.officeExternalKey,
            notification.entryProcedureDate
          ).subscribe(flyers => {
            this.getDocumentsByFlyers(flyers.join(',')).subscribe(documents => {
              if (!documents.data[0]) {
                this.alert(
                  'error',
                  'Error',
                  'No existe un folio universal escaneado para replicar'
                );
                return;
              }
              if (documents.count > 1) {
                this.alert(
                  'error',
                  'Error',
                  'Existe mas de un folio universal escaneado para replicar'
                );
                return;
              }
              const folio = documents[0].id;
              this.updateDocumentsByFolio(
                folio,
                notification.officeExternalKey
              ).subscribe();
            });
          });
        });
      } else {
        this.alert(
          'warning',
          'Advertencia',
          'Este registro no permite ser replicado'
        );
      }
    });
  }

  updateDocumentsByFolio(folioLNU: string | number, folioLST: string) {
    return this.documentsService.updateByFolio({ folioLNU, folioLST }).pipe(
      catchError(error => {
        this.alert('error', 'Error', 'Ocurrio un error al replicar el folio');
        return throwError(() => error);
      }),
      tap(() => {
        this.alert('success', 'Folio replicado correctamente', '');
      })
    );
  }

  getNotificationsByCveAndDate(cve: string, date: string | Date) {
    const params = new FilterParams();
    params.addFilter('officeExternalKey', cve);
    params.addFilter('entryProcedureDate', date as string);
    this.hideError();
    return this.notificationsService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        this.alert(
          'error',
          'Error',
          'No existe un folio universal escaneado para replicar.'
        );
        return throwError(() => error);
      }),
      map(response =>
        response.data.map(notification => notification.wheelNumber)
      )
    );
  }

  getNotificationByFlyer() {
    const params = new FilterParams();
    params.addFilter('wheelNumber', this.selectedRow.flierNumber);
    this.hideError();
    return this.notificationsService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        this.alert(
          'error',
          'Error',
          'No existe un folio universal escaneado para replicar.'
        );
        return throwError(() => error);
      }),
      map(response => response.data[0])
    );
  }

  getDocumentsByFlyers(flyers: string) {
    const params = new FilterParams();
    params.addFilter('scanStatus', 'ESCANEADO');
    params.addFilter('flyerNumber', flyers, SearchFilter.IN);
    this.hideError();
    return this.documentsService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        if (error.status < 500) {
          this.alert(
            'error',
            'Error',
            'No existe un folio universal escaneado para replicar'
          );
        } else {
          this.alert('error', 'Error', 'Ocurrio un error al replicar el folio');
        }
        return throwError(() => error);
      })
    );
  }

  getDocumentsCount() {
    const params = new FilterParams();
    params.addFilter('scanStatus', 'ESCANEADO');
    params.addFilter('flyerNumber', this.selectedRow.flierNumber);
    this.hideError();
    return this.documentsService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        if (error.status < 500) {
          return of({ count: 0 });
        }
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al replicar el folio'
        );
        return throwError(() => error);
      }),
      map(response => response.count)
    );
  }

  acptionBienes() {
    // this.workService.getViewBienes('598154').subscribe({
    //   next: (resp: any) => {
    //     console.log(resp);
    //   }
    // })
    const $obs = this.workService.getViewBienes;
    const service = this.workService;
    const columns = WORK_BIENES_COLUMNS;
    const title = BIENES_TITLE;
    const params = new FilterParams();
    params.addFilter('file', this.selectedRow.proceedingsNumber);
    const $params = new BehaviorSubject(params);
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        $obs,
        service,
        columns,
        title,
        $params,
      },
    };
    const modalRef = this.modalService.show(
      DocumentsPartOfficeModalTableComponent,
      config
    );
  }

  acptionAntecedente() {
    // this.workService.getViewAntecedente('598154').subscribe({
    //   next: (resp: any) => {
    //     console.log(resp);
    //   }
    // })
    const $obs = this.workService.getViewAntecedente;
    const service = this.workService;
    const columns = WORK_ANTECEDENTES_COLUMNS;
    const title = ANTECEDENTE_TITLE;
    const params = new FilterParams();
    params.addFilter('proceedingsNum', this.selectedRow.proceedingsNumber);
    const $params = new BehaviorSubject(params);
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        $obs,
        service,
        columns,
        title,
        $params,
      },
    };
    this.modalService.show(DocumentsPartOfficeModalTableComponent, config);
  }

  getUsers($params: ListParams) {
    console.log($params);
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.addFilter('name', $params.text, SearchFilter.LIKE);
    //params.addFilter('assigned', 'S');
    /*if (lparams?.text.length > 0)

    if (this.delDestinyNumber.value != null)
      params.addFilter('delegationNumber', this.delDestinyNumber.value);
    if (this.subDelDestinyNumber.value != null)
      params.addFilter('subdelegationNumber', this.subDelDestinyNumber.value);*/
    this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: data => {
        data.data.map(user => {
          user.userAndName = `${user.id}- ${user.name}`;
          return user;
        });

        this.users$ = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.users$ = new DefaultSelect();
      },
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filterForm = this.fb.group({
      managementArea: [null],
      user: [null],
      verTramiteG: [false],
      actualizarBuzon: [true],
      pendientes: [false],
      predetermined: [true],
      priority: [null],
      processStatus: [null],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      startDate: [null],
      endDate: [null],
    });
    this.filterForm.updateValueAndValidity();
    console.log(this.filterForm.value);
    let field = `filter.processEntryDate`;
    delete this.columnFilters[field];
    this.getUser();
  }

  notAvailable(): void {
    this.alertQuestion(
      'info',
      'No disponible',
      'Funcionalidad no disponible en este momento'
    );
  }

  workFunction(action: string): void {
    if (this.selectedRow !== null) {
      switch (action) {
        case 'work':
          this.work();
          break;
        case 'acptionAntecedente':
          this.acptionAntecedente();
          break;
        case 'acptionBienes':
          this.acptionBienes();
          break;
        case 'viewFlyerHistory':
          this.viewFlyerHistory();
          break;
        case 'viewIndicatorsHistory':
          this.viewIndicatorsHistory();
          break;
        default:
          this.alertQuestion(
            'info',
            'No disponible',
            'Funcionalidad no disponible en este momento'
          );
          break;
      }
    } else {
      this.alertQuestion(
        'info',
        'No ha seleccionao ningún registro',
        'Por favor seleccione un registro, para poder ejecutar la acción'
      );
    }
  }

  getSolicitud() {
    this.router.navigateByUrl(
      `/pages/general-processes/scan-request/${this.selectedRow.flierNumber}`
    );
  }

  fromDateChange(date: Date) {
    const toDateCtrl = this.startDate;
    toDateCtrl.clearValidators();
    if (date) {
      const min = addDays(date, 1);
      toDateCtrl.addValidators(minDate(min));
    }
    toDateCtrl.updateValueAndValidity();
  }

  toDateChange(date: Date) {
    const fromDateCtrl = this.endDate;
    fromDateCtrl.clearValidators();
    if (date) {
      const min = subDays(date, 1);
      fromDateCtrl.addValidators(maxDate(min));
    }
    fromDateCtrl.updateValueAndValidity();
  }

  onSaveConfirm(event: any) {
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Actualizado', '');
  }
}
