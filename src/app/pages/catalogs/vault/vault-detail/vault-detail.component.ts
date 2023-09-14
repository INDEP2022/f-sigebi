import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { ILocality } from 'src/app/core/models/catalogs/locality.model';
import { IMunicipality } from 'src/app/core/models/catalogs/municipality.model';
import { ISafe, ISafe2 } from 'src/app/core/models/catalogs/safe.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { IUsersTracking } from 'src/app/core/models/ms-security/pup-user.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SafeService } from '../../../../core/services/catalogs/safe.service';

@Component({
  selector: 'app-vault-detail',
  templateUrl: './vault-detail.component.html',
  styles: [],
})
export class VaultDetailComponent extends BasePage implements OnInit {
  vaultForm: ModelForm<ISafe>;
  vault: ISafe2;

  valueCity: ICity;
  valueState: IStateOfRepublic;
  valueMunicipality: IMunicipality;
  valueLocality: ILocality;

  title: string = 'Bóveda';
  edit: boolean = false;
  filterCity: string = '';
  idStateFilter: string = '';
  idFilter: string = '';
  idSMinicipalityFilter: string = '';
  validationstate: boolean = false;
  validationcity: boolean = false;
  validationmunicipality: boolean = false;
  validationlocality: boolean = false;

  public states = new DefaultSelect<IStateOfRepublic>();
  public cities = new DefaultSelect<ICity>();
  public municipalities = new DefaultSelect<IMunicipality>();
  public localities = new DefaultSelect<ILocality>();
  public manger = new DefaultSelect<IUsersTracking>();

  /*states = new DefaultSelect();
  cities = new DefaultSelect();
  municipalities = new DefaultSelect();
  localities = new DefaultSelect();*/

  safes1 = new DefaultSelect();
  safes2 = new DefaultSelect();
  safes3 = new DefaultSelect();
  safes4 = new DefaultSelect();

