import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BienesAsignados } from 'src/app/core/models/ms-directsale/BienesAsignados';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { MsDirectawardService } from 'src/app/core/services/ms-directaward/ms-directaward.service';
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
  maxDate = new Date();
  positions: number[] = [];
  edit: boolean = false;
  goodClassification: any[] = [];
  siabClassification: any[] = [];
  assignedGoodColumns: any[] = [];
  goodItems = new DefaultSelect();
  bodyBien: BienesAsignados;
  goodForm: FormGroup = new FormGroup({});
  goodForm2: FormGroup = new FormGroup({});
  delegationItems = new DefaultSelect();
  @Output() refresh = new EventEmitter<boolean>();
  @Output() onConfirm = new EventEmitter<any>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private municipalityControlMainService: MunicipalityControlMainService,
    private msDirectawardService: MsDirectawardService,
    private delegationService: DelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getData();
    this.getDelegation();
  }
  getData() {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.goodForm = this.fb.group({
      detbienesadjId: [null],
      soladjinstgobId: [null, [Validators.required, Validators.max(1000)]],
      typeentgobId: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      estateNumber: [null, [Validators.required, Validators.max(1000)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegation: [null, [Validators.required]],
      location: [null, [Validators.pattern(STRING_PATTERN)]],
      worthappraisal: [null, [Validators.max(1000000000)]],
      appraisalDate: [null],
      sessionNumber: [null, Validators.max(1000)],
      ranksEstate: [null, [Validators.pattern(STRING_PATTERN)]],
      mandate: [null, [Validators.pattern(STRING_PATTERN)]],
      rankssiab: [null, [Validators.pattern(STRING_PATTERN)]],
      comments: [null, [Validators.pattern(STRING_PATTERN)]],
      visualize: [null],
    });
    this.goodForm2 = this.fb.group({
      soladjinstgobId: [null, [Validators.required, Validators.max(1000)]],
      typeentgobId: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      estateNumber: [null, [Validators.required, Validators.max(1000)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegation: [null, [Validators.required]],
      location: [null, [Validators.pattern(STRING_PATTERN)]],
      worthappraisal: [null, [Validators.max(1000000000)]],
      appraisalDate: [null],
      sessionNumber: [null, Validators.max(1000)],
      ranksEstate: [null, [Validators.pattern(STRING_PATTERN)]],
      mandate: [null, [Validators.pattern(STRING_PATTERN)]],
      rankssiab: [null, [Validators.pattern(STRING_PATTERN)]],
      comments: [null, [Validators.pattern(STRING_PATTERN)]],
      visualize: [null],
    });
    if (this.good !== undefined) {
      this.edit = true;
      console.log('vamos a editar', this.good);
      this.goodForm.patchValue(this.good);
      this.setValue();
    } else {
      console.log('vamos desde cero');
      this.edit = false;
    }
  }
  // Deshacer///////////////////////////////////////////////////////////////////////////
  setValue() {
    this.goodForm.controls['soladjinstgobId'].setValue(
      this.good.soladjinstgobId.soladjinstgobId
    );
    this.goodForm.controls['typeentgobId'].setValue(
      this.good.typeentgobId.typeentgobId
    );
    this.goodForm.controls['detbienesadjId'].disable();
    this.goodForm.controls['soladjinstgobId'].disable();
    this.goodForm.controls['typeentgobId'].disable();
    if (this.good.appraisalDate) {
      this.goodForm.controls['appraisalDate'].setValue(
        new Date(this.goodForm.value.appraisalDate)
      );
    }
  }
  getDelegation() {
    this.delegationService.getAll2().subscribe({
      next: data => {
        this.delegationItems = new DefaultSelect(data.data, data.data.length);
        console.log('delegacion', data);
      },
      error: err => {
        console.log('delegacion', err);
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    this.goodForm.controls['detbienesadjId'].enable();
    this.goodForm.controls['soladjinstgobId'].enable();
    this.goodForm.controls['typeentgobId'].enable();
    this.bodyBien = this.goodForm.value;

    if (this.edit) {
      this.msDirectawardService
        .updateGoodsById(this.goodForm.value.detbienesadjId, this.bodyBien)
        .subscribe({
          next: data => {
            console.log(data);
            this.onLoadToast(
              'success',
              'Bien Asignado',
              'Actualizado Correctamente'
            );
            this.refresh.emit(true);
            this.modalRef.hide();
            //location.reload();
          },
          error: err => {
            console.log(err);
            this.onLoadToast(
              'warning',
              'advertencia',
              'Lo sentimos ha ocurrido un error'
            );
            // this.number = 0;
            this.modalRef.hide();
          },
        });
    } else {
      this.bodyBien = this.goodForm.value;
      this.goodForm2.patchValue(this.bodyBien);
      //console.log(JSON.stringify(this.goodForm2.value));
      this.msDirectawardService
        .createGoodsById(this.goodForm2.value)
        .subscribe({
          next: data => {
            console.log(data);
            this.onLoadToast(
              'success',
              'Bien Asignado',
              'Agregado Correctamente'
            );
            this.refresh.emit(true);
            this.modalRef.hide();
          },
          error: err => {
            this.onLoadToast(
              'warning',
              'Advertencia',
              'Lo Sentimos ha Ocurrido un Error'
            );
            this.number = 0;
            this.modalRef.hide();
          },
        });
    }
  }
}
