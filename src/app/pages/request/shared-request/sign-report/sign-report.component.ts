import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components
import { UploadElectronicSignatureComponent } from '../upload-electronic-signature/upload-electronic-signature.component';

@Component({
  selector: 'app-sign-report',
  templateUrl: './sign-report.component.html',
  styles: [],
})
export class SignReportComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  isSend: boolean = false;

  @Output() nextStep = new EventEmitter<boolean>();

  constructor(
    private modalService: BsModalService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: true,
        delete: true,
      },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.data.onChanged().subscribe(data => {
      if (data.elements.length <= 0) {
        this.isSend = false;
        this.nextStep.emit(false);
      } else {
        this.isSend = true;
        //this.nextStep.emit(true);
      }
    });
  }

  send(): void {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea mandar el documento a firmar?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Documento enviado correctamente', '');
      }
    });
  }

  openForm(signatory: any) {
    this.upload({ edit: true, signatory });
  }

  upload(context?: Partial<UploadElectronicSignatureComponent>): void {
    const modalRef = this.modalService.show(
      UploadElectronicSignatureComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );

    modalRef.content.newSignatory.subscribe(signatory => {
      if (signatory) {
        signatory = {
          ...signatory,
          status: 'Completo',
        };
        this.data.load([signatory]);
      } else {
        //this.isSigned = true;
        //this.tabsReport.tabs[0].disabled = false;
        //this.tabsReport.tabs[0].active = true;
      }
    });
  }

  next(): void {
    this.nextStep.emit(true);
  }

  close(): void {
    this.modalRef.hide();
  }

  delete(brand: any): void {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.data.load([]);
        this.data.refresh();
        this.onLoadToast(
          'success',
          'Eliminado',
          'Registro eliminado correctamente'
        );
      }
    });
  }
}
