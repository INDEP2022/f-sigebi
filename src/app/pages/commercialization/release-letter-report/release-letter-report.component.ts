import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
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
import { IComerLotsEG } from 'src/app/core/models/ms-parametercomer/parameter';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { SubDelegationService } from 'src/app/core/services/maintenance-delegations/subdelegation.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ComerLetterService } from 'src/app/core/services/ms-parametercomer/comer-letter.service';
import { ComerLotService } from 'src/app/core/services/ms-parametercomer/comer-lot.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { IndUserService } from 'src/app/core/services/ms-users/ind-user.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FindReleaseLetterComponent } from './find-release-letter/find-release-letter.component';
import { COMEMR_BIENES_COLUMNS } from './release-letter-collumn';

export interface IReport {
  data: File;
}

@Component({
  selector: 'app-release-letter-report',
  templateUrl: './release-letter-report.component.html',
  styleUrls: ['release-letter-report.component.scss'],
})
export class ReleaseLetterReportComponent extends BasePage implements OnInit {
  comerLibsForm: FormGroup;
  bienesLotesForm: FormGroup;
  goodList: IGood;
  dataGood: any;
  totalItems: number = 0;
  bienesLoading: boolean = false;
  idEvent: number = 0;
  descArea: string;
  event: IComerEvent;
  area: IDepartment;
  comerLots: IComerLotsEG;
  dataTableGood: LocalDataSource = new LocalDataSource();
  selectEvent = new DefaultSelect<IComerLotsEG>();
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  selectLot = new DefaultSelect<IComerLotsEG>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsBienes = new BehaviorSubject<ListParams>(new ListParams());
  paramsForm = new BehaviorSubject<ListParams>(new ListParams());
  idLot: number = 0;
  bienes: any;
  faEtapaCreada: number = 0;
  letter: IComerLetter;
  read: boolean = false;
  update: boolean = false;
  delete: boolean = false;
  insert: boolean = false;
  descriptionEvent: string = '';
  cve: string = '';
  fecha: string = '';
  lettersAll: IComerLetter[] = [];
  idGood: number = null;
  dateLetter = new Date();
  dateNew: string = '';
  valid: boolean = false;
  validPermisos: boolean = false;
  start: string;
  department: string = '';
  delegation: string = '';
  userName: string = '';
  puestoUser: string = '';
  letterDefault: any = null;
  subDelegation: string = '';
  carta: string;
  desType: string;
  screenKey = 'FCOMERCARTALIB_I';
  // params = new BehaviorSubject<ListParams>(new ListParams());
  dataUserLoggedTokenData: any;
  selectDataEvent = new DefaultSelect();
  selectDataLote = new DefaultSelect();
  P_DIRECCION: string = 'M';
  origin: string = '';

  get oficio() {
    return this.comerLibsForm.get('oficio');
  }

