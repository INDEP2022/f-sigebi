import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  FilterParams,
  SearchFilter,
} from './../../../common/repository/interfaces/list-params';
//Rxjs
import { BehaviorSubject } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
/**import SERVICE**/
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';

@Component({
  selector: 'goods-filter-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  template: `
    <ng-container>
      <div class="row mb-3 mt-3" *ngIf="showGoods">
        <div class="col-md-12">
          <form-field [control]="form.get(goodField)">
            <ngx-select
              (fetchItems)="getGoods($event)"
              [data]="goods"
              [form]="form"
              value="id"
              bindLabel="info"
              label="Bien"
              [control]="goodField"
              (change)="onGoodsChange($event)">
            </ngx-select>
          </form-field>
        </div>
      </div>
    </ng-container>
  `,
  styles: [],
})
export class GoodsFilterSharedComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() form: FormGroup;
  @Input() goodField: string = 'goodId';
  @Input() set reloadGood(value: IGood) {
    if (value) this.getData(value);
  }

  @Input() showGoods: boolean = true;
  //If Form PatchValue
  @Input() patchValue: boolean = false;
  @Input() classifGood: number;
  @Input() clean: boolean = false;
  @Output() good = new EventEmitter<IGood>();
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  goods = new DefaultSelect<IGood>();
  data: any[] = [];

  constructor(private readonly service: GoodFinderService) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getGoods({ limit: 10, page: 1 });
  }

  ngOnInit(): void {}

  getGoods(params: ListParams) {
    //Provisional data
    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;
    if (this.classifGood) {
      data.addFilter('goodClassNumber', this.classifGood);
    }
    if (params.text != undefined && params.text != '') {
      data.addFilter('description', params.text, SearchFilter.ILIKE);
    }
    console.log('CLASIFICADOR DEL BEINE ES: ', this.classifGood);

    this.service.getAll2(data.getParams()).subscribe({
      next: data => {
        this.data = data.data.map(clasi => {
          return {
            ...clasi,
            info: `${clasi.id} - ${clasi.description ?? ''}`,
          };
        });
        this.goods = new DefaultSelect(this.data, data.count);
      },
      error: err => {
        this.goods = new DefaultSelect([], 0);
        let error = '';
        // if (err.status === 0) {
        //   error = 'Revise su conexión de Internet.';
        //   this.onLoadToast('error', 'Error', error);
        // }
        this.alert(
          'warning',
          'Información',
          'No hay bienes que mostrar con los filtros seleccionado'
        );
      },
      complete: () => {},
    });
  }

  onGoodsChange(type: any) {
    if (this.patchValue) {
      this.form.patchValue({
        goodId: type.goodId,
        goodDescription: type.goodDescription,
      });
    }
    this.form.updateValueAndValidity();
    this.good.emit(type);
    //this.resetFields([this.subgood]);
    //this.subgoods = new DefaultSelect();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }

  getData(good: IGood) {
    const data = [good].map(clasi => {
      return {
        ...clasi,
        info: `${clasi.id} - ${clasi.description}`,
      };
    });
    console.log('DESDE el SELECT **********', data);
    this.goods = new DefaultSelect(data, data.length);
    //this.form.get('noBien').setValue(good.id);
  }

  concatenarEtiquetas(data: any): string {
    return `${data.id} - ${data.descripcion}`;
  }
}
