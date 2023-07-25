import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IInstitutionClassification } from 'src/app/core/models/catalogs/institution-classification.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  ICitys,
  IIssuingInstitution,
} from '../../../../core/models/catalogs/issuing-institution.model';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from '../../../../core/shared/patterns';
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
      name: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      manager: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      street: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(60),
        ],
      ],
      calle: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      numInside: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      numExterior: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      cologne: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(60),
        ],
      ],
      zipCode: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      delegMunic: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      phone: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      numClasif: [null, [Validators.required]],
      numCity: [null, [Validators.required]],
      numRegister: [null, []],
      numTransference: [null, []],
    });
    if (this.issuingInstitution != null) {
      this.edit = true;
      this.issuingInstitutionForm.patchValue(this.issuingInstitution);
      if (this.issuingInstitution.numCity) {
        let city = this.issuingInstitution.numCity as ICitys;
        console.log(city);
        this.issuingInstitution.numCity = city.numberCity;
        this.issuingInstitutionForm.controls['numCity'].setValue(
          (this.issuingInstitution.numCity = city.numberCity)
        );
      }
      console.log(this.issuingInstitutionForm.value);
      console.log(this.issuingInstitution);

      this.issuingInstitutionForm.controls['numClasif'].setValue(
        this.idInstitute.id
      );
      this.issuingInstitutionForm.controls['numClasif'].disable();
      this.issuingInstitution.numCity
        ? this.getFromSelectCity(
            new ListParams(),
            this.issuingInstitution.numCity.toString()
          )
        : this.getFromSelectCity(new ListParams());
      this.issuingInstitution.numTransference
        ? this.getFromSelectTransfer(
            new ListParams(),
            this.issuingInstitution.numTransference.toString()
          )
        : this.getFromSelectTransfer(new ListParams());
    } else {
      this.issuingInstitutionForm.controls['numClasif'].setValue(
        this.idInstitute.id
      );
      this.issuingInstitutionForm.controls['numClasif'].disable();
      console.log(this.idInstitute.id);
    }
    setTimeout(() => {
      this.getFromSelectCity(new ListParams());
      this.getFromSelectTransfer(new ListParams());
    }, 1000);

    // if (this.issuingInstitution != null) {
    //   this.edit = true;
    //   let city: ICity = this.issuingInstitution.numCity as ICity;
    //   let numTransfer: ITransferente = this.issuingInstitution
    //     .numTransference as ITransferente;
    //   this.issuingInstitutionForm.patchValue({
    //     ...this.issuingInstitution,
    //     numCity: city?.idCity,
    //     numTransference: numTransfer?.id,
    //   });
    //   this.issuingInstitution.numCity
    //     ? (this.itemsCity = new DefaultSelect([city], 1))
    //     : this.getFromSelectCity({ page: 1, text: '' });
    //   this.issuingInstitution.numTransference
    //     ? (this.itemsTransfer = new DefaultSelect([numTransfer], 1))
    //     : this.getFromSelectTransfer({ page: 1, text: '' });
    // } else {
    //   this.getFromSelectCity({ page: 1, text: '' });
    //   this.getFromSelectTransfer({ page: 1, text: '' });
    // }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.issuingInstitutionForm.controls['name'].value.trim() == '' ||
      this.issuingInstitutionForm.controls['description'].value.trim() == '' ||
      this.issuingInstitutionForm.controls['manager'].value.trim() == '' ||
      this.issuingInstitutionForm.controls['street'].value.trim() == '' ||
      this.issuingInstitutionForm.controls['cologne'].value.trim() == '' ||
      this.issuingInstitutionForm.controls['phone'].value.trim() == '' ||
      (this.issuingInstitutionForm.controls['name'].value.trim() == '' &&
        this.issuingInstitutionForm.controls['description'].value.trim() ==
          '' &&
        this.issuingInstitutionForm.controls['manager'].value.trim() == '' &&
        this.issuingInstitutionForm.controls['street'].value.trim() == '' &&
        this.issuingInstitutionForm.controls['cologne'].value.trim() == '' &&
        this.issuingInstitutionForm.controls['phone'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.issuingInstitutionService
        .create(this.issuingInstitutionForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  update() {
    if (
      this.issuingInstitutionForm.controls['name'].value.trim() == '' ||
      this.issuingInstitutionForm.controls['description'].value.trim() == '' ||
      this.issuingInstitutionForm.controls['manager'].value.trim() == '' ||
      this.issuingInstitutionForm.controls['street'].value.trim() == '' ||
      this.issuingInstitutionForm.controls['cologne'].value.trim() == '' ||
      this.issuingInstitutionForm.controls['phone'].value.trim() == '' ||
      (this.issuingInstitutionForm.controls['name'].value.trim() == '' &&
        this.issuingInstitutionForm.controls['description'].value.trim() ==
          '' &&
        this.issuingInstitutionForm.controls['manager'].value.trim() == '' &&
        this.issuingInstitutionForm.controls['street'].value.trim() == '' &&
        this.issuingInstitutionForm.controls['cologne'].value.trim() == '' &&
        this.issuingInstitutionForm.controls['phone'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.issuingInstitutionService
        .update2(
          this.issuingInstitution.id,
          this.issuingInstitutionForm.getRawValue()
        )
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  getFromSelectCity(params: ListParams, id?: string) {
    if (id) {
      params['filter.idCity'] = `$eq:${id}`;
    }
    this.issuingInstitutionService.getCities(params).subscribe((data: any) => {
      console.log(data);
      this.itemsCity = new DefaultSelect(data.data, data.count);
    });
  }

  getFromSelectTransfer(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.issuingInstitutionService
      .getTransfers(params)
      .subscribe((data: any) => {
        this.itemsTransfer = new DefaultSelect(data.data, data.count);
      });
  }
}
