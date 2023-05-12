import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SelectUnitModalComponent } from '../select-unit-modal/select-unit-modal.component';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
})
export class SelectInputComponent implements OnInit {
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() input: EventEmitter<any> = new EventEmitter();

  isreadOnly: boolean = false;
  bsModalRef: BsModalRef;

  constructor(private fb: FormBuilder, public modalService: BsModalService) {}

  ngOnInit(): void {
    this.initForm();
    //console.log(this.value, this.rowData);
    this.value = this.value != '' ? this.value : '__';
  }

  initForm() {}

  openModal() {
    this.openModalSelectUser();
  }

  openModalSelectUser() {
    let config: ModalOptions = {
      initialState: {
        good: this.rowData,
        callback: (next: boolean) => {
          //if (next) this.getExample();
        },
      },
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(SelectUnitModalComponent, config);
    this.bsModalRef.content.event.subscribe((res: any) => {
      this.input.emit(res);
    });
  }
}
