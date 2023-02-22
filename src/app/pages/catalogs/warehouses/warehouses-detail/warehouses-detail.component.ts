import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { WarehouseService } from '../../../../core/services/catalogs/warehouse.service';

@Component({
  selector: 'app-warehouses-detail',
  templateUrl: './warehouses-detail.component.html',
  styles: [],
})
export class WarehousesDetailComponent implements OnInit {
  loading: boolean = false;
  status: string = 'Nueva';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  warehouse: any;

  public states = new DefaultSelect();
  public cities = new DefaultSelect();
  public municipalities = new DefaultSelect();
  public localities = new DefaultSelect();

  public get idWarehouse() {
    return this.form.get('idWarehouse');
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
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
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
      stateCode: [
        null,
        Validators.compose([Validators.pattern(''), Validators.required]),
      ],
      cityCode: [
        null,
        Validators.compose([Validators.pattern(''), Validators.required]),
      ],
      municipalityCode: [
        null,
        Validators.compose([Validators.pattern(''), Validators.required]),
      ],
      localityCode: [
        null,
        Validators.compose([Validators.pattern(''), Validators.required]),
      ],
      indActive: [
        null,
        Validators.compose([
          Validators.pattern(STRING_PATTERN),
          Validators.required,
        ]),
      ],
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
    if (this.edit) {
      this.status = 'Actualizar';
      console.log(this.warehouse);
      const { descState, nameCity, municipalityName, localityName } =
        this.warehouse;
      this.form.patchValue(this.warehouse);
      this.idWarehouse.disable();
      //TODO: Revisar con backend que regrese el objeto de bodega completo para poder pintar la informacion en los select
      // this.states = new DefaultSelect([descState], 1);
      // this.cities = new DefaultSelect([nameCity], 1);
      // this.municipalities = new DefaultSelect([municipalityName], 1);
      // this.localities = new DefaultSelect([localityName], 1);
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
    this.warehouseService.create(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    const dataToUpdate = {
      cityCode: parseInt(this.warehouse.cityCode),
      description: this.warehouse.description,
      idWarehouse: this.warehouse.idWarehouse,
      indActive: this.warehouse.indActive,
      localityCode: parseInt(this.warehouse.localityCode),
      manager: this.warehouse.manager,
      municipalityCode: parseInt(this.warehouse.municipalityCode),
      registerNumber: parseInt(this.warehouse.registerNumber),
      responsibleDelegation: parseInt(this.warehouse.responsibleDelegation),
      stateCode: parseInt(this.warehouse.stateCode),
      type: this.warehouse.type,
      ubication: this.warehouse.ubication,
    };

    this.warehouseService
      .update(dataToUpdate.idWarehouse, dataToUpdate)
      .subscribe(
        data => this.handleSuccess(),
        error => (this.loading = false)
      );
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
