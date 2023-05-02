import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-claims-follow-up-detail',
  templateUrl: './claims-follow-up-detail.component.html',
  styles: [],
})
export class ClaimsFollowUpDetailComponent implements OnInit {
  claimsFollowUpDetailForm: FormGroup;

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.claimsFollowUpDetailForm = this.fb.group({
      descriptionGood: [null, Validators.required],
      reportDateCABIF: [null, Validators.required],
      insuranceReportDate: [null, Validators.required],
      dateSiniester: [null, Validators.required],
      typeSiniester: [null, Validators.required],
      officeMail: [null, Validators.required],
      numberSiniester: [null, Validators.required],
      affectedPolicy: [null, Validators.required],
      administrativeUnitUser: [null, Validators.required],
      detailGoodAffectedParties: [null, Validators.required],
      amountClaimedAccordingClaimLetter: [null, Validators.required],
      adjustedAmount: [null, Validators.required],
      deductible: [null, Validators.required],
      coaSure: [null, Validators.required],
      indemnifiedAmount: [null, Validators.required],
      claimLetter: [null, Validators.required],
      entryOrder: [null, Validators.required],
      closingDocument: [null, Validators.required],
      status: [null, Validators.required],
      firstSecondLayer: [null, Validators.required],
      formConclusion: [null, Validators.required],
      indemnityDate: [null, Validators.required],
    });
  }
  chargeFile(event: any) {}

  close() {
    this.modalRef.hide();
  }
}
