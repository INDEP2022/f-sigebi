import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentShowComponent } from '../../../programming-request-components/execute-reception/document-show/document-show.component';
import { DocumentsListComponent } from '../../../programming-request-components/execute-reception/documents-list/documents-list.component';
import { EXPEDIENT_DOC_SEA_COLUMNS } from '../registration-request-form/expedient-doc-columns';

@Component({
  selector: 'app-search-document-form',
  templateUrl: './search-document-form.component.html',
  styleUrls: ['../../styles/search-document-form.scss'],
})
export class SearchDocumentFormComponent extends BasePage implements OnInit {
  @Input() searchFileForm: FormGroup;
  typeDocuments = new DefaultSelect();
  regionalsDelegations = new DefaultSelect();
  states = new DefaultSelect();
  transferents = new DefaultSelect();
  showSearchForm: boolean = false;
  documentsSeaData: any[] = [];

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private modalService: BsModalService) {
    super();
    this.settings.actions.delete = true;

    this.settings = {
      ...this.settings,
      columns: EXPEDIENT_DOC_SEA_COLUMNS,
      edit: {
        editButtonContent: '<i class="fa fa-file text-success mx-2"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-eye text-primary mx-2"></i>',
      },
    };

    this.documentsSeaData = [
      {
        noDocument: '4353533',
        noExpedient: '3455333',
        noRequest: '34534534',
        titleDocument: 'Documento',
        typeDocument: 'Tipo de documento',
        author: 'Autor',
        createDate: '24/10/2022',
      },
    ];
  }

  ngOnInit(): void {}

  getTypeDocumentSelect(typeDocument: ListParams) {}

  getRegionalDelegationSelect(regionalDelegation: ListParams) {}

  getStateSelect(state: ListParams) {}

  getTransferentSelect(transferent: ListParams) {}

  showDocsEst() {
    const showDoctsEst = this.modalService.show(DocumentsListComponent, {
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

  deleteDocument() {
    alert('Se abre PDF');
  }
}