  cityValue: ICity;
  municipalityValue: IMunicipality;
  localityValue: ILocality;
  stateValue: IStateOfRepublic;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private safeService: SafeService,
    private stateService: StateOfRepublicService,
    private cityService: CityService,
    private municipalityService: MunicipalityService,
    private localityService: LocalityService,
    private securityService: SecurityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getStates(new ListParams());
    this.getUserTracking(new ListParams());
    //this.getMunicipalities(new ListParams());
    this.prepareForm();
  }

  prepareForm() {
    this.vaultForm = this.fb.group({
      idSafe: [null, []],
      manager: [null, [Validators.required]],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(90),
        ],
      ],
      ubication: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(90),
        ],
      ],
      municipalityCode: [null, []],
      localityCode: [null, []],
      stateCode: [null, []],
      cityCodeID: [null],
      cityCode: [null, []],
      registerNumber: [null, []],
    });
    if (this.vault != null) {
      this.edit = true;
      this.valueCity = this.vault.cityDetail as ICity;
      this.valueState = this.vault.stateDetail as IStateOfRepublic;
      this.valueMunicipality = this.vault.municipalityDetail as IMunicipality;
      this.valueLocality = this.vault.localityDetail as ILocality;
      this.vaultForm.patchValue(this.vault);
      console.log(this.vault);
      let state = this.vault.stateDetail;
      let city = this.vault.cityDetail;
      let municipality = this.vault.municipalityDetail;
      let locality = this.vault.localityDetail;
      //console.log("VALOOR" + city.nameCity)

      //this.vaultForm.controls['stateCodeID'].setValue(state.id);
      const { stateDetail, cityDetail, municipalityDetail, localityDetail } =
        this.vault;

      //this.cities = new DefaultSelect([cityDetail.nameCity], 1);
      //this.municipalities = new DefaultSelect([municipalityDetail.nameMunicipality], 1);
      ///this.localities = new DefaultSelect([localityDetail.nameLocation], 1);

      //this.vaultForm.controls['municipalityCode'].setValue(municipality.idMunicipality);
      //this.vaultForm.controls['localityCode'].setValue(locality.id);

      // if (this.vaultForm.controls['municipalityDetail'].value) {
      //   this.vaultForm.controls['cityDetail'].setValue(this.valueCity.nameCity);
      //   this.vaultForm.controls['stateDetail'].setValue(
      //     this.valueState.descCondition
      //   );
      // }

      // if (this.vaultForm.controls['localityDetail'].value) {
      //   this.vaultForm.controls['localityDetail'].setValue(
      //     this.valueLocality.nameLocation
      //   );
      // }

      // if (this.vaultForm.controls['municipalityDetail'].value) {
      //   this.vaultForm.controls['municipalityDetail'].setValue(
      //     this.valueMunicipality.nameMunicipality
      //   );
      // }

      if (
        this.vaultForm.controls['stateCode'].value &&
        this.vault.stateDetail != null
      ) {
        this.states = new DefaultSelect([state.descCondition], 1);
        this.vaultForm.controls['stateCode'].setValue(state.descCondition);
        this.idStateFilter = this.valueState.id.toString();
        this.getMunicipalities(new ListParams(), this.valueState.id.toString());
        this.getCities(new ListParams(), this.valueState.id.toString());
      }
      if (
        this.vaultForm.controls['cityCode'].value &&
        this.vault.cityDetail != null
      ) {
        this.cities = new DefaultSelect([city.nameCity], 1);
        this.vaultForm.controls['cityCode'].setValue(city.nameCity);
      }
      if (this.vaultForm.controls['localityCode'].value) {
      }
      if (
        this.vaultForm.controls['municipalityCode'].value &&
        this.vault.municipalityDetail != null
      ) {
        if (this.vault.localityDetail != null) {
          this.idSMinicipalityFilter =
            this.valueMunicipality.idMunicipality.toString();

          this.getLocalities(
            new ListParams(),
            this.valueMunicipality.idMunicipality.toString(),
            this.valueState.id.toString()
          );

          this.localities = new DefaultSelect([locality.nameLocation], 1);
          this.vaultForm.controls['localityCode'].setValue(
            locality.nameLocation
          );
        } else {
          this.municipalities = new DefaultSelect(
            [municipality.description],
            1
          );
          this.vaultForm.controls['municipalityCode'].setValue(
            municipality.description
          );
        }
      } else {
        this.localities = new DefaultSelect([], 0);
      }
      if (this.vaultForm.controls['manager'].value) {
        this.getUserTracking(
          new ListParams(),
          this.vaultForm.controls['manager'].value
        );
      }
    }
    setTimeout(() => {}, 1000);
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.loading = true;
    if (!this.validationlocality && this.vault != null) {
      this.vaultForm.controls['localityCode'].setValue(
        this.valueLocality.id.toString()
      );
    }
    if (!this.validationmunicipality && this.vault != null) {
      this.vaultForm.controls['municipalityCode'].setValue(
        this.valueMunicipality.idMunicipality.toString()
      );
    }
    if (!this.validationcity && this.vault != null) {
      this.vaultForm.controls['cityCode'].setValue(
        this.valueCity.idCity.toString()
      );
    }
    if (!this.validationstate && this.vault != null) {
      this.vaultForm.controls['stateCode'].setValue(
        this.valueState.id.toString()
      );
    }
    console.log(this.vaultForm.getRawValue());
    this.safeService.update(this.vault.idSafe, this.vaultForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.onLoadToast(
          'info',
          'Opss..',
          'No se completó su solicitud, contactar al administrador'
        );
        this.loading = false;
        console.log(error);
      },
    });
  }

  create() {
    if (
      this.vaultForm.controls['ubication'].value.trim() === '' ||
      this.vaultForm.controls['description'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', '');
      return;
    }
    this.loading = true;
    this.safeService.create2(this.vaultForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
  getUserTracking(params: ListParams, id?: string) {
    if (id) {
      params['filter.user'] = `$eq:${id}`;
    }
    this.securityService.getAllUsersTracker(params).subscribe(data => {
      this.manger = new DefaultSelect(data.data, data.count);
    });
  }
  getStates(params: ListParams) {
    this.stateService.getAll(params).subscribe(
      (data: any) => {
        this.states = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  getCities(params: ListParams, id?: string) {
    this.cities = new DefaultSelect([], 0);
    if (id) {
      params['filter.state'] = `$eq:${id}`;
    } else {
      params['filter.state'] = `$eq:${this.idStateFilter}`;
    }
    this.cityService.getAll(params).subscribe(
      data => {
        console.log(data);
        this.cities = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.cities = new DefaultSelect([], 0);
        console.log('error', err);
      }
    );
  }

  getMunicipalities(params: ListParams, id?: string) {
    this.municipalities = new DefaultSelect([], 0);
    if (id) {
      params['filter.stateKey'] = `$eq:${id}`;
    } else {
      params['filter.stateKey'] = `$eq:${this.idStateFilter}`;
    }
    this.municipalityService.getAll(params).subscribe(
      data => {
        console.log(data);
        this.municipalities = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.municipalities = new DefaultSelect([], 0);
        console.log('error', err);
      }
    );
  }

  getLocalities(params: ListParams, id?: string, idstate?: string) {
    this.localities = new DefaultSelect([], 0);
    if (id && idstate) {
      params['filter.municipalityId'] = `$eq:${id}`;
      params['filter.stateKey'] = `$eq:${idstate}`;
    }
    if (id && !idstate && this.idFilter == '') {
      params['filter.municipalityId'] = `$eq:${id}`;
      params[
        'filter.stateKey'
      ] = `$eq:${this.vaultForm.controls['stateCode'].value}`;
    }
    if (id && !idstate && this.idFilter != '') {
      params['filter.municipalityId'] = `$eq:${id}`;
      params['filter.stateKey'] = `$eq:${this.idFilter}`;
    }
    if (!(id && idstate) && !(id && !idstate)) {
      params['filter.municipalityId'] = `$eq:${this.idSMinicipalityFilter}`;
      params['filter.stateKey'] = `$eq:${this.idStateFilter}`;
    }
    this.localityService.getAll(params).subscribe(
      data => {
        this.localities = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.localities = new DefaultSelect([], 0);
        console.log('error', err);
      }
    );
  }

  /*getCitiesUpdate(params: ListParams, idCity?: string | number, idState?: string | number ) {
    if (idState && idCity) {
      params['filter.idCity'] = `$eq:${idCity}`;
      params['filter.state'] = `$eq:${idState}`;
    }
    this.cityService.getAll(params).subscribe({
      next: data => {
      console.log(data);
      this.cities = new DefaultSelect(data.data, data.count);
    },
      error: err => {
        this.cities = new DefaultSelect([], 0);
        console.log('error', err);
      }
    }
      
    );
}

getStatesUpdate(params: ListParams, id ?: string | number) {
  if (id) {
    params['filter.id'] = `$eq:${id}`;
  }
  this.stateService.getAll(params).subscribe({
    next: resp => {
      console.log(resp.data);
      this.states = new DefaultSelect(resp.data, resp.count);
    },
    error: err =>{
      this.states = new DefaultSelect([], 0);
    }
  });
}

getLocalitiesUpdate(params: ListParams, id ?: string | number, idMunicipality?: string|number, idState?: string|number ) {
  if (id && idMunicipality && idState) {
    params['filter.id'] = `$eq:${id}`;
    params['filter.municipalityId'] = `$eq:${idMunicipality}`;
    params['filter.stateKey'] = `$eq:${idState}`;
  }
  this.localityService.getAll(params).subscribe({
    next: data => {
      console.log(data.data);
      this.localities = new DefaultSelect(data.data, data.count);
    },
    error: err => {
      this.localities = new DefaultSelect([], 0);
      console.log('error', err);
    }
  });
}

getUpdateMunicipalities(params: ListParams, id ?: string | number,idState?: string| number) {
  if (id && idState) {
    params['filter.idMunicipality'] = `$eq:${id}`;
    params['filter.stateKey'] = `$eq:${idState}`;
  }
  this.municipalityService.getAll(params).subscribe({
    next: data => {
    console.log(data);
    this.municipalities = new DefaultSelect(data.data, data.count);
  },
    error: err => {
      this.municipalities = new DefaultSelect([], 0);
      console.log('error', err);
    }
  });
}*/

  onValuesChange1(safeChange1: ICity) {
    this.validationcity = true;
    this.cityValue = safeChange1;
    // this.vaultForm.controls['cityDetail'].setValue(safeChange1);
    this.vaultForm.controls['municipalityCode'].setValue('');
    this.vaultForm.controls['localityCode'].setValue('');
    // this.vaultForm.controls['municipalityDetail'].setValue('');
    // this.vaultForm.controls['localityDetail'].setValue('');
    this.localities = new DefaultSelect([], 0, true);
    this.safes1 = new DefaultSelect();
  }
  onValuesChange2(safeChange2: IMunicipality) {
    if (!this.validationstate && this.vault != null) {
      this.idFilter = this.valueState.id.toString();
    }
    this.idSMinicipalityFilter = safeChange2.idMunicipality;
    this.validationmunicipality = true;
    this.valueMunicipality = safeChange2;
    // this.vaultForm.controls['municipalityDetail'].setValue(
    //   safeChange2
    // );
    this.getLocalities(new ListParams(), safeChange2.idMunicipality);
    this.vaultForm.controls['localityCode'].setValue('');
    // this.vaultForm.controls['localityDetail'].setValue('');
    this.localities = new DefaultSelect([], 0, true);
    this.safes2 = new DefaultSelect();
  }
  onValuesChange3(safeChange3: ILocality) {
    this.validationlocality = true;
    this.localityValue = safeChange3;

    // this.vaultForm.controls['localityDetail'].setValue(safeChange3);

    this.safes3 = new DefaultSelect();
  }
  onValuesChange4(safeChange4: IStateOfRepublic) {
    this.valueState = safeChange4;
    // this.vaultForm.controls['stateDetail'].setValue(safeChange4.descCondition);
    this.getCities(new ListParams(), safeChange4.id);
    this.getMunicipalities(new ListParams(), safeChange4.id);
    this.safes4 = new DefaultSelect();
    this.localities = new DefaultSelect([], 0, true);
    this.vaultForm.controls['cityCode'].setValue('');
    this.vaultForm.controls['municipalityCode'].setValue('');
    this.vaultForm.controls['localityCode'].setValue('');
    this.validationstate = true;
    this.idStateFilter = safeChange4.id;
    // this.vaultForm.controls['cityDetail'].setValue('');
    // this.vaultForm.controls['municipalityDetail'].setValue('');
    // this.vaultForm.controls['localityDetail'].setValue('');
  }
}
