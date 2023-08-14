import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViewCell } from 'ng2-smart-table';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styles: [],
})
export class SelectInputComponent implements ViewCell, OnInit {
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() input: EventEmitter<any> = new EventEmitter();

  detailAssets: FormGroup = new FormGroup({});
  selectTansferUnitMeasure = new DefaultSelect();

  private goodsQueryService = inject(GoodsQueryService);
  private fb = inject(FormBuilder);

  constructor() {}

  ngOnInit(): void {
    this.detailAssets = this.fb.group({
      unitLigie: [null],
    });
    this.getTransferentUnit(new ListParams());
  }

  getTransferentUnit(params: ListParams) {
    params['filter.measureTlUnit'] = `$ilike:${params.text}`;
    this.goodsQueryService.getCatMeasureUnitView(params).subscribe({
      next: resp => {
        this.selectTansferUnitMeasure = new DefaultSelect(
          resp.data,
          resp.count
        );
      },
      error: error => {
        console.log(error);
      },
    });
  }

  chageUnit(event: any) {
    console.log(this.rowData);
    console.log(this.detailAssets.value);
    //this.input.emit()
  }
}
