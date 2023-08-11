import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IMeasureUnit } from 'src/app/core/models/catalogs/generic.model';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared';
import { RequestHelperService } from 'src/app/pages/request/request-helper-services/request-helper.service';

@Component({
  selector: 'app-measure-unit-sae-input',
  templateUrl: './measure-unit-sae-input.component.html',
  styles: [],
})
export class MeasureUnitSaeInputComponent
  extends BasePage
  implements ViewCell, OnInit
{
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() input: EventEmitter<any> = new EventEmitter();
  isreadOnly: boolean = false;
  measureUnits: IMeasureUnit[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  private requestHelperService = inject(RequestHelperService);
  constructor(private goodsQueryService: GoodsQueryService) {
    super();
  }

  ngOnInit(): void {
    this.requestHelperService.currentReadOnly.subscribe({
      next: resp => {
        this.isreadOnly = resp;
      },
    });
    this.getUnitMeasure();
  }

  getUnitMeasure() {
    this.params.getValue()['filter.measureTlUnit'] = `$ilike:${
      this.params.getValue().text
    }`;
    this.params.getValue().limit = 20;
    this.goodsQueryService
      .getCatMeasureUnitView(this.params.getValue())
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          this.measureUnits = resp.data;
        },
        error: error => {},
      });
  }

  onKeyUp(event: any) {
    let text = event.target.value;
    this.input.emit({ data: this.rowData, text: text });
  }
}
