import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IUsersTracking } from 'src/app/core/models/ms-security/pup-user.model';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.scss'],
})
export class EmailModalComponent extends BasePage implements OnInit {
  selectedParaUsers: IUsersTracking[] = [];
  selectedCCUsers: IUsersTracking[] = [];
  paraSelect: DefaultSelect = new DefaultSelect();
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
    this.searchUsersPara(new ListParams());
  }

  searchUsersPara(params: ListParams) {
    console.log(params);
    const filter = new FilterParams();
    filter.page = params.page;
    filter.limit = params.limit;

    filter.addFilter('mail', 'NULL', SearchFilter.NOT);
    this.usersService.getAllUsersTracker(filter.getParams()).subscribe({
      next: response => {
        if (response && response.data) {
          // this.dataUsers = response.data;
          this.paraSelect = new DefaultSelect(response.data);
        } else {
          // this.dataUsers = [];
          this.paraSelect = new DefaultSelect(response.data);
        }
      },
      error: err => {
        // this.dataUsers = [];
        this.paraSelect = new DefaultSelect([]);
      },
    });
  }

  onParaChange(item: IUsersTracking) {
    console.log(item);
    this.selectedParaUsers.push(item);
  }

  close() {
    this.modalRef.hide();
  }
}
