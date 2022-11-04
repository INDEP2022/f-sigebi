import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ElectronicSignatureListComponent } from '../../../programming-request-components/acept-programming/electronic-signature-list/electronic-signature-list.component';
import { ShowSignatureProgrammingComponent } from '../../../programming-request-components/acept-programming/show-signature-programming/show-signature-programming.component';
import { DocumentsListComponent } from '../../../programming-request-components/execute-reception/documents-list/documents-list.component';
import { AssociateFileComponent } from '../associate-file/associate-file.component';
import { EXPEDIENT_DOC_GEN_COLUMNS } from '../registration-request-form/expedient-doc-columns';

@Component({
  selector: 'app-general-documents-form',
  templateUrl: './general-documents-form.component.html',
  styleUrls: ['../../styles/search-document-form.scss'],
})
export class GeneralDocumentsFormComponent extends BasePage implements OnInit {
  @Input() searchFileForm: FormGroup;
  authorities = new DefaultSelect();
  regionalsDelegations = new DefaultSelect();
  states = new DefaultSelect();
  transferents = new DefaultSelect();
  stations = new DefaultSelect();
  showSearchForm: boolean = false;
  documentsGenData: any[] = [];

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: EXPEDIENT_DOC_GEN_COLUMNS,
    };
  }

  ngOnInit(): void {}

  newExpedient() {
    const newExpedient = this.modalService.show(AssociateFileComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  showDocsEst() {
    const showDoctsEst = this.modalService.show(DocumentsListComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  electronicSign() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          this.showSignProg();
        }
      },
    };

    const electronicSign = this.modalService.show(
      ElectronicSignatureListComponent,
      config
    );
  }

  showSignProg() {
    const showSignProg = this.modalService.show(
      ShowSignatureProgrammingComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  getAuthoritySelect(authority: ListParams) {}
  getRegionalDelegationSelect(regionalDelegation: ListParams) {}
  getStateSelect(state: ListParams) {}
  getTransferentSelect(transferent: ListParams) {}
  getStationSelect(station: ListParams) {}
}
