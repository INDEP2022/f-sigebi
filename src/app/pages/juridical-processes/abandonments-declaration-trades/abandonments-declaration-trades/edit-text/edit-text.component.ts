import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
// import { GoodService } from 'src/app/core/services/good/good.service';

import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-edit-text',
  templateUrl: './edit-text.component.html',
  styles: [],
})
export class EditTextComponent extends BasePage implements OnInit {
  string_PTRN: `[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]*'; [a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]`;
  @Output() refresh = new EventEmitter<true>();
  @Output() dataText = new EventEmitter<any>();
  dataEdit: any;
  filterText: string;
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(): void {
    this.form = this.fb.group({
      editText: [this.dataEdit],
    });
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    const data = {
      filterText: this.filterText,
      data: this.form.get('editText').value,
    };

    this.loading = false;
    // this.refresh.emit(true);
    this.dataText.emit(data);
    this.modalRef.hide();
  }
}
