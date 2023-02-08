import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AssociateFileButtonComponent } from './associate-file-button/associate-file-button.component';
import { ASSOCIATE_FILE_COLUMNS } from './associate-file-columns';
import { NewFileModalComponent } from './new-file-modal/new-file-modal.component';

@Component({
  selector: 'app-associate-file',
  templateUrl: './associate-file.component.html',
  styles: [],
})
export class AssociateFileComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  fileColumns: any[] = [];
  fileSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  fileTestData = [
    {
      fileNo: 222,
      requestNo: 1037,
      subject: 'SOLICITUD DE TRANSFERENCIA',
      requestDate: '25-oct-2017',
      receptionDate: '',
      senderName: 'LAURA ALVAREZ',
      senderPosition: 'DIRECTOR',
      senderPhone: '5500000000',
      senderEmail: 'OST12551@SAT.COM',
      regionalDelegation: 'BAJA CALIFORNIA',
      state: 'BAJA CALIFORNIA',
      transferee: 'SAT - COMERCIO EXTERIOR',
      emitter: 'AGAO',
    },
    {
      fileNo: 202,
      requestNo: 968,
      subject: 'SOLICITUD DE TRANSFERENCIA',
      requestDate: '13-oct-2017',
      receptionDate: '',
      senderName: 'PRUEBA EJEMPLO',
      senderPosition: 'CARGO REMITIDO',
      senderPhone: '1111100000',
      senderEmail: 'ANDRES_MENDOZA@SAT.COM',
      regionalDelegation: 'BAJA CALIFORNIA',
      state: 'BAJA CALIFORNIA',
      transferee: 'SAT - COMERCIO EXTERIOR',
      emitter: 'AGAO',
    },
    {
      fileNo: 41,
      requestNo: 1038,
      subject: 'SOLICITUD DE TRANSFERENCIA',
      requestDate: '25-oct-2017',
      receptionDate: '',
      senderName: 'LAURA ALVAREZ',
      senderPosition: 'DIRECTOR',
      senderPhone: '5500000000',
      senderEmail: 'OST12551@SAT.COM',
      regionalDelegation: 'BAJA CALIFORNIA',
      state: 'BAJA CALIFORNIA',
      transferee: 'SAT - COMERCIO EXTERIOR',
      emitter: 'AGAO',
    },
  ];

  constructor(private modalService: BsModalService) {
    super();
    this.fileSettings.columns = ASSOCIATE_FILE_COLUMNS;
  }

  ngOnInit(): void {
    const self = this;
    this.fileSettings.columns = {
      associate: {
        title: 'Asociar Expediente',
        type: 'custom',
        sort: false,
        renderComponent: AssociateFileButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            component.associateFile(row);
          });
        },
      },
      ...this.fileSettings.columns,
    };
  }

  getFiles(requestInfo: any) {
    console.log(requestInfo);
    // Llamar servicio para buscar expedientes
    let columns = this.fileTestData;
    columns.forEach(c => {
      c = Object.assign({ associate: '' }, c);
    });
    this.fileColumns = columns;
    this.totalItems = this.fileColumns.length;
    console.log(this.fileColumns);
  }

  associateFile(row: any) {
    console.log(row);
    // Llamar servicio para asociar expediente
    this.alert(
      'success',
      'Asociación Exitosa',
      `La solicitud ha sido asociada al expediente No. ${row.fileNo}`
    );
  }

  openFileModal() {
    const modalRef = this.modalService.show(NewFileModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onCreate.subscribe((data: boolean) => {
      if (data) this.confirm(data);
    });
  }

  confirm(result: boolean) {}
}
