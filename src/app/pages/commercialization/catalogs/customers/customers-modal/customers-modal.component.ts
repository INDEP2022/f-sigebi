import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  RFCCURP_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
//Models
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';

//Services
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-customers-modal',
  templateUrl: './customers-modal.component.html',
  styles: [],
})
export class CustomersModalComponent extends BasePage implements OnInit {
  customerForm: ModelForm<ICustomer>;
  customers: ICustomer;

  title: string = 'Cliente';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private customerService: CustomerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.customerForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      reasonName: [null, [Validators.pattern(STRING_PATTERN)]],
      rfc: [null, [Validators.pattern(RFCCURP_PATTERN)]],
      sellerId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      street: [null, [Validators.pattern(STRING_PATTERN)]],
      city: [null, [Validators.pattern(STRING_PATTERN)]],
      colony: [null, [Validators.pattern(STRING_PATTERN)]],
      delegation: [null, [Validators.pattern(STRING_PATTERN)]],
      zipCode: [null, [Validators.pattern(STRING_PATTERN)]],
      country: [null, [Validators.pattern(STRING_PATTERN)]],
      fax: [null, [Validators.pattern(STRING_PATTERN)]],
      phone: [null, [Validators.pattern(PHONE_PATTERN)]],
      mailWeb: [null, [Validators.pattern(EMAIL_PATTERN)]],
      state: [null, [Validators.pattern(STRING_PATTERN)]],
      curp: [null, [Validators.pattern(RFCCURP_PATTERN)]],
      blackList: [null, [Validators.pattern(STRING_PATTERN)]],
      paternalSurname: [null, [Validators.pattern(STRING_PATTERN)]],
      maternalSurname: [null, [Validators.pattern(STRING_PATTERN)]],
      municipalityId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      stateId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      blackListDate: [null, [Validators.pattern(STRING_PATTERN)]],
      releaseDate: [null, [Validators.pattern(STRING_PATTERN)]],
      penaltyId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      personType: [null, [Validators.pattern(STRING_PATTERN)]],
      approvedRfc: [null, [Validators.pattern(STRING_PATTERN)]],
      userFree: [null, [Validators.pattern(STRING_PATTERN)]],
      freeDate: [null, [Validators.pattern(STRING_PATTERN)]],
      registryNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      economicAgreementKey: [null, [Validators.pattern(STRING_PATTERN)]],
      identificationType: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      identificationNumber: [null, [Validators.pattern(STRING_PATTERN)]],
      agentId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      outsideNumber: [null, [Validators.pattern(STRING_PATTERN)]],
      insideNumber: [null, [Validators.pattern(STRING_PATTERN)]],
      password: [null, [Validators.pattern(STRING_PATTERN)]],
      user: [null, [Validators.pattern(STRING_PATTERN)]],
      interbankKey: [null, [Validators.pattern(STRING_PATTERN)]],
      bank: [null, [Validators.pattern(STRING_PATTERN)]],
      branch: [null, [Validators.pattern(STRING_PATTERN)]],
      checksAccount: [null, [Validators.pattern(STRING_PATTERN)]],
      penaltyInitDate: [null, [Validators.pattern(STRING_PATTERN)]],
      penalizeUser: [null, [Validators.pattern(STRING_PATTERN)]],
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

  confirm() {
    this.update();
  }

  update() {
    this.loading = true;
    this.customerService
      .updateCustomers(this.customers.id, this.customerForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
