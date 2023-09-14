import { Component } from '@angular/core';
import { CharacteristicEditorCell } from 'src/app/core/models/good/good-characteristic';
import { ChangeOfGoodCharacteristicService } from '../../services/change-of-good-classification.service';

@Component({
  selector: 'app-characteristic-good-cell',
  templateUrl: './characteristic-good-cell.component.html',
  styleUrls: ['./characteristic-good-cell.component.scss'],
})
export class CharacteristicGoodCellComponent extends CharacteristicEditorCell {
  // disabledTable = false;
  constructor(protected override service: ChangeOfGoodCharacteristicService) {
    super(service);
  }
}
