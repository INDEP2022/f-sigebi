import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, forkJoin, of, takeUntil } from 'rxjs';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
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
  files: any = [];
  goodNotValid: IGood[] = [];
  origin: string = null;
  changeDescription: string;
  changeDescriptionAlterning: string;
  contador = 0;

  get pathClasification() {
    return 'catalog/api/v1/good-sssubtype?sortBy=numClasifGoods:ASC';
  }

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
    private readonly goodServices: GoodService,
    private router: Router
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
          this.classificationOfGoods.addValidators(Validators.required);
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

  get ids() {
    return this.service.ids;
  }

  clearFilter() {
    this.form.reset();
    this.files = [];
    this.changeDescription = null;
    this.service.ids = null;
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
    this.loading = true;
    let newClassNumber: any;
    if (this.mode.value === 'I') {
      newClassNumber = this.classificationGoodAlterning.value;
    } else {
      newClassNumber = this.classificationOfGoods.value;
    }
    // setTimeout(() => {
    //   this.loading = false;
    // }, 1000);
    // return;
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
        this.loading = false;
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
    return this.goodServices.update(body).pipe(
      takeUntil(this.$unSubscribe),
      catchError(x => of(null))
    );
  }

  formEnable() {
    this.form.enable();
  }

  onChange(event: IGoodSssubtype) {
    console.log(event);
    this.changeDescription = event ? event.description : null;
  }
  onChageAlterning(event: string) {
    this.changeDescriptionAlterning = event;
  }

  goToRastreador() {
    this.router.navigate(['/pages/general-processes/goods-tracker'], {
      queryParams: { origin: 'FACTADBCAMBIOESTAT' },
    });
  }

  //Llenado de excel
  onFileChange(event: Event) {
    // debugger;
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    this.files = files;
  }
}
