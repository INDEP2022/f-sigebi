import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  DOCUMENTS_LIST_COLUMNS,
  DOCUMENTS_LIST_REQ_COLUMNS,
} from '../../request/programming-request-components/execute-reception/documents-list/documents-list-columns';

@Component({
  selector: 'app-expedient-list',
  templateUrl: './expedient-list.component.html',
  styles: [],
})
export class ExpedientListComponent extends BasePage implements OnInit {
  documentExpedientForm: FormGroup = new FormGroup({});
  documentationExpedientForm: FormGroup = new FormGroup({});
  expedientEstForm: FormGroup = new FormGroup({});
  photosGood: FormGroup = new FormGroup({});

  settingsDocReq = { ...TABLE_SETTINGS };

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    super();

    this.settings.columns = DOCUMENTS_LIST_COLUMNS;
    this.settingsDocReq.columns = DOCUMENTS_LIST_REQ_COLUMNS;

    this.settingsDocReq.actions.delete = true;
    this.settings.actions.delete = true;

    this.settingsDocReq.delete.deleteButtonContent =
      '<i class="fa fa-eye text-info mx-2"></i>';

    this.settingsDocReq.edit.editButtonContent =
      '<i class="fa fa fa-file"></i>';

    this.settings = {
      ...this.settings,
      edit: { editButtonContent: '<i class="fa fa fa-file"></i>' },
      delete: {
        deleteButtonContent: '<i class="fa fa-eye text-info mx-2"></i>',
        confirmDelete: false,
      },
    };
  }

  ngOnInit(): void {
    this.prepareDocForm();
    this.prepareReqForm();
    this.prepareEstForm();
    this.preparePhotoForm();
  }

  prepareDocForm() {
    this.documentExpedientForm = this.fb.group({
      text: [null],
      typeDocument: [null],
      titleDocument: [null],
      noSiab: [null],
      responsible: [null],
      author: [null],
      typeTransference: [null],
      taxpayer: [null],
      noGestion: [5645655],
      senderCharge: [null],
      comments: [null],
    });
  }

  prepareReqForm() {
    this.documentationExpedientForm = this.fb.group({
      text: [null],
      typeDocument: [null],
      titleDocument: [null],
      noSiab: [null],
      responsible: [null],
      author: [null],
      typeTransference: [null],
      taxpayer: [null],
      noGestion: [5645655],
      senderCharge: [null],
      comments: [null],
    });
  }

  prepareEstForm() {
    this.expedientEstForm = this.fb.group({
      text: [null],
      typeDocument: [null],
      titleDocument: [null],
      noSiab: [null],
      responsible: [null],
      author: [null],
      typeTransference: [null],
      taxpayer: [null],
      noGestion: [5645655],
      senderCharge: [null],
      comments: [null],
    });
  }

  preparePhotoForm() {
    this.photosGood = this.fb.group({
      photoNumber: [null],
      titleImage: [null],
      folioSchedule: [null],
      scheduleNumber: [null],
      author: [null],
      text: [null],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {}
}
