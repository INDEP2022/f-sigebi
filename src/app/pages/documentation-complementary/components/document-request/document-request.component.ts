import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocumentFormComponent } from 'src/app/pages/request/programming-request-components/execute-reception/document-form/document-form.component';
import { DocumentShowComponent } from 'src/app/pages/request/programming-request-components/execute-reception/document-show/document-show.component';
import { DOCUMENTS_LIST_EST_COLUMNS } from 'src/app/pages/request/programming-request-components/execute-reception/documents-list/documents-list-columns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ExpedientListComponent } from '../../expedient-list/expedient-list.component';

@Component({
  selector: 'app-document-request',
  templateUrl: './document-request.component.html',
  styles: [],
})
export class DocumentRequestComponent extends BasePage implements OnInit {
  typeDocuments = new DefaultSelect();

  @Input() documentationExpedientForm: FormGroup;
  expedientData: any[] = [];

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      edit: { editButtonContent: '<i class="fa fa fa-file"></i>' },
      delete: {
        deleteButtonContent: '<i class="fa fa-eye text-info mx-2"></i>',
      },
      columns: DOCUMENTS_LIST_EST_COLUMNS,
    };

    this.expedientData = [
      {
        numberDocument: 4353453,
        numberGood: 45645,
        titleDocument: 'documemento',
        author: 'Gustavo',
        typeDocument: 'documento',
      },
    ];
  }

  ngOnInit(): void {}

  getTypeDocumentSelect(goodType: ListParams) {}

  uploadFiles() {
    const uploadFiles = this.modalService.show(DocumentFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  showExpedient() {
    const showExpedient = this.modalService.show(ExpedientListComponent, {
      class: 'gray modal-lg modal-dialog-centered',
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
}
