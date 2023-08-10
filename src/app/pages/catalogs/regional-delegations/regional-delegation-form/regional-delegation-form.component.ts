import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { ZoneGeographicService } from 'src/app/core/services/catalogs/zone-geographic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  DOUBLE_POSITIVE_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-regional-delegation-form',
  templateUrl: './regional-delegation-form.component.html',
  styles: [],
})
export class RegionalDelegationFormComponent
  extends BasePage
  implements OnInit
{
  regionalDelegationForm: ModelForm<IRegionalDelegation>;
  regionalDelegation: IRegionalDelegation;
  title: string = 'Delegación Regional';
  edit: boolean = false;
  selectGeoZone = new DefaultSelect();
  selectCity = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private regionalDelegationService: RegionalDelegationService,
    private serviceCity: CityService,
    private serviceGeoZone: ZoneGeographicService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getCity(new ListParams());
    this.getGeoZone(new ListParams());
  }

  private prepareForm() {
    this.regionalDelegationForm = this.fb.group({
      id: [null],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      registerNumber: [null],
      idGeographicZona: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      version: [1],
      regionalDelegate: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      officeAddress: [
        null,
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      status: [1],
      keyZone: [null, [Validators.required]],
      iva: [
        0.16,
        [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)],
      ],
      city: [null, [Validators.required]],
      keyState: [null, [Validators.required]],
    });
    if (this.regionalDelegation != null) {
      this.edit = true;
      this.regionalDelegationForm.patchValue(this.regionalDelegation);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.regionalDelegationForm.controls['description'].value.trim() == '' ||
      this.regionalDelegationForm.controls['regionalDelegate'].value.trim() ==
        '' ||
      this.regionalDelegationForm.controls['officeAddress'].value.trim() ==
        '' ||
      (this.regionalDelegationForm.controls['description'].value.trim() == '' &&
        this.regionalDelegationForm.controls['regionalDelegate'].value.trim() ==
          '' &&
        this.regionalDelegationForm.controls['officeAddress'].value.trim() ==
          '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      /*this.regionalDelegationForm
        .get('idGeographicZona')
        .setValue(this.regionalDelegationForm.get('idGeographicZona').value.id);*/
      //console.log(this.regionalDelegationForm.getRawValue());
      this.regionalDelegationService
        .create(this.regionalDelegationForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  update() {
    if (
      this.regionalDelegationForm.controls['description'].value.trim() == '' ||
      this.regionalDelegationForm.controls['regionalDelegate'].value.trim() ==
        '' ||
      this.regionalDelegationForm.controls['officeAddress'].value.trim() ==
        '' ||
      (this.regionalDelegationForm.controls['description'].value.trim() == '' &&
        this.regionalDelegationForm.controls['regionalDelegate'].value.trim() ==
          '' &&
        this.regionalDelegationForm.controls['officeAddress'].value.trim() ==
          '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.regionalDelegationService
        .update(this.regionalDelegation.id, this.regionalDelegationForm.value)
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  //Data

  getGeoZone(param: ListParams) {
    this.serviceGeoZone.getAll(param).subscribe({
      next: res => {
        this.selectGeoZone = new DefaultSelect(res.data, res.count);
      },
      error: err => {
        this.selectGeoZone = new DefaultSelect();
      },
    });
  }

  fillSelectZone(event: any) {
    console.log(event);
    /*const zone = this.regionalDelegationForm.get('zone').value;
    if (zone != null) {
      this.regionalDelegationForm.controls['idGeographicZona'].setValue(
        this.regionalDelegation.id
      );
    }*/
  }

  getCity(param: ListParams) {
    this.serviceCity.getAll(param).subscribe({
      next: res => {
        this.selectCity = new DefaultSelect(res.data, res.count);
      },
      error: err => {
        this.selectCity = new DefaultSelect();
      },
    });
  }

  //Action

  fillSelectCity(event: any) {
    if (event != null) {
      let state: any = event.stateDetail;
      console.log(state.descCondition);
      this.regionalDelegationForm.get('city').setValue(event.nameCity);
      this.regionalDelegationForm.get('keyState').setValue(state.descCondition);
    } else {
      this.regionalDelegationForm.get('city').setValue(null);
      this.regionalDelegationForm.get('keyState').setValue(null);
    }
  }
}
