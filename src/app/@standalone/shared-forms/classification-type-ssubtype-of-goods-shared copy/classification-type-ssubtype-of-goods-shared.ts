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
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';

export interface IClasifi {
  no_clasif_bien?: number | string;
  info: string;
}
@Component({
  selector: 'app-classification-type-ssubtype-of-goods-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './classification-type-ssubtype-of-goods-shared.component.html',
  styles: [],
})
export class ClassificationTypeSsubtypeOfGoodsSharedComponent
  extends BasePage
  implements OnInit
{
  @Input() form: FormGroup;
  @Input() ClassificationTypeSsubtypeOfGoodFiield: string =
    'ClassificationTypeSsubtypeOfGoods';
  @Input() label: string = 'Subtipo - Ssubtipo - Sssubtipo';
  @Input() showClasification: boolean = true;
  @Output() clasification = new EventEmitter<string>();
  @Input() patchValue: boolean = false;
  @Input() obj: Object = null;

  data: IClasifi[] = [];
  sssubtypes = new DefaultSelect<IGoodSsubType>();

  get measurementUnit() {
    return this.form.get(this.ClassificationTypeSsubtypeOfGoodFiield);
  }

  constructor(private readonly dictationServices: DictationService) {
    super();
  }

  ngOnInit(): void {}

  getClassificationTypeSsubtypeOfGoods(params: ListParams) {
    this.dictationServices.getParamsOfTypeGood(this.obj).subscribe({
      next: response => {
        console.log(response);
        this.data = response.data.map((clasi: any) => {
          return {
            no_clasif_bien: clasi.no_clasif_bien,
            info: `${clasi.no_clasif_bien} - ${clasi.desc_subtipo} - ${clasi.desc_ssubtipo} - ${clasi.desc_sssubtipo}`,
          };
        });
        this.data.push({
          no_clasif_bien: '0',
          info: `Todos`,
        });
        this.sssubtypes = new DefaultSelect(this.data, response.count);
      },
      error: err => {
        console.log(err);
      },
    });
  }

  onPackagesChange(type: any) {
    this.clasification.emit(type.no_clasif_bien);
    this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
