import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-new-event-modal',
  templateUrl: './create-new-event-modal.component.html',
  styles: [
  ]
})
export class CreateNewEventModalComponent implements OnInit {
  
  form : FormGroup = new FormGroup({});

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(){
    this.form = this.fb.group(
      {
        id_event: [{value:null, disabled:true}],
        cve: ['', [Validators.required]],
        event: ['', [Validators.required]],
        place: ['', [Validators.required]],
        observ: ['', [Validators.required]],
        dateEvent: ['', [Validators.required]],
        dateClose: ['', [Validators.required]],
      })
  }

  close() {
    this.modalRef.hide();
  }

}
