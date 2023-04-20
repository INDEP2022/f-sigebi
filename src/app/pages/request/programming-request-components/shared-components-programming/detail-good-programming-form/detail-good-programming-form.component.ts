import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IGoodInfo } from 'src/app/core/models/good-programming/good-programming';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-detail-good-programming-form',
  templateUrl: './detail-good-programming-form.component.html',
  styles: [],
})
export class DetailGoodProgrammingFormComponent
  extends BasePage
  implements OnInit
{
  item: IGoodInfo;
  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.changeGoodinfo();
  }

  changeGoodinfo() {
    if (this.item.physicalStatus == 1) this.item.physicalStatus = 'BUENO';
    if (this.item.physicalStatus == 2) this.item.physicalStatus = 'MALO';
  }

  close() {
    this.modalRef.hide();
  }
}
