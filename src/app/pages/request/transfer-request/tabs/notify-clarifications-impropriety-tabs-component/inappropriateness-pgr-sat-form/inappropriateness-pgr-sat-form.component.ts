import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ClarificationGoodRejectNotification } from 'src/app/core/models/ms-clarification/clarification-good-reject-notification';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-inappropriateness-pgr-sat-form',
  templateUrl: './inappropriateness-pgr-sat-form.component.html',
  styles: [],
})
export class InappropriatenessPgrSatFormComponent
  extends BasePage
  implements OnInit
{
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
      senderName: [null, [Validators.required, Validators.maxLength(50)]],
      positionSender: [null, [Validators.required, Validators.maxLength(50)]],
      paragraphInitial: [null, [Validators.maxLength(4000)]],
      foundation: [null, [Validators.maxLength(4000)]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {}
}
