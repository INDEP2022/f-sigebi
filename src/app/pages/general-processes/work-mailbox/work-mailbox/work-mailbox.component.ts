import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  firstValueFrom,
  map,
  of,
  switchMap,
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
import {
  NUM_POSITIVE,
  STRING_PATTERN,
  VALID_VALUE_REGEXP,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import compareDesc from 'date-fns/compareDesc';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { WorkMailboxService } from '../work-mailbox.service';
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
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { HistoryIndicatorService } from 'src/app/core/services/ms-history-indicator/history-indicator.service';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { HistoricalProcedureManagementService } from 'src/app/core/services/ms-procedure-management/historical-procedure-management.service';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { isEmpty } from 'src/app/utils/validations/is-empty';

import { addDays, format, subDays } from 'date-fns';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { MailboxModalTableComponent } from '../components/mailbox-modal-table/mailbox-modal-table.component';
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
  CONFIRM_CANCEL,
  CONFIRM_FINISH,
  NO_FLYER_NUMBER,
  NO_INDICATORS_FOUND,
} from '../utils/work-mailbox-messages';
import {
  array_column_table,
  WORK_ANTECEDENTES_COLUMNS,
  WORK_BIENES_COLUMNS,
  WORK_MAILBOX_COLUMNS2,
} from './work-mailbox-columns';

