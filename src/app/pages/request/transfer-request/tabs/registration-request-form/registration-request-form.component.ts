import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs/tabset.component';

@Component({
  selector: 'app-registration-request-form',
  templateUrl: './registration-request-form.component.html',
  styles: [],
})
export class RegistrationRequestFormComponent implements OnInit {
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  @Input() requestForm: any;
  docGoodRequestId: number = null;
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

  changeTab(event: any) {
    if (event.changeTab === true) {
      this.docGoodRequestId = event.requestId;
      this.staticTabs.tabs[2].active = true;

      setTimeout(() => {
        this.docGoodRequestId = null;
      }, 5000);
    }
  }
}
