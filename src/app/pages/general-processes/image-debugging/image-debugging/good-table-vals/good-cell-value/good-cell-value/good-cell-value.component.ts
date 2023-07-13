import { Component, OnInit } from '@angular/core';
import { CharacteristicEditorCell } from 'src/app/core/models/good/good-characteristic';
import { secondFormatDate } from 'src/app/shared/utils/date';
import { GoodsPhotoService } from '../../../../services/image-debugging-service';

@Component({
  selector: 'app-good-cell-value',
  templateUrl: './good-cell-value.component.html',
  styleUrls: ['./good-cell-value.component.scss'],
})
export class GoodCharacteristicCellValueComponent
  extends CharacteristicEditorCell
  implements OnInit
{
  constructor(private service: GoodsPhotoService) {
    super();
  }

  get disabledTable() {
    return this.service.disabledTable;
  }

  updateDate(value: any) {
    console.log(value, secondFormatDate(value));
    this.service.data.forEach(x => {
      if (x.column === this.row.column) {
        x.value = secondFormatDate(value);
      }
    });
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

  ngOnInit() {
    // console.log(this.value);
  }
}
