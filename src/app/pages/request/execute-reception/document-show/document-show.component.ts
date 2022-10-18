import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-document-show',
  templateUrl: './document-show.component.html',
  styles: [
  ]
})
export class DocumentShowComponent extends BasePage implements OnInit {

  constructor(private modalRef: BsModalRef) { 
    super();
  }

  ngOnInit(): void {
  }
  
  close(){
    this.modalRef.hide();
  }
}
