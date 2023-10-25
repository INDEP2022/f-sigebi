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
      typeSignature: [false],
    });
  }

  confirm() {
    /*this.modalRef.content.callback({
      data: this.confirmForm.value,
      sign: this.electronicSignature,
    });
    this.modalRef.hide();*/
    const progform: any = this.confirmForm.value;
    progform.typeSignature = progform.typeSignature == true ? 'Y' : 'N';

    this.programmingService
      .updateProgramming(this.idProgramming, progform)
      .subscribe({
        next: () => {
          if (this.type == 'order-service') {
            this.modalRef.content.callback({
              data: progform,
              sign: progform.typeSignature == 'Y' ? 'electronica' : 'autografa',
            });
          } else {
            this.modalRef.content.callback(progform);
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
