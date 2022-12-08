import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalSelectsGoodsComponent } from '../modal-selects-goods/modal-selects-goods.component';

@Component({
  selector: 'app-location-goods-warehouses-storage',
  templateUrl: './location-goods-warehouses-storage.component.html',
  styles: [],
})
export class LocationGoodsWarehousesStorageComponent implements OnInit {
  //Reactive Forms
  form: FormGroup;

  get good() {
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
    return this.form.get('currentLocationWare');
  }
  get currentDescriptionWare() {
    return this.form.get('currentDescriptionWare');
  }
  get newLocationWare() {
    return this.form.get('newLocationWare');
  }
  get newDescriptionWare() {
    return this.form.get('newDescriptionWare');
  }
  get currentLocationVault() {
    return this.form.get('currentLocationVault');
  }
  get currentDescriptionVault() {
    return this.form.get('currentDescriptionVault');
  }
  get newLocationVault() {
    return this.form.get('newLocationVault');
  }
  get newDescriptionVault() {
    return this.form.get('newDescriptionVault');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      good: [null, [Validators.required]],
      description: [null, [Validators.required]],
      statusGoods: [null, [Validators.required]],
      radio: [null, [Validators.required]],
      currentLocationWare: [null, [Validators.required]],
      currentDescriptionWare: [null, [Validators.required]],
      newLocationWare: [null, [Validators.required]],
      newDescriptionWare: [null, [Validators.required]],
      currentLocationVault: [null, [Validators.required]],
      currentDescriptionVault: [null, [Validators.required]],
      newLocationVault: [null, [Validators.required]],
      newDescriptionVault: [null, [Validators.required]],
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
}
