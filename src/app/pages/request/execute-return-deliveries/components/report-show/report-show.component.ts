import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-report-show',
  templateUrl: './report-show.component.html',
  styles: [],
})
export class ReportShowComponent extends BasePage implements OnInit {
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {}

  chargeDocument(event: Event) {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
