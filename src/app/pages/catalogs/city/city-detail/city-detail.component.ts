import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IState } from 'src/app/core/models/catalogs/state-model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { CityService } from '../../../../core/services/catalogs/city.service';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styles: [],
})
export class CityDetailComponent extends BasePage implements OnInit {
  cityForm: ModelForm<ICity>;
  city: any;
  title: string = 'Ciudad';
  edit: boolean = false;

  states = new DefaultSelect();
  delegations = new DefaultSelect();
  subDelegations = new DefaultSelect();

  selectedState: IState = null;
  selectedDelegation: IDelegation = null;

  idState: IState;

  @Output() refresh = new EventEmitter<true>();

  public get noRegister() {
    return this.cityForm.get('noRegister');
  }

  public get id() {
    return this.cityForm.get('idSafe');
  }

  public get state() {
    return this.cityForm.get('state');
  }

  public get delegation() {
    return this.cityForm.get('noDelegation');
  }

  public get subDelegation() {
    return this.cityForm.get('noSubDelegation');
  }

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private cityService: CityService,
    private stateOfRepublicService: StateOfRepublicService,
    private delegationService: DelegationService,
    private subdelegationService: SubdelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    if (this.edit) {
      this.delegation.enable();
      this.subDelegation.enable();
      console.log(this.city);
      this.selectedState = this.city.delegationDetail;
      this.selectedDelegation = this.city.SubDelegationDetail;
      this.cityForm.controls['noDelegation'].setValue(this.selectedState.id);
      this.cityForm.controls['noSubDelegation'].setValue(
        this.selectedDelegation.id
      );
      this.getDelegations(new ListParams());
      this.getSubDelegations(new ListParams());
      this.getStates(new ListParams());
    } else {
      this.getDelegations(new ListParams());
      this.getStates(new ListParams());
    }
  }

  getStates(params: ListParams) {
    this.stateOfRepublicService.getAll(params).subscribe({
      next: data => {
        this.states = new DefaultSelect(data.data, data.count);
      },
    });
  }

  getDelegations(params: ListParams) {
    if (this.selectedState.id) params['filter.id'] = this.selectedState.id;

    this.delegationService.getAll(params).subscribe({
      next: data => {
        this.delegations = new DefaultSelect(data.data, data.count);
      },
    });
  }

  getSubDelegations(params: ListParams, subdelegationID?: number) {
    if (this.selectedDelegation.id)
      params['filter.delegationNumber'] = this.selectedDelegation.id;
    if (subdelegationID) params['filter.id'] = subdelegationID;

    this.subdelegationService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.subDelegations = new DefaultSelect(data.data, data.count);
      },
    });
  }

  selectState(event: IState) {
    this.selectedState = event;
    this.getDelegations(new ListParams());

    this.cityForm.controls['noDelegation'].reset();
    this.cityForm.controls['noSubDelegation'].reset();
    this.cityForm.controls['noSubDelegation'].disable();

    this.cityForm.controls['noDelegation'].enable();
  }

  selectDelegation(event: IDelegation) {
    this.selectedDelegation = event;
    this.getSubDelegations(new ListParams());

    this.cityForm.controls['noSubDelegation'].enable();
  }

  prepareForm() {
    this.cityForm = this.fb.group({
      idCity: [null, []],
      nameCity: [
        null,
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      state: [null, [Validators.required]],
      noDelegation: [
        { value: null, disabled: true },
        [Validators.required, Validators.minLength(1)],
      ],
      noSubDelegation: [
        { value: null, disabled: true },
        [Validators.required, Validators.minLength(1)],
      ],
      legendOffice: [
        null,
        [
          Validators.required,
          Validators.maxLength(150),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
    });
    if (this.city != null) {
      let formCity = Object.assign({}, this.city);

      Object.defineProperties(formCity, {
        state: {
          value: formCity.state,
        },
        noDelegation: {
          value: formCity.delegation,
        },
        noSubDelegation: {
          value: formCity.subDelegation,
        },
      });

      this.edit = true;
      this.idState = this.city.state as IState;
      this.cityForm.patchValue(formCity);
      //this.getSubDelegations(new ListParams(), formCity.subDelegation.id);
    }
  }

  confirm() {
    const newCity = Object.assign({}, this.cityForm.value);

    Object.defineProperties(newCity, {
      state: {
        value: newCity.state.id,
      },
      noDelegation: {
        value: newCity.noDelegation.id,
      },
      noSubDelegation: {
        value: newCity.noSubDelegation.id,
      },
    });
    this.edit ? this.update(newCity) : this.create(newCity);
  }

  close() {
    this.modalRef.hide();
  }

  create(newCity: ICity) {
    this.loading = true;
    this.cityService.create2(newCity).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  update(newCity: ICity) {
    this.loading = true;
    this.cityService.update2(this.city.idCity, newCity).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
