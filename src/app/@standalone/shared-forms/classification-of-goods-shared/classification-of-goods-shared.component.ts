import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';

export interface IClasifi {
  id?: number;
  description: string;
  info: string;
}
@Component({
  selector: 'app-classification-of-goods-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './classification-of-goods-shared.component.html',
  styles: [],
})
export class ClassificationOfGoodsSharedComponent
  extends BasePage
  implements OnInit
{
  @Input() form: FormGroup;
  @Input() classificationOfGoodsField: string = 'classificationOfGoods';
  @Input() label: string = 'No de Clasificación de Bien';
  @Input() showClasification: boolean = true;
  @Output() descriptionClasification = new EventEmitter<string>();
  @Input() patchValue: boolean = false;
  data: IClasifi[] = [];
  sssubtypes = new DefaultSelect<IGoodSsubType>();

  get measurementUnit() {
    return this.form.get(this.classificationOfGoodsField);
  }

  constructor(private readonly goodSssubtypeService: GoodSssubtypeService) {
    super();
  }

  ngOnInit(): void {}

  getClasification(params: ListParams) {
    this.goodSssubtypeService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.data = data.data.map(clasi => {
          return {
            id: clasi.numClasifGoods,
            description: clasi.description,
            info: `${clasi.numClasifGoods} - ${clasi.description}`,
          };
        });
        this.sssubtypes = new DefaultSelect(this.data, data.count);
      },
      error: err => {
        console.log(err);
      },
    });
  }

  onPackagesChange(type: any) {
    this.descriptionClasification.emit(type.description);
    this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
