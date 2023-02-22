import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentsListComponent } from '../../../programming-request-components/execute-reception/documents-list/documents-list.component';
import { EXPEDIENT_DOC_EST_COLUMNS } from '../registration-request-form/expedient-doc-columns';

@Component({
  selector: 'app-estate-document-form',
  templateUrl: './estate-document-form.component.html',
  styleUrls: ['../../styles/search-document-form.scss'],
})
export class EstateDocumentFormComponent extends BasePage implements OnInit {
  @Input() searchFileForm: FormGroup;

  documentSelect: boolean = false;
  goodTypes = new DefaultSelect();
  documentsEstData: any[] = [];
  showSearchForm: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private modalService: BsModalService) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: EXPEDIENT_DOC_EST_COLUMNS,
    };
  }

  ngOnInit(): void {}

  getGoodTypeSelect(goodType: ListParams) {}

  showDocsEstValidate() {
    if (!this.documentSelect) {
      alert('Selecciona un documento');
    } else {
      const showDoctsEst = this.modalService.show(DocumentsListComponent, {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      });
    }
  }

  selectDocument(selectDocument?: any) {
    if (selectDocument?.isSelected) {
      this.documentSelect = true;
    } else {
      this.documentSelect = false;
    }
  }
}
