import { Component, OnInit } from '@angular/core';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import { EVENT_PREPARATION_ALLOTMENT_COLUMNS } from './event-preparation-allotment-columns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SelectEventModalComponent } from '../select-event-modal/select-event-modal.component';
import { CreateNewEventModalComponent } from '../create-new-event-modal/create-new-event-modal.component';
import { animate, style, transition, trigger } from '@angular/animations';
//XLSX
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/common/services/exportToExcel.service';
import { AddEditLoteModalComponent } from '../add-edit-lote-modal/add-edit-lote-modal.component';

@Component({
  selector: 'app-c-b-f-fmdvdb-c-event-preparation',
  templateUrl: './c-b-f-fmdvdb-c-event-preparation.component.html',
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
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class CBFFmdvdbCEventPreparationComponent
  extends BasePage
  implements OnInit
{
  event: any = null;
  authKey: string = '';

  columns: any[] = [];
  totalItems: number = 0;

  settings = { ...TABLE_SETTINGS, 
    actions: {
      columnTitle: "Detalles", 
      add: false,
      delete: true,
      position: 'right',
    }
  };

  constructor(private modalService: BsModalService, private excelService: ExcelService) {
    super();
    this.settings.columns = EVENT_PREPARATION_ALLOTMENT_COLUMNS;
  }

  ngOnInit(): void {}

  openModal(context?: Partial<SelectEventModalComponent>) {
    const modalRef = this.modalService.show(SelectEventModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe((next: any) => {
      if (next) {
        console.log(next);
        this.event = next;
        this.authKey = '';
      }
    });
  }

  openModal2(): void {
    const modalRef = this.modalService.show(
      CreateNewEventModalComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
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
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

   openForm(allotment?: any) {
     this.openModal3({ allotment });
   }

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
      this.data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      console.log(this.data);
    };
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.data, 'lotes_preparando_evento');
  }

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
}
