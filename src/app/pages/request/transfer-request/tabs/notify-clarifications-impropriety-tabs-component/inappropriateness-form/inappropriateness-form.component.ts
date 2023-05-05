import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ClarificationGoodRejectNotification } from 'src/app/core/models/ms-clarification/clarification-good-reject-notification';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-inappropriateness-form',
  templateUrl: './inappropriateness-form.component.html',
  styles: [],
})
export class InappropriatenessFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  notification: ClarificationGoodRejectNotification;
  request: IRequest;
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('notification', this.notification);
    console.log('request', this.request);
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      addresseeName: [null, [Validators.required, Validators.maxLength(50)]],
      positionAddressee: [
        null,
        [Validators.required, Validators.maxLength(50)],
      ],
      senderName: [null, [Validators.required, Validators.maxLength(50)]],
      senderCharge: [null, [Validators.required, Validators.maxLength(50)]],
      clarification: [null, [Validators.required, Validators.maxLength(800)]],
      paragraphInitial: [null, [Validators.maxLength(1000)]],
      paragraphFinal: [null, [Validators.maxLength(1000)]],
      observations: [null, [Validators.maxLength(1000)]],
      transmitterId: [null, [Validators.maxLength(15)]],
      foundation: [null, [Validators.maxLength(4000)]],
      invoiceLearned: [null, [Validators.maxLength(60)]],
      worthAppraisal: [null, [Validators.maxLength(60)]],
      consistentIn: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  confirm() {
    console.log('value', this.form.value);
  }

  close() {
    this.modalRef.hide();
  }
}
