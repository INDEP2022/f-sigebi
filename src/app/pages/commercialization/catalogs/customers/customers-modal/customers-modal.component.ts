import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
//Models
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';
//Services

@Component({
  selector: 'app-customers-modal',
  templateUrl: './customers-modal.component.html',
  styles: [],
})
export class CustomersModalComponent implements OnInit {
  customerForm: ModelForm<ICustomer>;
  customers: ICustomer;

  title: string = 'Cliente';
  edit: boolean = false;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.customerForm = this.fb.group({
      id: [null, []],
      reasonName: [null, []],
      rfc: [null, []],
      sellerId: [null, []],
      street: [null, []],
      city: [null, []],
      colony: [null, []],
      delegation: [null, []],
      zipCode: [null, []],
      country: [null, []],
      fax: [null, []],
      phone: [null, []],
      mailWeb: [null, []],
      state: [null, []],
      curp: [null, []],
      blackList: [null, []],
      paternalSurname: [null, []],
      maternalSurname: [null, []],
      municipalityId: [null, []],
      stateId: [null, []],
      blackListDate: [null, []],
      releaseDate: [null, []],
      penaltyId: [null, []],
      personType: [null, []],
      approvedRfc: [null, []],
      userFree: [null, []],
      freeDate: [null, []],
      registryNumber: [null, []],
      economicAgreementKey: [null, []],
      identificationType: [null, []],
      identificationNumber: [null, []],
      agentId: [null, []],
      outsideNumber: [null, []],
      insideNumber: [null, []],
      password: [null, []],
      user: [null, []],
      interbankKey: [null, []],
      bank: [null, []],
      branch: [null, []],
      checksAccount: [null, []],
      penaltyInitDate: [null, []],
      penalizeUser: [null, []],
    });
    if (this.customers != null) {
      this.edit = true;
      console.log(this.customers);
      this.customerForm.patchValue(this.customers);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
