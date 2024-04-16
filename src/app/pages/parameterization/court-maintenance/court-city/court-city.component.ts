import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { CourtByCityService } from 'src/app/core/services/catalogs/court-by-city.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-court-city',
  templateUrl: './court-city.component.html',
  styles: [],
})
export class CourtCityComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  id: string | number = null;

  cities = new DefaultSelect();
  cityValue: ICity;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private courtCityServ: CourtByCityService,
    private readonly serviceSubDeleg: SubdelegationService,
    private readonly serviceFederation: EntFedService,
    private readonly serviceDeleg: DelegationService,
    private cityService: CityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      city: [null, Validators.required],
      court: [this.id, Validators.required],
      //entity: [{ value: null, disabled: true }],
      //delegation: [{ value: null, disabled: true }],
      //subDelegation: [{ value: null, disabled: true }],
    });

    setTimeout(() => {
      this.getCiities(new ListParams());
    }, 1000);
  }

  onValuesChange(cityChange: ICity) {
    console.log(cityChange);
    this.cityValue = cityChange;
    this.form.controls['city'].setValue(cityChange.idCity);
    this.cities = new DefaultSelect();
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.alert('success', 'Ciudad guardado correctamente', '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  confirm() {
    this.courtCityServ.create(this.form.value).subscribe({
      next: () => this.handleSuccess(),
      error: err =>
        this.onLoadToast(
          'warning',
          'La ciudad ya fue registrada para este juzgado',
          ''
        ),
    });
  }

  getCiities(params: ListParams) {
    this.cityService.getAll(params).subscribe({
      next: data => {
        this.cities = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.cities = new DefaultSelect();
      },
    });
  }
}
