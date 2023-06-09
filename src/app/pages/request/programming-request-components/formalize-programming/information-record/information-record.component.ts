import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

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
  horaActual: string;
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.obtenerHoraActual();
  }

  ngOnInit(): void {
    this.prepareDevileryForm();
    this.prepareReceiveForm();
    this.prepareWitnessOneForm();
    this.prepareWitnessTwoForm();
  }
  obtenerHoraActual() {
    const fechaActual = new Date();
    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
    };
    this.horaActual = fechaActual.toLocaleTimeString([], opcionesHora);
  }
  prepareDevileryForm() {
    this.deliveryForm = this.fb.group({
      name: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignature: [null],
      charge: [null, [Validators.pattern(STRING_PATTERN)]],
      resistance: [null, [Validators.pattern(STRING_PATTERN)]],
      identification: [null],
      noIdentification: [null],
      issuedBy: [null, [Validators.pattern(STRING_PATTERN)]],
      email: [null, [Validators.pattern(EMAIL_PATTERN)]],
    });
  }

  prepareReceiveForm() {
    this.receiveForm = this.fb.group({
      name: [null, [Validators.pattern(STRING_PATTERN)]],
      ng: [null],
      charge: [null, [Validators.pattern(STRING_PATTERN)]],
      resistance: [null, [Validators.pattern(STRING_PATTERN)]],
      identification: [null],
      noIdentification: [null],
      issuedBy: [null, [Validators.pattern(STRING_PATTERN)]],
      email: [null, [Validators.pattern(EMAIL_PATTERN)]],
    });
  }

  prepareWitnessOneForm() {
    this.witnessOneForm = this.fb.group({
      name: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignature: [null],
      charge: [null, [Validators.pattern(STRING_PATTERN)]],
      resistance: [null, [Validators.pattern(STRING_PATTERN)]],
      identification: [null],
      noIdentification: [null],
      issuedBy: [null, [Validators.pattern(STRING_PATTERN)]],
      email: [null, [Validators.pattern(EMAIL_PATTERN)]],
    });
  }

  prepareWitnessTwoForm() {
    this.witnessTwoForm = this.fb.group({
      name: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignature: [null],
      charge: [null, [Validators.pattern(STRING_PATTERN)]],
      resistance: [null, [Validators.pattern(STRING_PATTERN)]],
      identification: [null],
      noIdentification: [null],
      issuedBy: [null, [Validators.pattern(STRING_PATTERN)]],
      email: [null, [Validators.pattern(EMAIL_PATTERN)]],
    });
  }
  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
