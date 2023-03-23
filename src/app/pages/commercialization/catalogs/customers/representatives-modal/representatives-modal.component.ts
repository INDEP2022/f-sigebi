import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
//Models
import { IRepresentative } from 'src/app/core/models/catalogs/representative-model';
//Services
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
    private customerService: CustomerService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.representativeForm = this.fb.group({
      id: [null, []],
      reasonName: [null, []],
      paternalSurname: [null, []],
      maternalSurname: [null, []],
      dateBorn: [null, []],
      rfc: [null, []],
      curp: [null, []],
      personType: [null, []],
      identificationType: [null, []],
      autEmiIndentify: [null, []],
      identificationNumber: [null, []],
      escrowNumber: [null, []],
      nationalityKey: [null, []],
      countryOriginKey: [null, []],
      street: [null, []],
      outsideNumber: [null, []],
      insisdeNumber: [null, []],
      city: [null, []],
      suburb: [null, []],
      delegation: [null, []],
      zipCode: [null, []],
      state: [null, []],
      homeCountryKey: [null, []],
      fax: [null, []],
      countryPhoneKey: [null, []],
      phone: [null, []],
      mailWeb: [null, []],
      ecoActivityKey: [null, []],
      repAssociatedId: [null, []],
      registerNumber: [null, []],
    });
    if (this.representative != null) {
      this.edit = true;
      console.log(this.representative);
      this.representativeForm.patchValue(this.representative);
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
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
