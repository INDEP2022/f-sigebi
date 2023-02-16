import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IGoodProgrammingSelect } from 'src/app/core/models/good-programming/good-programming';
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
  item: IGoodProgrammingSelect;
  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    console.log('mostrar data', this.item);
  }

  close() {
    this.modalRef.hide();
  }
}
