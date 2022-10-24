import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';

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
      city: [null, Validators.required],
      status: [null, Validators.required],
      hour: [null, Validators.required],
      date: [null, Validators.required],
      appointedBy: [null, Validators.required],
      titleOf: [null, Validators.required],
      officeNumber: [null, Validators.required],
      dateOfOffice: [null, Validators.required],
    });
    this.antecedent = this.fb.group({
      tradeEntity: [null, Validators.required],
      officialDate: [null, Validators.required],
      signedBy: [null, Validators.required],
      position: [null, Validators.required],
      dependence: [null, Validators.required],
      customs: [null, Validators.required],
      container: [null, Validators.required],
      noContainer: [null, Validators.required],
    });
    this.antecedentTwo = this.fb.group({
      job: [null, Validators.required],
      officialDate: [null, Validators.required],
      signedBy: [null, Validators.required],
      position: [null, Validators.required],
      propertyOf: [null, Validators.required],
    });
    this.antecedentThree = this.fb.group({
      date: [null, Validators.required],
      subscribe1: [null, Validators.required],
      position1: [null, Validators.required],
      attachedA: [null, Validators.required],
      subscribe2: [null, Validators.required],
      position2: [null, Validators.required],
      attachedB: [null, Validators.required],
      wineriesSAE: [null, Validators.required],
      verificationOf: [null, Validators.required],
      consistsIn: [null, Validators.required],
      correspondentA: [null, Validators.required],
      description: [null, Validators.required],
      status: [null, Validators.required],
    });
    this.first = this.fb.group({
      authorizedBy: [null, Validators.required],
      addressee: [null, Validators.required],
    });
    this.closureOfMinutes = this.fb.group({
      date: [null, Validators.required],
      hour: [null, Validators.required],
      closePages: [null, Validators.required],
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
