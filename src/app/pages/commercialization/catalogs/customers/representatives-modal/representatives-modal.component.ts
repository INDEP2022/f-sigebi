import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
//Models
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { IRepresentative } from 'src/app/core/models/catalogs/representative-model';
import {
  EMAIL_PATTERN,
  RFC_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
//Services
import { formatDate } from '@angular/common';
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-representatives-modal',
  templateUrl: './representatives-modal.component.html',
  styles: [],
})
export class RepresentativesModalComponent extends BasePage implements OnInit {
  representativeForm: ModelForm<IRepresentative>;
  representative: IRepresentative;
  today: Date;
  title: string = 'Representante';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private bsDatepickerConfig: BsDatepickerConfig
  ) {
    super();
    this.today = new Date();
    this.bsDatepickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit(): void {
    this.prepareForm();
    console.log(this.representativeForm);
  }

  private prepareForm() {
    this.representativeForm = this.fb.group({
      id: [null, [Validators.required]],
      reasonName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paternalSurname: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      maternalSurname: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dateBorn: [null, [Validators.pattern(STRING_PATTERN)]],
      rfc: [null, [Validators.required, Validators.pattern(RFC_PATTERN)]],
      curp: [null, []],
      personType: [null, []],
      identificationType: [null, []],
      autEmiIndentify: [null, []],
      identificationNumber: [null, []],
      escrowNumber: [null, []],
      nationalityKey: [null, [Validators.pattern(STRING_PATTERN)]],
      countryOriginKey: [null, [Validators.pattern(STRING_PATTERN)]],
      street: [null, [Validators.pattern(STRING_PATTERN)]],
      outsideNumber: [null, []],
      insisdeNumber: [null, []],
      city: [null, [Validators.pattern(STRING_PATTERN)]],
      suburb: [null, [Validators.pattern(STRING_PATTERN)]],
      delegation: [null, [Validators.pattern(STRING_PATTERN)]],
      zipCode: [null, []],
      state: [null, []],
      homeCountryKey: [null, []],
      fax: [null, []],
      countryPhoneKey: [null, []],
      phone: [null, []],
      mailWeb: [null, [Validators.pattern(EMAIL_PATTERN)]],
      ecoActivityKey: [null, []],
      repAssociatedId: [null, []],
      registerNumber: [null, []],
    });
    if (this.representative != null) {
      this.edit = true;
      this.representativeForm.patchValue(this.representative);
      const dbDateBorn = this.representativeForm.get('dateBorn').value;
      const formattedDate1 = formatDate(dbDateBorn, 'dd/MM/yyyy', 'en-US');
      this.representativeForm.get('dateBorn').setValue(formattedDate1);
      this.representativeForm
        .get('dateBorn')
        .setValue(this.addDays(new Date(dbDateBorn), 1));
    }
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  clearFreeDate(propertyName: string) {
    this.representativeForm.get(propertyName).setValue(null);
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
      .updateRepresentatives(
        this.representative.id,
        this.representativeForm.value
      )
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit
      ? 'Representante Actualizado'
      : 'Representante Guardado';
    this.alert('success', `${message} Correctamente`, '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
