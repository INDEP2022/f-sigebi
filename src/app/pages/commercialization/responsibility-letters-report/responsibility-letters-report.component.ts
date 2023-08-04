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
} from 'src/app/common/repository/interfaces/list-params';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { IComerLetter } from 'src/app/core/models/ms-parametercomer/comer-letter';
import { IComerLotsEG } from 'src/app/core/models/ms-parametercomer/parameter';
import { IResLetter } from 'src/app/core/models/ms-parametercomer/resp-letter';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { SubDelegationService } from 'src/app/core/services/maintenance-delegations/subdelegation.service';
import { ComerLetterService } from 'src/app/core/services/ms-parametercomer/comer-letter.service';
import { ComerLotService } from 'src/app/core/services/ms-parametercomer/comer-lot.service';
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
  goodList: IGood;
  dataGood: any;
  totalItems: number = 0;
  bienesLoading: boolean = false;
  idEvent: number = 0;
  descArea: string;
  event: IComerEvent;
  area: IDepartment;
  respLetter: IResLetter;
  comerLots: IComerLotsEG;
  dataTableGood: LocalDataSource = new LocalDataSource();
  selectEvent = new DefaultSelect<IComerLotsEG>();
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  selectLot = new DefaultSelect<IComerLotsEG>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsBienes = new BehaviorSubject<ListParams>(new ListParams());
  idLot: number = 0;
  bienes: any;
  faEtapaCreada: number = 0;
  letter: IComerLetter;
  read: boolean = false;
  update: boolean = false;
  delete: boolean = false;
  insert: boolean = false;
  lettersAll: IComerLetter[] = [];
  idGood: number = null;
  dateLetter = new Date();
  valid: boolean = false;
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

  get descEvent() {
    return this.bienesLotesForm.get('descEvento');
  }
  get rfc() {
    return this.respForm.get('rfc');
  }
  get domicilio() {
    return this.respForm.get('domicilio');
  }
  get delegation() {
    return this.respForm.get('delegation');
  }
  get colonia() {
    return this.respForm.get('colonia');
  }
  get estado() {
    return this.respForm.get('colonia');
  }
  get cp() {
    return this.respForm.get('cp');
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
    private authService: AuthService,
    private comerEventService: ComerEventService,
    private router: Router
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
      diridoA: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      puesto: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      parrafo1: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(500)],
      ],
      adjudicatorio: [null, [Validators.pattern(STRING_PATTERN)]],
      factura: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(20)],
      ],
      fechaFactura: [null, [Validators.required]],
      parrafo2: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(500)],
      ],
      firmante: [null, [Validators.pattern(STRING_PATTERN)]],
      ccp1: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      ccp2: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      ccp3: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      ccp4: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
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
  comerRespForm() {
    this.respForm = this.fb.group({
      rfc: [null],
      domicilio: [null],
      delegation: [null],
      colonia: [null],
      estado: [null],
      cp: [null],
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

  getComerRespById(id: string) {
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
        // this.comerLibsForm.get('fechaCarta').setValue(this.carta);
        // this.comerLibsForm.get('fechaFallo').setValue(this.carta);
        this.comerLibsForm.get('diridoA').setValue(this.letter.addressedTo);
        this.comerLibsForm.get('puesto').setValue(this.letter.position);
        this.comerLibsForm.get('firmante').setValue(this.puestoUser);
        this.comerLibsForm.get('parrafo2').setValue(this.letter.paragraph2);
        this.comerLibsForm.get('adjudicatorio').setValue(this.letter.signatory);
        this.comerLibsForm.get('factura').setValue(this.letter.invoiceNumber);
        this.comerLibsForm.get('fechaFactura').setValue(this.start);
        this.comerLibsForm.get('ccp1').setValue(this.letter.ccp1);
        this.comerLibsForm.get('ccp2').setValue(this.letter.ccp2);
        this.comerLibsForm.get('ccp3').setValue(this.letter.ccp3);
        this.comerLibsForm.get('ccp4').setValue(this.letter.ccp4);
      },
      error: () => {
        console.log('error');
      },
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
        // this.comerLibsForm.get('fechaCarta').setValue(this.carta);
        // this.comerLibsForm.get('fechaFallo').setValue(this.carta);
        this.comerLibsForm.get('diridoA').setValue(this.letter.addressedTo);
        this.comerLibsForm.get('puesto').setValue(this.letter.position);
        this.comerLibsForm.get('firmante').setValue(this.puestoUser);
        this.comerLibsForm.get('parrafo2').setValue(this.letter.paragraph2);
        this.comerLibsForm.get('adjudicatorio').setValue(this.letter.signatory);
        this.comerLibsForm.get('factura').setValue(this.letter.invoiceNumber);
        this.comerLibsForm.get('fechaFactura').setValue(this.start);
        this.comerLibsForm.get('ccp1').setValue(this.letter.ccp1);
        this.comerLibsForm.get('ccp2').setValue(this.letter.ccp2);
        this.comerLibsForm.get('ccp3').setValue(this.letter.ccp3);
        this.comerLibsForm.get('ccp4').setValue(this.letter.ccp4);
        this.getComerLotes(this.letter.lotsId);
        this.comerBienesLetter(this.letter.lotsId, this.params.getValue());
      },
      error: () => {
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

  getComerLotes(id: number) {
    this.comerLotService.getByIdLot(id).subscribe({
      next: data => {
        this.comerLots = data;
        this.bienesLotesForm.get('lote').setValue(data.idLot);
        this.bienesLotesForm.get('description').setValue(data.description);
        this.bienesLotesForm.get('evento').setValue(data.idEvent);
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
        this.carta = this.datePipe.transform(
          this.event.failedDate,
          'dd/MM/yyyy'
        );
        // this.bienesLotesForm.get('descEvento').setValue(this.event.descEvento);
        this.comerLibsForm.get('fechaCarta').setValue(this.carta);
        this.comerLibsForm.get('adjudicatario').setValue(this.event.signatory);
        this.bienesLotesForm.get('cveProceso').setValue(this.event.processKey);
        // const year = this.datePipe.transform(this.letter.dateFail, 'yyyy');
        this.comerLibsForm.value.parrafo1 =
          'Derivado de la ' +
          this.bienesLotesForm.get('description').value +
          ' para la enajenación de vehiculos y/o bienes diversos ' +
          this.bienesLotesForm.get('cveProceso').value +
          ' celebrada el dia ' +
          '' +
          '. Solicito a usted sea entegada(s) la siguente(s) mercancias que a continuación se describe.';
        this.comerLibsForm
          .get('parrafo1')
          .setValue(this.comerLibsForm.value.parrafo1);
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

  comerBienesLetter(lotId: number, params1: ListParams) {
    // this.bienesLoading = true;
    // this.filterParams.getValue().removeAllFilters();
    // this.filterParams.getValue().page = params.page;
    // this.filterParams.getValue().search = params.text;
    // this.filterParams
    //   .getValue()
    //   .addFilter('lotId', this.letter.lotsId, SearchFilter.EQ);
    const params: any = new FilterParams();
    params['filter.lotId'] = '$eq:' + this.letter.lotsId;
    // params.addFilter('lotId', this.letter.lotsId);
    params.page = this.paramsBienes.value.page;
    params.limit = this.paramsBienes.value.limit;
    delete params['search'];
    delete params['sortBy'];
    console.log(params);
    this.comerEventService.getFindAllComerGoodXlotTotal(params).subscribe({
      next: (data: any) => {
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
        console.error('error al filtrar bienes');
      },
    });
  }
  searchEvent() {}

  getDepositaryType(paramsData: ListParams, getByValue: boolean = false) {
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    if (getByValue) {
      paramsData['filter.eventTpId'] =
        '$eq:' + this.bienesLotesForm.get('evento').value;
    }
    // paramsData['sortBy'] = 'townshipKey:DESC';
    console.log('DATA SELECT ', paramsData);

    this.comerEventService.getAllEvent(paramsData).subscribe({
      next: data => {
        console.log('DATA SELECT ', data.data);
        this.selectDataEvent = new DefaultSelect(
          data.data.map((i: any) => {
            i['nameDesc'] = i.otkey + ' -- ' + i.otvalor;
            return i;
          }),
          data.count
        );
        console.log(data, this.selectDataEvent);
      },
      error: error => {
        this.selectDataEvent = new DefaultSelect();
      },
    });
  }
}
