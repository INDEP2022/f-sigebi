import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';
import { ITPenalty } from 'src/app/core/models/ms-parametercomer/penalty-type.model';
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { TPenaltyService } from 'src/app/core/services/ms-parametercomer/tpenalty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  CURP_PATTERN,
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  RFC_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
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
  states: any = [];
  agend: any = [];
  agentId: number;
  penaltyId: number;
  userFree: string;

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

    if (this.customers) {
      const agentId = this.customers.agentId?.id;
      const penaltyId = this.customers.penaltyId?.penaltyId;
      const userFree = this.customers.userFree?.id;

      this.customerForm.patchValue({
        agentId: agentId,
        penaltyId: penaltyId,
        userFree: userFree,
      });
    }
  }

  private prepareForm() {
    this.customerForm = this.fb.group({
      id: [null],
      reasonName: [
        null,
        [
          Validators.required,
          Validators.maxLength(70),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      paternalSurname: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      maternalSurname: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      personType: [null, [Validators.pattern(STRING_PATTERN)]],
      rfc: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(RFC_PATTERN),
        ],
      ],
      curp: [
        null,
        [Validators.maxLength(20), Validators.pattern(CURP_PATTERN)],
      ],
      country: [
        null,
        [Validators.maxLength(22), Validators.pattern(STRING_PATTERN)],
      ],
      state: [
        null,
        [Validators.maxLength(31), Validators.pattern(STRING_PATTERN)],
      ],
      stateId: [
        null,
        [Validators.maxLength(5), Validators.pattern(NUMBERS_PATTERN)],
      ],
      city: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      municipalityId: [
        null,
        [Validators.maxLength(5), Validators.pattern(NUMBERS_PATTERN)],
      ],
      zipCode: [
        null,
        [Validators.maxLength(6), Validators.pattern(STRING_PATTERN)],
      ],
      street: [
        null,
        [Validators.maxLength(80), Validators.pattern(STRING_PATTERN)],
      ],
      colony: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      delegation: [
        null,
        [Validators.maxLength(49), Validators.pattern(STRING_PATTERN)],
      ],
      fax: [
        null,
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
      phone: [
        null,
        [Validators.maxLength(10), Validators.pattern(PHONE_PATTERN)],
      ],
      mailWeb: [
        null,
        [Validators.maxLength(60), Validators.pattern(EMAIL_PATTERN)],
      ],
      user: [
        null,
        [Validators.maxLength(50), Validators.pattern(STRING_PATTERN)],
      ],
      password: [
        null,
        [Validators.maxLength(50), Validators.pattern(STRING_PATTERN)],
      ],
      blackList: [null, [Validators.pattern(STRING_PATTERN)]],
      blackListDate: [null, [Validators.pattern(STRING_PATTERN)]],
      releaseDate: [null, [Validators.pattern(STRING_PATTERN)]],
      penaltyId: [
        null,
        [Validators.maxLength(20), Validators.pattern(NUMBERS_PATTERN)],
      ],
      sellerId: [
        null,
        [Validators.maxLength(4), Validators.pattern(NUMBERS_PATTERN)],
      ],
      approvedRfc: [
        null,
        [Validators.maxLength(15), Validators.pattern(STRING_PATTERN)],
      ],
      userFree: [
        null,
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ],
      freeDate: [null, [Validators.pattern(STRING_PATTERN)]],
      economicAgreementKey: [
        null,
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
      identificationType: [
        null,
        [Validators.maxLength(2), Validators.pattern(NUMBERS_PATTERN)],
      ],
      identificationNumber: [
        null,
        [Validators.maxLength(50), Validators.pattern(STRING_PATTERN)],
      ],
      agentId: [
        null,
        [Validators.maxLength(5), Validators.pattern(NUMBERS_PATTERN)],
      ],
      outsideNumber: [
        null,
        [Validators.maxLength(40), Validators.pattern(STRING_PATTERN)],
      ],
      insideNumber: [
        null,
        [Validators.maxLength(40), Validators.pattern(STRING_PATTERN)],
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
      penaltyEndDate: [null, [Validators.pattern(STRING_PATTERN)]],
      penalizeUser: [null, [Validators.pattern(STRING_PATTERN)]],
      registryNumber: [
        null,
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.customers != null) {
      this.edit = true;
      this.customerForm.patchValue(this.customers);

      if (this.customerForm.get('blackListDate').value === null) {
        this.customerForm.get('blackListDate').setValue(null);
      } else {
        const dbBlackListDate = this.customerForm.get('blackListDate').value;
        const formattedDate2 = formatDate(
          dbBlackListDate,
          'dd/MM/yyyy',
          'en-US'
        );
        this.customerForm.get('blackListDate').setValue(formattedDate2);
        this.customerForm
          .get('blackListDate')
          .setValue(this.addDays(new Date(dbBlackListDate), 1));
      }

      if (this.customerForm.get('freeDate').value === null) {
        this.customerForm.get('freeDate').setValue(null);
      } else {
        const dbFreeDate = this.customerForm.get('freeDate').value;
        const formattedDate3 = formatDate(dbFreeDate, 'dd/MM/yyyy', 'en-US');
        this.customerForm.get('freeDate').setValue(formattedDate3);
        this.customerForm
          .get('freeDate')
          .setValue(this.addDays(new Date(dbFreeDate), 1));
      }

      if (this.customerForm.get('penaltyInitDate').value === null) {
        this.customerForm.get('penaltyInitDate').setValue(null);
      } else {
        const dbPenaltyInitDate =
          this.customerForm.get('penaltyInitDate').value;
        const formattedDate4 = formatDate(
          dbPenaltyInitDate,
          'dd/MM/yyyy',
          'en-US'
        );
        this.customerForm.get('penaltyInitDate').setValue(formattedDate4);
        this.customerForm
          .get('penaltyInitDate')
          .setValue(this.addDays(new Date(dbPenaltyInitDate), 1));
      }

      if (this.customerForm.get('penaltyEndDate').value === null) {
        this.customerForm.get('penaltyEndDate').setValue(null);
      } else {
        const dbPenaltyEndDate = this.customerForm.get('penaltyEndDate').value;
        const formattedDate5 = formatDate(
          dbPenaltyEndDate,
          'dd/MM/yyyy',
          'en-US'
        );
        this.customerForm.get('penaltyEndDate').setValue(formattedDate5);
        this.customerForm
          .get('penaltyEndDate')
          .setValue(this.addDays(new Date(dbPenaltyEndDate), 1));
      }
    }
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  clearFreeDate(propertyName: string) {
    this.customerForm.get(propertyName).setValue(null);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.loading = true;
    const model: ICustomer = {
      agentId: this.customerForm.get('agentId').value,
      approvedRfc: this.customerForm.get('approvedRfc').value,
      bank: this.customerForm.get('bank').value,
      blackList: this.customerForm.get('blackList').value,
      blackListDate:
        this.customerForm.get('blackListDate').value !== null
          ? this.convertDateFormat(this.customerForm.get('blackListDate').value)
          : null,
      branch: this.customerForm.get('branch').value,
      checksAccount: this.customerForm.get('checksAccount').value,
      city: this.customerForm.get('city').value,
      colony: this.customerForm.get('colony').value,
      country: this.customerForm.get('country').value,
      curp: this.customerForm.get('curp').value,
      delegation: this.customerForm.get('delegation').value,
      economicAgreementKey: this.customerForm.get('economicAgreementKey').value,
      fax: this.customerForm.get('fax').value,
      freeDate:
        this.customerForm.get('freeDate').value !== null
          ? this.convertDateFormat(this.customerForm.get('freeDate').value)
          : null,
      id: this.customerForm.get('id').value,
      identificationNumber: this.customerForm.get('identificationNumber').value,
      identificationType: this.customerForm.get('identificationType').value,
      insideNumber: this.customerForm.get('insideNumber').value,
      interbankKey: this.customerForm.get('interbankKey').value,
      mailWeb: this.customerForm.get('mailWeb').value,
      maternalSurname: this.customerForm.get('maternalSurname').value,
      municipalityId: this.customerForm.get('municipalityId').value,
      outsideNumber: this.customerForm.get('outsideNumber').value,
      password: this.customerForm.get('password').value,
      paternalSurname: this.customerForm.get('paternalSurname').value,
      penalizeUser: this.customerForm.get('penalizeUser').value,
      penaltyId: this.customerForm.get('penaltyId').value,
      penaltyInitDate:
        this.customerForm.get('penaltyInitDate').value !== null
          ? this.convertDateFormat(
              this.customerForm.get('penaltyInitDate').value
            )
          : null,
      penaltyEndDate:
        this.customerForm.get('penaltyEndDate').value !== null
          ? this.convertDateFormat(
              this.customerForm.get('penaltyEndDate').value
            )
          : null,
      personType: this.customerForm.get('personType').value,
      phone: this.customerForm.get('phone').value,
      reasonName: this.customerForm.get('reasonName').value,
      registryNumber: this.customerForm.get('registryNumber').value,
      releaseDate:
        this.customerForm.get('releaseDate').value !== null
          ? this.convertDateFormat(this.customerForm.get('releaseDate').value)
          : null,
      rfc: this.customerForm.get('rfc').value,
      sellerId: this.customerForm.get('sellerId').value,
      state: this.customerForm.get('state').value,
      stateId: this.customerForm.get('stateId').value,
      street: this.customerForm.get('street').value,
      user: this.customerForm.get('user').value,
      userFree: this.customerForm.get('userFree').value,
      zipCode: this.customerForm.get('zipCode').value,
    };
    this.customerService.updateCustomers(this.customers.id, model).subscribe({
      next: data => {
        this.handleSuccess(), this.modalRef.hide();
        this.loading = true;
      },
      error: (error: any) => {
        this.alert('warning', `No es Posible Actualizar el Cliente`, '');
        this.modalRef.hide();
        this.loading = false;
      },
    });
    this.modalRef.hide();
    this.loading = true;
  }

  convertDateFormat(inputDate: string | Date): string {
    if (inputDate instanceof Date) {
      return formatDate(inputDate, 'yyyy-MM-dd', 'en-US');
    } else if (typeof inputDate === 'string') {
      const parts = inputDate.split('/');
      if (parts.length !== 3) {
        throw new Error('Fecha en Formato Incorrecto: ' + inputDate);
      }
      return parts[2] + '-' + parts[1] + '-' + parts[0] + 'T00:00:00.000Z';
    } else {
      throw new Error('Formato de Fecha Inválido: ' + inputDate);
    }
  }

  create() {
    this.loading = true;
    const reasonName = this.customerForm.get('reasonName'); //^
    const paternalSurname = this.customerForm.get('paternalSurname');
    const maternalSurname = this.customerForm.get('maternalSurname');
    const personType = this.customerForm.get('personType');
    const rfc = this.customerForm.get('rfc'); //^
    const curp = this.customerForm.get('curp');
    const country = this.customerForm.get('cucountryrp');
    const state = this.customerForm.get('cucountrstateyrp');
    const stateId = this.customerForm.get('stateId');
    const city = this.customerForm.get('stateIcityd');
    const municipalityId = this.customerForm.get('statmunicipalityIdeIcityd');
    const zipCode = this.customerForm.get('zipCode');
    const street = this.customerForm.get('street');
    const colony = this.customerForm.get('colony');
    const delegation = this.customerForm.get('delegation');
    const fax = this.customerForm.get('fax');
    const phone = this.customerForm.get('phone');
    const mailWeb = this.customerForm.get('mailWeb');
    const user = this.customerForm.get('user');
    const password = this.customerForm.get('password');
    const blackList = this.customerForm.get('blackList');
    const blackListDate: string | null =
      this.customerForm.get('blackListDate').value !== null
        ? this.convertDateFormat(this.customerForm.get('blackListDate').value)
        : null;
    const releaseDate: string | null =
      this.customerForm.get('releaseDate').value !== null
        ? this.convertDateFormat(this.customerForm.get('releaseDate').value)
        : null;
    const penaltyId = this.customerForm.get('penaltyId');
    const sellerId = this.customerForm.get('sellerId');
    const approvedRfc = this.customerForm.get('approvedRfc');
    const userFree = this.customerForm.get('userFree');
    const freeDate: string | null =
      this.customerForm.get('freeDate').value !== null
        ? this.convertDateFormat(this.customerForm.get('freeDate').value)
        : null;
    const economicAgreementKey = this.customerForm.get('economicAgreementKey');
    const identificationType = this.customerForm.get('identificationType');
    const identificationNumber = this.customerForm.get('identificationNumber');
    const agentId = this.customerForm.get('agentId');
    const outsideNumber = this.customerForm.get('outsideNumber');
    const insideNumber = this.customerForm.get('insideNumber');
    const interbankKey = this.customerForm.get('interbankKey');
    const bank = this.customerForm.get('bank');
    const branch = this.customerForm.get('branch');
    const checksAccount = this.customerForm.get('checksAccount');
    const penaltyInitDate: string | null =
      this.customerForm.get('penaltyInitDate').value !== null
        ? this.convertDateFormat(this.customerForm.get('penaltyInitDate').value)
        : null;
    const penaltyEndDate: string | null =
      this.customerForm.get('penaltyEndDate').value !== null
        ? this.convertDateFormat(this.customerForm.get('penaltyEndDate').value)
        : null;
    const penalizeUser = this.customerForm.get('penalizeUser');
    const registryNumber = this.customerForm.get('registryNumber');
    const model: ICustomer = {
      reasonName: reasonName?.value,
      paternalSurname: paternalSurname?.value,
      maternalSurname: maternalSurname?.value,
      personType: personType?.value,
      rfc: rfc?.value,
      curp: curp?.value,
      country: country?.value,
      state: state?.value,
      stateId: stateId?.value,
      city: city?.value,
      municipalityId: municipalityId?.value,
      zipCode: zipCode?.value,
      street: street?.value,
      colony: colony?.value,
      delegation: delegation?.value,
      fax: fax?.value,
      phone: phone?.value,
      mailWeb: mailWeb?.value,
      user: user?.value,
      password: password?.value,
      blackList: blackList?.value,
      blackListDate: blackListDate,
      releaseDate: releaseDate,
      penaltyId: penaltyId?.value,
      sellerId: sellerId?.value,
      approvedRfc: approvedRfc?.value,
      userFree: userFree?.value,
      freeDate: freeDate,
      economicAgreementKey: economicAgreementKey?.value,
      identificationType: identificationType?.value,
      identificationNumber: identificationNumber?.value,
      agentId: agentId?.value,
      outsideNumber: outsideNumber?.value,
      insideNumber: insideNumber?.value,
      interbankKey: interbankKey?.value,
      bank: bank?.value,
      branch: branch?.value,
      checksAccount: checksAccount?.value,
      penaltyInitDate: penaltyInitDate,
      penaltyEndDate: penaltyEndDate,
      penalizeUser: penalizeUser?.value,
      registryNumber: registryNumber?.value,
    };
    console.log(model);
    if (this.customerForm.valid) {
      this.customerService.create(model).subscribe({
        next: data => {
          this.handleSuccess();
          this.modalRef.hide();
        },
        error: error => {
          this.alert('warning', `No es Posible Crear el Cliente`, '');
          this.modalRef.hide();
        },
      });
      this.modalRef.hide();
    } else {
      this.alert(
        'warning',
        'El Formulario no es Válido. Revise los Campos Requeridos',
        ''
      );
    }
  }

  handleSuccess() {
    const message: string = this.edit
      ? 'Cliente Actualizado'
      : 'Cliente Creado';
    this.alert('success', `${message} Correctamente`, '');
    this.loading = true;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  getSellers(params: ListParams) {
    this.penaltyService.getAll(params).subscribe({
      next: data => (this.sellers = new DefaultSelect(data.data, data.count)),
    });
  }
}
