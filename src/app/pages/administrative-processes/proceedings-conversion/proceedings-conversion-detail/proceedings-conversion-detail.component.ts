import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-proceedings-conversion-detail',
  templateUrl: './proceedings-conversion-detail.component.html',
  styles: [],
})
export class ProceedingsConversionDetailComponent implements OnInit {
  header: ModelForm<any>;
  antecedent: ModelForm<any>;
  antecedentTwo: ModelForm<any>;
  antecedentThree: ModelForm<any>;
  first: ModelForm<any>;
  closureOfMinutes: ModelForm<any>;
  antecedentThreeEnable: boolean = false;
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.header = this.fb.group({
      destiny: [null, Validators.required],
      idConversion: [null, Validators.required],
      city: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      hour: [null, Validators.required],
      date: [null, Validators.required],
      appointedBy: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      titleOf: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      officeNumber: [null, Validators.required],
      dateOfOffice: [null, Validators.required],
    });
    this.antecedent = this.fb.group({
      tradeEntity: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      officialDate: [null, Validators.required],
      signedBy: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dependence: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      customs: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      container: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      noContainer: [null, Validators.required],
    });
    this.antecedentTwo = this.fb.group({
      job: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      officialDate: [null, Validators.required],
      signedBy: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      propertyOf: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.antecedentThree = this.fb.group({
      date: [null, Validators.required],
      subscribe1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      attachedA: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subscribe2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      attachedB: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      wineriesSAE: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      verificationOf: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      consistsIn: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      correspondentA: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
    this.first = this.fb.group({
      authorizedBy: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      addressee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.closureOfMinutes = this.fb.group({
      date: [null, Validators.required],
      hour: [null, Validators.required],
      closePages: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  public next() {
    this.antecedentThreeEnable = true;
  }
  public previous() {
    this.antecedentThreeEnable = false;
  }
  close() {
    this.modalRef.hide();
  }
}
