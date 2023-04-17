import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  CURP_PATTERN,
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  RFC_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
//Models
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';

//Services
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITPenalty } from 'src/app/core/models/ms-parametercomer/penalty-type.model';
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { TPenaltyService } from 'src/app/core/services/ms-parametercomer/tpenalty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

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

  today: Date;

  idPenality: ITPenalty;
  sellers = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private penaltyService: TPenaltyService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.customerForm = this.fb.group({
      id: [null, []],
      reasonName: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      rfc: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(RFC_PATTERN),
        ],
      ],
      sellerId: [null, [Validators.pattern(NUMBERS_PATTERN)]], //LLave
      street: [
        null,
        [
          Validators.required,
          Validators.maxLength(80),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      city: [
        null,
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      colony: [
        null,
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      delegation: [
        null,
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern(STRING_PATTERN),
        ],
      ], //Agregar Select?
      zipCode: [
        null,
        [Validators.maxLength(6), Validators.pattern(STRING_PATTERN)],
      ],
      country: [
        null,
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
      fax: [
        null,
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
      phone: [
        null,
        [Validators.maxLength(60), Validators.pattern(PHONE_PATTERN)],
      ],
      mailWeb: [
        null,
        [Validators.maxLength(60), Validators.pattern(EMAIL_PATTERN)],
      ],
      state: [
        null,
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      curp: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(CURP_PATTERN),
        ],
      ],
      blackList: [null, [Validators.pattern(STRING_PATTERN)]],
      paternalSurname: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      maternalSurname: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      municipalityId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      stateId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      blackListDate: [null, [Validators.pattern(STRING_PATTERN)]],
      releaseDate: [null, [Validators.pattern(STRING_PATTERN)]],
      penaltyId: [null, [Validators.pattern(NUMBERS_PATTERN)]], //Llave
      personType: [null, [Validators.pattern(STRING_PATTERN)]],
      approvedRfc: [null, [Validators.pattern(STRING_PATTERN)]],
      userFree: [null, [Validators.pattern(STRING_PATTERN)]], //Lave
      freeDate: [null, [Validators.pattern(STRING_PATTERN)]],
      registryNumber: [null, [Validators.pattern(STRING_PATTERN)]],
      economicAgreementKey: [null, [Validators.pattern(STRING_PATTERN)]],
      identificationType: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      identificationNumber: [null, [Validators.pattern(STRING_PATTERN)]],
      agentId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      outsideNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      insideNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      password: [null, [Validators.pattern(STRING_PATTERN)]],
      user: [
        null,
        [Validators.maxLength(50), Validators.pattern(STRING_PATTERN)],
      ],
      interbankKey: [
        null,
        [Validators.maxLength(18), Validators.pattern(STRING_PATTERN)],
      ],
      bank: [
        null,
        [Validators.maxLength(3), Validators.pattern(STRING_PATTERN)],
      ],
      branch: [
        null,
        [Validators.maxLength(10), Validators.pattern(STRING_PATTERN)],
      ],
      checksAccount: [
        null,
        [Validators.maxLength(11), Validators.pattern(STRING_PATTERN)],
      ],
      penaltyInitDate: [null, [Validators.pattern(STRING_PATTERN)]],
      penalizeUser: [null, [Validators.pattern(STRING_PATTERN)]], //Llave
    });
    if (this.customers != null) {
      this.edit = true;
      this.customerForm.patchValue(this.customers);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
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

  create() {
    this.loading = true;
    this.customerService.create(this.customerForm.value).subscribe({
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

  getSellers(params: ListParams) {
    this.penaltyService.getAll(params).subscribe({
      next: data => (this.sellers = new DefaultSelect(data.data, data.count)),
    });
  }
}
