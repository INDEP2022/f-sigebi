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
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from './../../../../core/interfaces/model-form';

@Component({
  selector: 'app-general-data-goods',
  templateUrl: './general-data-goods.component.html',
  styles: [],
})
export class GeneralDataGoodsComponent implements OnInit, OnChanges {
  @Input() goodId: number;
  generalDataForm: ModelForm<any>;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  list: { atributo: string; valor: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly goodQueryService: GoodsQueryService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.getGood();
    }
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private getGood() {
    this.goodService.getById(this.goodId).subscribe({
      next: (val: any) => {
        this.generalDataForm.get('cantidad').patchValue(val.quantitySae);
        this.generalDataForm.get('fechaFe').patchValue(val.judicialDate);
        this.generalDataForm.get('observacion').patchValue(val.observations);
        this.generalDataForm.get('descripcion').patchValue(val.description);
        let data: any = {};
        for (let i = 1; i <= 120; i++) {
          data[`val${i}`] = '';
        }
        for (const i in val) {
          for (const j in data) {
            if (j == i) {
              data[j] = val[i];
            }
          }
        }
        let dataParam = this.params.getValue();
        dataParam.limit = 120;
        dataParam.addFilter('classifGoodNumber', val.goodClassNumber);
        this.goodQueryService.getAllFilter(dataParam.getParams()).subscribe({
          next: val => {
            let ordered = val.data.sort(
              (a, b) => a.columnNumber - b.columnNumber
            );
            ordered.forEach((order, index) => {
              if (order) {
                this.list.push({
                  atributo: order.attribute,
                  valor: data[`val${index + 1}`],
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
      descripcion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cantidad: [null, [Validators.required]],
      fechaFe: [null, [Validators.required]],
      observacion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}
