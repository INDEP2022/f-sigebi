import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-new-event-modal',
  templateUrl: './create-new-event-modal.component.html',
  styles: [
  ]
})
export class CreateNewEventModalComponent implements OnInit {

  constructor(private modalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  close() {
    this.modalRef.hide();
  }

}
