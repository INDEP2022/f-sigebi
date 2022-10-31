import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocumentFormComponent } from 'src/app/pages/request/programming-request-components/execute-reception/document-form/document-form.component';
import { DocumentShowComponent } from 'src/app/pages/request/programming-request-components/execute-reception/document-show/document-show.component';
import { DOCUMENTS_LIST_EST_COLUMNS } from 'src/app/pages/request/programming-request-components/execute-reception/documents-list/documents-list-columns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-document-estate',
  templateUrl: './document-estate.component.html',
  styles: [],
})
export class DocumentEstateComponent extends BasePage implements OnInit {
  @Input() expedientEstForm: FormGroup;
  typeDocuments = new DefaultSelect();

  documentsEstData: any[] = [];
  constructor(private modalService: BsModalService) {
    super();

    this.settings = {
      ...this.settings,
      columns: DOCUMENTS_LIST_EST_COLUMNS,
      edit: { editButtonContent: '<i class="fa fa fa-file"></i>' },
      delete: {
        deleteButtonContent: '<i class="fa fa-eye text-info mx-2"></i>',
      },
    };
    this.settings.actions.delete = true;

    this.documentsEstData = [
      {
        numberDocument: 435345345,
        numberGood: 564564566,
        titleDocument: 'Documeto prueba',
        typeDocument: 'Prueba',
        author: 'Gustavo',
        creationDate: '12-11-1999',
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
