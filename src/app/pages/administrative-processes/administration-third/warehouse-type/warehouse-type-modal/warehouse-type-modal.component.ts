import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IWarehouseClassifyCosts } from 'src/app/core/models/catalogs/warehouse-classify-costs';
import { WarehouseClassifyCostsService } from 'src/app/core/services/catalogs/warehouse-classify-costs.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EventSelectionModalComponent } from 'src/app/pages/commercialization/catalogs/components/event-selection-modal/event-selection-modal.component';
import { StrategyCostComponent } from '../strategy-cost/strategy-cost.component';
import { TypeGoodComponent } from '../type-good/type-good.component';

@Component({
  selector: 'app-warehouse-type-modal',
  templateUrl: './warehouse-type-modal.component.html',
  styles: [],
})
export class WarehouseTypeModalComponent extends BasePage implements OnInit {
  warehouseForm: FormGroup = new FormGroup({});
  edit: boolean = false;
  title: string = 'Tipo de Almacén';
  data: IWarehouseClassifyCosts;
  value: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private warehouseClassifyCostsService: WarehouseClassifyCostsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    if (this.data != null) {
      this.edit = true;
    }
    this.warehouseForm = this.fb.group({
      warehouseTypeId: [null],
      warehouseName: [{ value: null, disabled: true }],
      classifGoodNumber: [null, Validators.required],
      descClassif: [{ value: null, disabled: this.edit ? true : false }],
      costId: [null, Validators.required],
      descCost: [null],
      registryNumber: [null],
    });
    if (this.data != null) {
      console.log(this.data);
      let warehouseTypeId = this.data.warehouseTypeId;
      console.log(warehouseTypeId.warehouseTypeId);
      this.edit = true;
      this.warehouseForm.patchValue(this.data);
      this.warehouseForm.controls['warehouseTypeId'].setValue(
        warehouseTypeId.warehouseTypeId
      );
      this.warehouseForm.controls['warehouseName'].setValue(
        warehouseTypeId.descriptionType
      );
    } else {
      // console.log(this.value.warehouseTypeId);
      this.warehouseForm.controls['warehouseTypeId'].setValue(
        this.value.warehouseTypeId
      );
      this.warehouseForm.controls['warehouseName'].setValue(
        this.value.descriptionType
      );
    }
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    this.loading = true;
    let data = {
      warehouseTypeId: this.warehouseForm.controls['warehouseTypeId'].value,
      classifGoodNumber: this.warehouseForm.controls['classifGoodNumber'].value,
      costId: this.warehouseForm.controls['costId'].value,
      registryNumber: this.warehouseForm.controls['registryNumber'].value,
    };
    this.warehouseClassifyCostsService.create1(data).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
  update() {
    this.loading = true;

    let data = {
      warehouseTypeId: this.warehouseForm.controls['warehouseTypeId'].value,
      classifGoodNumber: this.warehouseForm.controls['classifGoodNumber'].value,
      costId: this.warehouseForm.controls['costId'].value,
      registryNumber: this.warehouseForm.controls['registryNumber'].value,
    };
    this.warehouseClassifyCostsService.update7(data).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
  close() {
    this.modalRef.hide();
  }

  openCost(context?: Partial<EventSelectionModalComponent>) {
    const modalRef = this.modalService.show(StrategyCostComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe((next: any) => {
      if (next) {
        console.log(next);
        this.warehouseForm.controls['costId'].setValue(next.data.costId);
        this.warehouseForm.controls['descCost'].setValue(next.data.descCost);
      }
    });
  }
  openGood(context?: Partial<EventSelectionModalComponent>) {
    let value = this.warehouseForm.value;
    const modalRef = this.modalService.show(TypeGoodComponent, {
      initialState: { ...context, value },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe((next: any) => {
      console.log(next);
      this.warehouseForm.controls['classifGoodNumber'].setValue(
        next.data.numClasifGoods
      );
      this.warehouseForm.controls['descClassif'].setValue(
        next.data.description
      );
    });
  }
}
