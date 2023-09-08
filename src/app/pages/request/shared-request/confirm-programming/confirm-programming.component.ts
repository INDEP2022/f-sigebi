import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ElectronicSignatureListComponent } from '../electronic-signature-list/electronic-signature-list.component';

@Component({
  selector: 'app-confirm-programming',
  templateUrl: './confirm-programming.component.html',
  styles: [],
})
export class ConfirmProgrammingComponent extends BasePage implements OnInit {
  confirmForm: FormGroup = new FormGroup({});
  idProgramming: number = 0;
  type?: string = null;
  electronicSignature: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private programmingService: ProgrammingRequestService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.confirmForm = this.fb.group({
      nameSignatore: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      chargeSignatore: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  confirm() {
    /*this.modalRef.content.callback({
      data: this.confirmForm.value,
      sign: this.electronicSignature,
    });
    this.modalRef.hide(); */

    this.programmingService
      .updateProgramming(this.idProgramming, this.confirmForm.value)
      .subscribe({
        next: () => {
          if (this.type == 'order-service') {
            this.modalRef.content.callback({
              data: this.confirmForm.value,
              sign: this.electronicSignature,
            });
          } else {
            this.modalRef.content.callback(this.confirmForm.value);
          }
          this.modalRef.hide();
        },
        error: error => {},
      });
  }

  electronicSig() {
    const electronicSig = this.modalService.show(
      ElectronicSignatureListComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  close() {
    this.modalService.hide();
  }
}
