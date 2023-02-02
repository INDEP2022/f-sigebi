import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-show-programming',
  templateUrl: './show-programming.component.html',
  styles: [],
})
export class ShowProgrammingComponent extends BasePage implements OnInit {
  constructor(
    private modalService: BsModalService,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {}

  signReport(signReport?: Event) {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
