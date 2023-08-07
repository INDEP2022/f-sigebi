import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-edit-good-form',
  templateUrl: './edit-good-form.component.html',
  styles: [],
})
export class EditGoodFormComponent extends BasePage implements OnInit {
  good: IGood;
  form: FormGroup = new FormGroup({});
  unitMeasures = new DefaultSelect();
  physicalStatus = new DefaultSelect();
  stateConservations = new DefaultSelect();
  tranType: string = '';
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private goodService: GoodService,
    private genericService: GenericService,
    private goodsQueryService: GoodsQueryService,
    private modalService: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getStateConservation(new ListParams());
    this.getUnitMeasure(new ListParams());
    this.getPhysicalStatus(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null],
      observations: [
        null,
        [
          Validators.required,
          Validators.maxLength(300),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      goodId: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      uniqueKey: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      goodDescription: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      quantity: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      unitMeasure: [null],
      physicalStatus: [null],
      stateConservation: [null],
    });

    this.form.patchValue(this.good);
  }

  confirm() {
    if (this.form.get('observations').value) {
      const formData = {
        id: this.form.get('id').value,
        goodId: this.form.get('goodId').value,
        observations: this.form.get('observations').value,
      };

      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea actualizar la información del Bien?'
      ).then(question => {
        if (question.isConfirmed) {
          this.goodService.updateByBody(formData).subscribe({
            next: () => {
              this.alertInfo(
                'success',
                'Acción Correcta',
                'Bien modificado correctamente'
              ).then(question => {
                if (question.isConfirmed) {
                  this.modalService.content.callback(true);
                  this.modalRef.hide();
                }
              });
            },
            error: error => {
              this.onLoadToast('error', 'Error', 'Error al actualizar el bien');
            },
          });
        }
      });
    } else {
      this.alertInfo(
        'warning',
        'Acción Inválida',
        'Se necesita llenar el campo observación'
      );
    }
  }

  getStateConservation(params: ListParams) {
    params['filter.name'] = '$eq:Estado Conservacion';
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          console.log('data', data);
          this.stateConservations = new DefaultSelect(data.data, data.count);
        },
        error: error => {},
      });
  }

  getUnitMeasure(params: ListParams) {
    params['filter.measureTlUnit'] = `$ilike:${params.text}`;
    params.limit = 20;
    this.goodsQueryService
      .getCatMeasureUnitView(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          console.log('Unit measure', resp);
          this.unitMeasures = new DefaultSelect(resp.data, resp.count);
        },
        error: error => {},
      });
  }

  getPhysicalStatus(params: ListParams) {
    params['filter.name'] = '$eq:Estado Fisico';
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          console.log('status', data);
          this.physicalStatus = new DefaultSelect(data.data, data.count);
        },
      });
  }

  close() {
    this.modalRef.hide();
  }
}
