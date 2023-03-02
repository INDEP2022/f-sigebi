import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModalSelectsGoodsComponent } from '../modal-selects-goods/modal-selects-goods.component';

@Component({
  selector: 'app-location-goods-warehouses-storage',
  templateUrl: './location-goods-warehouses-storage.component.html',
  styles: [],
})
export class LocationGoodsWarehousesStorageComponent
  extends BasePage
  implements OnInit
{
  //Reactive Forms
  form: FormGroup;
  formWarehouse: FormGroup;
  formVault: FormGroup;
  typeLocation: string = '';
  good: IGood;
  disableConsultLocation: boolean = false;
  warehouseDisable: boolean = true;
  vaultDisable: boolean = true;
  nullDisable: boolean = true;
  get numberGood() {
    return this.form.get('good');
  }
  get description() {
    return this.form.get('description');
  }
  get statusGoods() {
    return this.form.get('statusGoods');
  }
  get radio() {
    return this.form.get('radio');
  }
  get currentLocationWare() {
    return this.formWarehouse.get('currentLocationWare');
  }
  get currentDescriptionWare() {
    return this.formWarehouse.get('currentDescriptionWare');
  }
  get warehouse() {
    return this.formWarehouse.get('warehouse');
  }

  get currentLocationVault() {
    return this.formVault.get('currentLocationVault');
  }
  get currentDescriptionVault() {
    return this.formVault.get('currentDescriptionVault');
  }
  get safe() {
    return this.formVault.get('safe');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private readonly goodServices: GoodService,
    private token: AuthService,
    private warehouseService: WarehouseService,
    private safeService: SafeService
  ) {
    super();
  }

  ngOnInit(): void {
    /////////// validar los persmisos del usuario
    console.log(this.token.decodeToken());
    this.buildForm();
    this.buildFormWare();
    this.buildFormVault();
    this.form.disable();
    this.numberGood.enable();
  }

  private buildForm() {
    this.form = this.fb.group({
      good: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      statusGoods: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      radio: [null, [Validators.required]],
    });
  }
  private buildFormWare() {
    this.formWarehouse = this.fb.group({
      currentLocationWare: [null, [Validators.required]],
      currentDescriptionWare: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      warehouse: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  private buildFormVault() {
    this.formVault = this.fb.group({
      currentLocationVault: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      currentDescriptionVault: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      safe: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  checkLocations() {
    if (this.radio.value === null) return;
    this.radio.value === 'A'
      ? this.router.navigate([
          '/pages/administrative-processes/warehouse-inquiries',
        ])
      : this.router.navigate([
          '/pages/administrative-processes/vault-consultation',
        ]);
  }

  openModal(): void {
    this.modalService.show(ModalSelectsGoodsComponent, {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  loadGood() {
    this.loading = true;
    this.warehouseDisable = true;
    this.vaultDisable = true;
    this.goodServices.getById(this.numberGood.value).subscribe({
      next: response => {
        console.log(response);
        this.good = response;
        this.validRadio(this.good);
        this.loadDescriptionStatus(this.good);
        this.loadDescriptionWarehouse(this.good.storeNumber);
        this.loadDescriptionVault(this.good.vaultNumber);
        this.setGood(this.good);
        this.radio.enable();
        this.currentLocationWare.disable();
        this.currentDescriptionWare.disable();
        this.currentLocationVault.disable();
        this.currentDescriptionVault.disable();
        this.loading = false;
      },
      error: err => {
        console.log(err);
      },
    });
  }

  setGood(good: IGood) {
    this.description.setValue(good.description);
    this.radio.setValue(good.ubicationType);
    this.currentLocationWare.setValue(good.storeNumber);
    this.currentLocationVault.setValue(good.vaultNumber);
    this.currentDescriptionVault.setValue('');
  }

  loadDescriptionStatus(good: IGood) {
    this.goodServices.getStatusByGood(good.id).subscribe({
      next: response => {
        this.statusGoods.setValue(response.status_descripcion);
      },
      error: error => {
        this.loading = false;
        this.onLoadToast(
          'info',
          'Información',
          'Este bien no tiene un Status asignado'
        );
      },
    });
  }
  loadDescriptionWarehouse(id: string | number) {
    this.warehouseService.getById(id).subscribe({
      next: response => {
        this.validLocationsConsult(response);
        this.currentDescriptionWare.setValue(response.description);
      },
      error: err => {
        this.onLoadToast(
          'info',
          'Opps...',
          'Este bien no tiene asignado almacen'
        );
      },
    });
  }
  loadDescriptionVault(id: string | number) {
    this.safeService.getById(id).subscribe({
      next: response => {
        this.currentDescriptionVault.setValue(response.description);
      },
      error: err => {
        this.onLoadToast(
          'info',
          'Opps...',
          'Este bien no tiene asignado Bóvedas'
        );
      },
    });
  }

  onChangeType(event: string) {
    this.typeLocation = event;
  }

  changeLocation() {
    console.log(this.good);
    if (this.validarGood()) return;
    console.log('nuevo -->', this.good);
    this.goodServices.update(this.good).subscribe({
      next: response => {
        console.log(response);
        this.onLoadToast(
          'success',
          'Exitoso',
          'Se ha cambiado la ubicacion del bien'
        );
        this.loadGood();
      },
      error: err => {
        console.log(err);
        this.onLoadToast(
          'error',
          'ERROR',
          'Ha ocurrido un error al cambiar la ubicacion del bien'
        );
      },
    });
  }

  validarGood(): boolean {
    if (this.radio.value === 'A') {
      if (Number(this.good.type) === 5 && Number(this.good.subTypeId) === 16) {
        this.onLoadToast(
          'error',
          'ERROR',
          'El bien no puede estar en un almacen'
        );
        return true;
      } else {
        this.good.storeNumber = this.warehouse.value;
        this.good.ubicationType = 'A';
        this.good.dateIn = new Date();
      }
    } else {
      if (Number(this.good.type) === 5 && Number(this.good.subTypeId) === 16) {
        this.good.vaultNumber = 9999;
        this.good.storeNumber = null;
        this.good.ubicationType = 'B';
      } else {
        this.good.vaultNumber = this.safe.value;
        this.good.ubicationType = 'B';
        this.good.dateIn = new Date();
      }
    }
    return false;
  }
  validLocationsConsult(warehouse: IWarehouse) {
    if (warehouse.manager === this.token.decodeToken().preferred_username) {
      this.disableConsultLocation = true;
    }
  }
  validRadio(good: IGood) {
    good.storeNumber === null ? (this.warehouseDisable = false) : '';
    good.vaultNumber === null ? (this.vaultDisable = false) : '';
  }
}
