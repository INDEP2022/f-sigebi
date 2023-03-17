import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-transferors-detail',
  templateUrl: './transferors-detail.component.html',
  styles: [],
})
export class TransferorsDetailComponent extends BasePage implements OnInit {
  title: string = 'Transferente por estado';
  edit: boolean = false;

  transferorsStateForm: ModelForm<ITransferente>;
  transferorsState: ITransferente;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.transferorsStateForm = this.fb.group({
      id: [null, []],
      keyTransferent: [null, []],
      nameTransferent: [null, []],
      typeTransferent: [null, []],
    });
    if (this.transferorsState != null) {
      this.edit = true;
      this.transferorsStateForm.patchValue(this.transferorsState);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
