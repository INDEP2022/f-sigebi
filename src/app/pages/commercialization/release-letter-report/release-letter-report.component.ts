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
import { IGood } from 'src/app/core/models/good/good.model';
import { IComerLetter } from 'src/app/core/models/ms-parametercomer/comer-letter';
import { IComerLotsEG } from 'src/app/core/models/ms-parametercomer/parameter';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ComerLetterService } from 'src/app/core/services/ms-parametercomer/comer-letter.service';
import { ComerLotService } from 'src/app/core/services/ms-parametercomer/comer-lot.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  idEvent: number = 0;
  comerLots: IComerLotsEG;
  dataTableGood: LocalDataSource = new LocalDataSource();
  selectEvent = new DefaultSelect<IComerLotsEG>();
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  selectLot = new DefaultSelect<IComerLotsEG>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsBienes = new BehaviorSubject<ListParams>(new ListParams());
  idLot: number = 0;
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
  delegation: string = '';
  userName: string = '';
  letterDefault: any = null;
  subDelegation: string = '';
  carta: string;
  desType: string;
  screenKey = 'FCOMERCARTALIB_I';
  // params = new BehaviorSubject<ListParams>(new ListParams());
  dataUserLoggedTokenData: any;

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

  constructor(
    private fb: FormBuilder,
    private securityService: SecurityService,
    private reportService: ReportService,
    private comerLotService: ComerLotService,
    private comerLetterService: ComerLetterService,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private router: Router
  ) {
    super();
    this.validPermisos = !this.validPermisos;
    this.settings = {
      ...TABLE_SETTINGS,
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
    this.delegation = this.authService.decodeToken().delegacionreg;
    this.subDelegation = this.authService.decodeToken().sub;
    this.userName = this.authService.decodeToken().preferred_username;

    this.userTracker(
      this.screenKey,
      this.authService.decodeToken().preferred_username
    );
    this.comerLibsForm = this.fb.group({
      oficio: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      diridoA: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      puesto: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      parrafo1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      adjudicatorio: [null, [Validators.pattern(STRING_PATTERN)]],
      factura: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      fechaFactura: [null, [Validators.required]],
      parrafo2: [null, [Validators.pattern(STRING_PATTERN)]],
      firmante: [null, [Validators.pattern(STRING_PATTERN)]],
      ccp1: [null, [Validators.pattern(STRING_PATTERN)]],
      ccp2: [null, [Validators.pattern(STRING_PATTERN)]],
      ccp3: [null, [Validators.pattern(STRING_PATTERN)]],
      ccp4: [null, [Validators.pattern(STRING_PATTERN)]],
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
    });
  }
  bienlotForm() {
    this.bienesLotesForm = this.fb.group({
      lote: [null],
      evento: [null],
      description: [null],
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
        this.comerLibsForm.get('oficio').setValue(this.letter.id);
        this.comerLibsForm.get('diridoA').setValue(this.letter.addressedTo);
        this.comerLibsForm.get('puesto').setValue(this.letter.position);
        this.comerLibsForm.get('parrafo1').setValue(this.letter.paragraph1);
        this.comerLibsForm.get('parrafo2').setValue(this.letter.paragraph2);
        this.comerLibsForm.get('adjudicatorio').setValue(this.letter.signatory);
        this.comerLibsForm.get('factura').setValue(this.letter.invoiceNumber);
        this.comerLibsForm.get('fechaFactura').setValue(this.carta);
        this.comerLibsForm.get('ccp1').setValue(this.letter.ccp1);
        this.comerLibsForm.get('ccp2').setValue(this.letter.ccp2);
        this.comerLibsForm.get('ccp3').setValue(this.letter.ccp3);
        this.comerLibsForm.get('ccp4').setValue(this.letter.ccp4);
        this.getComerLotes(this.letter.lotsId);
        // this.bienesLotesForm.get('description').setValue(this.letter.lots);
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

    let modalRef = this.modalService.show(
      FindReleaseLetterComponent,
      modalConfig
    );
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
            this.validPermisos = true;
            console.log('readNo and writeYes');
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

  comerBienesLetter(params: ListParams) {}
  getComerLotes(id: number) {
    this.comerLotService.getByIdLot(id).subscribe({
      next: data => {
        this.comerLots = data;
        this.bienesLotesForm.get('lote').setValue(data.idLot);
        this.bienesLotesForm.get('description').setValue(data.description);
        this.bienesLotesForm.get('evento').setValue(data.idEvent);
        console.log(this.comerLots);
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
}
