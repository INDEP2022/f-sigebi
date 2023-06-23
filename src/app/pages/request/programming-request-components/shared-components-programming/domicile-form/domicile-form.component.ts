import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IDomicileInfo } from 'src/app/core/models/good-programming/good-programming';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-domicile-form',
  templateUrl: './domicile-form.component.html',
  styles: [],
})
export class DomicileFormComponent extends BasePage implements OnInit {
  item: IDomicileInfo;
  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }
}
