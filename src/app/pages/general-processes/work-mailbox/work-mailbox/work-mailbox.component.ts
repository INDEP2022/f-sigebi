import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
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
import { AuthService } from '../../../../core/services/authentication/auth.service';
import { WorkMailboxService } from '../work-mailbox.service';
//Models
import { IManagementArea } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
/*Redux NgRX Global Vars Service*/
import { GlobalVarsService } from 'src/app//shared/global-vars/services/global-vars.service';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { WORK_MAILBOX_COLUMNS2 } from './work-mailbox-columns';

@Component({
  selector: 'app-work-mailbox',
  templateUrl: './work-mailbox.component.html',
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
export class WorkMailboxComponent extends BasePage implements OnInit {
  //TODO: TYPE ALL
  dataTable: LocalDataSource = new LocalDataSource();
  data: any[] = [];
  dataSelect: any = {};

  selectedRow: any = null;
  P_SAT_TIPO_EXP: string = '';
  satTypeProceedings: string = null;

  //Filters
  priority$: string = null;
  areas$: any = [];
  selectedArea: string;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  columnFilters: any = [];

  form = this.fb.group({
    verTramite: [null],
    actualizarBuzon: [null],
    pendientes: [null],
    observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
  });

  filterForm = this.fb.group({
    managementArea: [null],
  });

  /*Redux NgRX Global Vars Model*/
  globalVars: IGlobalVars;

  managementAreas = new DefaultSelect<IManagementArea>();

  constructor(
    private fb: FormBuilder,
    private workService: WorkMailboxService,
    private satInterface: SatInterfaceService,
    private docsDataService: DocumentsReceptionDataService,
    private procedureManagementService: ProcedureManagementService,
    private router: Router,
    private globalVarsService: GlobalVarsService,
    private authService: AuthService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = WORK_MAILBOX_COLUMNS2;
    this.settings = {
      ...this.settings,
      selectMode: 'inline',
      actions: {
        ...this.settings.actions,
        delete: false,
        add: false,
        edit: false,
      },
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.dataTable
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'processNumber':
                searchFilter = SearchFilter.EQ;
                break;
              /*case 'status':
                searchFilter = SearchFilter.EQ;
                break;
              case 'version':
                searchFilter = SearchFilter.EQ;
                break;*/
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getData();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());

    //this.getAreas();
    this.getGroupWork();
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
              columname6: item.userATurn,
              columname7: item.priority,
              idOffice: item.officeNumber,
            });
          });

          this.dataTable.load(this.data);
        }
      },
    });*/
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.workService.getView(params).subscribe({
      next: (resp: any) => {
        if (resp.data) {
          this.data = resp.data;
          this.totalItems = resp.count || 0;
          this.dataTable.load(resp.data);
          this.loading = false;
        }
      },
      error: error => (this.loading = false),
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
                this.router.navigateByUrl(
                  '/pages/juridical/juridical-ruling/12345'
                );
              } else {
                console.log('No se puede llamar la Declaratoria de abandono');
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
              console.log('other screenKey');
              //TODO:MAP SCREENS AND ROUTING
            }
          }
        },
      });
  }

  work() {
    const { processNumber, officeNumber, flierNumber } = this.selectedRow;

    this.workService.getSatOfficeType(officeNumber).subscribe({
      next: (resp: any) => {
        if (resp.data) {
          console.log(resp.data);
          this.P_SAT_TIPO_EXP = resp.data[0].satTypeProceedings;
          console.log(this.P_SAT_TIPO_EXP);
          if (this.P_SAT_TIPO_EXP !== '') {
            let typeManagement = this.selectedRow.typeManagement;
            let folio = this.selectedRow.folioRep;
            //TODO: CHECK BUZON
            switch (typeManagement) {
              case '2':
                folio !== 0
                  ? this.work2()
                  : console.log(
                      'Este tramite es un asunto SAT, no se puede trabajar hasta que se genere un folio de recepción...'
                    );
                break;
              case '3':
                folio !== 0
                  ? this.work2()
                  : console.log(
                      'Este tramite es un asunto PGR, no se puede trabajar hasta que se genere un folio de recepción...'
                    );
                break;
              default:
                console.log('No es 2 ni 3, work()');
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
        }
      },
      error: error => (this.loading = false),
    });
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

  getGroupWork() {
    const token = this.authService.decodeToken();
    let userId = 'FGAYTAN'; //token.preferred_username;
    const params = new FilterParams();
    params.addFilter('user', userId);
    this.procedureManagementService
      .getManagamentGroupWork(params.getParams())
      .subscribe({
        next: (resp: any) => {
          if (resp.data) {
            let groups = resp.data;
            this.procedureManagementService
              .getManagamentArea({ limit: 20 })
              .subscribe({
                next: (resp: any) => {
                  let data = resp.data.filter((area: any) => {
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
                  data = data.map((area: any) => {
                    area.description = `${area.id} - ${area.description}`;
                    return area;
                  });

                  this.areas$ = new DefaultSelect(data, resp.count);
                  console.log(this.areas$);
                },
                error: error => (this.loading = false),
              });
          }
        },
        error: error => (this.loading = false),
      });
  }
}
