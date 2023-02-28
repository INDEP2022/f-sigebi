import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { CreateNewEventModalComponent } from '../create-new-event-modal/create-new-event-modal.component';
import { SelectEventModalComponent } from '../select-event-modal/select-event-modal.component';
import { EVENT_PREPARATION_GOODS_COLUMNS } from './even-preparation-goods-columns';
import { EVENT_PREPARATION_ALLOTMENT_COLUMNS } from './event-preparation-allotment-columns';
//XLSX
import { ExcelService } from 'src/app/common/services/excel.service';
import * as XLSX from 'xlsx';
import { AddEditLoteModalComponent } from '../add-edit-lote-modal/add-edit-lote-modal.component';
import { GroundsStatusModalComponent } from '../grounds-status-modal/grounds-status-modal.component';

@Component({
  selector: 'app-event-preparation',
  templateUrl: './event-preparation.component.html',
  styles: [
    `
      .bg-key {
        background-color: #e3e3e3;
        border-radius: 8px !important;
      }
    `,
  ],
  animations: [
    trigger('OnEventSelected', [
      //  transition(':enter', [
      //    style({ opacity: 0 }),
      //    animate('500ms', style({ opacity: 1 })),
      //  ]),
      //  transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class EventPreparationComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  event: any = null;
  authKey: string = '';

  columns: any[] = [];

  settings2 = {
    ...this.settings,
    actions: false,
  };

  totalItems: number = 0;
  get check() {
    return this.form.get('check');
  }

  constructor(
    private modalService: BsModalService,
    private excelService: ExcelService,
    private fb: FormBuilder
  ) {
    super();
    (this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Detalles',
        add: true,
        delete: true,
        position: 'right',
      },
      columns: { ...EVENT_PREPARATION_ALLOTMENT_COLUMNS },
    }),
      (this.settings2.columns = EVENT_PREPARATION_GOODS_COLUMNS);
  }

  ngOnInit(): void {
    // this.params
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getData());
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      check: [false],
    });
  }

  openModal(context?: Partial<SelectEventModalComponent>) {
    const modalRef = this.modalService.show(SelectEventModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  openModal2(): void {
    const modalRef = this.modalService.show(CreateNewEventModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
  groundsStatus(): void {
    const modalRef = this.modalService.show(GroundsStatusModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
  // openModal3(): void {
  //   const modalRef = this.modalService.show(
  //     AddEditLoteModalComponent,
  //     {
  //       class: 'modal-lg modal-dialog-centered',
  //       ignoreBackdropClick: true,
  //     }
  //   );
  // }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  openModal3(context?: Partial<AddEditLoteModalComponent>) {
    const modalRef = this.modalService.show(AddEditLoteModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  openForm(allotment?: any) {}

  delete(allotment: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

  ReadExcel(event: any) {
    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = e => {
      var workbook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workbook.SheetNames;
      this.data2 = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      console.log(this.data2);
    };
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.data, 'lotes_preparando_evento');
  }

  //Datos de prueba para lotes
  data = [
    {
      lote: '1148',
      descripcion: 'Aduana Dos Bocas (1)',
      valorbase: '0',
      idcliente: '240',
      rfc: 'SIIR480502JA1',
    },
    {
      lote: '1243',
      descripcion: 'Aduana Cd. Hidalgo',
      valorbase: '0',
      idcliente: '1596',
      rfc: 'PETJ700101',
    },
    {
      lote: '1414',
      descripcion: 'Aduana Salina Cruz',
      valorbase: '0',
      idcliente: '1458',
      rfc: 'REMJ760712',
    },
    {
      lote: '3213',
      descripcion: 'ALAF Oaxaca',
      valorbase: '0',
      idcliente: '1507',
      rfc: 'MOAR670630',
    },
  ];

  //Datos prueba de bienesdescripcion
  data2 = [
    {
      no_bien: '78946',
      descripcion: 'PIEZA, LLAVES PARA DADOS, MARCA PITTSBURGH',
      transferente: '451',
      estatus: 'CPV',
      cantidad: '2',
      valorAvaluo: '',
      eventoParticipante: '',
      loteParticipante: '',
      eventoRemPre: '',
      loteRemPre: '',
      valorBase: '',
      precioFinal: '',
      precioSIva: '',
      ivaFinal: '',
    },
    {
      no_bien: '14789',
      descripcion:
        '17 PIEZAS, CARTUCHOS DE VIDEO JUEGOS, 6 DE GAME CUBE, 7 GAME BOY ADVANCE Y 4 NINTENDO DS, EN BUEN ESTADO FISICO',
      transferente: '32',
      estatus: 'CPV',
      cantidad: '17',
      valorAvaluo: '',
      eventoParticipante: '',
      loteParticipante: '',
      eventoRemPre: '',
      loteRemPre: '',
      valorBase: '',
      precioFinal: '',
      precioSIva: '',
      ivaFinal: '',
    },
    {
      no_bien: '9874',
      descripcion:
        '140 PIEZAS, GORRAS BEISBOLERAS, MARCA BIG, EN BUEN ESTADO FISICO',
      transferente: '321',
      estatus: 'CPV',
      cantidad: '140',
      valorAvaluo: '',
      eventoParticipante: '',
      loteParticipante: '',
      eventoRemPre: '',
      loteRemPre: '',
      valorBase: '',
      precioFinal: '',
      precioSIva: '',
      ivaFinal: '',
    },
    {
      no_bien: '25849',
      descripcion: '50 PIEZAS DE LENTES, EN REGULAR ESTADO FÍSICO.',
      transferente: '357',
      estatus: 'CPV',
      cantidad: '9',
      valorAvaluo: '',
      eventoParticipante: '',
      loteParticipante: '',
      eventoRemPre: '',
      loteRemPre: '',
      valorBase: '',
      precioFinal: '',
      precioSIva: '',
      ivaFinal: '',
    },
    {
      no_bien: '98541',
      descripcion: 'PIEZAS DE BALATAS',
      transferente: '1874',
      estatus: 'CPV',
      cantidad: '1',
      valorAvaluo: '',
      eventoParticipante: '',
      loteParticipante: '',
      eventoRemPre: '',
      loteRemPre: '',
      valorBase: '',
      precioFinal: '',
      precioSIva: '',
      ivaFinal: '',
    },
  ];
}
