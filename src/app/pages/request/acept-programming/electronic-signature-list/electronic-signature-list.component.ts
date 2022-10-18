import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { USER_COLUMNS } from '../columns/users-columns';
import { UploadFilesFormComponent } from '../upload-files-form/upload-files-form.component';
import { ELECTRONIC_SGIGNATURE_COLUMNS } from './electronic-signature-columns';

@Component({
  selector: 'app-electronic-signature-list',
  templateUrl: './electronic-signature-list.component.html',
  styles: [],
})
export class ElectronicSignatureListComponent
  extends BasePage
  implements OnInit
{
  override settings = { ...TABLE_SETTINGS, actions: false };
  usersData: IUser[] = [];
  constructor(
    private modalService: BsModalService,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings.columns = ELECTRONIC_SGIGNATURE_COLUMNS;
  }

  uploadFiles() {
    const uploadFile = this.modalService.show(UploadFilesFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  showSignProg() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
