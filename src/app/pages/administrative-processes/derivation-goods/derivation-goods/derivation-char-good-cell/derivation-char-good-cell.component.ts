import { Component } from '@angular/core';
import { CharacteristicEditorCell } from 'src/app/core/models/good/good-characteristic';
import { DerivationGoodsService } from '../derivation-goods.service';

@Component({
  selector: 'app-derivation-char-good-cell',
  templateUrl: './derivation-char-good-cell.component.html',
  styleUrls: ['./derivation-char-good-cell.component.scss'],
})
export class DerivationCharGoodCellComponent extends CharacteristicEditorCell {
  // disabledTable = false;
  constructor(protected override service: DerivationGoodsService) {
    super(service);
  }
}
