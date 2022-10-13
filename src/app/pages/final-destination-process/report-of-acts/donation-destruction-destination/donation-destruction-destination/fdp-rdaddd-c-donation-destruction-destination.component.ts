import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';
import { FdpAdpdtDetailDelegationsComponent } from '../../../third-party-possession-acts/detail-delegations/fdp-adpdt-detail-delegations.component';
import { DELEGATIONS_COLUMNS } from './../../delegations-columns';
import { SUBDELEGATIONS_COLUMNS } from '../../sub-delegations-columns';

@Component({
  selector: 'app-fdp-rdaddd-c-donation-destruction-destination',
  templateUrl: './fdp-rdaddd-c-donation-destruction-destination.component.html',
  styles: [
  ]
})
export class FdpRdadddCDonationDestructionDestinationComponent implements OnInit {
  actForm: FormGroup;
  bsModalRef?: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
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
      eventEndDate: [null, []]
    });
  }

  onSubmit(){

  }

  onClick(){
  }

  openModal( title: string, columns: string ){
    const initialState: ModalOptions = {
      initialState: {
        title,
        columns: columns === 'DELEGATIONS-COLUMNS'? DELEGATIONS_COLUMNS: SUBDELEGATIONS_COLUMNS
      }
    };
    this.bsModalRef = this.modalService.show(FdpAdpdtDetailDelegationsComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
