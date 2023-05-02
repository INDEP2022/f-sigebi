import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DELEGATIONS_COLUMNS } from '../../report-of-acts/delegations-columns';
import { DetailDelegationsComponent } from '../detail-delegations/detail-delegations.component';
import { SUBDELEGATIONS_COLUMNS } from './../../report-of-acts/sub-delegations-columns';

@Component({
  selector: 'app-impression-of-acts',
  templateUrl: './impression-of-acts.component.html',
  styles: [],
})
export class ImpressionOfActsComponent implements OnInit {
  @Input() title: string;
  @Input() labelDate1: string;
  @Input() labelDate2: string;
  @Input() father: string;
  @Input() labelDelegation1: string;
  @Input() labelDelegation2: string;
  @Input() labelDescripDelegation1: string;
  @Input() labelDescripDelegation2: string;
  actForm: FormGroup;
  bsModalRef?: BsModalRef;

  constructor(private fb: FormBuilder, private modalService: BsModalService) {}

  ngOnInit(): void {
    this.initForm();
    console.log(this.labelDate2);
  }

  initForm() {
    this.actForm = this.fb.group({
      delegation: [null, []],
      descripDelegation: [null, []],
      subDelegation: [null, []],
      descripSubDelegation: [null, []],
      initExpedient: [null, []],
      finalExpedient: [null, []],
      statusAct: [null, []],
      typeAct: [null, []],
      eventStartDate: [null, []],
      eventEndDate: [null, []],
    });
  }

  onSubmit() {}

  openModal(title: string, columns: string) {
    const initialState: ModalOptions = {
      initialState: {
        title,
        columns:
          columns === 'DELEGATIONS-COLUMNS'
            ? DELEGATIONS_COLUMNS
            : SUBDELEGATIONS_COLUMNS,
      },
    };
    this.bsModalRef = this.modalService.show(
      DetailDelegationsComponent,
      initialState
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
