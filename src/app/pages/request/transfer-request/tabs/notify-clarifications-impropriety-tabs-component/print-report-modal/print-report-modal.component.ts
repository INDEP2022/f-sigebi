import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { UploadFielsModalComponent } from '../upload-fiels-modal/upload-fiels-modal.component';
import { LIST_REPORTS_COLUMN } from './list-reports-column';

var data = [
  {
    id: 1,
    name: 'ENRIQUE GUZMAN',
    position: 'SUPERVISOR',
    statusRegistration: 'DATOS INCOMPLETOS',
  },
];

@Component({
  selector: 'app-print-report-modal',
  templateUrl: './print-report-modal.component.html',
  styles: [],
})
export class PrintReportModalComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  totalItems: number = 0;

  title: string = 'Imprimir Reporte';
  btnTitle: string = 'Firma Reporte';
  printReport: boolean = true;
  listSigns: boolean = false;
  isAttachDoc: boolean = false;
  columns = LIST_REPORTS_COLUMN;
  config = {
    keyboard: true,
  };

  constructor(
    public modalService: BsModalService,
    public modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = { ...TABLE_SETTINGS, actions: false };
    this.settings.columns = LIST_REPORTS_COLUMN;

    this.columns.button = {
      ...this.columns.button,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick.subscribe((data: any) => {
          console.log(data);
          this.uploadData(data);
        });
      },
    };

    /* this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());*/
  }

  close(): void {
    this.modalRef.hide();
  }

  signReport() {
    //mostrar listado de reportes
    if (!this.listSigns && this.printReport && !this.isAttachDoc) {
      this.printReport = false;
      this.listSigns = true;
      this.title = 'Firma Electronica';

      this.ListReports();
    } else if (!this.listSigns && this.printReport && this.isAttachDoc) {
      //adjuntar el reporte

      this.close();
    }
  }

  ListReports() {
    //llamar a la lista de reportes
    this.paragraphs = data;
  }

  uploadData(data: any): void {
    let config: ModalOptions = {
      initialState: {
        data: data,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UploadFielsModalComponent, config);
  }

  sendSign() {
    //verificar que el estado de registro este como "datos completo" y enviarlo!
    this.alertQuestion(
      undefined,
      'Confirmación',
      '¿Está seguro a enviar la información a firmar?',
      'Acepetar'
    ).then(question => {
      if (question.isConfirmed) {
        console.log('enviar mensaje');
      }
    });
  }

  backStep() {
    this.listSigns = false;
    this.isAttachDoc = false;
    this.printReport = true;
    this.paragraphs = [];
  }

  nextStep() {
    //verificar que el estado de registro este como "Correcto" y siguiente paso
    this.listSigns = false;
    this.printReport = true;
    this.isAttachDoc = true;
    this.btnTitle = 'Adjuntar Documento';
  }
}
