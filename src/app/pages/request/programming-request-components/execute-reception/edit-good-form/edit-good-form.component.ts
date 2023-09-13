import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IUnitsMedConv } from 'src/app/core/models/administrative-processes/siab-sami-interaction/measurement-units';
import { IGood } from 'src/app/core/models/good/good.model';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  DOUBLE_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
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
  stateConservationInfo = new DefaultSelect();
  saePhysicalStateInfo = new DefaultSelect();
  stateConservations = new DefaultSelect();
  saeDestiny = new DefaultSelect();
  tranType: string = '';
  stateConservationName: string = '';
  physicalStatusName: string = '';
  nameDestinyTransferent: string = '';
  unitMeasureConv: IUnitsMedConv;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private goodService: GoodService,
    private genericService: GenericService,
    private goodsQueryService: GoodsQueryService,
    private modalService: BsModalRef,
    private strategyService: StrategyServiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getStateConservation(new ListParams());
    this.getUnitMeasure(new ListParams());
    this.getPhysicalStatus(new ListParams());
    this.getDestiny(new ListParams());
    this.showPhisycalStatus();
    this.showStateConservation();
    /*if (this.good) {
      this.showDestinyTransferent();
    } */
    //this.getStateConservation(new ListParams());
  }

  showPhisycalStatus() {
    if (this.good?.physicalStatus == 1) {
      this.physicalStatusName = 'BUENO';
    } else if (this.good?.physicalStatus == 2) {
      this.physicalStatusName = 'MALO';
    }
  }

  showStateConservation() {
    if (this.good?.stateConservation == 1) {
      this.stateConservationName = 'BUENO';
    } else if (this.good?.stateConservation == 2) {
      this.stateConservationName = 'MALO';
    }
  }

  showDestinyTransferent() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.name'] = 'Destino';
    params.getValue()['filter.keyId'] = this.good?.destiny;
    this.genericService.getAll(params.getValue()).subscribe({
      next: response => {
        this.nameDestinyTransferent = response.data[0].description;
        //this.saeDestiny = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      observations: [
        null,
        [
          Validators.required,
          Validators.maxLength(300),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      /*
      goodId: [this.good?.idGood],
      descriptionGoodSae: [null],
      quantitySae: [null],
      saePhysicalState: [null],
      stateConservationSae: [null],
      saeMeasureUnit: [null],
      saeDestiny: [null], */
      /*
     
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
      stateConservation: [null], */
    });

    this.form.patchValue(this.good);
  }

  confirm() {
    /*const quantitySae = this.form.get('quantitySae').value;
    console.log('sae', quantitySae);
    console.log('trans', this.good?.quantity);

    if (this.unitMeasureConv) {
      if (this.unitMeasureConv.tpUnitGreater == 'N') {
        if (quantitySae > this.good?.quantity) {
          this.alert(
            'warning',
            'Acción Invalida',
            'La cantidad INDEP es mayor a la cantidad transferente'
          );
        } else {
          console.log('form', this.form);
          this.goodService.updateByBody(this.form.value).subscribe({
            next: response => {
              this.modalRef.content.callback(true);
              this.alert(
                'success',
                'Correcto',
                'Bien modificado correctamente'
              );
              this.close();
            },
            error: error => {
              this.alert(
                'warning',
                'Acción Invalida',
                'Error al actualizar el Bien'
              );
            },
          });
        }
      } else if (this.unitMeasureConv.tpUnitGreater == 'Y') {
        console.log('form', this.form);
      }
    } */

    if (this.form.get('observations').value) {
      const formData = {
        id: this.good?.id,
        goodId: this.good?.goodId,
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
          this.stateConservations = new DefaultSelect(data.data, data.count);
        },
        error: error => {},
      });
  }

  getUnitMeasure(params: ListParams) {
    params['filter.unit'] = `$eq:${this.good.unitMeasure}`;
    this.strategyService.getUnitsMedXConv(params).subscribe({
      next: response => {
        this.unitMeasures = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
    /*
    params['filter.measureTlUnit'] = `$ilike:${params.text}`;
    params.limit = 20;
    this.goodsQueryService
      .getCatMeasureUnitView(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          console.log('Unit measure', resp);
          
        },
        error: error => {},
      }); */
  }

  getPhysicalStatus(params: ListParams) {
    params['filter.name'] = '$eq:Estado Fisico';
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          this.saePhysicalStateInfo = new DefaultSelect(data.data, data.count);
        },
      });
  }

  getDestiny(params: ListParams) {
    params['filter.name'] = 'Destino';

    this.genericService.getAll(params).subscribe({
      next: response => {
        this.saeDestiny = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
  }

  unitSelect(unitMeasureConv: IUnitsMedConv) {
    this.unitMeasureConv = unitMeasureConv;
    if (this.unitMeasureConv.decimals == 'N') {
      this.form
        .get('quantitySae')
        .addValidators([Validators.pattern(NUMBERS_PATTERN)]);
      this.form.markAllAsTouched();
    } else {
      this.form
        .get('quantitySae')
        .addValidators([Validators.pattern(DOUBLE_PATTERN)]);
      this.form.markAllAsTouched();
    }
  }

  /*quantitySaeCheck() {
    const quantitySae = this.form.get('quantitySae').value;
    console.log('sae', quantitySae);
    console.log('trans', this.good?.quantity);

    if (this.unitMeasureConv) {
      if (this.unitMeasureConv.decimals == 'N') {
        if (quantitySae > this.good?.quantity) {
          this.form
            .get('quantitySae')
            .addValidators([min(this.good?.quantity)]);
          this.form
            .get('quantitySae')
            .setErrors({ minDate: { min: this.good?.quantity } });
          this.form.markAllAsTouched();
        }
      }
    }
  } */

  close() {
    this.modalRef.hide();
  }
}
