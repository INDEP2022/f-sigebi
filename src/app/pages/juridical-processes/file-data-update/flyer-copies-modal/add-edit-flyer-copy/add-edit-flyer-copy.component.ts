import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from '../../../../../common/repository/interfaces/list-params';
import { ICopiesxFlier } from '../../../../../core/models/ms-flier/tmp-doc-reg-management.model';
import { IUserAccessAreaRelational } from '../../../../../core/models/ms-users/seg-access-area-relational.model';
import { DocReceptionRegisterService } from '../../../../../core/services/document-reception/doc-reception-register.service';
import { BasePage } from '../../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';

@Component({
  selector: 'app-add-edit-flyer-copy',
  templateUrl: './add-edit-flyer-copy.component.html',
  styles: [],
})
export class AddEditFlyerCopyComponent extends BasePage implements OnInit {
  title: string = 'Copia de Volante';
  userCopyForm: FormGroup;
  edit: boolean = false;
  copyEdit: ICopiesxFlier;
  users = new DefaultSelect<IUserAccessAreaRelational>();
  @Output() onChange = new EventEmitter<IUserAccessAreaRelational>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private docRegisterService: DocReceptionRegisterService
  ) {
    super();
  }

  get userCopy() {
    return this.userCopyForm.controls['userCopy'];
  }

  ngOnInit(): void {
    this.prepareForm();
    if (this.edit && this.copyEdit) {
      this.userCopy.setValue(this.copyEdit);
    }
  }

  private prepareForm(): void {
    this.userCopyForm = this.fb.group({
      userCopy: [null, Validators.required],
    });
  }

  editChanged(): boolean {
    if (!this.edit) return true;
    if (JSON.stringify(this.copyEdit) != this.userCopy.value) {
      return true;
    }
    return false;
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    console.log(this.userCopy.value);
    this.loading = false;
    this.onChange.emit(this.userCopy.value);
    this.modalRef.hide();
  }

  getUsersCopy(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('user', lparams.text, SearchFilter.LIKE);
    this.docRegisterService.getUsersSegAreas(params.getParams()).subscribe({
      next: data => {
        console.log(data);
        this.users = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        console.log(err);
        this.users = new DefaultSelect();
      },
    });
  }
}
