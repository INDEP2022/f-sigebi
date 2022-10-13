import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IIssuingInstitution } from '../../../../core/models/catalogs/issuing-institution.model';
import { IssuingInstitutionService } from './../../../../core/services/catalogs/issuing-institution.service';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { ITransferente } from '../../../../core/models/catalogs/transferente.model';
import { TransferenteService } from '../../../../core/services/catalogs/transferente.service';

@Component({
  selector: 'app-issuing-institution-form',
  templateUrl: './issuing-institution-form.component.html',
  styles: [],
})
export class IssuingInstitutionFormComponent
  extends BasePage
  implements OnInit
{
  issuingInstitutionForm: FormGroup = new FormGroup({});
  title: string = 'Institución Emisora';
  edit: boolean = false;
  issuingInstitution: IIssuingInstitution;
  itemsCity = new DefaultSelect();
  itemsTransfer = new DefaultSelect();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private issuingInstitutionService: IssuingInstitutionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.issuingInstitutionForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      manager: [null, [Validators.required]],
      street: [null, [Validators.required]],
      calle: [null, [Validators.required]],
      numInside: [null, [Validators.required]],
      numExterior: [null, [Validators.required]],
      cologne: [null, [Validators.required]],
      zipCode: [null, [Validators.required]],
      delegMunic: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      numClasif: [null, [Validators.required]],
      numCity: [null, [Validators.required]],
      numRegister: [null, [Validators.required]],
      numTransference: [null, [Validators.required]],
    });
    if (this.issuingInstitution != null) {
      this.edit = true;
      let city: ICity = this.issuingInstitution.numCity as ICity;
      let numTransfer: ITransferente = this.issuingInstitution
        .numTransference as ITransferente;
      this.issuingInstitutionForm.patchValue({
        ...this.issuingInstitution,
        numCity: city?.idCity,
        numTransference: numTransfer?.id,
      });
      this.issuingInstitution.numCity
        ? (this.itemsCity = new DefaultSelect([city], 1))
        : this.getFromSelectCity({ inicio: 1, text: '' });
      this.issuingInstitution.numTransference
        ? (this.itemsTransfer = new DefaultSelect([numTransfer], 1))
        : this.getFromSelectTransfer({ inicio: 1, text: '' });
    } else {
      this.getFromSelectCity({ inicio: 1, text: '' });
      this.getFromSelectTransfer({ inicio: 1, text: '' });
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.issuingInstitutionService
      .create(this.issuingInstitutionForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.issuingInstitutionService
      .update(this.issuingInstitution.id, this.issuingInstitutionForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  getFromSelectCity(params: ListParams) {
    this.issuingInstitutionService.getCities(params).subscribe((data: any) => {
      console.log(data);
      this.itemsCity = new DefaultSelect(data.data, data.count);
    });
  }

  getFromSelectTransfer(params: ListParams) {
    this.issuingInstitutionService
      .getTransfers(params)
      .subscribe((data: any) => {
        this.itemsTransfer = new DefaultSelect(data.data, data.count);
      });
  }
}
