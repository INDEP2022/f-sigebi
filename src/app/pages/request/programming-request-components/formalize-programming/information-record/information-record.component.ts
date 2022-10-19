import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-information-record',
  templateUrl: './information-record.component.html',
  styles: [],
})
export class InformationRecordComponent extends BasePage implements OnInit {
  deliveryForm: FormGroup = new FormGroup({});
  receiveForm: FormGroup = new FormGroup({});
  witnessOneForm: FormGroup = new FormGroup({});
  witnessTwoForm: FormGroup = new FormGroup({});

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareDevileryForm();
    this.prepareReceiveForm();
    this.prepareWitnessOneForm();
    this.prepareWitnessTwoForm();
  }

  prepareDevileryForm() {
    this.deliveryForm = this.fb.group({
      name: [null],
      electronicSignature: [null],
      charge: [null],
      resistance: [null],
      identification: [null],
      noIdentification: [null],
      issuedBy: [null],
      email: [null],
    });
  }

  prepareReceiveForm() {
    this.receiveForm = this.fb.group({
      name: [null],
      electronicSignature: [null],
      charge: [null],
      resistance: [null],
      identification: [null],
      noIdentification: [null],
      issuedBy: [null],
      email: [null],
    });
  }

  prepareWitnessOneForm() {
    this.witnessOneForm = this.fb.group({
      name: [null],
      electronicSignature: [null],
      charge: [null],
      resistance: [null],
      identification: [null],
      noIdentification: [null],
      issuedBy: [null],
      email: [null],
    });
  }

  prepareWitnessTwoForm() {
    this.witnessTwoForm = this.fb.group({
      name: [null],
      electronicSignature: [null],
      charge: [null],
      resistance: [null],
      identification: [null],
      noIdentification: [null],
      issuedBy: [null],
      email: [null],
    });
  }
  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
