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
  title: string = 'Categoria para almacenes';
  edit: boolean = false;

  public states = new DefaultSelect();
  public cities = new DefaultSelect();
  public municipalities = new DefaultSelect();
  public localities = new DefaultSelect();

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
    private localityService: LocalityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.warehouseForm = this.fb.group({
      idWarehouse: [null],
      description: [
        '',
        Validators.compose([
          Validators.pattern(STRING_PATTERN),
          Validators.required,
        ]),
      ],
      ubication: [
        null,
        Validators.compose([
          Validators.pattern(STRING_PATTERN),
          Validators.required,
        ]),
      ],
      manager: [
        null,
        Validators.compose([
          Validators.pattern(STRING_PATTERN),
          Validators.required,
        ]),
      ],
      registerNumber: [
        null,
        Validators.compose([Validators.pattern(''), Validators.required]),
      ],
      stateCodeID: [
        null,
        Validators.compose([Validators.pattern(''), Validators.required]),
      ],
      stateCode: [null],
      cityCodeID: [
        null,
        Validators.compose([Validators.pattern(''), Validators.required]),
      ],
      cityCode: [null],
      municipalityCodeID: [
        null,
        Validators.compose([Validators.pattern(''), Validators.required]),
      ],
      municipalityCode: [null],
      localityCodeID: [null, Validators.compose([Validators.pattern('')])],
      localityCode: [null],
      indActive: [null],
      type: [
        null,
        Validators.compose([
          Validators.pattern(STRING_PATTERN),
          Validators.required,
        ]),
      ],
      responsibleDelegation: [
        null,
        Validators.compose([
          Validators.pattern(STRING_PATTERN),
          Validators.required,
        ]),
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
      this.warehouseForm.controls['stateCode'].setValue(state.descCondition);
      this.warehouseForm.controls['stateCodeID'].setValue(state.id);
      this.warehouseForm.controls['cityCode'].setValue(city.nameCity);
      this.warehouseForm.controls['cityCodeID'].setValue(city.idCity);
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
      const { stateCode, cityCode, municipalityCode, localityCode } =
        this.warehouse;
      console.log([stateCode.descCondition]);
      this.states = new DefaultSelect([stateCode.descCondition], 1);
      this.cities = new DefaultSelect([cityCode.nameCity], 1);
      this.municipalities = new DefaultSelect(
        [municipalityCode.nameMunicipality],
        1
      );
      this.localities = new DefaultSelect([localityCode.nameLocation], 1);
    } else {
      this.warehouseForm.controls['indActive'].setValue(1);
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
    this.warehouseService.create(this.warehouseForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  update() {
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

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  getStates(params: ListParams) {
    this.stateService.getAll(params).subscribe(data => {
      this.states = new DefaultSelect(data.data, data.count);
    });
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
}
