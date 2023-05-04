import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { DocumentsPartOfficeService } from '../documents-part-office.service';
//Models
import {
  IManagementArea,
  IProceduremanagement,
} from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
/*Redux NgRX Global Vars Service*/
import { BsModalService } from 'ngx-bootstrap/modal';
import { GlobalVarsService } from 'src/app//shared/global-vars/services/global-vars.service';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { HistoryIndicatorService } from 'src/app/core/services/ms-history-indicator/history-indicator.service';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { HistoricalProcedureManagementService } from 'src/app/core/services/ms-procedure-management/historical-procedure-management.service';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';

import { addDays, subDays } from 'date-fns';
import {
  DOCUMENT_PART_OFFCIE_COLUMNS,
  DOCUMENT_PART_OFFCIE_COLUMNS2,
} from '../documents-part-office/documents-part-office-columns';

import { DomSanitizer } from '@angular/platform-browser';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { maxDate, minDate } from 'src/app/common/validations/date.validators';
import { IRequestInformation } from 'src/app/core/models/requests/requestInformation.model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import Swal from 'sweetalert2';
import { DocumentPartOfficeModalComponent } from '../document-part-office-modal/document-part-office-modal.component';

@Component({
  selector: 'app-documents-part-office',
  templateUrl: './documents-part-office.component.html',
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
export class DocumentsPartOfficeComponent extends BasePage implements OnInit {
  //TODO: TYPE ALL
  rdoD: boolean = true;
  rdoT: boolean = false;
  rdoR: boolean = false;
  userDel: number = -1;
  newFolio_rep: number = 0;
  disableReg: boolean = false;
  disableUpd: boolean = true;
  Consec: number = 1;
  dataTable: LocalDataSource = new LocalDataSource();
  dataTableC: LocalDataSource = new LocalDataSource();
  dataTaC: IProceduremanagement[] = [];
  dataTa: any[] = [];
  dataTaR: any[] = [];
  data: any[] = [];
  dataTAsuntos: any[] = [
    { id: 1, descripcion: 'Acta Circunstanciada' },
    { id: 2, descripcion: 'Amparo' },
    { id: 3, descripcion: 'Averiguación Previa' },
    { id: 4, descripcion: 'Causa Penal' },
    { id: 5, descripcion: 'Expediente Transferente' },
  ];
  dataSelect: any = {};

  consultaOk: boolean = false;

  settings2 = { ...TABLE_SETTINGS };

  public typeDoc: string = '';
  regDocForm: boolean = true;
  regDocView: boolean = true;
  searchRequestSimGoods: boolean = true;
  selectGoods: boolean = true;
  guidelines: boolean = true;
  docRequest: boolean = true;
  expRequest: boolean = true;
  viewSelectedGoods: boolean = true;
  dictumValidate: boolean = true;
  /**
   * SET STATUS ACTIONS
   **/
  saveRequest: boolean = true;
  turnReq: boolean = true;
  createReport: boolean = true;
  rejectReq: boolean = true;

  requestId: number = NaN;
  contributor: string = '';
  title: string;
  requestInfo: IRequestInformation;
  screenWidth: number;

  selectedRow: any = null;
  P_SAT_TIPO_EXP: string = '';
  satTypeProceedings: string = null;
  testurl: any;
  //Filters
  priority$: string = null;

  selectedArea: string;
  //users$: any = [];

  totalItems: number = 0;
  totalOP: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  columnFilters: any = [];
  form1: FormGroup = new FormGroup({});

  form: FormGroup = this.fb.group({
    verTramite: [null],
    actualizarBuzon: [null],
    pendientes: [null],
    observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
  });

  filterForm: FormGroup = this.fb.group({
    dailyConsecutiveNumber: [null],
    managementArea: [null],
    descentfed: [null, [Validators.required]],
    issueType: [null, [Validators.required]],
    issue: [null, [Validators.required]],
    desalojo: [true],
    office: [true],
    officeNumber: [null, [Validators.required]],
    sheets: [null, [Validators.required]],
    turnadoiUser: [null, [Validators.required]],
    sistema: [false],
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

  filterForm2: FormGroup = this.fb.group({
    dailyConsecutiveNumber: [null],
    descentfed: [null, [Validators.required]],
    issueType: [null, [Validators.required]],
    issue: [null, [Validators.required]],
    desalojo: [true],
    office: [true],
    officeNumber: [null, [Validators.required]],
    sheets: [null, [Validators.required]],
    turnadoiUser: [null, [Validators.required]],
    startDate: [null],
    endDate: [null],
    folio: [null],
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
  Edos$ = new DefaultSelect<ISegUsers>();
  areas$ = new DefaultSelect<IManagementArea>();
  tasuntos$ = new DefaultSelect<IManagementArea>();

  get descentfed() {
    return this.filterForm.controls['estado'];
  }
  get issueType() {
    return this.filterForm.controls['issueType'];
  }
  get issue() {
    return this.filterForm.controls['issue'];
  }
  get desalojo() {
    return this.filterForm.controls['desalojo'];
  }
  get officeNumber() {
    return this.filterForm.controls['officeNumber'];
  }
  get sheets() {
    return this.filterForm.controls['sheets'];
  }
  get turnadoiUser() {
    return this.filterForm.controls['turnadoiUser'];
  }
  get sistema() {
    return this.filterForm.controls['sistema'];
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

  ///-------------------------------------------

  get startDate2() {
    return this.filterForm2.controls['startDate'];
  }
  get endDate2() {
    return this.filterForm2.controls['endDate'];
  }
  get folio() {
    return this.filterForm2.controls['folio'];
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
    private notificationsService: NotificationService,
    private stateService: StateOfRepublicService,
    private siabService: SiabService
  ) {
    super();
    //this.settings.actions = true;
    this.settings.columns = DOCUMENT_PART_OFFCIE_COLUMNS2;
    this.settings = {
      ...this.settings,
      //mode: 'inline',
      actions: {
        ...this.settings.actions,
        delete: true,
        add: false,
        edit: true,
      },
    };
    this.settings2.columns = DOCUMENT_PART_OFFCIE_COLUMNS;
    this.settings2.hideSubHeader = false;
    this.settings2.actions.add = false;
  }

  ngOnInit(): void {
    //console.log(this.settings2);
    this.tasuntos$ = new DefaultSelect(
      this.dataTAsuntos,
      this.dataTAsuntos.length
    );
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      //console.log('se ejecutó');
      if (this.predeterminedF.value) {
        this.getUser();
      } else {
        //this.getData();
      }
    });

    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      //if (this.consultaOk) {
      this.getProceduraManagment(0);
    });
  }
  changeRadio(event: any) {
    if (event.target.defaultValue == '1') {
      this.rdoD = true;
      this.rdoT = false;
      this.rdoR = false;
    }
    if (event.target.defaultValue == '2') {
      this.rdoD = false;
      this.rdoT = true;
      this.rdoR = false;
    }
    if (event.target.defaultValue == '3') {
      this.rdoD = false;
      this.rdoT = false;
      this.rdoR = true;
    }
  }
  getProceduraManagment(val: number) {
    this.loading = true;
    if (this.rdoD) {
      this.params2.getValue()['filter.actualDate'] = this.dateFormat(
        new Date()
      );
    }
    if (this.rdoR) {
      this.params2.getValue()['filter.actualDate'] = `$btw:${this.dateFormat(
        new Date(this.startDate2.value)
      )},${this.dateFormat(new Date(this.endDate2.value))}`;
    }
    if (this.rdoT) {
      this.params2.getValue()['filter.actualDate'] = `$gt:${this.dateFormat(
        new Date('2015-01-01')
      )}`;
    }
    if (this.folio.value != null) {
      if (this.folio.value.length > 0) {
        this.params2.getValue()['filter.folio'] = `$eq:${this.folio.value}`;
      }
    }

    this.procedureManagementService
      .getAllFiltered(this.params2.getValue())
      .subscribe({
        next: (data: any) => {
          this.totalOP = data.count;
          this.dataTaC = data.data;
          //console.log(this.dataTaC);
          this.loading = false;
        },
        error: () => {
          this.newFolio_rep = 0;
          this.loading = false;
        },
      });

    delete this.params2.getValue()['filter.actualDate'];
    delete this.params2.getValue()['filter.folio'];

    console.log('Inicia el recorrido.');
    console.log(this.params2.getValue());
    console.log('Fin del recorrido.');
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
        this.filterForm.controls['turnadoiUser'].setValue(data.data[0]);
        let $params = new ListParams();
      },
      error: () => {
        //this.users$ = new DefaultSelect();
      },
    });
  }
  getUsers($params: ListParams) {
    //console.log($params);
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.addFilter('name', $params.text, SearchFilter.LIKE);
    this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: data => {
        data.data.map(user => {
          user.userAndName = `${user.id}`;
          return user;
        });
        //console.log(data.data);
        this.users$ = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.users$ = new DefaultSelect();
      },
    });
  }

  getDelegacion(event: any) {
    //console.log(event);
    this.userDel = event.usuario.delegationNumber;
    //console.log(event);
    this.procedureManagementService.getFolioMax(this.userDel).subscribe({
      next: data => {
        this.newFolio_rep = Number(data.folioMax);
        //console.log(this.newFolio_rep + 1);
      },
      error: () => {
        this.newFolio_rep = 0;
      },
    });
  }

  getEdos(parameter: ListParams): void {
    let params = new FilterParams();
    params.addFilter('descentfed', SearchFilter.EQ);
    //console.log('Testldfgñsldkf');
    this.stateService.getAll(parameter).subscribe({
      next: data => {
        this.filterParams.getValue().removeAllFilters();
        data.data.map(edo => {
          edo.descCondition = `${edo.descCondition}`;
          return edo;
        });
        this.Edos$ = new DefaultSelect(data.data, data.count);
        //console.log(data.count);
        //this.filterForm.controls['descentfed'].setValue(data.data);
        let $params = new ListParams();
      },
      error: () => {
        //this.users$ = new DefaultSelect();
        console.log('Error en la invocations');
      },
    });
  }
  getData() {
    let field = `filter.turnadoiUser`;
    if (this.predeterminedF.value) {
      const token = this.authService.decodeToken();
      let userId = token.preferred_username;
      this.columnFilters[field] = `$eq:${userId.toUpperCase()}`;
    }

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

  /*Redux NgRX Global Vars Get Initial State*/
  getGlobalVars() {
    this.globalVarsService
      .getGlobalVars$()
      .subscribe((globalVars: IGlobalVars) => {
        this.globalVars = globalVars;
        // console.log(globalVars);
      });
  }

  register() {
    if (this.filterForm.valid) {
      this.filterForm.get('dailyConsecutiveNumber').setValue(this.Consec);
      //console.log(this.filterForm.value);
      this.dataTa.push(this.filterForm.value);
      this.dataTable.load(this.dataTa);
      this.dataTable.refresh();
      this.Consec = this.Consec + 1;
      //console.log(this.dataTa);
      this.filterForm.reset();
      Swal.fire('Registro', '', 'success');
    } else {
      this.onLoadToast(
        'warning',
        'Advertencia',
        'No a seleccionado todos los campos requeridos'
      );
      this.filterForm.markAllAsTouched();
    }
  }
  editarOP(event: any) {
    this.disableReg = true;
    this.disableUpd = false;
    //console.log(event.data);
    this.filterForm.patchValue(event.data);
  }
  editarOPmodal(event: any) {
    this.disableReg = true;
    this.disableUpd = false;
    //console.log(event.data);
    this.filterForm.patchValue(event.data);
  }
  cdeleteOP(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.dataTa = this.dataTa.filter(
          dat =>
            dat.dailyConsecutiveNumber !== event.data.dailyConsecutiveNumber
        );
        this.dataTable.load(this.dataTa);
        this.dataTable.refresh();
        Swal.fire('Borrado', '', 'success');
      }
    });
  }
  udpateReg() {
    this.disableReg = false;
    let idx = this.dataTa.findIndex(
      dat =>
        dat.dailyConsecutiveNumber ==
        this.filterForm.get('dailyConsecutiveNumber').value
    );
    //console.log(idx);
    this.dataTa[idx] = this.filterForm.value;
    //console.log(this.dataTa);
    this.dataTable.load(this.dataTa);
    this.dataTable.refresh();
    this.disableUpd = true;
    this.filterForm.reset();
    Swal.fire('Actualizado', '', 'success');
  }

  saveGestion() {
    //console.log(this.newFolio_rep + 1);
    let cont1 = 0;
    const token = this.authService.decodeToken();
    let userId = token.preferred_username;
    this.dataTa.forEach(dat => {
      const body: IProceduremanagement = {
        status: 'OPI',
        situation: 1,
        userTurned: dat.turnadoiUser,
        actualDate: this.dateFormat(new Date()),
        dailyConsecutiveNumber: dat.dailyConsecutiveNumber,
        admissionDate: this.dateFormat(new Date()),
        flierNumber: null,
        expedient: null,
        affair: dat.issue.toUpperCase(),
        affairType: dat.issueType,
        officeNumber: dat.officeNumber.toUpperCase(),
        classificationDicta: '',
        registerUser: userId.toUpperCase(),
        descentfed: dat.descentfed,
        sheet: dat.sheets,
        delegation: this.userDel,
        folio: this.newFolio_rep + 1,
        serieIfai: null,
      };
      this.procedureManagementService.create(body).subscribe({
        next: (data: any) => {
          this.dataTaR.push(data);
          cont1++;
        },
        error: error => {
          this.newFolio_rep = 0;
          console.log(error.error.message);
        },
      });
    });
    //this.getReportBlank("blank");
    try {
      //console.log("Line 584");
      this.dataTable.load(this.dataTaR);
      this.dataTable.refresh();
      //console.log(this.dataTable);
      this.limpiar();
      Swal.fire('Guardado', '', 'success');
    } catch (error) {}

    try {
      this.getReport('RGERGENSOLICDIGIT', { pn_folio: 1 });
    } catch (error) {
      Swal.fire('No se puedo generar el reporte', '', 'error');
    }

    //this.userDel, this.newFolio_rep
  }
  getReport(report: string, params: any): void {
    this.siabService.fetchReport(report, params).subscribe({
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
  getReportBlank(report: string): void {
    this.siabService.fetchReportBlank(report).subscribe({
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
  limpiar() {
    this.userDel = -1;
    this.newFolio_rep = 0;
    this.disableReg = false;
    this.disableUpd = true;
    this.Consec = 1;
    this.dataTable = new LocalDataSource();
    this.dataTa = [];
    this.dataTaR = [];
    this.data = [];
    this.filterForm.reset();
    this.dataTable.load(this.dataTa);
    this.dataTable.refresh();
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

  dateFormat(date: Date) {
    let fecha = date;
    let anio = fecha.getFullYear();
    let mes: any = fecha.getMonth() + 1;
    let dia: any = fecha.getDate();
    if (mes < 10) {
      mes = '0' + mes;
    }
    if (dia < 10) {
      dia = '0' + dia;
    }
    return anio + '-' + mes + '-' + dia;
  }
  openForm(datos?: IProceduremanagement) {
    if (datos.status == 'OPI' || datos.status == 'OPP' || datos.status == 'I') {
      const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
      modalConfig.initialState = {
        datos,
        callback: (next: boolean) => {
          if (next) this.getProceduraManagment(0);
        },
      };
      this.modalService.show(DocumentPartOfficeModalComponent, modalConfig);
    } else {
      this.onLoadToast(
        'warning',
        'Aviso',
        'No se puede realizar la modificación. Verifica que el trámite esté en OPI, OPP.'
      );
    }
  }

  mayus(evet: any) {
    let dat = evet.target.value.toUpperCase();
    return dat;
  }
}
