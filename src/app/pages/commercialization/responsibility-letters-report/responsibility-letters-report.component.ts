import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { IComerLetter } from 'src/app/core/models/ms-parametercomer/comer-letter';
import {
  IClientLot,
  IComerLotsEG,
  IRespLetter,
} from 'src/app/core/models/ms-parametercomer/parameter';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { SubDelegationService } from 'src/app/core/services/maintenance-delegations/subdelegation.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ComerLetterService } from 'src/app/core/services/ms-parametercomer/comer-letter.service';
import { ComerLotService } from 'src/app/core/services/ms-parametercomer/comer-lot.service';
import { RespLetterService } from 'src/app/core/services/ms-parametercomer/resp-letter';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FindRespLetterComponent } from './find-resp-letter/find-resp-letter.component';
import { COMEMR_BIENES_COLUMNS } from './resp-letter-columns';

@Component({
  selector: 'app-responsibility-letters-report',
  templateUrl: './responsibility-letters-report.component.html',
  styles: [
    `
      .bg-gray {
        background-color: #eee !important;
      }
    `,
  ],
})
export class ResponsibilityLettersReportComponent
  extends BasePage
  implements OnInit
{
  comerLibsForm: FormGroup;
  bienesLotesForm: FormGroup;
  respForm: FormGroup;
  clientForm: FormGroup;
  goodList: IGood;
  dataGood: any;
  totalItems: number = 0;
  bienesLoading: boolean = false;
  idEvent: number = 0;
  descArea: string;
  event: IComerEvent;
  area: IDepartment;
  respLetter: IRespLetter;
  comerLots: IComerLotsEG;
  dataTableGood: LocalDataSource = new LocalDataSource();
  selectEvent = new DefaultSelect<IComerLotsEG>();
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  selectLot = new DefaultSelect<IComerLotsEG>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsBienes = new BehaviorSubject<ListParams>(new ListParams());
  idLot: number = 0;
  bienes: any;
  client: IClientLot;
  faEtapaCreada: number = 0;
  maxDate = new Date();
  letter: IComerLetter;
  read: boolean = false;
  update: boolean = false;
  delete: boolean = false;
  insert: boolean = false;
  lettersAll: IComerLetter[] = [];
  idGood: number = null;
  dateLetter = new Date();
  valid: boolean = false;
  dateFinal: string;
  validPermisos: boolean = false;
  start: string;
  department: string = '';
  delegationName: string = '';
  userName: string = '';
  puestoUser: string = '';
  letterDefault: any = null;
  subDelegation: string = '';
  carta: string;
  desType: string;
  screenKey = 'FCOMERCARTARESP_I';
  // params = new BehaviorSubject<ListParams>(new ListParams());
  dataUserLoggedTokenData: any;
  selectDataEvent = new DefaultSelect();
  selectDataLote = new DefaultSelect();
  P_DIRECCION: string = 'M';
  origin: string = '';
  dataVal: any = null;

  get oficio() {
    return this.comerLibsForm.get('oficio');
  }

  get diridoA() {
    return this.comerLibsForm.get('diridoA');
  }

  get adjudicatorio() {
    return this.comerLibsForm.get('adjudicatorio');
  }
  get factura() {
    return this.comerLibsForm.get('factura');
  }
  get fechaFactura() {
    return this.comerLibsForm.get('fechaFactura');
  }

  get lote() {
    return this.bienesLotesForm.get('lote');
  }
  get description() {
    return this.bienesLotesForm.get('description');
  }
  get cveProceso() {
    return this.bienesLotesForm.get('cveProceso');
  }

  get descEvent() {
    return this.bienesLotesForm.get('descEvento');
  }

  get rfc() {
    return this.clientForm.get('rfc');
  }
  get calle() {
    return this.clientForm.get('calle');
  }
  get delegation() {
    return this.clientForm.get('delegation');
  }
  get colonia() {
    return this.clientForm.get('colonia');
  }
  get estado() {
    return this.clientForm.get('estado');
  }
  get ciudad() {
    return this.clientForm.get('ciudad');
  }
  get cp() {
    return this.clientForm.get('cp');
  }

  get paragraph1() {
    return this.respForm.get('paragraph1');
  }
  get paragraph2() {
    return this.respForm.get('paragraph2');
  }
  get paragraph3() {
    return this.respForm.get('paragraph3');
  }

  valLote: boolean = false;
  valOficio: boolean = false;
  selectDataOficio = new DefaultSelect<any>();
  columnFilters: any = [];
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  constructor(
    private fb: FormBuilder,
    private securityService: SecurityService,
    private departamentService: DepartamentService,
    private reportService: ReportService,
    private comerLotService: ComerLotService,
    private comerLetterService: ComerLetterService,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private subDelegationService: SubDelegationService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private respLetterService: RespLetterService,
    private authService: AuthService,
    private comerEventService: ComerEventService,
    private msLotService: LotService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private msComerClientsService: ComerClientsService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...COMEMR_BIENES_COLUMNS,
      },
      noDataMessage: 'No se encontrarón registros',
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareTableBienXLot();
    this.dateFinal = this.datePipe.transform(this.maxDate, 'dd/MM/yyyy');
    const token = this.authService.decodeToken();
    this.dataUserLoggedTokenData = token;
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        console.log(params);
        this.origin = params['origin'] ?? null;
        this.P_DIRECCION = params['P_DIRECCION'] ?? null;
        console.log(params);
      });
  }

  prepareTableBienXLot() {
    this.dataTableGood
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.comerBienesLetter();
        }
      });

    this.paramsBienes.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems > 0) this.comerBienesLetter();
    });
  }
  prepareForm() {
    this.department = this.authService.decodeToken().department;
    this.delegationName = this.authService.decodeToken().delegacionreg;
    this.subDelegation = this.authService.decodeToken().puesto;
    this.puestoUser = this.authService.decodeToken().puesto;
    this.userName = this.authService.decodeToken().preferred_username;
    this.userTracker(
      this.screenKey,
      this.authService.decodeToken().preferred_username
    );
    this.comerLibsForm = this.fb.group({
      oficio: [
        null,
        [
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(50),
          Validators.required,
        ],
      ],
      adjudicatorio: [null, [Validators.pattern(STRING_PATTERN)]],
      factura: [
        null,
        [
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(20),
          Validators.required,
        ],
      ],
      fechaFactura: [null, [Validators.required]],
      fechaCarta: [null],
      fechaFallo: [null],
      cveProceso: [null],
      nombreFirma: [null],
      puestoFirma: [null],
      nombreCcp1: [null],
      puestoCcp1: [null],
      nombreCcp2: [null],
      puestoCcp2: [null],
      lote: [null, Validators.required],
      evento: [null],
      evento_descripcion: [null],
      lote_descripcion: [null],
    });
    this.bienesLotesForm = this.fb.group({
      lote: [null],
      evento: [null],
      descEvento: [null],
      description: [null],
      cveProceso: [null],
    });
    this.clientForm = this.fb.group({
      rfc: [null],
      calle: [null],
      colonia: [null],
      ciudad: [null],
      delegacion: [null],
      estado: [null],
      cp: [null],
      adjudicatorio: [null],
    });
    this.respForm = this.fb.group({
      id: [null],
      paragraph1: [null, Validators.required],
      paragraph2: [null, Validators.required],
      paragraph3: [null, Validators.required],
    });
  }
  confirm(): void {
    if (this.letterDefault == null) {
      this.alert('warning', 'Realiza una consulta para continuar', '');
      return;
    }
    this.loading = true;
    // console.log(this.comerLibsForm.value);
    this.carta = this.datePipe.transform(this.letter.invoiceDate, 'dd/MM/yyyy');
    this.start = this.datePipe.transform(this.letter.invoiceDate, 'dd/MM/yyyy');
    let params = {
      DESTYPE: this.bienesLotesForm.value.description,
      ID_LOTE: this.bienesLotesForm.controls['lote'].value,
      OFICIO_CARTALIB: this.comerLibsForm.value.oficio,
      // DIRIGIDO_A: this.comerLibsForm.controls['diridoA'].value,
      // PUESTO: this.comerLibsForm.controls['puesto'].value,
      PARRAFO1: this.respForm.controls['paragraph1'].value,
      ADJUDICATARIO: this.comerLibsForm.controls['adjudicatorio'].value,
      NO_FACTURA: this.comerLibsForm.controls['factura'].value,
      FECHA_FACTURA: this.start,
      PARRAFO2: this.respForm.controls['paragraph2'].value,
      // FIRMANTE: this.comerLibsForm.controls['firmante'].value,
      // PUESTOFIRMA: this.comerLibsForm.controls['puestoFirma'].value,
      // CCP1: this.comerLibsForm.controls['ccp1'].value,
      // CCP2: this.comerLibsForm.controls['ccp1'].value,
      // PUESTOCCP1: this.comerLibsForm.controls['puestoCcp1'].value,
      // PUESTOCCP2: this.comerLibsForm.controls['puestoCcp2'].value,
      FECHA_CARTA: this.carta,
    };

    console.log(params);
    this.siabService
      // .fetchReport('RCOMERCARTALIB', params)
      .fetchReportBlank('blank')
      .subscribe(response => {
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
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
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
        }
      });
  }

  getComerLetterById(id: number) {
    this.loading = true;
    console.log('ID COMMER LETTER', id);
    this.comerLetterService.getById(id).subscribe({
      next: data => {
        // this.clientForm.reset();
        // this.loading = false;
        this.letter = data;
        console.log(data, this.letter);
        this.carta = this.datePipe.transform(
          this.letter.invoiceDate,
          'dd/MM/yyyy'
        );
        this.start = this.datePipe.transform(
          this.letter.invoiceDate,
          'dd/MM/yyyy'
        );
        this.comerLibsForm.get('oficio').setValue(this.letter.id);
        // this.comerLibsForm.get('fechaCarta').setValue(this.carta);
        // this.comerLibsForm.get('fechaFallo').setValue(this.carta);
        this.comerLibsForm.get('adjudicatorio').setValue(this.letter.signatory);
        this.comerLibsForm.get('factura').setValue(this.letter.invoiceNumber);
        this.comerLibsForm.get('fechaFactura').setValue(this.start);
        this.getComerLotes(this.letter.lotsId);
        this.getComerRespById(this.letter.id);
        // this.comerLibsForm.value.paragraph1 =
        //   'Derivado de la ' +
        //   this.bienesLotesForm.get('description').value +
        //   ' para la enajenación de vehiculos y/o bienes diversos ' +
        //   this.bienesLotesForm.get('cveProceso').value +
        //   ' celebrada el dia ' +
        //   this.carta;
        // '' +
        //   '. Solicito a usted sea entegada(s) la siguente(s) mercancias que a continuación se describe.';
        // this.comerLibsForm
        //   .get('paragraph1')
        //   .setValue(this.comerLibsForm.value.paragraph1);
      },
      error: () => {
        this.loading = false;
        console.log('error');
      },
    });
  }
  getComerRespById(id: string) {
    this.loading = true;
    this.respLetterService.getByIdResp(id).subscribe({
      next: data => {
        this.loading = false;
        this.respLetter = data;
        console.log(this.respLetter);
        this.respForm.get('paragraph1').setValue(this.respLetter.paragraph1);
        this.respForm.get('paragraph2').setValue(this.respLetter.paragraph2);
        this.respForm.get('paragraph3').setValue(this.respLetter.paragraph3);
      },
      error: () => {
        this.loading = false;
        console.log('error');
      },
    });
  }

  getDataCustomers(idLote: number) {
    this.loading = true;
    this.msComerClientsService.getDataCustomersByLote(idLote).subscribe({
      next: data => {
        this.loading = false;
        console.log(data);
        this.clientForm.patchValue(data.data[0]);
      },
      error: () => {
        this.loading = false;
        console.log('error');
      },
    });
  }

  searchComer(provider?: IComerLetter) {
    const { lote, oficio } = this.comerLibsForm.value;
    if (!lote) {
      this.alert('warning', 'Selecciona un Lote para continuar', '');
      return;
    }

    if (!oficio) {
      this.alert('warning', 'Selecciona un Oficio para continuar', '');
      return;
    }
    this.getAllComerLetterResp(oficio);
    this.comerBienesLetter();
    return;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
      P_DIRECCION: this.P_DIRECCION,
      loteId: lote,
      oficio,
    };
    // Reset on search
    this.comerLibsForm.get('oficio').reset();
    this.comerLibsForm.get('factura').reset();
    this.comerLibsForm.get('fechaFactura').reset();
    this.comerLibsForm.get('adjudicatorio').reset();
    this.bienesLotesForm.reset();
    this.dataTableGood.load([]);
    this.dataTableGood.refresh();
    this.totalItems = 0;
    this.respForm.reset();
    let modalRef = this.modalService.show(FindRespLetterComponent, modalConfig);
    modalRef.content.onSave.subscribe((next: any) => {
      this.letterDefault = next;
      console.log(next);
      this.comerLibsForm.controls['adjudicatorio'].setValue(
        this.letterDefault.signatory
      );
      this.idLot = next.lotsId;
      this.idEvent = next.idEvent;
      this.getComerLetterById(next.id);
    });
  }

  userTracker(screen: string, user: string) {
    let isfilterUsed = false;
    const params = this.params.getValue();
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;
    this.securityService.getScreenUser(screen, user).subscribe({
      next: (data: any) => {
        data.data.map((filter: any) => {
          if (
            filter.readingPermission == 'S' &&
            filter.writingPermission == 'S'
          ) {
            this.read = true;
            this.update = true;
            this.delete = true;
            this.insert = true;
            console.log(this.read);
            console.log(this.insert);
            console.log('readYes and writeYes');
            this.validPermisos = true;
          } else if (
            filter.readingPermission == 'S' &&
            filter.writingPermission == 'N'
          ) {
            this.read = true;
            console.log('readYes and writeNO');
          } else if (
            filter.readingPermission == 'N' &&
            filter.writingPermission == 'S'
          ) {
            this.insert = true;
            this.validPermisos = true;
            console.log('readNo and writeYes');
          } else if (
            filter.readingPermission == 'N' &&
            filter.writingPermission == 'N'
          ) {
            this.read = false;
            this.update = false;
            this.delete = false;
            this.insert = false;
            console.log(this.read);
            console.log(this.insert);
            console.log('readNO and writeNO');
            this.validPermisos = false;
          } else {
            this.alert(
              'info',
              'No tiene permiso de lectura y/o escritura sobre la pantalla, por lo que no podrá ingresar',
              ''
            );
            return;
          }
        });
      },
      error: (error: any) => {
        this.loading = false;
        console.error('éste usuario no tiene permisos de escritura');
      },
    });
  }
  userRowSelect(event: any) {
    this.desType = event.data.description;
    this.idEvent = event.data.event.idEvent;
    this.valid = true;
    console.log(event);
  }

  Generar() {
    this.loading = true;
    const start = this.comerLibsForm.get('fechaFactura').value;
    const carta = this.comerLibsForm.get('fechaCarta').value;
    this.start = this.datePipe.transform(start, 'dd/MM/yyyy');
    this.carta = this.datePipe.transform(carta, 'dd/MM/yyyy');
    let params = {
      DESTYPE: this.bienesLotesForm.controls['description'].value,
      ID_LOTE: this.bienesLotesForm.controls['lote'].value,
      OFICIO_CARTALIB: this.comerLibsForm.controls['oficio'].value,
      DIRIGIDO_A: this.comerLibsForm.controls['diridoA'].value,
      PUESTO: this.comerLibsForm.controls['puesto'].value,
      PARRAFO1: this.comerLibsForm.controls['paragraph1'].value,
      ADJUDICATARIO: this.comerLibsForm.controls['adjudicatorio'].value,
      NO_FACTURA: this.comerLibsForm.controls['factura'].value,
      FECHA_FACTURA: this.start,
      PARRAFO2: this.comerLibsForm.controls['paragraph2'].value,
      FIRMANTE: this.comerLibsForm.controls['firmante'].value,
      PUESTOFIRMA: this.comerLibsForm.controls['puestoFirma'].value,
      CCP1: this.comerLibsForm.controls['ccp1'].value,
      CCP2: this.comerLibsForm.controls['ccp1'].value,
      PUESTOCCP1: this.comerLibsForm.controls['puestoCcp1'].value,
      PUESTOCCP2: this.comerLibsForm.controls['puestoCcp2'].value,
      FECHA_CARTA: this.carta,
    };

    this.siabService
      .fetchReport('FCOMERCARTALIB', params)
      .subscribe(response => {
        if (response !== null) {
          this.loading = false;
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {
                if (data) {
                  data.map((item: any) => {
                    return item;
                  });
                }
              },
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }
  getClientLotes(id: number) {
    this.comerLotService.getByClient(id).subscribe({
      next: data => {
        this.client = data;
        this.clientForm.get('rfc').setValue(this.client.rfc);
        this.clientForm.get('calle').setValue(this.client.calle);
        this.clientForm.get('colonia').setValue(this.client.colonia);
        this.clientForm.get('ciudad').setValue(this.client.ciudad);
        this.clientForm.get('delegacion').setValue(this.client.delegacion);
        this.clientForm.get('estado').setValue(this.client.estado);
        this.clientForm.get('cp').setValue(this.client.cp);
        console.log(this.client);
      },
      error: error => {
        this.loading = false;
        console.error(error);
      },
    });
  }

  getComerLotes(id: number) {
    this.comerLotService.getByIdLot(id).subscribe({
      next: data => {
        console.log('DATA PRUEBA COMER', data);
        this.comerLots = data;
        this.bienesLotesForm.get('lote').setValue(data.idLot);
        this.bienesLotesForm.get('description').setValue(data.description);
        this.bienesLotesForm.get('evento').setValue(data.idEvent);
        this.getComerEvent(data.idEvent);
        this.getClientLotes(data.idEvent);
        console.log(this.comerLots);
      },
      error: error => {
        console.error(error);
      },
    });
  }
  getComerEvent(id: string) {
    this.comerEventService.geEventId(id).subscribe({
      next: data => {
        console.log('DATA PRUEBA', data);
        this.event = data;
        this.carta = this.datePipe.transform(
          this.event.failedDate,
          'dd/MM/yyyy'
        );
        // this.bienesLotesForm.get('descEvento').setValue(this.event.descEvento);
        this.comerLibsForm.get('fechaCarta').setValue(this.carta);
        // this.comerLibsForm.get('adjudicatorio').setValue(this.event.signatory);
        this.bienesLotesForm.get('cveProceso').setValue(this.event.processKey);
        // const year = this.datePipe.transform(this.letter.dateFail, 'yyyy');
        console.log(this.event);
      },
      error: error => {
        console.error(error);
      },
    });
  }

  cleanForm(): void {
    this.comerLibsForm.reset();
    this.bienesLotesForm.reset();
    this.dataTableGood.load([]);
    this.dataTableGood.refresh();
    this.totalItems = 0;
    this.respForm.reset();
    this.clientForm.reset();
    this.dataVal = null;
    this.valLote = false;
    this.valOficio = false;
  }
  goBack() {}

  actualizarLetter() {}

  comerBienesLetter() {
    const { lote } = this.comerLibsForm.value;
    if (!lote) return;
    this.bienesLoading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params.page = this.paramsBienes.value.page;
    params.limit = this.paramsBienes.value.limit;
    this.comerEventService.getAllFilterLetter_(lote, params).subscribe({
      next: (data: any) => {
        console.log(data);
        let result = data.data.map(i => {
          i['description'] = i.good ? i.good.description : '';
        });
        Promise.all(result).then(resp => {
          this.dataTableGood.load(data.data);
          this.dataTableGood.refresh();
          this.totalItems = data.count;
          this.bienesLoading = false;
        });
      },
      error: () => {
        this.bienesLoading = false;
        this.dataTableGood.load([]);
        this.dataTableGood.refresh();
        this.totalItems = 0;
      },
    });
  }
  searchEvent() {}

  changeEvent(event: any) {
    console.log(event);
    if (event) {
      this.valLote = true;
      this.valOficio = false;
    } else {
      this.valLote = false;
      this.valOficio = false;
    }

    this.comerLibsForm.get('fechaFactura').reset();
    this.comerLibsForm.get('factura').reset();
    this.comerLibsForm.get('oficio').reset();
    this.clientForm.get('adjudicatorio').reset();
    this.clientForm.get('rfc').reset();
    this.clientForm.get('calle').reset();
    this.clientForm.get('colonia').reset();
    this.clientForm.get('ciudad').reset();
    this.clientForm.get('delegacion').reset();
    this.clientForm.get('estado').reset();
    this.clientForm.get('cp').reset();

    this.comerLibsForm.get('lote').reset();
    this.comerLibsForm
      .get('evento_descripcion') //.reset();
      .setValue(event ? event.observations : null);
    this.comerLibsForm.get('lote_descripcion').reset();
    this.getLoteData(new ListParams());
  }

  getEventData(paramsData: ListParams, getByValue: boolean = false) {
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    if (getByValue) {
      paramsData['filter.id'] = '$eq:' + this.comerLibsForm.get('evento').value;
    }
    // paramsData['filter.observations'] = '$ilike:' + paramsData['search'];
    if (this.P_DIRECCION) {
      paramsData['filter.address'] = `$eq:${this.P_DIRECCION}`;
    }
    if (paramsData.text) {
      paramsData['filter.id'] = `$eq:${paramsData.text}`;
    }
    // paramsData['sortBy'] = 'observations:ASC';
    delete paramsData['search'];
    delete paramsData['text'];
    console.log('DATA SELECT ', paramsData);
    // '$eq:' + this.comerLibsForm.get('evento').value;
    this.comerEventService.getAllEvent(paramsData).subscribe({
      next: data => {
        console.log('DATA SELECT ', data.data);
        this.selectDataEvent = new DefaultSelect(data.data, data.count);
        console.log(data, this.selectDataEvent);
      },
      error: error => {
        this.selectDataEvent = new DefaultSelect();
      },
    });
  }

  changeLote(event: any) {
    console.log(event);
    if (event) {
      this.valOficio = true;
    } else {
      this.valOficio = false;
    }
    this.comerLibsForm.get('fechaFactura').reset();
    this.comerLibsForm.get('factura').reset();
    this.comerLibsForm.get('oficio').reset();
    if (event)
      if (!event.client) {
        this.clientForm.get('adjudicatorio').reset();
        this.clientForm.get('rfc').reset();
        this.clientForm.get('calle').reset();
        this.clientForm.get('colonia').reset();
        this.clientForm.get('ciudad').reset();
        this.clientForm.get('delegacion').reset();
        this.clientForm.get('estado').reset();
        this.clientForm.get('cp').reset();
        this.alert('warning', 'Lote sin cliente asignado', '');
      } else {
        this.clientForm.get('rfc').setValue(event.client.rfc);
        this.clientForm.get('calle').setValue(event.client.street);
        this.clientForm.get('colonia').setValue(event.client.neighborhood);
        this.clientForm.get('ciudad').setValue(event.client.city);
        this.clientForm.get('delegacion').setValue(event.client.delegation);
        this.clientForm.get('estado').setValue(event.client.state);
        this.clientForm.get('cp').setValue(event.client.zipCode);
        this.clientForm.get('adjudicatorio').setValue(event.client.nomRazon);
      }
    else {
      this.clientForm.get('adjudicatorio').reset();
      this.clientForm.get('rfc').reset();
      this.clientForm.get('calle').reset();
      this.clientForm.get('colonia').reset();
      this.clientForm.get('ciudad').reset();
      this.clientForm.get('delegacion').reset();
      this.clientForm.get('estado').reset();
      this.clientForm.get('cp').reset();
    }
    this.comerLibsForm
      .get('lote_descripcion')
      .setValue(event ? event.description : null);

    this.getOficioData(new ListParams());
  }

  getLoteData(paramsData: ListParams, getByValue: boolean = false) {
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    if (!this.comerLibsForm.get('evento').value) {
      if (paramsData['search'] != '') {
        this.alert(
          'warning',
          'Seleccionar un evento primero para búscar un lote',
          ''
        );
      }
      this.selectDataLote = new DefaultSelect();
      return;
    }
    const params = new FilterParams();
    params.addFilter('idEvent', this.comerLibsForm.get('evento').value);
    // params.addFilter('description', paramsData['search'], SearchFilter.ILIKE);
    if (paramsData['search']) {
      params.addFilter('idLot', paramsData['search']);
    }
    params['sortBy'] = 'description:ASC';
    delete paramsData['search'];
    delete paramsData['text'];
    console.log('DATA SELECT ', paramsData, params);
    this.msLotService.getAllComerLotsFilter(params.getParams()).subscribe({
      next: data => {
        console.log('DATA SELECT ', data.data);
        this.selectDataLote = new DefaultSelect(
          // data.data.map((i: any) => {
          //   i['description_data'] = i.idLot + ' --- ' + i.description;
          //   return i;
          // }),
          data.data,
          data.count
        );
        console.log(data, this.selectDataLote);
      },
      error: error => {
        this.selectDataLote = new DefaultSelect();
      },
    });
  }

  getOficioData(paramsData: ListParams) {
    const { lote } = this.comerLibsForm.value;
    if (!lote) return;
    if (paramsData.text) paramsData['filter.oficio'] = `$eq:${paramsData.text}`;
    paramsData['filter.lotsId'] = `$eq:${lote}`;
    this.comerLetterService.getAll(paramsData).subscribe({
      next: (data: any) => {
        console.log(data);
        let result = data.data.map(i => {});
        Promise.all(result).then(resp => {
          this.selectDataOficio = new DefaultSelect(data.data, data.count);
        });
      },
      error: () => {
        this.selectDataOficio = new DefaultSelect();
      },
    });
  }
  changeOficio(event: any) {
    if (event) {
      this.comerLibsForm.get('factura').setValue(event.invoiceNumber);
      let date = this.datePipe.transform(event.invoiceDate, 'dd/MM/yyyy');
      this.comerLibsForm.get('fechaFactura').setValue(date);
    } else {
      this.comerLibsForm.get('factura').reset();
      this.comerLibsForm.get('fechaFactura').reset();
      this.respForm.reset();
    }
  }

  getAllComerLetterResp(oficio: string | number) {
    this.comerLetterService.getByIdResponsability(oficio).subscribe({
      next: data => {
        this.alertInfo('success', 'Carta de Responsabilidad Cargada', '').then(
          quesition => {
            if (quesition.isConfirmed) {
              setTimeout(() => {
                this.performScroll();
              }, 200);
            }
          }
        );
        this.dataVal = data;
        this.respForm.get('id').setValue(data.id);
        this.respForm.get('paragraph1').setValue(data.paragraph1);
        this.respForm.get('paragraph2').setValue(data.paragraph2);
        this.respForm.get('paragraph3').setValue(data.paragraph3);
      },
      error: () => {
        this.alertQuestion(
          'warning',
          'No se encontraron Cartas de Responsabilidad',
          '¿Desea crear una?'
        ).then(quesition => {
          this.dataVal = null;
          if (quesition.isConfirmed) {
            this.llenarParrafos();
            setTimeout(() => {
              this.performScroll();
            }, 200);
          }
        });
      },
    });
  }

  async llenarParrafos() {
    const { rfc } = this.clientForm.value;
    const { factura, fechaFactura } = this.comerLibsForm.value;
    console.log(this.comerLibsForm.value);
    console.log('fechaFactura', fechaFactura);
    let fechaFactura_ = fechaFactura.split('/');
    const yy1 = fechaFactura_[2];
    const mm1 = fechaFactura_[1];
    const dd1 = fechaFactura_[0];
    const v_mes = await this.obtenerNombreMes(Number(mm1));

    const yy2 = this.datePipe.transform(new Date(), 'yyyy');
    const mm2 = this.datePipe.transform(new Date(), 'MM');
    const dd2 = this.datePipe.transform(new Date(), 'dd');
    const v_mes2 = await this.obtenerNombreMes(Number(mm2));

    let v_fecha_letras = `${dd1} de ${v_mes} del ${yy1}`;
    let v_fecha_letras2 = `${dd2} de ${v_mes2} del ${yy2}`;
    let parrafo1 = `Con registro Federal de Contribuyentes ${
      rfc ? rfc : ''
    }, manifiesto que a partir de esta fecha, soy el responsable del uso y destino que se de a la Mercancía: `;
    let parrafo2 = `Así mismo declaro que soy el único responsable del uso y cuidado de la factura ${factura} de fecha ${v_fecha_letras}, que me fue expedida por el Servicio de Administración y Enajenación de Bienes derivado de la subasta arriba señalada y con la cual acredito que soy el único y legal propietario de la mercancía.`;
    let parrafo3 = `Conocedor de los alcances de lo que anteriormente he manifestado, así como de las responsabilidades civiles, penales y administrativas en que puedo incurrir por el mal uso del Bien antes citado y de la documentación legal que acredita la propiedad de la misma, expido la presente CARTA DE ACEPTACIÓN DE RESPONSABILIDADES al Gobierno Federal de los Estados Unidos Mexicanos, para los usos y fines que al mismo convengan, en la Ciudad de México, Distrito Federal el ${v_fecha_letras2}.`;

    this.respForm.get('paragraph1').setValue(parrafo1);
    this.respForm.get('paragraph2').setValue(parrafo2);
    this.respForm.get('paragraph3').setValue(parrafo3);
  }

  async obtenerNombreMes(numeroMes: number) {
    switch (numeroMes) {
      case 1:
        return 'Enero';
      case 2:
        return 'Febrero';
      case 3:
        return 'Marzo';
      case 4:
        return 'Abril';
      case 5:
        return 'Mayo';
      case 6:
        return 'Junio';
      case 7:
        return 'Julio';
      case 8:
        return 'Agosto';
      case 9:
        return 'Septiembre';
      case 10:
        return 'Octubre';
      case 11:
        return 'Noviembre';
      case 12:
        return 'Diciembre';
      default:
        return null;
    }
  }

  performScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
  loadingSave: boolean = false;
  saveData() {
    this.respForm.value.id = this.comerLibsForm.value.oficio;
    if (!this.dataVal) {
      this.comerLetterService
        .createComerLetterResp(this.respForm.value)
        .subscribe({
          next: data => {
            this.dataVal = true;
            this.alert(
              'success',
              'Carta de Responsabilidad Guardada Correctamente',
              ''
            );
          },
          error: () => {
            this.alert(
              'warning',
              'No se pudo crear la Carta de Responsabilidad',
              ''
            );
          },
        });
    } else {
      this.comerLetterService
        .updateComerLetterResp(this.respForm.value, this.respForm.value.id)
        .subscribe({
          next: data => {
            this.dataVal = true;
            this.alert(
              'success',
              'Carta de Responsabilidad Actualizada Correctamente',
              ''
            );
          },
          error: () => {
            this.alert(
              'warning',
              'No se pudo actualizar la Carta de Responsabilidad',
              ''
            );
          },
        });
    }
  }
}
