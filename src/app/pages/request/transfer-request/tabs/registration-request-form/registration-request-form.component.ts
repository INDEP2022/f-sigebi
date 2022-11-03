import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registration-request-form',
  templateUrl: './registration-request-form.component.html',
  styles: [],
})
export class RegistrationRequestFormComponent implements OnInit {
  searchFileForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.searchFileForm = this.fb.group({
      requestNumber: [null],
      expedientNumber: [null],
      regionalDelegation: [null],
      goodType: [null],
      gestionNumber: [null],
      descriptionGoodTransferent: [null],
      state: [null],
      transferent: [null],
      station: [null],
      authority: [null],
      indicated: [null],
      transferFile: [null],
      inquiryPreliminary: [null],
      casePenal: [null],
      protectionNumber: [null],
      typeTransference: [null],
      domainExtinction: [null],
      judgmentType: [null],
      judment: [null],
      text: [null],
      typeDocument: [null],
      titleDocument: [null],
      siabNumber: [null],
      senderCharge: [null],
      author: [null],
      responsible: [null],
      documentNumber: [null],
      contributor: [null],
      officeNumber: [null],
      comments: [null],
      goodNumber: [null],
      sender: [null],
    });
  }
}
