import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-global-confirm',
  templateUrl: './global-confirm.component.html',
  styles: [],
})
export class GlobalConfirmComponent implements OnInit {
  title: string = '¿Estas seguro?';
  message: string = '';
  deleteMethod: Observable<any>;
  @Output() refresh = new EventEmitter<true>();

  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  confirm() {
    this.deleteMethod.subscribe((data) => this.handleSuccess());
  }

  handleSuccess() {
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
