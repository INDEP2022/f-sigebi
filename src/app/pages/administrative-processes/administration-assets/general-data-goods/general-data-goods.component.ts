import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from './../../../../core/interfaces/model-form';

@Component({
  selector: 'app-general-data-goods',
  templateUrl: './general-data-goods.component.html',
  styles: [],
})
export class GeneralDataGoodsComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() goodId: number;
  generalDataForm: ModelForm<any>;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  list: { atributo: string; valor: string }[] = [];
  good: IGood = {};
  data: any = {};
  constructor(
    private fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly goodQueryService: GoodsQueryService
  ) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.getGood();
    }
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  updateGood() {
    console.log('Actualizando');
    this.good.quantitySae = this.generalDataForm.get('cantidad').value;
    this.good.judicialDate = this.generalDataForm.get('fechaFe').value;
    this.good.observations = this.generalDataForm.get('observacion').value;
    this.good.description = this.generalDataForm.get('descripcion').value;
    const good: IGood = {
      id: Number(this.good.id),
      goodId: Number(this.good.id),
      quantitySae: this.good.quantitySae,
      judicialDate: this.good.judicialDate,
      observations: this.good.observations,
      description: this.good.description,
    };
    this.goodService.update(good).subscribe({
      next: resp => {
        this.alert('success', 'Datos del bien actualizados', '');
      },
      error: err => {
        this.alert('error', 'Error al actualizar el bien', '');
      },
    });
  }
  private getGood() {
    this.goodService.getById(this.goodId).subscribe({
      next: (response: any) => {
        this.good = response.data[0];
        let val: any = response.data[0];
        this.generalDataForm.get('cantidad').patchValue(this.good.quantitySae);
        this.generalDataForm
          .get('fechaFe')
          .patchValue(
            this.good.judicialDate === undefined ? null : this.good.judicialDate
          );
        this.generalDataForm
          .get('observacion')
          .patchValue(this.good.observations);
        this.generalDataForm
          .get('descripcion')
          .patchValue(this.good.description);
        //let data: any = {};
        for (let i = 1; i <= 120; i++) {
          this.data[`val${i}`] = '';
        }
        for (const i in val) {
          for (const j in this.data) {
            if (j == i) {
              this.data[j] = val[i];
            }
          }
        }
        let dataParam = this.params.getValue();
        dataParam.limit = 120;
        dataParam.addFilter('classifGoodNumber', this.good.goodClassNumber);
        this.goodQueryService.getAllFilter(dataParam.getParams()).subscribe({
          next: val => {
            let ordered = val.data.sort(
              (a, b) => a.columnNumber - b.columnNumber
            );
            ordered.forEach((order, index) => {
              if (order) {
                this.list.push({
                  atributo: order.attribute,
                  valor: this.data[`val${index + 1}`] ?? '',
                });
              }
            });
          },
        });
      },
    });
  }
  private prepareForm() {
    this.generalDataForm = this.fb.group({
      descripcion: [null, [Validators.pattern(STRING_PATTERN)]],
      cantidad: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      fechaFe: [null],
      observacion: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }
}
