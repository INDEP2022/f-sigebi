import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { WarehouseService } from '../../../../core/services/catalogs/warehouse.service';

@Component({
  selector: 'app-warehouses-detail',
  templateUrl: './warehouses-detail.component.html',
  styles: [],
})
export class WarehousesDetailComponent extends BasePage implements OnInit {
  warehouseForm: ModelForm<IWarehouse>;
  warehouse: IWarehouse;
  title: string = 'Categoria para Almacen';
  edit: boolean = false;

  public states = new DefaultSelect();
  public cities = new DefaultSelect();
  public municipalities = new DefaultSelect();
  public localities = new DefaultSelect();
  public responsibleDelegation = new DefaultSelect();
  public type = new DefaultSelect();
  public user = new DefaultSelect();
  public get idWarehouse() {
    return this.warehouseForm.get('idWarehouse');
  }

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private warehouseService: WarehouseService,
    private stateService: StateOfRepublicService,
    private cityService: CityService,
    private municipalityService: MunicipalityService,
    private localityService: LocalityService,
    private tvalTable1Service: TvalTable1Service,
    private securityService: SecurityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getStates(new ListParams());
    this.getCities(new ListParams());
    this.prepareForm();
  }

  prepareForm() {
    this.warehouseForm = this.fb.group({
      idWarehouse: [null],
      description: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      ubication: [null, [Validators.required]],
      manager: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      registerNumber: [null],
      stateCodeID: [null],
      stateCode: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cityCodeID: [null],
      cityCode: [null, [Validators.required]],
      municipalityCodeID: [null],
      municipalityCode: [null, [Validators.required]],
      localityCodeID: [null],
      localityCode: [null, [Validators.required]],
      indActive: [null],
      type: [null, [Validators.pattern(STRING_PATTERN), Validators.required]],
      responsibleDelegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.warehouse != null) {
      this.edit = true;
      console.log(this.warehouse);
      let state = this.warehouse.stateCode;
      let city = this.warehouse.cityCode;
      let municipality = this.warehouse.municipalityCode;
      let locality = this.warehouse.localityCode;
      this.warehouseForm.patchValue(this.warehouse);
      console.log('state.descCondition', state.descCondition);

      this.warehouseForm.controls['stateCode'].setValue(state.descCondition);
      this.warehouseForm.controls['stateCodeID'].setValue(state.id);
      this.warehouseForm.controls['cityCode'].setValue(city.nameCity);
      this.warehouseForm.controls['cityCodeID'].setValue(city.idCity);
      const { stateCode, cityCode, municipalityCode, localityCode } =
        this.warehouse;
      if (municipality) {
        this.warehouseForm.controls['municipalityCode'].setValue(
          municipality.nameMunicipality
        );
        this.warehouseForm.controls['municipalityCodeID'].setValue(
          municipality.idMunicipality
        );
        this.warehouseForm.controls['localityCode'].setValue(
          locality.nameLocation
        );
        this.warehouseForm.controls['localityCodeID'].setValue(locality.id);
        this.municipalities = new DefaultSelect(
          [municipalityCode.nameMunicipality],
          1
        );
        this.localities = new DefaultSelect([localityCode.nameLocation], 1);
      } else {
        this.getMunicipalitie(city);
      }
      console.log('stateCode.descCondition', stateCode.descCondition);
      this.states = new DefaultSelect([stateCode.descCondition], 1);
      this.cities = new DefaultSelect([cityCode.nameCity], 1);

      if (this.warehouseForm.controls['type'].value) {
        this.getType(
          new ListParams(),
          this.warehouseForm.controls['type'].value
        );
      }
      this.getUser(
        new ListParams(),
        this.warehouseForm.controls['manager'].value
      );
    } else {
      this.warehouseForm.controls['indActive'].setValue(1);
      this.getType(new ListParams());
    }
    this.getType(new ListParams());
    this.getUser(new ListParams());
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    if (
      this.warehouseForm.controls['ubication'].value.trim() == '' ||
      this.warehouseForm.controls['description'].value.trim() == '' ||
      (this.warehouseForm.controls['ubication'].value.trim() == '' &&
        this.warehouseForm.controls['description'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.warehouseService.create(this.warehouseForm.value).subscribe(
        data => this.handleSuccess(),
        error => (this.loading = false)
      );
    }
  }

  update() {
    if (
      this.warehouseForm.controls['ubication'].value.trim() == '' ||
      this.warehouseForm.controls['description'].value.trim() == '' ||
      (this.warehouseForm.controls['ubication'].value.trim() == '' &&
        this.warehouseForm.controls['description'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      console.log(this.warehouseForm.value);
      let data = {
        idWarehouse: this.warehouseForm.controls['idWarehouse'].value,
        description: this.warehouseForm.controls['description'].value,
        ubication: this.warehouseForm.controls['ubication'].value,
        manager: this.warehouseForm.controls['manager'].value,
        registerNumber: this.warehouseForm.controls['registerNumber'].value,
        stateCode:
          this.warehouse.stateCode.descCondition !=
          this.warehouseForm.get('stateCode').value
            ? this.warehouseForm.get('stateCode').value
            : this.warehouseForm.controls['stateCodeID'].value,
        cityCode:
          this.warehouse.cityCode.nameCity !=
          this.warehouseForm.get('cityCode').value
            ? this.warehouseForm.controls['cityCode'].value
            : this.warehouseForm.controls['cityCodeID'].value,
        municipalityCode:
          this.warehouse.municipalityCode.nameMunicipality !=
          this.warehouseForm.get('municipalityCode').value
            ? this.warehouseForm.controls['municipalityCode'].value
            : this.warehouseForm.controls['municipalityCodeID'].value,
        localityCode:
          this.warehouse.localityCode.nameLocation !=
          this.warehouseForm.get('localityCode').value
            ? this.warehouseForm.controls['localityCode'].value
            : this.warehouseForm.controls['localityCodeID'].value,
        indActive: this.warehouseForm.controls['indActive'].value,
        type: this.warehouseForm.controls['type'].value,
        responsibleDelegation:
          this.warehouseForm.controls['responsibleDelegation'].value,
      };
      this.warehouseService.update(this.warehouse.idWarehouse, data).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
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
      data => {
        this.states = new DefaultSelect(data.data, data.count);
      },
      error => (this.states = new DefaultSelect())
    );
  }
  getCitie(data: any) {
    console.log(data);
    this.localities = new DefaultSelect([], 0, true);
    this.municipalities = new DefaultSelect([], 0, true);
    this.cities = new DefaultSelect([], 0, true);
    this.warehouseForm.controls['cityCode'].setValue(null);
    this.warehouseForm.controls['municipalityCode'].setValue(null);
    this.warehouseForm.controls['localityCode'].setValue(null);
    this.getCities(new ListParams(), data.id);
  }

  getCitiesParams(params: ListParams) {
    let estadoId = this.warehouseForm.get('stateCode').value;
    if (estadoId) {
      this.getCities(params, estadoId);
    } else {
      this.getCities(params);
    }
  }

  getMunicipalitiesParams(params: ListParams, id?: string) {
    let estadoId = this.warehouseForm.get('stateCode').value;
    if (estadoId) {
      this.getMunicipalities(params, estadoId);
    } else {
      this.getMunicipalities(params);
    }
  }

  getCities(params: ListParams, id?: string) {
    if (id) {
      params['filter.state'] = `$eq:${id}`;
    }
    this.cityService.getAllCitys(params).subscribe(data => {
      this.cities = new DefaultSelect(data.data, data.count);
    });
  }
  getMunicipalitie(data: any) {
    this.localities = new DefaultSelect([], 0, true);
    // this.warehouseForm.controls['municipalityCode'].setValue(null);
    this.warehouseForm.controls['localityCode'].setValue(null);
    this.getMunicipalities(new ListParams(), data.state);
  }
  getMunicipalities(params: ListParams, id?: string) {
    if (id) {
      params['filter.stateKey'] = `$eq:${id}`;
    }
    this.municipalityService.getAll(params).subscribe(data => {
      this.municipalities = new DefaultSelect(data.data, data.count);
    });
  }
  getLocalitie(data: any) {
    console.log(data);
    this.warehouseForm.controls['localityCode'].setValue(null);
    this.getLocalities(new ListParams(), data.stateKey, data.idMunicipality);
  }
  getLocalities(params: ListParams, id?: string, idMunicipality?: string) {
    if (idMunicipality) {
      params['filter.municipalityId'] = `$eq:${idMunicipality}`;
      params['filter.stateKey'] = `$eq:${id}`;
    }
    /*
    if (id) {
      params['filter.stateKey'] = `$eq:${id}`;
    }*/
    this.localityService.getAll(params).subscribe(data => {
      this.localities = new DefaultSelect(data.data, data.count);
    });
  }
  getResponsibleDelegation(params: ListParams) {
    this.warehouseService.getAllDelegation(params).subscribe(data => {
      this.responsibleDelegation = new DefaultSelect(data.data, data.count);
    });
  }
  getType(params: ListParams, id?: string) {
    params['filter.nmtable'] = `$eq:432`;
    if (id) {
      params['filter.otkey'] = `$eq:${id}`;
    }
    this.tvalTable1Service.getAlls(params).subscribe(data => {
      this.type = new DefaultSelect(data.data, data.count);
    });
  }
  getUser(params: ListParams, user?: string) {
    if (user) {
      params['filter.user'] = `$eq:${user}`;
    }
    this.securityService.getAllUsersTracker(params).subscribe(data => {
      this.user = new DefaultSelect(data.data, data.count);
    });
  }
}
