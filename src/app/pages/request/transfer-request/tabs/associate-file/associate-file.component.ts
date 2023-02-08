import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-associate-file',
  templateUrl: './associate-file.component.html',
  styles: [],
})
export class AssociateFileComponent extends BasePage implements OnInit {
  associateFileForm: FormGroup = new FormGroup({});

  users = new DefaultSelect();
  units = new DefaultSelect();
  files = new DefaultSelect();
  dispositions = new DefaultSelect();
  functionarys = new DefaultSelect();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.associateFileForm = this.fb.group({
      user: [null, [Validators.required]],
      unit: [null, [Validators.required]],
      file: [null, [Validators.required]],
      disposition: [null, [Validators.required]],
      functionary: [null, [Validators.required]],
      fileDate: [null, [Validators.required]],
      reservationDate: [null],
      fojas: [null, [Validators.required]],
      legajos: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  confirm() {}

  close() {
    this.modalRef.hide();
  }

  getUserSelect(user: ListParams) {}

  getUnitSelect(unit: ListParams) {}

  getFileSelect(file: ListParams) {}

  getDispositionSelect(disposition: ListParams) {}

  getFunctionarySelect(functionary: ListParams) {}
}
