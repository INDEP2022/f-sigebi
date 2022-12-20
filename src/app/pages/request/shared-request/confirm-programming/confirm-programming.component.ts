import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.confirmForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      charge: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  confirm() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
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
