import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
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
  get newLocationWare() {
    return this.formWarehouse.get('newLocationWare');
  }
  get newDescriptionWare() {
    return this.formWarehouse.get('newDescriptionWare');
  }
  get currentLocationVault() {
    return this.formVault.get('currentLocationVault');
  }
  get currentDescriptionVault() {
    return this.formVault.get('currentDescriptionVault');
  }
  get newLocationVault() {
    return this.formVault.get('newLocationVault');
  }
  get newDescriptionVault() {
    return this.formVault.get('newDescriptionVault');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private readonly goodServices: GoodService,
    private token: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
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
      newLocationWare: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      newDescriptionWare: [
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
      newLocationVault: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      newDescriptionVault: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  massAssignment() {
    this.openModal();
  }

  checkLocations() {}

  openModal(): void {
    this.modalService.show(ModalSelectsGoodsComponent, {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  loadGood() {
    this.loading = true;
    this.goodServices.getById(this.numberGood.value).subscribe({
      next: response => {
        console.log(response);
        this.good = response.data;
        this.loadDescriptionStatus(this.good);
        this.radio.enable();
        this.loading = false;
      },
    });
  }

  setGood(good: IGood, status: any) {
    this.description.setValue(good.description);
    this.statusGoods.setValue(status.status_descripcion);
  }

  loadDescriptionStatus(good: IGood) {
    this.goodServices.getStatusByGood(good.id).subscribe({
      next: response => {
        this.setGood(good, response);
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  onChangeType(event: string) {
    this.typeLocation = event;
  }
}
