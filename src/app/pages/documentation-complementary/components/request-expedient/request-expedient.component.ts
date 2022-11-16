import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DOCUMENTS_LIST_EST_COLUMNS } from 'src/app/pages/request/programming-request-components/execute-reception/documents-list/documents-list-columns';
import { DocumentFormComponent } from 'src/app/pages/request/shared-request/document-form/document-form.component';
import { DocumentShowComponent } from 'src/app/pages/request/shared-request/document-show/document-show.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ESTATES_REQUEST_COLUMNS } from '../../columns/estate-request-columns';
import { REQUEST_EXPEDIENT_COLUMNS } from '../../columns/request-expedient-columns';

@Component({
  selector: 'app-request-expedient',
  templateUrl: './request-expedient.component.html',
  styleUrls: ['../../styles/search-document-form.scss'],
})
export class RequestExpedientComponent extends BasePage implements OnInit {
  settingsDocExpediet = {
    ...this.settings,
    edit: { editButtonContent: '<i class="fa fa fa-file"></i>' },
    delete: {
      deleteButtonContent: '<i class="fa fa-eye text-info mx-2"></i>',
    },
    columns: DOCUMENTS_LIST_EST_COLUMNS,
  };

  settingsReqExpedient = {
    ...this.settings,
    actions: false,
    columns: REQUEST_EXPEDIENT_COLUMNS,
  };
  settingsEstateRequest = {
    ...this.settings,
    actions: false,
    columns: ESTATES_REQUEST_COLUMNS,
  };

  @Input() documentationExpedientForm: FormGroup;
  documentsReqData: any[] = [];
  expedientData: any[] = [];
  estateRequestData: any[] = [];
  showSearchForm: boolean = false;

  typeDocuments = new DefaultSelect();

  constructor(private modalService: BsModalService) {
    super();
    this.settingsDocExpediet.actions.delete = true;

    this.expedientData = [
      {
        numberDocument: 32423,
        numberGood: 345345,
        titleDocument: 'Documento prueba',
        typeDocument: 'Tipo documento',
        author: 'Autor',
        creationDate: '12-10-2022',
      },
    ];
  }

  ngOnInit(): void {}

  uploadFiles() {
    const uploadFiles = this.modalService.show(DocumentFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  showDocument() {
    const showDocument = this.modalService.show(DocumentShowComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  viewDocument() {
    alert('Se abrira el documento');
  }

  getTypeDocumentSelect(document: ListParams) {}
}
