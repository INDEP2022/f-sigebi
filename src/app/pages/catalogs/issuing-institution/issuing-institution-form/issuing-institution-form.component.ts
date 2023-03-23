import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IInstitutionClassification } from 'src/app/core/models/catalogs/institution-classification.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IIssuingInstitution } from '../../../../core/models/catalogs/issuing-institution.model';
import { STRING_PATTERN } from '../../../../core/shared/patterns';
import { IssuingInstitutionService } from './../../../../core/services/catalogs/issuing-institution.service';

@Component({
  selector: 'app-issuing-institution-form',
  templateUrl: './issuing-institution-form.component.html',
  styles: [],
})
export class IssuingInstitutionFormComponent
  extends BasePage
  implements OnInit
{
  issuingInstitutionForm: ModelForm<IIssuingInstitution>;
  issuingInstitution: IIssuingInstitution;
  title: string = 'Institución Emisora';
  edit: boolean = false;

  idInstitute: IInstitutionClassification;

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
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      manager: [null, [Validators.required]],
      street: [null, [Validators.pattern(STRING_PATTERN)]],
      calle: [null, [Validators.pattern(STRING_PATTERN)]],
      numInside: [null, []],
      numExterior: [null, []],
      cologne: [null, []],
      zipCode: [null, []],
      delegMunic: [null, []],
      phone: [null, []],
      numClasif: [null, [Validators.required]],
      numCity: [null, []],
      numRegister: [null, []],
      numTransference: [null, []],
    });
    if (this.issuingInstitution != null) {
      this.edit = true;
      this.issuingInstitutionForm.patchValue(this.issuingInstitution);
      this.issuingInstitutionForm.controls['numClasif'].setValue(
        this.idInstitute.id
      );
    } else {
      this.issuingInstitutionForm.controls['numClasif'].setValue(
        this.idInstitute.id
      );
      console.log(this.idInstitute.id);
    }
    /*if (this.issuingInstitution != null) {
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
        : this.getFromSelectCity({ page: 1, text: '' });
      this.issuingInstitution.numTransference
        ? (this.itemsTransfer = new DefaultSelect([numTransfer], 1))
        : this.getFromSelectTransfer({ page: 1, text: '' });
    } else {
      this.getFromSelectCity({ page: 1, text: '' });
      this.getFromSelectTransfer({ page: 1, text: '' });
    }*/
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
      .update2(this.issuingInstitution.id, this.issuingInstitutionForm.value)
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
