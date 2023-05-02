import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IAppraisersGood } from 'src/app/core/models/good/good.model';
@Component({
  selector: 'app-appraisal-history',
  templateUrl: './appraisal-history.component.html',
  styles: [],
})
export class AppraisalHistoryComponent implements OnInit {
  loading: boolean = false;
  parentModal: string;
  appraisalData: IAppraisersGood[];

  @Output() refresh = new EventEmitter<true>();

  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }
}
