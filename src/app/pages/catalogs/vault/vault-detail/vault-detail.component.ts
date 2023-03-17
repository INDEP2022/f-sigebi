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
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { BasePage } from 'src/app/core/shared/base-page';
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

  title: string = 'Catálogo de Bóvedas';
  edit: boolean = false;

  public states = new DefaultSelect<IStateOfRepublic>();
  public cities = new DefaultSelect<ICity>();
  public municipalities = new DefaultSelect<IMunicipality>();
  public localities = new DefaultSelect<ILocality>();

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
    private localityService: LocalityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.vaultForm = this.fb.group({
      idSafe: [null, []],
      manager: [null, [Validators.required]],
      description: [null, [Validators.required]],
      ubication: [null, [Validators.required]],
      municipalityCode: [null, []],
      localityCode: [null, []],
      stateCode: [null, []],
      cityCode: [null, []],
      cityDetail: [null, []],
      localityDetail: [null, []],
      stateDetail: [null, []],
      municipalityDetail: [null, []],
      registerNumber: [null, []],
    });
    if (this.vault != null) {
      this.edit = true;
      this.valueCity = this.vault.cityDetail as ICity;
      this.valueState = this.vault.stateDetail as IStateOfRepublic;
      this.valueMunicipality = this.vault.municipalityDetail as IMunicipality;
      this.valueLocality = this.vault.localityDetail as ILocality;
      this.vaultForm.patchValue(this.vault);

      this.vaultForm.controls['cityDetail'].setValue(this.valueCity.nameCity);
      this.vaultForm.controls['stateDetail'].setValue(
        this.valueState.descCondition
      );
      this.vaultForm.controls['localityDetail'].setValue(this.valueLocality.id);
      this.vaultForm.controls['municipalityDetail'].setValue(
        this.valueMunicipality.nameMunicipality
      );
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.loading = true;
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

  getCities(params: ListParams) {
    this.cityService.getAll(params).subscribe(data => {
      this.cities = new DefaultSelect(data.data, data.count);
    });
  }

  getMunicipalities(params: ListParams) {
    this.municipalityService.getAll(params).subscribe(data => {
      this.municipalities = new DefaultSelect(data.data, data.count);
    });
  }

  getLocalities(params: ListParams) {
    this.localityService.getAll(params).subscribe(data => {
      this.localities = new DefaultSelect(data.data, data.count);
    });
  }

  onValuesChange1(safeChange1: ICity) {
    this.cityValue = safeChange1;
    this.vaultForm.controls['cityCode'].setValue(safeChange1.idCity);
    this.safes1 = new DefaultSelect();
  }
  onValuesChange2(safeChange2: IMunicipality) {
    this.valueMunicipality = safeChange2;
    this.vaultForm.controls['municipalityCode'].setValue(
      safeChange2.idMunicipality
    );
    this.safes2 = new DefaultSelect();
  }
  onValuesChange3(safeChange3: ILocality) {
    this.localityValue = safeChange3;
    this.vaultForm.controls['localityCode'].setValue(safeChange3.id);
    this.safes3 = new DefaultSelect();
  }
  onValuesChange4(safeChange4: IStateOfRepublic) {
    this.valueState = safeChange4;
    this.vaultForm.controls['stateCode'].setValue(safeChange4.id);
    this.safes4 = new DefaultSelect();
  }
}
