import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BienesAsignados } from 'src/app/core/models/ms-directsale/BienesAsignados';
import { MunicipalityControlMainService } from 'src/app/core/services/ms-directsale/municipality-control-main.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-assigned-goods-modal',
  templateUrl: './assigned-goods-modal.component.html',
  styles: [],
})
export class AssignedGoodsModalComponent extends BasePage implements OnInit {
  title: string = 'Bien Asignado';
  good: any;
  number = 0;
  positions: number[] = [];
  edit: boolean = false;
  goodClassification: any[] = [];
  siabClassification: any[] = [];
  assignedGoodColumns: any[] = [];
  goodItems = new DefaultSelect();
  bodyBien: BienesAsignados;
  goodForm: FormGroup = new FormGroup({});
  @Output() onConfirm = new EventEmitter<any>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private municipalityControlMainService: MunicipalityControlMainService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.goodForm = this.fb.group({
      repvendcId: [null],
      batchId: [1],
      bill: [null, [Validators.required]],
      labelsent: [null, [Validators.required]],
      sayDelivery: [null, [Validators.required]],
      job: [null, [Validators.required]],
      managed: [null, [Validators.required]],
      addresssent: [null, [Validators.required]],
      labelBatch: [null, [Validators.required]],
      userSignature: [null, [Validators.required]],
      paragraph1: [null, Validators.pattern(STRING_PATTERN)],
      ccp1: [null],
    });
    if (this.good !== undefined) {
      this.edit = true;
      this.goodForm.patchValue(this.good);
      this.setValue();
    } else {
      this.edit = false;
    }
  }

  setValue() {
    this.goodForm.controls['batchId'].setValue(
      this.goodForm.controls['batchId'].value.batchId
    );
  }
  createId() {
    this.municipalityControlMainService.getBienesAsignados().subscribe({
      next: data => {
        this.assignedGoodColumns = data.data;
        for (let i = 0; i < this.assignedGoodColumns.length; i++) {
          if (this.assignedGoodColumns[i].repvendcId > this.number) {
            this.number = this.assignedGoodColumns[i].repvendcId;
          }
        }
        this.handleSuccess();
      },
      error: err => {
        this.number = 1;
        this.handleSuccess();
      },
    });
    this.number = 0;
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.createId();
  }

  handleSuccess() {
    this.loading = true;
    this.bodyBien = this.goodForm.value;
    if (this.edit) {
      this.municipalityControlMainService
        .updateBienesAsignados(this.goodForm.value.repvendcId, this.bodyBien)
        .subscribe({
          next: data => {
            console.log(data);
            this.onLoadToast('success', 'Datos actualizados correctamente', '');
            this.number = 0;
            this.modalRef.hide();
            location.reload();
          },
          error: err => {
            console.log(err);
            this.onLoadToast(
              'warning',
              'advertencia',
              'Lo sentimos ha ocurrido un error'
            );
            this.number = 0;
            this.modalRef.hide();
          },
        });
    } else {
      this.number++;
      this.goodForm.value.repvendcId = this.number;
      this.goodForm.value.sayDelivery = this.goodForm.value.sayDelivery
        .toLocaleDateString()
        .toString();
      this.municipalityControlMainService
        .addBienesAsignados(this.bodyBien)
        .subscribe({
          next: data => {
            console.log(data);
            this.onLoadToast('success', 'Datos agregados correctamente', '');
            this.number = 0;
            this.modalRef.hide();
            location.reload();
          },
          error: err => {
            this.onLoadToast(
              'warning',
              'advertencia',
              'Lo sentimos ha ocurrido un error'
            );
            this.number = 0;
            this.modalRef.hide();
          },
        });
    }
  }
}
