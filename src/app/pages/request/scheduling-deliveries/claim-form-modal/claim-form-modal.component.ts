import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-claim-form-modal',
  templateUrl: './claim-form-modal.component.html',
  styles: [],
})
export class ClaimFormModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  screenWidth: number = null;
  onClose: Subject<any>;

  private fb = inject(FormBuilder);
  private bsModelService = inject(BsModalRef);
  private modalService = inject(BsModalService);

  bsModelRef: BsModalRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      incharge: [null],
      position: [null],
      electronicSignature: [false], // Agrega este control
    });
  }

  confirm() {
    this.onClose.next(this.form.value);
    this.close();
  }

  close() {
    this.bsModelService.hide();
  }
}
