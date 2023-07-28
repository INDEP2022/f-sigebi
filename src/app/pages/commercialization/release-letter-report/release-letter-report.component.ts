import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { IComerLotsEG } from 'src/app/core/models/ms-parametercomer/parameter';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ComerLotService } from 'src/app/core/services/ms-parametercomer/comer-lot.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

export interface IReport {
  data: File;
}

@Component({
  selector: 'app-release-letter-report',
  templateUrl: './release-letter-report.component.html',
  styleUrls: ['release-letter-report.component.scss'],
})
export class ReleaseLetterReportComponent extends BasePage implements OnInit {
  goodList: IGood;
  dataGood: any;
  totalItems: number = 0;
  idEvent: number = 0;
  selectEvent = new DefaultSelect<IComerLotsEG>();
  selectLot = new DefaultSelect<IComerLotsEG>();
  idLot: number = 0;
  idGood: number = null;
  valid: boolean = false;
  validPermisos: boolean = false;
  start: string;
  carta: string;
  desType: string;
  params = new BehaviorSubject<ListParams>(new ListParams());

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

  // ccp4
  // lote
  // fechaCarta
  // fechaFallo
  // cveProceso
  // descEvent
  // nombreFirma
  // puestoFirma
  // nombreCcp1
  // nombreCcp2

  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      goodId: {
        title: 'Bien',
        type: 'string',
        sort: false,
      },
      description: {
        title: 'Descripcion',
        type: 'string',
        sort: false,
      },
      quantity: {
        title: 'Valor',
        type: 'string',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  comerLibsForm: FormGroup;
  bienesLotesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private comerLotService: ComerLotService,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.bienlotForm();
    // this.getEvent(this.params.getValue());
    // this.getLot(this.params.getValue());
  }

  prepareForm() {
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
      evento: [null],
      description: [null],
    });
  }

  confirm(): void {
    // console.log(this.comerLibsForm.value);

    let params = {
      DESTYPE: this.comerLibsForm.controls['descEvent'].value,
      ID_LOTE: this.comerLibsForm.controls['lote'].value,
      OFICIO_CARTALIB: this.comerLibsForm.controls['oficio'].value,
      DIRIGIDO_A: this.comerLibsForm.controls['diridoA'].value,
      PUESTO: this.comerLibsForm.controls['puesto'].value,
      PARRAFO1: this.comerLibsForm.controls['parrafo1'].value,
      ADJUDICATARIO: this.comerLibsForm.controls['adjudicatorio'].value,
      NO_FACTURA: this.comerLibsForm.controls['factura'].value,
      FECHA_FACTURA: this.comerLibsForm.controls['fechaFactura'].value,
      PARRAFO2: this.comerLibsForm.controls['parrafo2'].value,
      FIRMANTE: this.comerLibsForm.controls['firmante'].value,
      PUESTOFIRMA: this.comerLibsForm.controls['puestoFirma'].value,
      CCP1: this.comerLibsForm.controls['ccp1'].value,
      CCP2: this.comerLibsForm.controls['ccp1'].value,
      PUESTOCCP1: this.comerLibsForm.controls['puestoCcp1'].value,
      PUESTOCCP2: this.comerLibsForm.controls['puestoCcp2'].value,
      FECHA_CARTA: this.comerLibsForm.controls['fechaCarta'].value,
    };

    console.log(params);
    this.siabService
      // .fetchReport('RGERADBCONCNUMEFE', params)
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

  getGood(search: any) {
    this.loading = true;
    this.comerLotService.findGood(search).subscribe({
      next: data => {
        this.goodList = data.data;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  getEvent(params?: ListParams) {
    params['filter.event.statusvtaId'] = `$ilike:${params.text}`;
    params['filter.event.id'] = `$eq:${this.idEvent}`;
    this.comerLotService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.description = `${data.event.id}- ${data.event.statusvtaId}`;
          return data;
        });
        this.selectEvent = new DefaultSelect(data.data, data.count);
        // this.getGood(this.idGood);
      },
      error: () => {
        this.selectEvent = new DefaultSelect();
      },
    });
  }
  getLot(params?: ListParams) {
    params['filter.event.id'] = `$eq:${this.idEvent}`;
    this.comerLotService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          this.idGood = data.goodNumber;
          this.valid = true;
          data.description = `${data.lotId}- ${data.description}`;
          return data;
        });
        this.selectLot = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.selectLot = new DefaultSelect();
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
      DESTYPE: this.comerLibsForm.controls['evento'].value,
      ID_LOTE: this.comerLibsForm.controls['lote'].value,
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

  cleanForm(): void {
    this.comerLibsForm.reset();
  }
}
export const RELEASE_REPORT_COLUMNS = {
  goodNumber: {
    title: 'Bien',
    type: 'text',
    sort: true,
  },
  description: {
    title: 'Descripcion',
    type: 'text',
    sort: true,
  },
  amount: {
    title: 'Valor',
    type: 'text',
    sort: true,
  },
};

const EXAMPLE_DATA = [
  {
    description: 'Comercialización',
  },
  {
    description: 'Siap',
  },
  {
    description: 'Entrega de bienes',
  },
  {
    description: 'Inmuebles',
  },
  {
    description: 'Muebles',
  },
  {
    description: 'Importaciones',
  },
  {
    description: 'Enajenación',
  },
  {
    description: 'Lícito de bienes',
  },
];