  get diridoA() {
    return this.comerLibsForm.get('diridoA');
  }
  get puesto() {
    return this.comerLibsForm.get('puesto');
  }
  get parrafo1() {
    return this.comerLibsForm.get('parrafo1');
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
  get parrafo2() {
    return this.comerLibsForm.get('parrafo2');
  }
  get firmante() {
    return this.comerLibsForm.get('firmante');
  }
  get ccp1() {
    return this.comerLibsForm.get('ccp1');
  }
  get puestoCcp1() {
    return this.comerLibsForm.get('puestoCcp1');
  }
  get ccp2() {
    return this.comerLibsForm.get('ccp2');
  }
  get puestoCcp2() {
    return this.comerLibsForm.get('puestoCcp2');
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
  columnFilters: any = [];
  disabledFields: boolean = false;
  loadingSave: boolean = false;

  selectDataUser0 = new DefaultSelect();
  selectDataUser1 = new DefaultSelect();
  selectDataUser2 = new DefaultSelect();
  dataVal: any = null;
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
    private authService: AuthService,
    private comerEventService: ComerEventService,
    private router: Router,
    private msIndUserService: IndUserService,
    private msLotService: LotService,
    private activatedRoute: ActivatedRoute,
    private msUsersService: UsersService,
    private comerTpEventosService: ComerTpEventosService
  ) {
    super();
    this.validPermisos = !this.validPermisos;
    this.settings = {
      ...TABLE_SETTINGS,
      hideSubHeader: true,
      actions: false,
      columns: {
        ...COMEMR_BIENES_COLUMNS,
      },
      noDataMessage: 'No se encontrarón registros',
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.bienlotForm();
    this.dateNew = this.datePipe.transform(this.dateLetter, 'dd/MM/yyyy');
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

    this.prepareTableBienXLot();
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
              idGood: () => (searchFilter = SearchFilter.EQ),
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
    this.delegation = this.authService.decodeToken().delegacionreg;
    this.subDelegation = this.authService.decodeToken().puesto;
    this.puestoUser = this.authService.decodeToken().puesto;
    this.userName = this.authService
      .decodeToken()
      .preferred_username.toUpperCase();
    this.userTracker(
      this.screenKey,
      this.authService.decodeToken().preferred_username
    );
    this.comerLibsForm = this.fb.group({
      oficio: [null, Validators.required],
      diridoA: [null, Validators.required],
      puesto: [null, Validators.required],
      parrafo1: [null, Validators.required],
      adjudicatorio: [null],
      factura: [null, Validators.required],
      fechaFactura: [null],
      parrafo2: [null],
      firmante: [null, Validators.required],
      ccp1: [null],
      ccp2: [null],
      ccp3: [null],
      ccp4: [null],
      ccp5: [null],
      fechaCarta: [null],
      fechaFallo: [null],
      cveProceso: [null],
      descEvent: [null],
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
  }
  bienlotForm() {
    this.bienesLotesForm = this.fb.group({
      lote: [null],
      evento: [null],
      description: [null],
      cveProceso: [null],
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
      DIRIGIDO_A: this.comerLibsForm.controls['diridoA'].value,
      PUESTO: this.comerLibsForm.controls['puesto'].value,
      PARRAFO1: this.comerLibsForm.controls['parrafo1'].value,
      ADJUDICATARIO: this.comerLibsForm.controls['adjudicatorio'].value,
      NO_FACTURA: this.comerLibsForm.controls['factura'].value,
      FECHA_FACTURA: this.start,
      PARRAFO2: this.comerLibsForm.controls['parrafo2'].value,
      FIRMANTE: this.comerLibsForm.controls['firmante'].value,
      PUESTOFIRMA: this.comerLibsForm.controls['puestoFirma'].value,
      CCP1: this.comerLibsForm.controls['ccp1'].value,
      CCP2: this.comerLibsForm.controls['ccp1'].value,
      PUESTOCCP1: this.comerLibsForm.controls['puestoCcp1'].value,
      PUESTOCCP2: this.comerLibsForm.controls['puestoCcp2'].value,
      FECHA_CARTA: this.carta,
    };

    console.log(params);
    this.siabService
      .fetchReport('RCOMERCARTALIB', params)
      // .fetchReportBlank('blank')
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
    this.comerLetterService.getById(id).subscribe({
      next: data => {
        this.loading = false;
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
        this.comerLibsForm.get('diridoA').setValue(this.letter.addressedTo);
        this.comerLibsForm.get('puesto').setValue(this.letter.position);
        this.comerLibsForm.get('firmante').setValue(this.puestoUser);
        this.comerLibsForm.get('parrafo1').setValue(this.letter.paragraph1);
        this.comerLibsForm.get('parrafo2').setValue(this.letter.paragraph2);
        this.comerLibsForm.get('adjudicatorio').setValue(this.letter.signatory);
        this.comerLibsForm.get('factura').setValue(this.letter.invoiceNumber);
        this.comerLibsForm.get('fechaFactura').setValue(this.start);
        this.comerLibsForm.get('ccp1').setValue(this.letter.ccp1);
        this.comerLibsForm.get('ccp2').setValue(this.letter.ccp2);
        // this.comerLibsForm.get('ccp3').setValue(this.letter.ccp3);
        // this.comerLibsForm.get('ccp4').setValue(this.letter.ccp4);
        this.bienesLotesForm.get('lote').setValue(this.letter.lotsId);
        // this.getComerLotes(this.letter.lotsId);

        // this.paramsBienes
        //   .pipe(takeUntil(this.$unSubscribe))
        //   .subscribe(() =>
        //     this.comerBienesLetter()
        //   );

        // '. Solicito a usted sea entegada(s) la siguente(s) mercancias que a continuación se describe.';
        setTimeout(() => {
          if (this.puestoUser) {
            this.getAllNameOtval();
          }
          if (this.letter.ccp1) {
            this.getAllNameOtval(1);
          }
          if (this.letter.ccp2) {
            this.getAllNameOtval(2);
          }
        }, 300);
      },
      error: () => {
        console.log('error');
      },
    });
  }

  async searchComer() {
    if (!this.comerLibsForm.get('lote').value) {
      this.alert('warning', 'Selecciona un lote para continuar', '');
      return;
    }
    this.comerBienesLetter();
    await this.prepareFilter();
    this.getAllComerLetter();
  }

  openModal(provider?: IComerLetter) {
    const modalConfig = {
      initialState: {
        provider,
        dataVal: this.dataVal,
        P_DIRECCION: this.P_DIRECCION,
        loteId: this.comerLibsForm.get('lote').value,
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    let modalRef = this.modalService.show(
      FindReleaseLetterComponent,
      modalConfig
    );
    modalRef.content.onSave.subscribe((next: any) => {
      this.letterDefault = next;
      console.log(next);
      // this.comerLibsForm.controls['adjudicatorio'].setValue(this.letterDefault.signatory);
      this.idLot = next.lotsId;
      this.idEvent = next.idEvent;
      this.llenarCampos(next);
      // this.getComerLetterById(next.id);
    });

    modalRef.content.onDelete.subscribe(async (next: any) => {
      if (next) {
        this.dataVal = null;
        this.cleanLib(1);
      }
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
            this.validPermisos = false;
            console.log(this.read);
            console.log(this.insert);
            console.log('readNo and writeNO');
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

  Generar() {
    if (this.letterDefault == null) {
      this.alert('warning', 'Realiza una consulta para continuar', '');
      return;
    }
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
      PARRAFO1: this.comerLibsForm.controls['parrafo1'].value,
      ADJUDICATARIO: this.comerLibsForm.controls['adjudicatorio'].value,
      NO_FACTURA: this.comerLibsForm.controls['factura'].value,
      FECHA_FACTURA: this.start,
      PARRAFO2: this.comerLibsForm.controls['parrafo2'].value,
      FIRMANTE: this.comerLibsForm.controls['firmante'].value,
      PUESTOFIRMA: this.comerLibsForm.controls['puestoFirma'].value,
      CCP1: this.comerLibsForm.controls['ccp1'].value,
      CCP2: this.comerLibsForm.controls['ccp1'].value,
      PUESTOCCP1: this.comerLibsForm.controls['puestoCcp1'].value,
      PUESTOCCP2: this.comerLibsForm.controls['puestoCcp2'].value,
      FECHA_CARTA: this.carta,
    };

    this.siabService
      // .fetchReport('FCOMERCARTALIB', params)
      .fetchReportBlank('blank')
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

  getComerLotes(id: number) {
    this.comerLotService.getByIdLot(id).subscribe({
      next: data => {
        this.comerLots = data;
        this.descriptionEvent = this.comerLots.description;
        this.bienesLotesForm
          .get('description')
          .setValue(this.comerLots.description);
        this.bienesLotesForm.get('evento').setValue(this.comerLots.event);
        console.log();
        this.getComerEvent(data.idEvent);
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
        this.event = data;
        this.fecha = this.datePipe.transform(
          this.carta,
          "dd 'de' MMMM 'del año' yyyy",
          'es'
        );
        this.bienesLotesForm.get('evento').setValue(this.event.id);
        this.comerLibsForm.get('fechaCarta').setValue(this.carta);
        // this.comerLibsForm.get('adjudicatorio').setValue(this.event.signatory);
        this.bienesLotesForm.get('cveProceso').setValue(this.event.processKey);
        this.cve = this.event.processKey;
        console.log(this.cve);
        console.log(this.fecha);
        console.log(this.event);
      },
      error: error => {
        console.error(error);
      },
    });
  }

  cleanForm(): void {
    this.valLote = false;
    this.disabledFields = false;
    this.valResult = false;
    this.idLot = 0;
    this.idEvent = null;
    this.comerLibsForm.reset();
    this.bienesLotesForm.reset();
    this.bienes = [];
    this.dataTableGood.load([]);
    this.dataTableGood.refresh();
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
    params['filter.lotId'] = `$eq:${lote}`;
    params.page = this.paramsBienes.value.page;
    params.limit = this.paramsBienes.value.limit;

    this.comerEventService.getFindAllComerGoodXlotTotal(params).subscribe({
      next: (data: any) => {
        console.log(data);
        this.bienesLoading = false;
        if (data) {
          this.bienes = data.items.map((i: any) => {
            i['description'] = i.good ? i.good.description : '';
            return i;
          });
          console.log(this.bienes);
          this.dataTableGood.load(this.bienes);
          this.dataTableGood.refresh();
          this.totalItems = data.count;
        }
      },
      error: () => {
        this.bienesLoading = false;
        this.dataTableGood.load([]);
        this.dataTableGood.refresh();
        this.totalItems = 0;
      },
    });
  }

  getAllNameOtval(option: number = 0) {
    if (option == 0) {
      this.comerLibsForm.get('puestoFirma').reset();
    } else if (option == 1) {
      this.comerLibsForm.get('puestoCcp1').reset();
    } else if (option == 2) {
      this.comerLibsForm.get('puestoCcp2').reset();
    }
    // const params: any = new FilterParams();
    let nameSearch: string = '';
    if (option == 0) {
      // params.addFilter('name', this.puestoUser);
      nameSearch = encodeURI(this.puestoUser);
    } else {
      // params['filter.name'] =
      //   '$eq:' + (option == 1 ? this.letter.ccp1 : this.letter.ccp2);
      nameSearch = encodeURI(option == 1 ? this.letter.ccp1 : this.letter.ccp2);
    }
    // params['sortBy'] = 'name:ASC';
    this.msUsersService.getOtValueFromUserName(nameSearch).subscribe({
      next: data => {
        console.log(data);
        if (option == 0) {
          this.comerLibsForm.get('puestoFirma').setValue(data.data[0].otvalor);
        } else if (option == 1) {
          this.comerLibsForm.get('puestoCcp1').setValue(data.data[0].otvalor);
        } else if (option == 2) {
          this.comerLibsForm.get('puestoCcp2').setValue(data.data[0].otvalor);
        }
      },
      error: err => {
        console.error(err);
      },
    });
  }
  valLote: boolean = false;
  changeEvent(event: any) {
    if (event) {
      this.valLote = true;
    } else {
      this.valLote = false;
    }
    console.log(event);
    this.comerLibsForm.get('lote').reset();
    this.comerLibsForm
      .get('evento_descripcion') //.reset();
      .setValue(event ? event.observations : null);

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
    if (paramsData.text) {
      paramsData['filter.id'] = `$eq:${paramsData.text}`;
    }
    if (this.P_DIRECCION) {
      paramsData['filter.address'] = `$eq:${this.P_DIRECCION}`;
    }
    paramsData['sortBy'] = 'id:ASC';
    delete paramsData['search'];
    delete paramsData['text'];
    this.comerEventService.getAllEvent(paramsData).subscribe({
      next: data => {
        this.selectDataEvent = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.selectDataEvent = new DefaultSelect();
      },
    });
  }
  loteData: any = null;
  async changeLote(event: any) {
    console.log(event);
    this.loteData = event;
    this.comerLibsForm
      .get('lote_descripcion')
      .setValue(event ? event.description : null);
    if (event) {
      if (!event.client) {
        this.comerLibsForm.get('adjudicatorio').setValue(null);
        this.alert('warning', 'Lote sin cliente asignado', '');
      } else {
        this.comerLibsForm.get('adjudicatorio').setValue(event.client.nomRazon);
      }

      if (event.eat_events) {
        let tpEvento: any = await this.comerTpEvents(
          event.eat_events.idEventType
        );
        if (tpEvento) {
          this.comerLibsForm
            .get('fechaFallo')
            .setValue(event.eat_events.fallDate);
          this.comerLibsForm
            .get('cveProceso')
            .setValue(event.eat_events.processKey);
          this.comerLibsForm.get('descEvent').setValue(tpEvento.descReceipt);
        } else {
          this.comerLibsForm.get('fechaFallo').setValue(null);
          this.comerLibsForm.get('cveProceso').setValue(null);
          this.comerLibsForm.get('descEvent').setValue(null);
        }
      }

      await this.parrafo1_();
    } else {
      this.comerLibsForm.get('fechaFallo').setValue(null);
      this.comerLibsForm.get('cveProceso').setValue(null);
      this.comerLibsForm.get('descEvent').setValue(null);
      this.comerLibsForm.get('adjudicatorio').setValue(null);
      this.comerLibsForm.get('parrafo1').setValue(null);
      this.dataTableGood.load([]);
      this.dataTableGood.refresh();
      this.totalItems = 0;
    }
  }
  comerTpEvents(id: string | number) {
    return new Promise((resolve, reject) => {
      this.comerTpEventosService.getByIdComerTEvents(id).subscribe({
        next(value) {
          resolve(value);
        },
        error(err) {
          resolve(null);
        },
      });
    });
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
    if (paramsData['search']) {
      params.addFilter('idLot', paramsData['search']);
    }
    params['sortBy'] = 'description:ASC';
    delete paramsData['search'];
    delete paramsData['text'];
    this.msLotService.getAllComerLotsFilter(params.getParams()).subscribe({
      next: data => {
        this.selectDataLote = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.selectDataLote = new DefaultSelect();
      },
    });
  }
  valResult: boolean = false;
  getAllComerLetter() {
    this.loading = true;
    const { lote } = this.comerLibsForm.value;
    const params = new ListParams();
    params['filter.lotsId'] = `$eq:${lote}`;
    this.comerLetterService.getAll(params).subscribe({
      next: (data: any) => {
        if (data.count == 0) {
          this.alertQuestion(
            'warning',
            'No se encontraron Cartas de Liberación',
            '¿Desea crear una?'
          ).then(quesition => {
            if (quesition.isConfirmed) {
              this.cleanLib(1);
            } else {
              this.cleanLib();
              this.dataVal = null;
            }
          });
          this.valResult = false;
        } else if (data.count == 1) {
          // this.getComerLetterById(data.data[0].id)
          this.llenarCampos(data.data[0]);
          this.dataVal = data.data[0];
          this.disabledFields = true;
          this.valResult = false;
        } else if (data.count > 1) {
          this.openModal();
          this.dataVal = null;
          this.valResult = true;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertQuestion(
          'warning',
          'No se encontraron Cartas de Liberación',
          '¿Desea crear una?'
        ).then(quesition => {
          if (quesition.isConfirmed) {
            this.cleanLib(1);
          } else {
            this.cleanLib();
            this.dataVal = null;
          }
        });
        this.valResult = false;
      },
    });
  }

  async prepareFilter() {
    const {
      oficio,
      diridoA,
      puesto,
      parrafo1,
      adjudicatorio,
      factura,
      fechaFactura,
      parrafo2,
      firmante,
      ccp1,
      ccp2,
      ccp3,
      ccp4,
      fechaCarta,
      fechaFallo,
      cveProceso,
      descEvent,
      nombreFirma,
      puestoFirma,
      nombreCcp1,
      puestoCcp1,
      nombreCcp2,
      puestoCcp2,
      lote,
      evento,
    } = this.comerLibsForm.value;

    let par = {
      id: 'f',
      signatory: 'a',
      ccp3: 'a',
      ccp4: 'a',
      ccp5: 'a',
    };

    if (lote) {
      this.paramsForm.getValue()['filter.lotsId'] = `$eq:${lote}`;
    } else {
      delete this.paramsForm.getValue()['filter.lotsId'];
    }

    // if (factura) {
    //   this.paramsForm.getValue()['filter.invoiceNumber'] = `$eq:${factura}`;
    // } else {
    //   delete this.paramsForm.getValue()['filter.invoiceNumber'];
    // }

    // if (fechaFactura) {
    //   let date = '';
    //   if (typeof fechaFactura == 'string') {
    //     date = fechaFactura.split('/').reverse().join('-');
    //   } else {
    //     date = this.datePipe.transform(fechaFactura, 'yyyy-MM-dd');
    //   }
    //   this.paramsForm.getValue()['filter.invoiceDate'] = `$eq:${date}`;
    // } else {
    //   delete this.paramsForm.getValue()['filter.invoiceDate'];
    // }

    // if (diridoA) {
    //   this.paramsForm.getValue()['filter.addressedTo'] = `$ilike:${diridoA}`;
    // } else {
    //   delete this.paramsForm.getValue()['filter.addressedTo'];
    // }

    // if (puesto) {
    //   this.paramsForm.getValue()['filter.position'] = `$ilike:${puesto}`;
    // } else {
    //   delete this.paramsForm.getValue()['filter.position'];
    // }

    // if (firmante) {
    //   this.paramsForm.getValue()['filter.signatory'] = `$ilike:${firmante}`;
    // } else {
    //   delete this.paramsForm.getValue()['filter.signatory'];
    // }

    // if (ccp1) {
    //   this.paramsForm.getValue()['filter.ccp1'] = `$eq:${ccp1}`;
    // } else {
    //   delete this.paramsForm.getValue()['filter.ccp1'];
    // }

    // if (ccp2) {
    //   this.paramsForm.getValue()['filter.ccp2'] = `$eq:${ccp2}`;
    // } else {
    //   delete this.paramsForm.getValue()['filter.ccp2'];
    // }
    // if (parrafo1) {
    //   this.paramsForm.getValue()['filter.paragraph1'] = `$ilike:${parrafo1}`;
    // } else {
    //   delete this.paramsForm.getValue()['filter.paragraph1'];
    // }

    // if (parrafo2) {
    //   this.paramsForm.getValue()['filter.paragraph2'] = `$ilike:${parrafo2}`;
    // } else {
    //   delete this.paramsForm.getValue()['filter.paragraph2'];
    // }

    return this.paramsForm.getValue();
  }

  cleanLib(filter?: number) {
    this.comerLibsForm.get('oficio').reset();
    this.comerLibsForm.get('diridoA').reset();
    this.comerLibsForm.get('puesto').reset();
    this.comerLibsForm.get('factura').reset();
    this.comerLibsForm.get('fechaFactura').reset();
    this.comerLibsForm.get('parrafo2').reset();
    this.comerLibsForm.get('firmante').reset();
    this.comerLibsForm.get('ccp1').reset();
    this.comerLibsForm.get('ccp2').reset();
    this.comerLibsForm.get('ccp3').reset();
    this.comerLibsForm.get('ccp4').reset();
    this.comerLibsForm.get('ccp5').reset();
    this.comerLibsForm.get('fechaCarta').reset();
    this.comerLibsForm.get('nombreFirma').reset();
    this.comerLibsForm.get('puestoFirma').reset();
    this.comerLibsForm.get('nombreCcp1').reset();
    this.comerLibsForm.get('puestoCcp1').reset();
    this.comerLibsForm.get('nombreCcp2').reset();
    this.comerLibsForm.get('puestoCcp2').reset();
    // this.comerLibsForm.patchValue({
    //   oficio: null,
    //   diridoA: null,
    //   puesto: null,
    //   // parrafo1: null,
    //   // adjudicatorio: null,
    //   factura: null,
    //   fechaFactura: null,
    //   parrafo2: null,
    //   firmante: null,
    //   ccp1: null,
    //   ccp2: null,
    //   ccp3: null,
    //   ccp4: null,
    //   fechaCarta: null,
    //   // fechaFallo: null,
    //   // cveProceso: null,
    //   // descEvent: null,
    //   nombreFirma: null,
    //   puestoFirma: null,
    //   nombreCcp1: null,
    //   puestoCcp1: null,
    //   nombreCcp2: null,
    //   puestoCcp2: null,
    // });

    if (filter == 1)
      (this.disabledFields = true),
        this.changeLote(this.loteData),
        (this.dataVal = null);
  }

  saveData() {
    const {
      oficio,
      diridoA,
      puesto,
      parrafo1,
      adjudicatorio,
      factura,
      fechaFactura,
      parrafo2,
      firmante,
      ccp1,
      ccp2,
      ccp3,
      ccp4,
      ccp5,
      fechaCarta,
      fechaFallo,
      cveProceso,
      descEvent,
      nombreFirma,
      puestoFirma,
      nombreCcp1,
      puestoCcp1,
      nombreCcp2,
      puestoCcp2,
      lote,
    } = this.comerLibsForm.value;
    if (this.dataVal) {
      let body = {
        id: oficio,
        lotsId: lote,
        addressedTo: diridoA,
        position: puesto,
        paragraph1: parrafo1,
        invoiceNumber: factura,
        // dateFail: fechaFallo,
        invoiceDate: fechaFactura,
        paragraph2: parrafo2,
        signatory: firmante,
        ccp1: ccp1,
        ccp2: ccp2,
        ccp3: ccp3,
        ccp4: ccp4,
        ccp5: ccp5,
      };
      this.comerLetterService.updateLib(body, body.id).subscribe({
        next: value => {
          this.dataVal = value;
          this.alert('success', 'Registro actualizado correctamente', '');
        },
        error: err => {
          this.alert('warning', 'No se pudo actualizar el registro', '');
        },
      });
    } else {
      let body: IComerLetter = {
        id: oficio,
        lotsId: lote,
        addressedTo: diridoA,
        position: puesto,
        paragraph1: parrafo1,
        invoiceNumber: factura,
        dateFail: fechaFallo,
        invoiceDate: fechaFactura,
        paragraph2: parrafo2,
        signatory: firmante,
        ccp1: ccp1,
        ccp2: ccp2,
        ccp3: ccp3,
        ccp4: ccp4,
        ccp5: ccp5,
      };
      this.comerLetterService.createLib(body).subscribe({
        next: value => {
          console.log(value);
          this.dataVal = value;
          this.valResult = true;
          this.alert('success', 'Registro creado correctamente', '');
        },
        error: err => {
          this.alert('warning', 'No se pudo crear el registro', '');
        },
      });
    }
  }

  openModalSearch() {
    this.openModal();
  }

  llenarCampos(data: any) {
    this.disabledFields = true;
    this.letter = data;
    this.dataVal = data;
    console.log(data, this.letter);

    this.carta = this.datePipe.transform(this.letter.invoiceDate, 'dd/MM/yyyy');
    this.start = this.datePipe.transform(this.letter.invoiceDate, 'dd/MM/yyyy');
    this.comerLibsForm.get('oficio').setValue(this.letter.id);
    // this.comerLibsForm.get('fechaCarta').setValue(this.carta);
    // this.comerLibsForm.get('fechaFallo').setValue(this.carta);
    this.comerLibsForm.get('diridoA').setValue(this.letter.addressedTo);
    this.comerLibsForm.get('puesto').setValue(this.letter.position);
    this.comerLibsForm.get('firmante').setValue(this.letter.signatory);
    this.comerLibsForm.get('parrafo1').setValue(this.letter.paragraph1);
    this.comerLibsForm.get('parrafo2').setValue(this.letter.paragraph2);
    // this.comerLibsForm.get('adjudicatorio').setValue(this.letter.signatory);
    this.comerLibsForm.get('factura').setValue(this.letter.invoiceNumber);
    this.comerLibsForm.get('fechaFactura').setValue(this.start);
    this.comerLibsForm.get('ccp1').setValue(this.letter.ccp1);
    this.comerLibsForm.get('ccp2').setValue(this.letter.ccp2);
    this.comerLibsForm.get('ccp3').setValue(this.letter.ccp3);
    this.comerLibsForm.get('ccp4').setValue(this.letter.ccp4);
    this.comerLibsForm.get('ccp5').setValue(this.letter.ccp5);
    this.bienesLotesForm.get('lote').setValue(this.letter.lotsId);

    // '. Solicito a usted sea entegada(s) la siguente(s) mercancias que a continuación se describe.';
    setTimeout(() => {
      if (this.puestoUser) {
        this.getAllNameOtval();
      }
      if (this.letter.ccp1) {
        this.getAllNameOtval(1);
      }
      if (this.letter.ccp2) {
        this.getAllNameOtval(2);
      }
    }, 300);
  }

  async parrafo1_() {
    const {
      oficio,
      diridoA,
      puesto,
      parrafo1,
      adjudicatorio,
      factura,
      fechaFactura,
      parrafo2,
      firmante,
      ccp1,
      ccp2,
      ccp3,
      ccp4,
      ccp5,
      fechaCarta,
      fechaFallo,
      cveProceso,
      descEvent,
      nombreFirma,
      puestoFirma,
      nombreCcp1,
      puestoCcp1,
      nombreCcp2,
      puestoCcp2,
      lote,
    } = this.comerLibsForm.value;

    const yy1 = fechaFallo ? this.datePipe.transform(fechaFallo, 'yyyy') : null;
    const mm1 = fechaFallo ? this.datePipe.transform(fechaFallo, 'MM') : null;
    const dd1 = fechaFallo ? this.datePipe.transform(fechaFallo, 'dd') : null;
    const v_mes = await this.obtenerNombreMes(Number(mm1));

    let v_fecha_fallo = `${dd1} de ${v_mes} del ${yy1}`;
    this.comerLibsForm
      .get('parrafo1')
      .setValue(
        `Derivado de la ${descEvent} para la enajenación de vehiculos y/o bienes diversos ${cveProceso} celebrada el dia ${v_fecha_fallo} . Solicito a usted sea entegada(s) la siguente(s) mercancias que a continuación se describe.`
      );
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

  getUsers(params: ListParams, option: number = 0) {
    let nameSearch: string = '';

    this.msUsersService.getAllSegUsers(params).subscribe({
      next: (res: any) => {
        if (option == 0) {
          this.selectDataUser0 = new DefaultSelect(res.data, 0);
        } else if (option == 1) {
          this.selectDataUser1 = new DefaultSelect(res.data, 0);
        } else if (option == 2) {
          this.selectDataUser2 = new DefaultSelect(res.data, 10);
        }
      },
      error: error => {
        if (option == 0) {
          this.selectDataUser0 = new DefaultSelect([], 0);
        } else if (option == 1) {
          this.selectDataUser1 = new DefaultSelect([], 0);
        } else if (option == 2) {
          this.selectDataUser2 = new DefaultSelect([], 0);
        }
      },
    });
  }

  changeUser(event: any, option: number) {
    console.log(event);
    if (event) this.insertPuestoFields(event.id, option);
    else {
      if (option == 0) {
        this.comerLibsForm.get('puestoFirma').setValue(null);
      } else if (option == 1) {
        this.comerLibsForm.get('puestoCcp1').setValue(null);
      } else if (option == 2) {
        this.comerLibsForm.get('puestoCcp2').setValue(null);
      }
    }
  }

  insertPuestoFields(nameSearch: string, option: number) {
    this.msUsersService.getOtValueFromUserName(nameSearch).subscribe({
      next: data => {
        console.log(data);
        if (option == 0) {
          this.comerLibsForm.get('puestoFirma').setValue(data.data[0].otvalor);
        } else if (option == 1) {
          this.comerLibsForm.get('puestoCcp1').setValue(data.data[0].otvalor);
        } else if (option == 2) {
          this.comerLibsForm.get('puestoCcp2').setValue(data.data[0].otvalor);
        }
      },
      error: err => {
        if (option == 0) {
          this.comerLibsForm.get('puestoFirma').setValue(null);
        } else if (option == 1) {
          this.comerLibsForm.get('puestoCcp1').setValue(null);
        } else if (option == 2) {
          this.comerLibsForm.get('puestoCcp2').setValue(null);
        }
      },
    });
  }
}
