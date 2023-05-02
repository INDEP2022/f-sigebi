import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-massive-reclassification-goods',
  templateUrl: './massive-reclassification-goods.component.html',
  styles: [],
})
export class MassiveReclassificationGoodsComponent
  extends BasePage
  implements OnInit
{
  listGood: IGood[] = [];
  form: FormGroup;
  selectedGooods: IGood[] = [];
  goodNotValid: IGood[] = [];
  origin: string = null;
  changeDescription: string;
  changeDescriptionAlterning: string;
  get mode() {
    return this.form.get('mode');
  }
  get classificationOfGoods() {
    return this.form.get('classificationOfGoods');
  }
  get description() {
    return this.form.get('description');
  }
  get goodStatus() {
    return this.form.get('goodStatus');
  }
  get classificationGoodAlterning() {
    return this.form.get('classificationGoodAlterning');
  }
  get descriptionAlternating() {
    return this.form.get('descriptionAlternating');
  }
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private readonly goodServices: GoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        name: {
          title: 'Reclasificar',
          sort: false,
          type: 'custom',
          showAlways: true,
          valuePrepareFunction: (isSelected: boolean, row: IGood) =>
            this.isGoodSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onGoodSelect(instance),
        },
        ...COLUMNS,
      },
    };
  }

  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }

  isGoodSelected(_good: IGood) {
    const exists = this.selectedGooods.find(good => good.id == _good.id);
    return !exists ? false : true;
  }

  goodSelectedChange(good: IGood, selected: boolean) {
    if (selected) {
      this.selectedGooods.push(good);
    } else {
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.id != good.id
      );
    }
  }

  ngOnInit(): void {
    this.buildForm();
    this.form.disable();
    this.mode.enable();
    console.log(this.mode.value);
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      mode: [null, [Validators.required]],
      classificationOfGoods: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      goodStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      classificationGoodAlterning: [null, [Validators.required]],
      descriptionAlternating: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  openQuestion() {
    this.alertQuestion(
      'question',
      '¿Desea reclasificar los bienes seleccionados?',
      '',
      'Cambiar'
    ).then(resp => {
      if (resp.isConfirmed) {
        this.changeClassification();
      }
    });
  }

  changeClassification() {
    console.log('Se cambiaron los datos de forma masiva');
    console.log(this.selectedGooods);
    this.selectedGooods.forEach(good => {
      if (good.goodClassNumber === 1575) {
        this.goodNotValid.push(good);
      } else {
        this.mode.value === 'E'
          ? this.updateMode(good, this.classificationOfGoods.value)
          : this.updateMode(good, this.classificationGoodAlterning.value);
      }
    });
    this.onLoadToast(
      'success',
      'Exitoso',
      'Se ha reclasificado los bienes seleccionados.'
    );
  }

  updateMode(good: IGood, newClassNumber: string) {
    console.log(Number(newClassNumber), this.classificationOfGoods.value);
    good.goodClassNumber = Number(newClassNumber);
    good.requestId = Number(good.requestId);
    good.fractionId = Number(good.fractionId);
    good.addressId = Number(good.addressId);
    console.log(good);
    this.goodServices.update(good).subscribe({
      next: response => {
        console.log(response);
      },
      error: err => {
        console.log(err);
      },
    });
  }
  formEnable() {
    this.form.enable();
  }

  loadGoods() {
    console.log(this.classificationOfGoods.value);
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      console.log('Entro', this.params.getValue());
      this.goodServices.getAll(this.params.getValue()).subscribe({
        next: response => {
          console.log(response);
          this.listGood = response.data;
          this.totalItems = response.count;
        },
        error: err => {
          console.log(err);
        },
      });
    });
  }
  onChage(event: string) {
    this.changeDescription = event;
  }
  onChageAlterning(event: string) {
    this.changeDescriptionAlterning = event;
  }
}
