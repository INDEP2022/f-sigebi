import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-documents-form',
  templateUrl: './view-documents-form.component.html',
  styles: [],
})
export class ViewDocumentsFormComponent implements OnInit {
  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }
}
