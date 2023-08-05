import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { debounceTime, forkJoin, takeUntil } from 'rxjs';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MassiveReclassificationGoodsService } from '../services/massive-reclassification-goods.service';

@Component({
  selector: 'app-massive-reclassification-goods',
  templateUrl: './massive-reclassification-goods.component.html',
  styleUrls: ['./massive-reclassification-goods.component.scss'],
})
export class MassiveReclassificationGoodsComponent
  extends BasePage
  implements OnInit
{
  // listGood: IGood[] = [];
  goodNotValid: IGood[] = [];
  origin: string = null;
  changeDescription: string;
  changeDescriptionAlterning: string;
  contador = 0;

  get selectedGooods() {
    return this.service.selectedGooods;
  }

  get form() {
    return this.service.form;
  }

  get mode() {
    return this.form.get('mode');
  }
  get classificationOfGoods() {
    return this.form.get('classificationOfGoods');
  }

  get classificationGoodAlterning() {
    return this.form.get('classificationGoodAlterning');
  }

  constructor(
    private service: MassiveReclassificationGoodsService,
    private readonly goodServices: GoodService
  ) {
    super();
  }

  loadGoods() {
    this.service.loadGoods.next(true);
  }

  enabledReclass() {
    let validacion = this.selectedGooods.length > 0;
    if (this.mode.value && this.mode.value === 'I') {
      validacion =
        validacion &&
        this.form.valid &&
        this.classificationGoodAlterning.value !== null;
    } else {
      validacion =
        validacion &&
        this.mode.value !== null &&
        this.classificationOfGoods.value !== null;
    }
    return validacion;
  }

  ngOnInit(): void {
    this.service.buildForm();
    this.form.disable();
    this.mode.enable();
    this.mode.valueChanges
      .pipe(debounceTime(500), takeUntil(this.$unSubscribe))
      .subscribe(x => {
        // console.log(x);
        if (x === 'I') {
          this.classificationGoodAlterning.setValue(null);
          this.classificationGoodAlterning.addValidators(Validators.required);
        } else {
          this.classificationGoodAlterning.setValue(null);
          this.classificationGoodAlterning.removeValidators(
            Validators.required
          );
        }
        this.form.updateValueAndValidity();
        // console.log(this.form.valid);
      });

    // this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
    //   console.log('Entro', this.params.getValue());
    //   if (this.contador > 0) {
    //     this.loadGoods();
    //   }
    //   this.contador++;
    // });
    // this.form.valueChanges.subscribe(x => {
    //   if (this.listGood.length > 0) {
    //     console.log(x);
    //   }
    // });

    console.log(this.mode.value);
  }

  clearFilter() {
    this.form.reset();
    this.service.selectedGooods = [];
    this.service.loadGoods.next(false);
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  openQuestion() {
    this.alertQuestion(
      'question',
      '¿Desea reclasificar los Bienes Seleccionados?',
      ''
    ).then(resp => {
      if (resp.isConfirmed) {
        this.changeClassification();
      }
    });
  }

  changeClassification() {
    console.log('Se cambiaron los datos de forma masiva');
    // console.log(this.selectedGooods);
    let newClassNumber: any;
    if (this.mode.value === 'I') {
      newClassNumber = this.classificationGoodAlterning.value;
    } else {
      newClassNumber = this.classificationOfGoods.value;
    }
    // console.log(this.selectedGooods);
    forkJoin(
      this.selectedGooods.map(good => {
        return this.updateMode(good, newClassNumber);
      })
    )
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(x => {
        this.alert(
          'success',
          'Reclasificación Masiva',
          'Se han reclasificado los Bienes Seleccionados.'
        );
        this.loadGoods();
      });

    // forkJoin(this.selectedGooods.map(good => {
    //         const filterParams = new FilterParams();
    //         filterParams.addFilter('typeManagement', 2);
    //         filterParams.addFilter2(
    //           'filter.expedient=' +
    //             (good.fileNumber ? '$eq:' + good.fileNumber : '$null')
    //         );
    //         filterParams.addFilter2(
    //           'filter.flierNumber=' +
    //             (good.flierNumber ? '$eq:' + good.flyerNumber : '$null')
    //         );
    // }))
  }

  goGoodRastrer() {}
  // get disabled() {
  //   return (
  //     this.selectedGooods.length === 0 ||
  //     !this.form ||
  //     this.form.invalid ||
  //     (this.mode.value === 'I' && !this.classificationGoodAlterning.value)
  //   );
  // }

  updateMode(good: IGood, newClassNumber: string) {
    // console.log(Number(newClassNumber), this.classificationOfGoods.value);
    let body: any = {};
    body.id = good.id;
    body.goodId = good.goodId;
    body.goodClassNumber = Number(newClassNumber);
    body.requestId = Number(good.requestId);
    body.fractionId = Number(good.fractionId);
    body.addressId = Number(good.addressId);
    // console.log(body);
    return this.goodServices.update(body).pipe(takeUntil(this.$unSubscribe));
  }

  formEnable() {
    this.form.enable();
  }

  onChage(event: string) {
    this.changeDescription = event;
  }
  onChageAlterning(event: string) {
    this.changeDescriptionAlterning = event;
  }
}
