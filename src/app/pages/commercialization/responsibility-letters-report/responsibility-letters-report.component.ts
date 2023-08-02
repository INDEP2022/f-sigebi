import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
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
  styles: [],
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
    private router: Router
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
    this.bienlotForm();
    this.comerClientForm();
    this.dateFinal = this.datePipe.transform(this.maxDate, 'dd/MM/yyyy');
    const token = this.authService.decodeToken();
    this.dataUserLoggedTokenData = token;
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
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(50)],
      ],
      adjudicatorio: [null, [Validators.pattern(STRING_PATTERN)]],
      factura: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(20)],
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
    });
  }
  bienlotForm() {
    this.bienesLotesForm = this.fb.group({
      lote: [null],
      evento: [null],
      descEvento: [null],
      description: [null],
      cveProceso: [null],
    });
  }
  comerClientForm() {
    this.clientForm = this.fb.group({
      rfc: [null],
      calle: [null],
      colonia: [null],
      ciudad: [null],
      delegacion: [null],
      estado: [null],
      cp: [null],
    });
  }
  comerRespForm() {
    this.respForm = this.fb.group({
      id: [null],
      paragraph1: [null],
      paragraph2: [null],
      paragraph3: [null],
    });
  }
  confirm(): void {
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
    this.comerLetterService.getById(id).subscribe({
      next: data => {
        this.loading = false;
        this.letter = data;
        this.carta = this.datePipe.transform(
          this.letter.invoiceDate,
          'dd/MM/yyyy'
        );
        this.start = this.datePipe.transform(
          this.letter.invoiceDate,
          'dd/MM/yyyy'
        );
        this.comerLibsForm.get('oficio').setValue(this.letter.id);
        this.comerLibsForm.get('fechaCarta').setValue(this.carta);
        // this.comerLibsForm.get('fechaFallo').setValue(this.carta);
        this.comerLibsForm.get('adjudicatorio').setValue(this.letter.signatory);
        this.comerLibsForm.get('factura').setValue(this.letter.invoiceNumber);
        // this.comerLibsForm.get('fechaFactura').setValue(this.start);
        this.getComerLotes(this.letter.lotsId);
        this.getComerRespById(this.letter.id);
        this.comerBienesLetter(this.letter.lotsId, this.params.getValue());
        this.comerLibsForm.value.paragraph1 =
          'Derivado de la ' +
          this.bienesLotesForm.get('description').value +
          ' para la enajenación de vehiculos y/o bienes diversos ' +
          this.bienesLotesForm.get('cveProceso').value +
          ' celebrada el dia ' +
          this.carta;
        '' +
          '. Solicito a usted sea entegada(s) la siguente(s) mercancias que a continuación se describe.';
        this.comerLibsForm
          .get('paragraph1')
          .setValue(this.comerLibsForm.value.paragraph1);
      },
      error: () => {
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

  searchComer(provider?: IComerLetter) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
    };

    let modalRef = this.modalService.show(FindRespLetterComponent, modalConfig);
    modalRef.content.onSave.subscribe((next: any) => {
      this.letterDefault = next;
      console.log(next.id);
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
              'No Tiene Permiso de Lectura y/o Escritura sobre la Pantalla, por lo que no podrá Ingresar',
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
        this.event = data;
        this.carta = this.datePipe.transform(
          this.event.failedDate,
          'dd/MM/yyyy'
        );
        // this.bienesLotesForm.get('descEvento').setValue(this.event.descEvento);
        this.comerLibsForm.get('fechaCarta').setValue(this.carta);
        this.comerLibsForm.get('adjudicatario').setValue(this.event.signatory);
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
  }
  goBack() {}

  actualizarLetter() {}

  // async getDepartment() {
  //   const params = new ListParams();
  //   params['filter.id'] = this.department;
  //   params['filter.numDelegation'] = this.delegation;
  //   params['filter.numSubDelegation'] = this.subDelegation;
  //   params['filter.phaseEdo'] = this.faEtapaCreada;
  //   this.departamentService.getbyDelegation(this.delegation, '').subscribe({
  //     next: data => {
  //       console.log(data)
  //     }
  //   })

  // }

  comerBienesLetter(lotId: number, params: ListParams) {
    this.bienesLoading = true;
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;
    this.filterParams.getValue().search = params.text;
    this.filterParams
      .getValue()
      .addFilter('lotId', this.letter.lotsId, SearchFilter.EQ);
    this.comerEventService
      .getAllFilterLetter(lotId, this.params.getValue())
      .subscribe({
        next: data => {
          this.bienesLoading = false;
          this.bienes = data.data;
          this.dataTableGood.load(this.bienes);
          this.dataTableGood.refresh();
          this.totalItems = data.count;
        },
        error: () => {
          this.bienesLoading = false;
          console.error('error al filtrar bienes');
        },
      });
  }
  searchEvent() {}
}
