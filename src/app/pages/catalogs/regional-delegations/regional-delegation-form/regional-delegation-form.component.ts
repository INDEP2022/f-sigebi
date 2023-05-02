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
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  }

  private prepareForm() {
    this.regionalDelegationForm = this.fb.group({
      id: [null],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      registerNumber: [null],
      idGeographicZona: [null, [Validators.required]],
      version: [1],
      regionalDelegate: [null, [Validators.required]],
      officeAddress: [null, [Validators.required]],
      status: [1],
      keyZone: [null, [Validators.required]],
      iva: [0.16, [Validators.required]],
      city: [null, [Validators.required]],
      keyState: [null, [Validators.required]],
    });
    if (this.regionalDelegation != null) {
      this.edit = true;
      console.log(this.regionalDelegation);
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
    this.loading = true;
    this.regionalDelegationForm
      .get('idGeographicZona')
      .setValue(this.regionalDelegationForm.get('idGeographicZona').value.id);
    this.regionalDelegationService
      .create(this.regionalDelegationForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;

    this.regionalDelegationService
      .update(this.regionalDelegation.id, this.regionalDelegationForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  //Data

  getGeoZone(param: ListParams) {
    this.serviceGeoZone.getAll(param).subscribe(res => {
      this.selectGeoZone = new DefaultSelect(res.data, res.count);
    });
  }

  getCity(param: ListParams) {
    this.serviceCity.getAll(param).subscribe(res => {
      console.log(res);
      this.selectCity = new DefaultSelect(res.data, res.count);
    });
  }

  //Action

  fillSelectCity() {
    const city = this.regionalDelegationForm.get('city').value;
    if (city != null) {
      this.regionalDelegationForm.get('city').setValue(city.nameCity);
      this.regionalDelegationForm
        .get('keyState')
        .setValue(city.state.descCondition);
    } else {
      this.regionalDelegationForm.get('city').setValue(null);
      this.regionalDelegationForm.get('keyState').setValue(null);
    }
  }
}
