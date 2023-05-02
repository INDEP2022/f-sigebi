import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DocumentFormComponent } from 'src/app/pages/request/shared-request/document-form/document-form.component';
import { DocumentShowComponent } from 'src/app/pages/request/shared-request/document-show/document-show.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DOCUMENTS_COLUMNS } from '../../documents.columns';
import { documentsData } from '../../documents.data';

@Component({
  selector: 'app-documents-request-form',
  templateUrl: './documents-request-form.component.html',
  styles: [],
})
export class DocumentsRequestFormComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  documents = documentsData;
  typeDocumentData = new DefaultSelect();
  delegationsRegionals = new DefaultSelect();
  states = new DefaultSelect();
  Transferents = new DefaultSelect();
  showSearchForm: boolean = false;
  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    super();

    this.settings = {
      ...this.settings,
      columns: DOCUMENTS_COLUMNS,
      actions: { delete: true, columnTitle: 'Acciones', position: 'right' },
      edit: {
        editButtonContent: '<i class="fa fa-eye text-info mx-2"></i>',
      },

      delete: {
        deleteButtonContent: '<i class="fa fa-file text-primary mx-2"></i>',
      },
    };
  }

  form: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      text: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      typeDocument: [null],
      titleDocument: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      author: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      noDocument: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      typeTransference: [null],
      delegationRegional: [null],
      state: [null],
      transferent: [null],
      sender: [null],
      chargeSender: [null],
      responsible: [null],
      contributor: [null],
      numberOffice: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      comments: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
    });
  }

  viewDetail() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {},
    };

    const createDocument = this.modalService.show(
      DocumentShowComponent,
      config
    );
  }

  viewDocument() {
    alert('Se mostrara el documento pdf');
  }

  createDocument() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {},
    };

    const createDocument = this.modalService.show(
      DocumentFormComponent,
      config
    );
  }
}
