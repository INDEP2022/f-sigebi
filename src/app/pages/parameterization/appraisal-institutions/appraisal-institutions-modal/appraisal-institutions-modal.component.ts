import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IAppraisers } from 'src/app/core/models/catalogs/appraisers.model';
import { IEntfed } from 'src/app/core/models/catalogs/entfed.model';
import { IMunicipality } from 'src/app/core/models/catalogs/municipality.model';
import { AppraisersService } from 'src/app/core/services/catalogs/appraisers.service';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  CURP_PATTERN,
  PHONE_PATTERN,
  RFC_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-appraisal-institutions-modal',
  templateUrl: './appraisal-institutions-modal.component.html',
  styles: [],
})
export class AppraisalInstitutionsModalComponent
  extends BasePage
  implements OnInit
{
  appraisers: IAppraisers;
  appraisersForm: ModelForm<IAppraisers>;
  title: string = 'Institución Valuadora';
  edit: boolean = false;
  entfedSelect = new DefaultSelect<IEntfed>();
  municipalitySelect = new DefaultSelect<IMunicipality>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private appraisersService: AppraisersService,
    private entFedService: EntFedService,
    private municipalityService: MunicipalityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.appraisersForm = this.fb.group({
      id: [null],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(60),
        ],
      ],
      street: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      noExterior: [
        null,
        [Validators.maxLength(10), Validators.pattern(STRING_PATTERN)],
      ],
      noInterior: [
        null,
        [Validators.maxLength(10), Validators.pattern(STRING_PATTERN)],
      ],
      codepostal: [null, [Validators.max(99999)]],
      colony: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      deleg: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      cveEntfed: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(10)],
      ],
      rfc: [null, [Validators.pattern(RFC_PATTERN), Validators.maxLength(20)]],
      curp: [
        null,
        [Validators.pattern(CURP_PATTERN), Validators.maxLength(20)],
      ],
      tel: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(20)],
      ],
      represent: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(60),
        ],
      ],
      observations: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      noRegistro: [null],
    });
    if (this.appraisers != null) {
      this.edit = true;
      const cvEntfed = this.appraisers.cveEntfed;
      //let entfedI: IEntfed2 = this.appraisers.cveEntfed as IEntfed2;
      //let municipalityI: IMunicipality = this.appraisers.deleg as IMunicipality;
      //this.entfedSelect = new DefaultSelect([entfedI], 1);
      //this.municipalitySelect = new DefaultSelect([municipalityI], 1);
      //console.log(this.appraisers.cveEntfed, this.appraisers.deleg);
      this.appraisersForm.patchValue(this.appraisers);
    }
    setTimeout(() => {
      this.getEntfed(new ListParams());
      this.getMunicipality(new ListParams());
    }, 1000);
  }

  getEntfed(params: ListParams) {
    this.entFedService.getAll(params).subscribe({
      next: data => {
        console.log(data.data);
        this.entfedSelect = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.entfedSelect = new DefaultSelect();
      },
    });
  }

  getMunicipality(params: ListParams) {
    this.municipalityService.getAll(params).subscribe({
      next: data => {
        this.municipalitySelect = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.municipalitySelect = new DefaultSelect();
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    if (
      this.appraisersForm.controls['description'].value.trim() == '' ||
      this.appraisersForm.controls['represent'].value.trim() == '' ||
      (this.appraisersForm.controls['description'].value.trim() == '' &&
        this.appraisersForm.controls['represent'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.appraisersService
        .create(this.appraisersForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }
  update() {
    if (
      this.appraisersForm.controls['description'].value.trim() == '' ||
      this.appraisersForm.controls['represent'].value.trim() == '' ||
      (this.appraisersForm.controls['description'].value.trim() == '' &&
        this.appraisersForm.controls['represent'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.appraisersService
        .update(
          this.appraisersForm.controls['id'].value,
          this.appraisersForm.getRawValue()
        )
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }
  /*handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title 'Se ha eliminado', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }*/
  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
