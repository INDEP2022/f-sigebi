import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-show-signature-programming',
  templateUrl: './show-signature-programming.component.html',
  styles: [
  ]
})
export class ShowSignatureProgrammingComponent implements OnInit {

  constructor(private modalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  AttachDocument(){
    this.modalRef.hide();
  }
}
