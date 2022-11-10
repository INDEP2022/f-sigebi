import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentFormComponent } from '../document-form/document-form.component';
import { DocumentShowComponent } from '../document-show/document-show.component';
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
    this.settings.columns = DOCUMENTS_LIST_COLUMNS;
    this.settings.actions.delete = true;
    this.settings = {
      ...this.settings,
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
      text: [null],
      typeDocument: [null],
      titleDocument: [null],
      noSiab: [null],
      responsible: [null],
      author: [null],
      typeTransference: [null],
      taxpayer: [null],
      noGestion: [5296016],
      senderCharge: [null],
      comments: [null],
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
