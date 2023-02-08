import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentFormComponent } from '../../../shared-request/document-form/document-form.component';
import { DocumentShowComponent } from '../../../shared-request/document-show/document-show.component';
import { DOCUMENTS_LIST_COLUMNS } from './documents-list-columns';

@Component({
  selector: 'documents-list',
  templateUrl: './documents-list.component.html',
  styles: [],
})
export class DocumentsListComponent extends BasePage implements OnInit {
  documentsData: any[] = [];
  showForm: boolean = false;
  documentForm: FormGroup = new FormGroup({});
  typeDocuments = new DefaultSelect();
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings.actions.delete = true;

    this.settings = {
      ...this.settings,
      columns: DOCUMENTS_LIST_COLUMNS,
      edit: { editButtonContent: '<i class="fa fa fa-file"></i>' },
      delete: {
        deleteButtonContent: '<i class="fa fa-eye text-info mx-2"></i>',
        confirmDelete: false,
      },
    };
    this.documentsData = [
      {
        numberDocument: 435345345,
        numberGestion: 564564566,
        titleDocument: 'Documeto prueba',
        typeDocument: 'Prueba',
        author: 'Gustavo',
        creationDate: '12-11-1999',
      },
    ];
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.documentForm = this.fb.group({
      text: [null, [Validators.pattern(STRING_PATTERN)]],
      typeDocument: [null],
      titleDocument: [null, [Validators.pattern(STRING_PATTERN)]],
      noSiab: [null],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],
      author: [null, [Validators.pattern(STRING_PATTERN)]],
      typeTransference: [null, [Validators.pattern(STRING_PATTERN)]],
      taxpayer: [null, [Validators.pattern(STRING_PATTERN)]],
      noGestion: [5296016],
      senderCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      comments: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  uploadFiles() {
    const uploadFiles = this.modalService.show(DocumentFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  getTypeDocumentSelect(typeDocument: ListParams) {}

  close() {
    this.modalRef.hide();
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

  confirm() {}
}
