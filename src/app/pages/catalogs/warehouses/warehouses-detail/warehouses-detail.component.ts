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
      localityCode: [null, Validators.compose([Validators.pattern('')])],
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
    if (this.warehouse != null) {
      this.edit = true;
      console.log(this.warehouse);
      this.warehouseForm.patchValue(this.warehouse);
      // console.log(this.warehouse);
      // const { descCondition, nameCity, description, localityName } =
      //   this.warehouse;
      // this.warehouseForm.patchValue(this.warehouse);
      // this.idWarehouse.disable();
      // //TODO: Revisar con backend que regrese el objeto de bodega completo para poder pintar la informacion en los select
      // this.states = new DefaultSelect([descCondition], 1);
      // this.cities = new DefaultSelect([nameCity], 1);
      // this.municipalities = new DefaultSelect([description], 1);
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
    this.warehouseService.create(this.warehouseForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  update() {
    this.loading = true;
    this.warehouseService
      .update(this.warehouse.idWarehouse, this.warehouseForm.value)
      .subscribe({
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
