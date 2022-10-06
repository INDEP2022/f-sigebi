import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styles: [
  ]
})
export class PasswordModalComponent implements OnInit {

  title: string;
  password: string;
  constructor(protected modalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  close() {
    this.modalRef.hide();
  }
  submit() {
   // this.dialogRef.close(this.password);
  }

  generatePaswword() {
    var pass = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      'abcdefghijklmnopqrstuvwxyz0123456789@#$';
    for (let i = 1; i <= 8; i++) {
      var char = Math.floor(Math.random()
        * str.length + 1);
      pass += str.charAt(char)
    }
    this.password = pass;
  }

}
