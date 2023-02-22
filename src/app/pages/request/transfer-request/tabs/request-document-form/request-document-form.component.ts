import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentsListComponent } from '../../../programming-request-components/execute-reception/documents-list/documents-list.component';
import { EXPEDIENT_DOC_REQ_COLUMNS } from '../registration-request-form/expedient-doc-columns';

@Component({
  selector: 'app-request-document-form',
  templateUrl: './request-document-form.component.html',
  styleUrls: ['../../styles/search-document-form.scss'],
})
export class RequestDocumentFormComponent extends BasePage implements OnInit {
  @Input() searchFileForm: FormGroup;
  regionalsDelegations = new DefaultSelect();
  states = new DefaultSelect();
  documentsReqData: any[] = [];
  showSearchForm: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      columns: EXPEDIENT_DOC_REQ_COLUMNS,
      actions: false,
    };
  }

  ngOnInit(): void {}

  showDocsEst() {
    const showDoctsEst = this.modalService.show(DocumentsListComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  getRegionalDelegationSelect(regionalDelegation: ListParams) {}
  getStateSelect(states: ListParams) {}
}
