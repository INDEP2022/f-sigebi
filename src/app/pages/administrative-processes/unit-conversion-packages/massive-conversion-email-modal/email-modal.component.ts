import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IUsersTracking } from 'src/app/core/models/ms-security/pup-user.model';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styles: ['./email-modal.component.scss'],
})
export class EmailModalComponent extends BasePage implements OnInit {
  dataUsers: IUsersTracking[] = [];
  form: FormGroup;
  constructor(
    private modalRef: BsModalRef,
    private usersService: SecurityService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    if (!this.form) {
      this.form = this.fb.group({
        para: [null, [Validators.required]],
        cc: [null],
        asunto: [
          null,
          [Validators.required, Validators.pattern(STRING_PATTERN)],
        ],
        mensaje: [
          null,
          [Validators.required, Validators.pattern(STRING_PATTERN)],
        ],
      });
    }
    const filter = new FilterParams();
    filter.addFilter('mail', 'NULL', SearchFilter.NOT);
    this.usersService.getAllUsersTracker(filter.getParams()).subscribe({
      next: response => {
        if (response && response.data) {
          this.dataUsers = response.data;
        } else {
          this.dataUsers = [];
        }
      },
      error: err => {
        this.dataUsers = [];
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
