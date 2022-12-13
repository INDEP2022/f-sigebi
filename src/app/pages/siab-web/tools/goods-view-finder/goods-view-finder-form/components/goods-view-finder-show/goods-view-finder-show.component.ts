import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-goods-view-finder-show',
  templateUrl: './goods-view-finder-show.component.html',
  styles: [],
})
export class GoodsViewFinderShowComponent extends BasePage implements OnInit {
  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }
}
