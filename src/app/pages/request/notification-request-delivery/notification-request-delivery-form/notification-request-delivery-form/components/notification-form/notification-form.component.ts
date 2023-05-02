import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import { ConfirmProgrammingComponent } from 'src/app/pages/request/shared-request/confirm-programming/confirm-programming.component';
import { ElectronicSignatureListComponent } from 'src/app/pages/request/shared-request/electronic-signature-list/electronic-signature-list.component';
import { ShowProgrammingComponent } from 'src/app/pages/request/shared-request/show-programming/show-programming.component';
import { ShowSignatureProgrammingComponent } from 'src/app/pages/request/shared-request/show-signature-programming/show-signature-programming.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.component.html',
  styles: [],
})
export class NotificationFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  formats = new DefaultSelect();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      nameFormat: [null],
    });
  }

  viewNotification() {}

  signOffice() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          this.showProg();
        }
      },
    };

    const confirmPro = this.modalService.show(
      ConfirmProgrammingComponent,
      config
    );
  }

  showProg() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          this.electronicSign();
        }
      },
    };
    const showProg = this.modalService.show(ShowProgrammingComponent, config);
  }

  electronicSign() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          this.showSignProg();
        }
      },
    };

    const electronicSign = this.modalService.show(
      ElectronicSignatureListComponent,
      config
    );
  }

  showSignProg() {
    const showSignProg = this.modalService.show(
      ShowSignatureProgrammingComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  close() {
    this.modalRef.hide();
  }
}