import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { PgrFilesComponent } from 'src/app/@standalone/modals/pgr-files/pgr-files.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { maxDate, minDate } from 'src/app/common/validations/date.validators';
import { ImageMediaService } from 'src/app/core/services/catalogs/image-media.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsTypeService } from 'src/app/core/services/ms-documents-type/documents-type.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { InterfacefgrService } from 'src/app/core/services/ms-interfacefgr/ms-interfacefgr.service';
import { SatTransferService } from 'src/app/core/services/ms-interfacesat/sat-transfer.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { TmpManagementProcedureService } from 'src/app/core/services/ms-procedure-management/tmp-management-procedure.service';
import { ObservationsComponent } from '../components/observations/observations.component';
import { SaveModalMailboxComponent } from '../components/save-modal-mailbox/save-modal-mailbox.component';
import { TurnPaperworkComponent } from '../components/turn-paperwork/turn-paperwork.component';

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

      .drop-scroll {
        height: 220px;
        overflow-y: auto;
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
  testurl: any;
  //Filters
  priority$: string = null;

  selectedArea: string;
  //users$: any = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  areasParams = new BehaviorSubject(new FilterParams());
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

  resetDataFilter: boolean = false;
  fields_WORK_MAILBOX_COLUMNS2 = array_column_table(WORK_MAILBOX_COLUMNS2);

  get user() {
    this.dataTable.count;
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
  get pendientesF() {
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

  type: 'SAT' | 'PGR' = null;
  showScan: boolean = false;
  showPGRDocs: boolean = false;
  showValDoc: boolean = false;

  constructor(
    private fb: FormBuilder,
    private workService: WorkMailboxService,
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
    private notificationsService: NotificationService,
    private interfaceFgrService: InterfacefgrService,
    private tmpManagementProcedureService: TmpManagementProcedureService,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private documentsTypesService: DocumentsTypeService,
    private imageMediaService: ImageMediaService,
    private goodTrackerService: GoodTrackerService,
    private satTransferService: SatTransferService
  ) {
    super();
    this.settings.actions = false; // SE CAMBIO PARA NO PERMITIR EDITAR
    this.settings.columns = WORK_MAILBOX_COLUMNS2;
    this.settings = {
      ...this.settings,
      mode: 'inline',
      actions: {
        ...this.settings.actions,
        delete: false,
        add: false,
        edit: false, // SE CAMBIO PARA NO PERMITIR EDITAR
        // columnTitle: 'Acciones',
        // position: 'right',
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

  /**
   * Obtener el nodo donde se encuentra el nombre del nodo que se pasa como parametro
   * @param filterField Nombre de la clase a buscar
   * @param nodeName Nombre del nodo a buscar dentro del nodo de la clase que se pasa como parametro
   * @returns
   */
  getCellNode(filterField: string, nodeName: string) {
    let field = document.getElementsByClassName(filterField);
    let cell: ChildNode;
    for (let index = 0; index < field.length; index++) {
      const element = field[index];
      if (element) {
        element.childNodes.forEach((node: any) => {
          if (node['className'].toLocaleLowerCase().includes(nodeName)) {
            cell = node;
          }
        });
      }
    }
    return cell;
  }

  /**
   * Eliminar nodos de mensajes anteriores
   * @param cell Elemento donde se va a eliminar el nodo
   */
  removeChilds(cell: ChildNode) {
    let removeChilds: ChildNode[] = [];
    cell.childNodes.forEach((nodeChild: any) => {
      if (
        nodeChild['className']
          .toLocaleLowerCase()
          .includes('validator-field-table')
      ) {
        removeChilds.push(nodeChild);
      }
    });
    removeChilds.forEach(removeChild => {
      // cell.removeChild(removeChild);
    });
  }

  /**
   * Crea el mensaje de validación en el elemento que se pasa como parametro @cell
   * @param cell Elemento donde se va a crear el nodo
   * @param valueField Respuesta del validador de campo
   */
  createChildNode(cell: ChildNode, valueField: any) {
    const node = document.createElement('p');
    node.classList.add('validator-field-table');
    node.classList.add('fs-4');
    node.classList.add('text-danger');
    node.innerHTML = `${
      valueField.errorRegExp ? '*' + valueField.errorRegExpMessage : ''
    }${
      valueField.errorMaxLength
        ? '<br>*' + valueField.errorMaxLengthMessage
        : ''
    }`;
    // cell.appendChild(node);
  }

  /**
   * Validar si se requiere agregar el mensaje en el campos
   * @param valueField Respuesta del validador de campo
   * @param filterField Nombre de la clase a buscar
   * @param nodeName Nombre del nodo a buscar dentro del nodo de la clase que se pasa como parametro
   */
  validChildNode(valueField: any, filterField: string, nodeName: string) {
    if (valueField.errorRegExp || valueField.errorMaxLength) {
      let cell = this.getCellNode(filterField, nodeName);
      if (cell) {
        this.removeChilds(cell);
        this.createChildNode(cell, valueField);
      }
    }
  }
  /**
   * Remover los mensajes de validación en caso que los campos esten vacios en los filtros
   * @param filterField Nombre de la clase a buscar
   * @param nodeName Nombre del nodo a buscar dentro del nodo de la clase que se pasa como parametro
   */
  removePreviewsMessages(filterField: string, nodeName: string) {
    let cell = this.getCellNode(filterField, nodeName);
    if (cell) {
      this.removeChilds(cell);
    }
  }

  ngOnInit(): void {
    this.resetDataFilter = false;
    this.dataTable
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe), debounceTime(700))
      .subscribe(change => {
        //console.log(change);
        if (change.action === 'filter') {
          this.params.value.page = 1;
          this.params.value.limit = 10;
          this.resetDataFilter = false;
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            // //console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            // this.removePreviewsMessages(filter.field + '-validation', 'title'); // Remover validaciones previas
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'processNumber':
                // NO TRAMITE
                searchFilter = SearchFilter.EQ;
                let valueProcessNumber = VALID_VALUE_REGEXP(
                  filter.search,
                  NUM_POSITIVE,
                  40
                );
                // this.validChildNode(
                //   valueProcessNumber,
                //   filter.field + '-validation',
                //   'title'
                // ); // Validar el camnpo y crear mensajes necesarios
                filter.search = valueProcessNumber.validValue;
                break;
              case 'processStatus':
                // ESTATUS
                searchFilter = SearchFilter.EQ;
                if (filter.search) {
                  let valueProcessStatus = VALID_VALUE_REGEXP(
                    filter.search,
                    STRING_PATTERN,
                    10
                  );
                  filter.search = valueProcessStatus.validValue.toUpperCase();
                }
                break;
              case 'flierNumber':
                // NO VOLANTE
                searchFilter = SearchFilter.EQ;
                let valueFlier = VALID_VALUE_REGEXP(
                  filter.search,
                  NUM_POSITIVE,
                  40
                );
                filter.search = valueFlier.validValue;
                break;
              case 'issueType':
                // TIPO DE ASUNTO
                searchFilter = SearchFilter.EQ;
                break;
              case 'count':
                // DIGITALIZADO
                searchFilter = SearchFilter.EQ;
                break;
              case 'officeNumber':
                // OFICIO
                let valueOfficeNumber = VALID_VALUE_REGEXP(
                  filter.search,
                  STRING_PATTERN,
                  500
                );
                filter.search = valueOfficeNumber.validValue;
                break;
              case 'proceedingsNumber':
                // EXPEDIENTE
                let valueProceedingsNumber = VALID_VALUE_REGEXP(
                  filter.search,
                  NUM_POSITIVE,
                  11
                );
                searchFilter = SearchFilter.EQ;
                filter.search = valueProceedingsNumber.validValue;
                break;
              case 'issue':
                // ASUNTO
                let valueIssue = VALID_VALUE_REGEXP(
                  filter.search,
                  STRING_PATTERN,
                  500
                );
                filter.search = valueIssue.validValue;
                break;
              case 'processSituation':
                // SITUACION TRAMITE
                let valueProcessSituation = VALID_VALUE_REGEXP(
                  filter.search,
                  NUM_POSITIVE,
                  11
                );
                filter.search = valueProcessSituation.validValue;
                break;
              case 'turnadoiUser':
                // USUARIO TURNADO
                let valueTurnadoiUser = VALID_VALUE_REGEXP(
                  filter.search,
                  STRING_PATTERN,
                  30
                );
                filter.search = valueTurnadoiUser.validValue.toUpperCase();
                break;
              case 'dailyConsecutiveNumber':
                // CONSECUTIVO DIARIO
                let valueDailyConsecutiveNumber = VALID_VALUE_REGEXP(
                  filter.search,
                  NUM_POSITIVE,
                  11
                );
                filter.search = valueDailyConsecutiveNumber.validValue;
                break;
              case 'descentfed':
                // DESCRIPCION ENTIDAD FEDERATIVA
                let valueDescentfed = VALID_VALUE_REGEXP(
                  filter.search,
                  STRING_PATTERN,
                  100
                );
                filter.search = valueDescentfed.validValue;
                break;
              case 'businessDays':
                // DIAS HABILES
                let valueBusinessDays = VALID_VALUE_REGEXP(
                  filter.search,
                  NUM_POSITIVE,
                  5
                );
                filter.search = valueBusinessDays.validValue;
                break;
              case 'naturalDays':
                // DIAS NATURALES HABILES
                let valueNaturalDays = VALID_VALUE_REGEXP(
                  filter.search,
                  NUM_POSITIVE,
                  5
                );
                filter.search = valueNaturalDays.validValue;
                break;
              case 'observation':
                // OBSERVACIONES
                let valueObservation = VALID_VALUE_REGEXP(
                  filter.search,
                  STRING_PATTERN,
                  200
                );
                filter.search = valueObservation.validValue;
                break;
              case 'observationAdd':
                // OBSERVACIONES ADD
                let valueObservationAdd = VALID_VALUE_REGEXP(
                  filter.search,
                  STRING_PATTERN,
                  200
                );
                filter.search = valueObservationAdd.validValue;
                break;
              case 'priority':
                // PRIORIDAD
                let valuePriority = VALID_VALUE_REGEXP(
                  filter.search,
                  STRING_PATTERN,
                  10
                );
                filter.search = valuePriority.validValue;
                break;
              case 'sheets':
                // DOCUMENTOS
                let valueSheets = VALID_VALUE_REGEXP(
                  filter.search,
                  NUM_POSITIVE,
                  5
                );
                filter.search = valueSheets.validValue;
                break;
              case 'areaATurn':
                // AREA TURNAR
                let valueAreaATurn = VALID_VALUE_REGEXP(
                  filter.search,
                  STRING_PATTERN,
                  30
                );
                filter.search = valueAreaATurn.validValue;
                break;
              case 'userATurn':
                // USUARIO A TURNAR
                let valueUserATurn = VALID_VALUE_REGEXP(
                  filter.search,
                  STRING_PATTERN,
                  30
                );
                filter.search = valueUserATurn.validValue.toUpperCase();
                break;
              case 'folioRep':
                // FOLIO REP.
                searchFilter = SearchFilter.EQ;
                let valueFolioRep = VALID_VALUE_REGEXP(
                  filter.search,
                  NUM_POSITIVE,
                  10
                );
                filter.search = valueFolioRep.validValue;
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
          //console.log(this.columnFilters, this.resetDataFilter);
          if (this.resetDataFilter) {
            this.resetDataFilter = false;
            this.columnFilters = [];
          }
          if (this.predeterminedF.value) {
            this.getUser();
          } else {
            this.getData();
          }
        }
      });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      //console.log('se ejecutó');
      if (this.predeterminedF.value) {
        this.getUser();
      } else {
        this.getData();
      }
    });
  }

  getUser(): void {
    const token = this.authService.decodeToken();
    let userId = token.preferred_username;
    let params = new FilterParams();
    params.addFilter('id', userId.toUpperCase(), SearchFilter.EQ);
    this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: data => {
        //console.log(data);
        this.filterParams.getValue().removeAllFilters();
        data.data.map(user => {
          user.userAndName = `${user.id}- ${user.name}`;
          return user;
        });
        this.filterForm.controls['user'].setValue(data.data[0]);
        let $params = new ListParams();
        this.getGroupWork($params, true);
      },
      error: () => {
        //this.users$ = new DefaultSelect();
      },
    });
  }

  /*BUILD FILTERS*/
  buildFilters(): void {
    //console.log(this.managementAreaF.value);
    //console.log(this.user.value);
    this.filterParams.getValue().removeAllFilters();
    this.filterForm.controls['priority'].setValue(this.priority$);
    this.params.value.page = 1;
    this.params.value.limit = 10;

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

    //console.log(this.filterForm.value)
    let field = `filter.processEntryDate`;
    /*console.log(
      this.filterForm.get('startDate').invalid,
      this.filterForm.get('endDate').invalid,
      this.filterForm.get('startDate').valid,
      this.filterForm.get('endDate').valid,
      this.filterForm.get('startDate').value,
      this.filterForm.get('endDate').value,
      this.filterForm.value
    );*/
    let dateNow: Date = new Date(); //.toISOString().split('T')[0];
    // console.log(dateNow, endDate);
    /*DATEFILTER*/
    if (
      this.filterForm.get('startDate').invalid ||
      this.filterForm.get('endDate').invalid
    ) {
      this.onLoadToast(
        'warning',
        'Fechas incorrectas',
        'Ingrese Fechas correctas para realizar la búsqueda.'
      );
      return;
    } else if (
      this.filterForm.get('startDate').valid &&
      this.filterForm.get('endDate').valid &&
      startDate &&
      endDate
    ) {
      dateNow.setHours(23, 59, 59); // Lo iniciamos a 23:59:59 horas
      // console.log(
      //   dateNow,
      //   endDate,
      //   Date.parse(dateNow.toISOString()),
      //   Date.parse(endDate)
      // );
      if (Date.parse(dateNow.toISOString()) < Date.parse(endDate)) {
        this.onLoadToast(
          'warning',
          'Fechas incorrectas',
          'La Fecha "Hasta" no debe ser MAYOR al día de hoy'
        );
        return;
      } else {
        let validDate = null;
        validDate = compareDesc(startDate, endDate);
        // console.log(validDate);
        if (validDate >= 0) {
          const startTemp = `${startDate.getFullYear()}-0${
            startDate.getUTCMonth() + 1
          }-0${startDate.getDate()}`;
          const endTemp = `${endDate.getFullYear()}-0${
            endDate.getUTCMonth() + 1
          }-0${endDate.getDate()}`;
          this.columnFilters[field] = `$btw:${startTemp},${endTemp}`;
        } else {
          let mensaje = '';
          if (validDate == -1) {
            mensaje =
              'La Fecha "Desde" debe ser menor o igual a la Fecha "Hasta".';
          } else {
            mensaje = 'Ingrese Fechas correctas para realizar la búsqueda.';
          }
          this.onLoadToast('warning', 'Fechas incorrectas', mensaje);
          return;
        }
      }
    } else {
      if (endDate || startDate) {
        // console.log(startDate, endDate);
        this.onLoadToast(
          'warning',
          'Fechas incorrectas',
          'Si desea realizar una búsqueda por Fechas, ingrese la Fecha "Desde" y la Fecha "Hasta"'
        );
        return;
      }
      delete this.columnFilters[field];
    }
    //console.log(this.filterForm.value);

    //console.log(priority);
    field = `filter.processStatus`;
    let filter = `$eq`;
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
          processStatus = `${managementArea.id}`;
          filter = `$ilike`;
          break;
      }
      if (processStatus !== null) {
        //this.filterParams.getValue().addFilter('processStatus',processStatus,SearchFilter.EQ);

        this.columnFilters[field] = `${filter}:${processStatus}`;
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

    field = `filter.count`;
    if (this.pendientesF.value) {
      this.columnFilters[field] = `$eq:0`;
    } else {
      delete this.columnFilters[field];
    }

    let isSegAreas = false;
    field = `filter.turnadoiUser`;
    if (this.verTramiteG.value && user !== null) {
      this.getSegXAreas(user)
        .then(resp => {
          //console.log(resp);
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
          //console.log(err);
        });
    } else {
      //console.log(this.predeterminedF.value);
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

            //console.log(resp.data)
          }
        },
        error: error => (this.loading = false),
      })*/
  }

  getData() {
    /*//console.log(this.filterParams.getValue());
    let filters : FilterParams =this.filterParams.getValue()*/
    //console.log(this.predeterminedF.value);
    let field = `filter.turnadoiUser`;
    //let field = `search`;
    //let searchBy = `searchBy`;
    if (this.predeterminedF.value) {
      const token = this.authService.decodeToken();
      let userId = token.preferred_username;
      this.columnFilters[field] = `$eq:${userId.toUpperCase()}`;

      /*if (this.managementAreaF.value !== null) {
        let managementArea = this.managementAreaF.value;
        this.columnFilters[
          'filter.processStatus'
        ] = `$ilike:${managementArea.id}`;
      }*/

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

    //console.log(params);
    this.workService.getView(params).subscribe({
      next: (resp: any) => {
        if (resp.data) {
          this.data = resp.data.map((elem: any) => {
            elem.turnSelect = false;
            return elem;
          });
          this.totalItems = resp.count || 0;
          this.dataTable.load(resp.data);
          this.dataTable.refresh();
          this.loading = false;
        }
      },
      error: error => {
        //console.log(error);
        this.dataTable.load([]);
        this.totalItems = 0;
        this.dataTable.refresh();
        //this.onLoadToast('warning', 'Advertencia','No se encontrarón registros');
        this.loading = false;
      },
    });
  }

  insertIntoTmp(body: any) {
    return this.tmpManagementProcedureService.create(body);
  }

  deleteFromTmp(id: string | number) {
    return this.tmpManagementProcedureService.remove(id);
  }

  selectEvent(e: any) {
    //console.log(e);
    e.isSelected ? (e.data.turnSelect = true) : (e.data.turnSelect = false);

    this.dataTable.update(e.data, e.data);

    this.showPGRDocs = false;
    this.showScan = false;
    this.showValDoc = false;

    const { processNumber, folioRep, turnadoiUser } = e.data;
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
            //console.log(resp);
            this.selectedRow = {
              ...this.selectedRow,
              typeManagement: resp?.typeManagement || null,
            };
            this.determinateDocuments();
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
                    //console.log(resp);
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
    } else {
      this.selectedRow = null;
    }
  }

  //GET TIPO_TRAMITE|| typeManagement

  work2() {
    //Substring 2 FIRST LETTER STATUS
    let processStatus = this.selectedRow.processStatus.substring(0, 2);
    //console.log(processStatus);
    this.procedureManagementService
      .getManagamentArea({ 'filter.id': processStatus })
      .subscribe({
        next: (resp: any) => {
          //console.log(resp);
          if (resp) {
            if (resp.data[0].screenKey === 'FACTJURDICTAMASG') {
              //console.log('PUP_LANZA_DICTAMEN_ABANDONO');
              let TIPO_DIC = 'ABANDONO';
              let wheelType = this.selectedRow.wheelType;
              if (wheelType !== null) {
                //console.log('call FACTJURDICTAMASG');
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
                this.alert(
                  'info',
                  `${resp.data[0].screenKey}`,
                  'No se encuentra disponible en este momento'
                );
              }
            } else if (resp.data[0].screenKey === 'FACTOFPREGRECDOCM') {
              //console.log(this.docsDataService.flyersRegistrationParams);
              this.docsDataService.flyersRegistrationParams = {
                pIndicadorSat: null,
                pGestOk: 1,
                pNoVolante: null,
                pNoTramite: parseInt(this.selectedRow.processNumber),
                pSatTipoExp: this.P_SAT_TIPO_EXP || null,
                noTransferente: null,
              };
              //console.log(this.selectedRow);
              //console.log(this.docsDataService.flyersRegistrationParams);
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
              //console.log('other screenKey');
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
            //console.log(resp.data);
            this.P_SAT_TIPO_EXP = resp.data[0]?.satTypeProceedings || null;
            //console.log(this.P_SAT_TIPO_EXP);
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
                ////console.log('No es 2 ni 3, work()');
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
        //console.log(globalVars);
      });
  }

  areaChange(area: IManagementArea) {
    //console.log(area);
    this.buildFilters();
    const user = this.user.value;
    const _area = this.managementAreaF.value;
    if (user && _area) {
      this.setDefaultValuesByArea(_area, user);
    }
  }

  setDefaultValuesByArea(
    area: IManagementArea,
    user: any,
    haveAreas?: boolean
  ) {
    //this.filterForm.controls['managementArea'].setValue(area);
    const params = new FilterParams();

    params.addFilter('user', user.id);
    if (!haveAreas) params.addFilter('managementArea', area.id);

    this.getAllManagementGroupAreas(params).subscribe(response => {
      if (haveAreas) {
        const groups = response.data;
        let predeterminedA = groups.filter(area => area.predetermined == 'S');
        if (predeterminedA.length > 0) {
          let defaultArea = this.areas$.data.filter(
            area => area.id == predeterminedA[0].managementArea
          );
          this.filterForm.controls['managementArea'].setValue(defaultArea[0]);
          this.buildFilters();
        } else {
          this.buildFilters();
          this.onLoadToast(
            'info',
            'Sin área predeterminada',
            'Este usuario no cuenta con un área predeterminada'
          );
        }
      } else {
        const group = response.data[0];
        if (group) {
          this.groupNumber = group.groupNumber;
          this.managementArea = group.managementArea;
          this.predetermined = group.predetermined;
          this.send = group.send;
          this.turnar = group.turnar;
          this.watch = group.watch;
        }
      }
    });
  }

  getAreas(params: FilterParams) {
    return this.procedureManagementService
      .getManagamentArea(params.getParams())
      .pipe(
        catchError(error => {
          this.areas$ = new DefaultSelect([], 0, true);
          return throwError(() => error);
        }),
        tap(resp => {
          this.areas$ = new DefaultSelect(resp.data, resp.count);
          //if (resp.data.length > 0)
          //this.filterForm.controls['managementArea'].setValue(resp.data[0]);
        })
      );
  }

  getAllManagementGroupAreas(params: FilterParams) {
    return this.procedureManagementService.getManagamentGroupWork(
      params.getParams()
    );
  }

  getGroupWork($params: ListParams, reset?: boolean) {
    if (reset) {
      $params.page = 1;
    }
    const _params = new FilterParams();
    const params = new FilterParams();
    _params.limit = 100;
    params.page = $params.page;
    params.limit = $params.limit;
    params.addFilter('description', $params.text, SearchFilter.LIKE);
    //params.search = $params.text;

    const user = this.user.value;
    //console.log(user)
    if (user) {
      _params.addFilter('user', user.id);
      this.getAllManagementGroupAreas(_params)
        .pipe(
          map(response => response.data.map(group => group.managementArea)),
          switchMap(areas => {
            if (areas.length > 0) {
              params.addFilter('id', areas.join(','), SearchFilter.IN);
            }
            return this.getAreas(params);
          })
        )
        .subscribe({
          next: () => {
            this.setDefaultValuesByArea(null, user, true);
          },
          error: error => {
            this.buildFilters();
            this.areas$ = new DefaultSelect();
            this.filterForm.controls['managementArea'].setValue(null);
            /*this.onLoadToast(
              'info',
              'Sin áreas asignadas',
              'Este usuario no cuenta con  áreas asignadas')*/
          },
        });
    } else {
      this.buildFilters();
      this.getAreas(params).subscribe();
    }

    // const token = this.authService.decodeToken();
    // let userId = token.preferred_username;
    // const params = new FilterParams();
    // params.page = $params.page;
    // params.limit = $params.limit;
    // let predetermined = this.predeterminedF.value;

    // predetermined
    //   ? (params.addFilter('predetermined', 'S'),
    //     params.addFilter('user', userId.toUpperCase()))
    //   : params.removeAllFilters();

    // this.procedureManagementService
    //   .getManagamentGroupWork(params.getParams())
    //   .subscribe({
    //     next: (respGW: any) => {
    //       if (respGW.data) {
    //         let groups = respGW.data;
    //         this.procedureManagementService
    //           .getManagamentArea({ limit: 20 })
    //           .subscribe({
    //             next: (resp: any) => {
    //               /*VALIDAR AREAS POR GRUPO*/
    //               let assignedArea = resp.data.filter((area: any) => {
    //                 return groups.some((g: any) => {
    //                   return area.id === g.managementArea;
    //                 });
    //               });
    //               let data = resp.data.map((area: any) => {
    //                 area.description = `${area.id} - ${area.description}`;
    //                 return area;
    //               });

    //               this.areas$ = new DefaultSelect(data, resp.count);

    //               //let managementArea=this.areas$.filter(ar=>ar.managementArea===groups.)
    //               //console.log(assignedArea);
    //               predetermined
    //                 ? this.filterForm.controls['managementArea'].setValue(
    //                     assignedArea[0]
    //                   )
    //                 : this.filterForm.controls['managementArea'].setValue({});

    //               this.groupNumber = resp.data[0].groupNumber;
    //               this.managementArea = resp.data[0].managementArea;
    //               this.predetermined = resp.data[0].predetermined;
    //               this.send = resp.data[0].send;
    //               this.turnar = resp.data[0].turnar;
    //               this.watch = resp.data[0].watch;
    //               //console.log(this.areas$);
    //               this.getData();
    //             },
    //             error: error => (this.loading = false),
    //           });
    //       }
    //     },
    //     error: error => (this.loading = false),
    //   });
  }

  viewFlyerHistory() {
    const $obs = this.historicalProcedureManagementService.getAllFiltered;
    const service = this.historicalProcedureManagementService;
    const columns = FLYER_HISTORY_COLUMNS;
    const title = FLYER_HISTORY_TITLE;
    const params = new FilterParams();
    params.addFilter('procedureNumber', this.selectedRow.processNumber);
    params.sortBy = 'consecutive:DESC';
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
    this.modalService.show(MailboxModalTableComponent, config);
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
    this.modalService.show(MailboxModalTableComponent, config);
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
      MailboxModalTableComponent<IDocuments>,
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

  determinateDocuments() {
    if (this.selectedRow.count > 0) {
      this.showPGRDocs = false;
      this.showValDoc = false;
      this.showScan = true;
      return;
    }
    const typeManagement = this.selectedRow.typeManagement;
    if (typeManagement == 3) {
      this.type = 'PGR';
      this.pgrDocs().subscribe();
    } else if (typeManagement == 2) {
      //console.log('sat', typeManagement);
      this.type = 'SAT';
      this.satDocs();
    } else {
      this.showScan = true;
      this.showPGRDocs = false;
      this.showValDoc = false;
    }
  }

  satDocs() {
    const { officeNumber } = this.selectedRow;
    // http://sigebimsqa.indep.gob.mx/interfacesat/api/v1/sat-transferencia/get-count-registers
    /**
     * {
        "officeNumber": 12,
        "valid": 1
      }
     */
    this.type = 'SAT';
    let valid: number = 0;
    this.satTransferService
      .getCountRegisters({ officeNumber, valid })
      .subscribe(res => {
        if (res.count > 0) {
          this.showValDoc = true;
        } else {
          this.showScan = true;
        }
      });
  }

  pgrDocs() {
    const { officeNumber } = this.selectedRow;
    const params = new FilterParams();
    params.addFilter('pgrOffice', officeNumber);
    return this.interfaceFgrService
      .getPgrTransferFiltered(params.getParams())
      .pipe(
        catchError(error => {
          if (error.status < 500) {
            this.showScan = true;
          }
          return throwError(() => error);
        }),
        tap(response => {
          if (response.count > 0) {
            this.showPGRDocs = true;
          } else {
            this.showScan = true;
          }
        })
      );
  }

  turnPaperwork() {
    this.dataTable.getAll().then(data => {
      const turnSelects = data.filter((elem: any) => elem.turnSelect);
      const promises = turnSelects.map(async (elem: any) => {
        const tmp = {
          id: elem.processNumber,
          InvoiceRep: elem.folioRep,
          usrturned: elem.turnadoiUser,
        };

        let promise = await firstValueFrom(this.insertIntoTmp(tmp));
        return promise;
      });

      Promise.allSettled(promises)
        .then(dataP => {
          //TODO: ADVERTIR CUANDO ALGUN TRÁMITE NO SE HA GUARDADO EN LA TABLA TEMPORAL
          //console.log(dataP);
          const isSaveTmp = dataP.filter(elem => elem.status === 'fulfilled');
          if (isSaveTmp.length === turnSelects.length) {
            const config: any = {
              ...MODAL_CONFIG,
              class: 'modal-dialog-centered',
              initialState: {
                callback: (refresh: boolean) => {
                  this.afterTurn(refresh, turnSelects);
                },
                paperworks: turnSelects,
              },
            };
            this.modalService.show(TurnPaperworkComponent, config);
          } else {
            this.alertQuestion(
              'warning',
              'No disponible',
              'Los trámites seleccionados se encuentran en proceso de turnado en este momento'
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    });

    // TODO: descomentar cuando los permisos esten habilitados
    // if(!this.turnar) {
    //   this.onLoadToast('error', 'Error', TURN_PAPERWORK_UNAVAILABLE);
    //   return
    // }
  }

  afterTurn(refresh: boolean, turnSelects: any) {
    const promises = turnSelects.map(async (elem: any) => {
      let promise = await firstValueFrom(
        this.deleteFromTmp(elem.processNumber)
      );
      return promise;
    });

    Promise.allSettled(promises).then(data => {
      if (refresh) {
        this.getData();
      }
    });
  }

  async onCancelPaperwork() {
    if (!this.selectedRow) {
      this.onLoadToast('error', 'Error', 'Primero selecciona un trámite');
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

  async onSavePaperwork() {
    console.log(this.selectedRow);
    if (!this.selectedRow) {
      this.onLoadToast('error', 'Error', 'Primero selecciona un trámite');
      return;
    }
    if (this.selectedRow.areaATurn && this.selectedRow.userATurn) {
      const result = await this.alertQuestion(
        'question',
        'Utilizar datos predeterminados',
        `¿Desea enviar el trámite al usuario ${this.selectedRow.userATurn} 
          y área ${this.selectedRow.areaATurn}?`,
        `Enviar`,
        `Buscar`
      );

      if (result.isConfirmed) {
        const params = new FilterParams();
        params.addFilter('managementArea', this.selectedRow.areaATurn);
        params.addFilter('user', this.selectedRow.userATurn);
        this.savePaperwork('2').subscribe();
      } else {
        const config = {
          ...MODAL_CONFIG,
          initialState: {
            callback: (refresh: boolean) => {
              if (refresh) {
                this.getData();
              }
            },
            selectedRow: this.selectedRow,
          },
        };
        const modalRef = this.modalService.show(
          SaveModalMailboxComponent,
          config
        );
      }
    } else {
      const config = {
        ...MODAL_CONFIG,
        initialState: {
          callback: (refresh: boolean) => {
            if (refresh) {
              this.getData();
            }
          },
          selectedRow: this.selectedRow,
        },
      };
      const modalRef = this.modalService.show(
        SaveModalMailboxComponent,
        config
      );
    }
  }

  async onFinishPaperwork() {
    if (!this.selectedRow) {
      this.onLoadToast('error', 'Error', 'Primero selecciona un trámite');
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

  savePaperwork(option: string) {
    const { processNumber, areaATurn, userATurn } = this.selectedRow;
    let body;
    if (option === '1') {
      body = {
        status: this.managementAreaF.value.id + 'I',
        userTurned: this.user.value.id,
        situation: 1,
      };
    } else {
      body = {
        status: areaATurn + 'I',
        userTurned: userATurn,
        situation: 1,
      };
    }

    return this.procedureManagementService.update(processNumber, body).pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al enviar el trámite'
        );
        return throwError(() => error);
      }),
      tap(() => {
        this.onLoadToast('success', 'El trámite se envío correctamente', '');
        this.getData();
      })
    );
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
        this.onLoadToast('success', 'El trámite se canceló correctamente', '');
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

  viewDoc() {
    const { flierNumber, proceedingsNumber, officeNumber } = this.selectedRow;
    //console.log(this.selectedRow);
    if (!flierNumber && !proceedingsNumber) {
      this.alert(
        'info',
        'Aviso',
        'El Oficio no tiene volante relacionado, sólo se visualizarán los documentos'
      );
      let config = {
        class: 'modal-lg modal-dialog-centered',
        initialState: {
          pgrOffice: officeNumber,
        },
        ignoreBackdropClick: true,
      };
      this.modalService.show(PgrFilesComponent, config);
      return;
    }

    if (flierNumber && proceedingsNumber) {
      this.getPgrDocuments();
    }
  }

  getPgrDocuments() {
    const { flierNumber, proceedingsNumber, officeNumber } = this.selectedRow;
    const __params = new FilterParams();
    __params.addFilter('flyerNumber', flierNumber);
    const _params = `${__params.getParams()}&sortBy=id:DESC`;
    this.documentsService
      .getAllFilter(_params)
      .pipe(
        switchMap(response => this.getPgrTransferDocuments(response.data[0]))
      )
      .subscribe({
        next: response => {
          const { id, scanStatus } = response?.data[0];
          const action =
            scanStatus == 'ESCANEADO'
              ? 'C'
              : scanStatus == 'SOLICITADO'
              ? 'S'
              : 'I';
          this.determinatePgr(id, action);
        },
        error: error => {
          if (error.status < 500) {
            this.determinatePgr(null, 'I');
          } else {
            this.onLoadToast('error', 'Error', 'Ocurrio un error inesperado');
          }
        },
      });
  }

  getPgrTransferDocuments(document: IDocuments) {
    const description = 'DOCUMENTACION ENVIADA POR TRANSFERENCIA ELECTRONICA.';
    const _params = new FilterParams();
    _params.addFilter('descriptionDocument', description, SearchFilter.ILIKE);
    _params.addFilter('id', document.id);
    _params.addFilter('flyerNumber', document.flyerNumber);
    return this.documentsService.getAllFilter(_params.getParams());
  }

  determinatePgr(folio: string | number | null, action: string) {
    //console.log(folio);
    if (!folio) {
      const { flierNumber, proceedingsNumber } = this.selectedRow;
      this.getPgrFolio(flierNumber, proceedingsNumber, action);
    } else if (action == 'C' || action == 'I' || action == 'S') {
      this.exportPgrDocs(folio, action);
    } else {
      this.onLoadToast(
        'error',
        'Error',
        'Ocurrio un error al obtener el Folio Universal'
      );
    }
  }

  getPgrFolio(
    flyer: string | number,
    expedient: string | number,
    action: string
  ) {
    this.getCveTypeDocument()
      .pipe(
        switchMap(cveDocumentType =>
          this.getImageMedia().pipe(
            map(media => {
              return { cveDocumentType, media };
            })
          )
        )
      )
      .subscribe({
        next: value =>
          this.createDocument(
            value.media,
            value.cveDocumentType,
            expedient,
            flyer,
            action
          ),
        error: error =>
          this.createDocument(null, null, expedient, flyer, action),
      });
  }

  createDocument(
    media: string | number,
    cveDocument: string,
    expedient: string | number,
    flyer: string | number,
    action: string
  ) {
    const today = new Date();
    const decodedToken = this.authService.decodeToken();
    const documentToInsert: any = {
      numberProceedings: expedient,
      keySeparator: 60,
      keyTypeDocument: cveDocument,
      natureDocument: 'ORIGINAL',
      descriptionDocument:
        'DOCUMENTACION ENVIADA POR TRANSFERENCIA ELECTRONICA.',
      significantDate: format(today, 'MM/yyyy'),
      scanStatus: 'ESCANEADO',
      userRequestsScan: decodedToken.preferred_username,
      scanRequestDate: format(today, 'yyyy-MM-dd'),
      flyerNumber: flyer,
      mediumId: media,
      sheets: 1,
    };
    this.documentsService.create(documentToInsert).subscribe(document => {
      this.exportPgrDocs(document.id, action);
    });
  }

  getCveTypeDocument() {
    const params = new FilterParams();
    params.addFilter('description', 'REMITE DOCUMENTACION');
    return this.documentsTypesService
      .getAllWidthFilters(params.getParams())
      .pipe(map(response => response.data[0].id));
  }

  getImageMedia() {
    const params = new FilterParams();
    params.addFilter('status', 'A');
    return this.imageMediaService
      .getAllFilter(params.getParams())
      .pipe(map(response => response.data[0].id));
  }

  exportPgrDocs(folio: string | number, action: string) {
    const { officeNumber } = this.selectedRow;
    if (action == 'I' || action == 'S') {
      this.alert(
        'info',
        'Aviso',
        'El Oficio tiene No. Volante relacionado, se guardarán los documentos.'
      );
      this.fileBrowserService.moveFile(folio, officeNumber).subscribe({
        next: () => {
          this.getData();
          let config = {
            class: 'modal-lg modal-dialog-centered',
            initialState: {
              pgrOffice: officeNumber,
            },
            ignoreBackdropClick: true,
          };
          this.modalService.show(PgrFilesComponent, config);
        },
        error: () => {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio un error al copiar los documentos'
          );
        },
      });
      // copy img
      // view pgr docs
    } else if (action == 'C') {
      // view pgr docs
      let config = {
        class: 'modal-lg modal-dialog-centered',
        initialState: {
          pgrOffice: officeNumber,
        },
        ignoreBackdropClick: true,
      };
      this.modalService.show(PgrFilesComponent, config);
    }
  }

  validDoc() {
    const { flierNumber, proceedingsNumber, officeNumber } = this.selectedRow;
    let config = {
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        pgrOffice: officeNumber,
      },
      ignoreBackdropClick: true,
    };
    this.modalService.show(PgrFilesComponent, config);
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
    const params = new FilterParams();
    params.addFilter('flyerNumber', this.selectedRow?.flierNumber);
    this.documentsService.getAllFilter(params.getParams()).subscribe({
      next: () => {
        const title = RELATED_FOLIO_TITLE;
        const modalRef = this.openDocumentsModal(
          this.selectedRow?.flierNumber,
          title
        );
        modalRef.content.selected
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(document => this.goToScanDocuments(document));
      },
      error: async error => {
        if (error.status < 500) {
          const result = await this.alertQuestion(
            'warning',
            'Advertencia',
            'No se ha generado una solicitud de escaneo. ¿Desea generarla?'
          );
          if (result.isConfirmed) {
            this.router.navigate(
              [
                `/pages/general-processes/scan-request/${this.selectedRow.flierNumber}`,
              ],
              { queryParams: { origin: 'FGESTBUZONTRAMITE' } }
            );
          }
        }
      },
    });
  }

  goToScanDocuments(document: IDocuments) {
    const { id } = document;
    this.router.navigate(['/pages/general-processes/scan-documents'], {
      queryParams: {
        folio: id,
        origin: 'FGESTBUZONTRAMITE',
      },
    });
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
    //     //console.log(resp);
    //   }
    // })
    const $obs = this.workService.getViewBienes;
    const service = this.workService;
    const columns = WORK_BIENES_COLUMNS;
    const title = BIENES_TITLE;
    const params = new FilterParams();
    params.addFilter('fileNumber', this.selectedRow.proceedingsNumber);
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
    const modalRef = this.modalService.show(MailboxModalTableComponent, config);
  }

  acptionAntecedente() {
    // this.workService.getViewAntecedente('598154').subscribe({
    //   next: (resp: any) => {
    //     //console.log(resp);
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
    this.modalService.show(MailboxModalTableComponent, config);
  }

  userChange(user: any) {
    //console.log(user);
    if (user == undefined) {
      delete this.columnFilters['filter.turnadoiUser'];
    }
    const params = new ListParams();
    //console.log(params)
    this.filterForm.controls['managementArea'].setValue(null);
    this.areas$ = new DefaultSelect([], 0, true);
    this.getGroupWork(params, true);
    const _user = this.user.value;
    //console.log(_user);
    const _area = this.managementAreaF.value;
    if (_user && _area) {
      this.setDefaultValuesByArea(_area, _user);
    }
  }

  getUsers($params: ListParams) {
    //console.log($params);
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    const area = this.managementAreaF.value;
    /*if (area) {
      const _params = new FilterParams();
      _params.page = params.page;
      //_params.addFilter('id', area.managementArea);
      //_params.addFilter('user', params.search, SearchFilter.ILIKE);
     
      this.getAllManagementGroupAreas(_params)
        .pipe(
          map(response => response.data.map(group => group.user)),
          switchMap(users => {
            const __params = new FilterParams();
            __params.addFilter('id', users.join(','), SearchFilter.IN);
            return this.getAllUsers(__params);
          })
        )
        .subscribe();
       this.getAllUsers(_params).subscribe();
    } else {
      this.getAllUsers(params).subscribe();
    }*/
    params.search = $params.text;
    //params.addFilter('name', $params.text, SearchFilter.LIKE);
    this.getAllUsers(params).subscribe();
  }

  getAllUsers(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }

  resetFilters(): void {
    this.columnFilters = [];
    this.dataTable.reset();
    this.filterForm.reset();
    this.filterForm = this.fb.group({
      managementArea: [null],
      user: [null],
      verTramiteG: [null],
      actualizarBuzon: [null],
      pendientes: [null],
      predetermined: [null],
      priority: [null],
      processStatus: [null],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      startDate: [null],
      endDate: [null],
    });
    this.priority$ = null;
    this.filterForm.updateValueAndValidity();
    //console.log(this.filterForm.value);
    let field = `filter.processEntryDate`;
    delete this.columnFilters[field];
    this.resetDataFilter = true;
    // this.getUser();
    // this.getData();
    // this.dataTable.refresh();
    this.buildFilters();
  }

  notAvailable(): void {
    this.alertQuestion(
      'info',
      'No disponible',
      'Funcionalidad no disponible en este momento'
    );
  }

  workFunction(action: string): void {
    this.dataTable.getAll().then(data => {
      const turnSelects = data.filter((elem: any) => elem.turnSelect);
      if (this.selectedRow !== null) {
        switch (action) {
          case 'work':
            turnSelects.length === 1
              ? this.work()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.work();
                });
            break;
          case 'acptionAntecedente':
            turnSelects.length === 1
              ? this.acptionAntecedente()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.acptionAntecedente();
                });
            break;
          case 'acptionBienes':
            turnSelects.length === 1
              ? this.acptionBienes()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.acptionBienes();
                });
            break;
          case 'viewFlyerHistory':
            turnSelects.length === 1
              ? this.viewFlyerHistory()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.viewFlyerHistory();
                });
            break;
          case 'viewIndicatorsHistory':
            turnSelects.length === 1
              ? this.viewIndicatorsHistory()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.viewIndicatorsHistory();
                });
            break;
          case 'replicate':
            turnSelects.length === 1
              ? this.replicate()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.replicate();
                });
            break;
          case 'turnPaperwork':
            this.turnPaperwork();
            break;
          case 'viewPictures':
            turnSelects.length === 1
              ? this.viewPictures()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.viewPictures();
                });
            break;
          case 'onFinishPaperwork':
            turnSelects.length === 1
              ? this.onFinishPaperwork()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.onFinishPaperwork();
                });
            break;
          case 'onCancelPaperwork':
            turnSelects.length === 1
              ? this.onCancelPaperwork()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.onCancelPaperwork();
                });
            break;
          case 'onSavePaperwork':
            turnSelects.length === 1
              ? this.onSavePaperwork()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.onSavePaperwork();
                });
            break;
          case 'validDoc':
            turnSelects.length === 1
              ? this.validDoc()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.validDoc();
                });
            break;
          case 'viewDoc':
            turnSelects.length === 1
              ? this.viewDoc()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.viewDoc();
                });
            break;
          case 'scanDocuments':
            turnSelects.length === 1
              ? this.scanDocuments()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.scanDocuments();
                });
            break;
          case 'getSolicitud':
            turnSelects.length === 1
              ? this.getSolicitud()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.getSolicitud();
                });
            break;
          case 'getNotificationsReport':
            turnSelects.length === 1
              ? this.getNotificationsReport()
              : this.takeOneProcess(turnSelects).then(() => {
                  this.getNotificationsReport();
                });
            break;
          case 'getIdentifier':
            this.getIdentifier();
            /*turnSelects.length === 1 ? 
              this.getIdentifier():
              this.takeOneProcess(turnSelects).then(()=>{
                this.getIdentifier();
              });*/
            break;
          case 'updateObservations':
            turnSelects.length === 1
              ? this.updateObservations()
              : this.takeOneProcess(turnSelects).then(() => {
                  console.log('return');
                  this.updateObservations();
                });
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
          'No ha seleccionado ningún registro',
          'Por favor seleccione un registro, para poder ejecutar la acción'
        );
      }
    });
  }

  async takeOneProcess(turnSelects: any) {
    return this.alertInfo(
      'info',
      'Más de un trámite seleccionado',
      'Se tomará el último registro seleccionado'
    ).then(data => {
      console.log(this.selectedRow);
      const notSelected = turnSelects.filter(
        (elem: any) => elem.processNumber !== this.selectedRow.processNumber
      );
      console.log(notSelected);
      const polls = notSelected.map(async (elem: any) => {
        elem.turnSelect = false;
        return await this.dataTable.update(elem, elem);
      });
      return polls;
    });
  }

  getSolicitud() {
    if (this.selectedRow.flierNumber) {
      this.router.navigate(
        [
          `/pages/general-processes/scan-request/${this.selectedRow.flierNumber}`,
        ],
        { queryParams: { origin: 'FGESTBUZONTRAMITE' } }
      );
    } else {
      this.alert(
        'info',
        'Aviso',
        'El Oficio no tiene volante relacionado, no puede generarse una solicitud de digitalización'
      );
    }
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

  getNotificationsReport(): void {
    if (!this.selectedRow?.folioRep) {
      const params = {
        P_DEF_WHERE: 'WHERE ', //||:T_WHERE);
      };
      const report = 'RGESTBUZONTRAMITE';
      this.onLoadToast(
        'info',
        'RGESTBUZONTRAMITE No disponible',
        'Reporte no disponible en este momento'
      );
      //console.log(report);
    } else {
      if (this.selectedRow?.processStatus === 'OPI') {
        const params = {
          PFOLIO: this.selectedRow?.folioRep,
          PTURNADOA: this.selectedRow?.turnadoiUser,
        };
        this.siabService
          .fetchReport('RFOL_DOCTOSRECIB_SATSAE', params)
          .subscribe({
            next: response => {
              const blob = new Blob([response], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              let config = {
                initialState: {
                  documento: {
                    urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                    type: 'pdf',
                  },
                  callback: (data: any) => {},
                }, //pasar datos por aca
                class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
                ignoreBackdropClick: true, //ignora el click fuera del modal
              };
              this.modalService.show(PreviewDocumentsComponent, config);
            },
            error: error => {
              this.onLoadToast(
                'error',
                'No disponible',
                'Reporte no disponible'
              );
            },
          });
      } else {
        this.alertQuestion(
          'info',
          'No permitido',
          'El reporte para los trámites con estatus diferente a "OPI", no está disponible'
        );
      }
    }
  }

  getIdentifier2(): void {
    this.loading = true;
    //Get NextVal SEQ_RASTREADOR
    //console.log(this.selectedRow.flierNumber);
    if (this.selectedRow?.flierNumber) {
      const flierNumber = this.selectedRow?.flierNumber;
      this.goodTrackerService.getIdentifier().subscribe({
        next: (resp: any) => {
          //console.log(resp);
          if (resp.nextval) {
            const tmpTracker = {
              identificator: resp.nextval,
              goodNumber: flierNumber,
            };
            this.goodTrackerService.createTmpTracker(tmpTracker).subscribe({
              next: (resp: any) => {
                //console.log('insert tmp_rastreador');
                this.loading = false;
                this.getFlyersReport(tmpTracker.identificator);
              },
              error: error => {
                this.loading = false;
                this.onLoadToast(
                  'warning',
                  'Ocurrió un error',
                  'No se pudo guardar la información del identificador, solo se visualizará el primer volante'
                );
                this.getFlyersReport(null, flierNumber);
              },
            });
          }
        },
        error: error => {
          this.loading = false;
          this.onLoadToast(
            'warning',
            'Ocurrió un error',
            'No se pudo generar un identificador, solo se visualizará el primer volante'
          );
          this.getFlyersReport(null, flierNumber);
        },
      });
    } else {
      this.loading = false;
      this.alert(
        'info',
        'Aviso',
        'El Oficio no tiene volante relacionado, el reporte no puede generarse'
      );
    }
  }

  getIdentifier(): void {
    this.loading = true;
    //Get NextVal SEQ_RASTREADOR
    this.goodTrackerService.getIdentifier().subscribe({
      next: (resp: any) => {
        //console.log(resp);
        if (resp.nextval) {
          this.dataTable.getAll().then(data => {
            const turnSelects = data.filter((elem: any) => elem.turnSelect);
            const promises = turnSelects.map(async (elem: any) => {
              if (elem?.flierNumber) {
                const flierNumber = elem?.flierNumber;
                console.log(elem.flierNumber);
                const tmpTracker = {
                  identificator: resp.nextval,
                  goodNumber: flierNumber,
                };
                let promise = await firstValueFrom(
                  this.goodTrackerService.createTmpTracker(tmpTracker)
                );
                return promise;
              } else {
                throw new Error('false');
              }
            });
            Promise.allSettled(promises).then(polls => {
              console.log(polls);
              this.loading = false;
              const isSaveTmp = polls.filter(
                elem => elem.status === 'fulfilled'
              );

              console.log(isSaveTmp.length, turnSelects.length);
              if (isSaveTmp.length === turnSelects.length) {
                this.getFlyersReport(resp.nextval);
              } else if (isSaveTmp.length > 0) {
                this.alertInfo(
                  'info',
                  'Aviso',
                  'Solo se visualizará el reporte de los Oficios con volantes relacionados'
                );
                this.getFlyersReport(resp.nextval);
              } else {
                this.alertInfo(
                  'info',
                  'Aviso',
                  'El Oficio no tiene volante relacionado, el reporte no puede generarse'
                );
              }
            });
          });
        }
      },
      error: error => {
        this.loading = false;
        this.alertInfo(
          'warning',
          'Ocurrió un error',
          'No se pudo generar un identificador, solo se visualizará el primer volante'
        );
        if (this.selectedRow?.flierNumber) {
          const flierNumber = this.selectedRow?.flierNumber;
          this.getFlyersReport(null, flierNumber);
        } else {
          this.loading = false;
          this.alertInfo(
            'info',
            'Aviso',
            'El Oficio no tiene volante relacionado, el reporte no puede generarse'
          );
        }
      },
    });
  }
  getFlyersReport(identificator?: number, flierNumber?: number): void {
    this.loading = true;
    let params = {};

    if (identificator !== null) {
      params = {
        PN_VOLANTEINI: 0,
        PN_VOLANTEFIN: 0,
        P_IDENTIFICADOR: identificator,
      };
    } else if (flierNumber) {
      params = {
        PN_VOLANTEINI: flierNumber.toString(),
        PN_VOLANTEFIN: flierNumber.toString(),
      };
    }

    this.siabService.fetchReport('RCONCOGVOLANTESRE', params).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No disponible', 'Reporte no disponible');
      },
    });
  }

  openModal(context?: Partial<ObservationsComponent>) {
    const modalRef = this.modalService.show(ObservationsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.onLoadToast('success', 'Elemento Actualizado', '');
        this.getData();
      }
    });
  }

  updateObservations() {
    const process = this.selectedRow;
    this.openModal({ process });
  }

  onSaveConfirm(event: any) {
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Actualizado', '');
  }
}
