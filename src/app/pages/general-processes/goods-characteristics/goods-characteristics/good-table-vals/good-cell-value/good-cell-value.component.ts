import { Component, OnInit } from '@angular/core';
import { CharacteristicEditorCell } from 'src/app/core/models/good/good-characteristic';
import { GoodsCharacteristicsService } from '../../../services/goods-characteristics.service';

@Component({
  selector: 'app-good-cell-value',
  templateUrl: './good-cell-value.component.html',
  styleUrls: [
    './good-cell-value.component.scss',
    '../../characteristics-legend/characteristics-legend.component.scss',
  ],
})
export class GoodCharacteristicCellValueComponent
  extends CharacteristicEditorCell
  implements OnInit
{
  constructor(protected override service: GoodsCharacteristicsService) {
    super(service);
  }

  ngOnInit() {
    // console.log(this.value);
  }
}
