import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { IState } from 'src/app/core/models/catalogs/state-model';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { CityService } from '../../../../core/services/catalogs/city.service';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styles: [],
})
export class CityDetailComponent extends BasePage implements OnInit {
  cityForm: ModelForm<ICity>;
  city: ICity;
  title: string = 'Catálogos de Ciudades';
  edit: boolean = false;

  states = new DefaultSelect();

  idState: IState;

  @Output() refresh = new EventEmitter<true>();

  public get state() {
    return this.cityForm.get('state');
  }

  public get noRegister() {
    return this.cityForm.get('noRegister');
  }

  public get id() {
    return this.cityForm.get('idSafe');
  }
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private cityService: CityService,
    private stateOfRepublicService: StateOfRepublicService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  getStates(params: ListParams) {
    this.stateOfRepublicService.getAll(params).subscribe({
      next: data => (this.states = new DefaultSelect(data.data, data.count)),
    });
  }

  prepareForm() {
    this.cityForm = this.fb.group({
      idCity: [null, []],
      nameCity: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      state: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      noDelegation: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.minLength(1),
        ],
      ],
      noSubDelegation: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.minLength(1),
        ],
      ],
      legendOffice: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.city != null) {
      this.edit = true;
      this.idState = this.city.state as IState;
      this.cityForm.patchValue(this.city);
      this.cityForm.controls['state'].setValue(this.idState.descCondition);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.cityService.create2(this.cityForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  update() {
    this.loading = true;
    this.cityService.update2(this.city.idCity, this.cityForm.value).subscribe({
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
