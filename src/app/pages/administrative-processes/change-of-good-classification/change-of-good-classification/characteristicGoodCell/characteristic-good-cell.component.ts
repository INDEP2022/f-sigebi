import { Component } from '@angular/core';
import { CharacteristicEditorCell } from 'src/app/core/models/good/good-characteristic';
import { secondFormatDate } from 'src/app/shared/utils/date';
import { ChangeOfGoodCharacteristicService } from '../../services/change-of-good-classification.service';

@Component({
  selector: 'app-characteristic-good-cell',
  templateUrl: './characteristic-good-cell.component.html',
  styleUrls: ['./characteristic-good-cell.component.scss'],
})
export class CharacteristicGoodCellComponent extends CharacteristicEditorCell {
  // disabledTable = false;
  constructor(private service: ChangeOfGoodCharacteristicService) {
    super();
  }
  updateDate(value: any) {
    console.log('Esta es la fila', this.row.column);
    console.log(value, secondFormatDate(value));
    this.service.data.forEach(x => {
      if (x.column === this.row.column) {
        x.value = secondFormatDate(value);
      }
    });
    console.log(this.service.data);
  }

  updateCell(value: any) {
    // console.log(value, this.value, this.isAddCat(value));
    if (!this.haveError(this.row)) {
      console.log(value);
      this.service.data.forEach(x => {
        if (x.column === this.row.column) {
          x.value = value;
        }
      });
    }
  }
}
