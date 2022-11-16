import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from '../../../../../core/interfaces/model-form';

@Component({
  selector: 'app-annex-k-form',
  templateUrl: './annex-k-form.component.html',
  styleUrls: ['./annex-k-form.component.scss'],
})
export class AnnexKFormComponent implements OnInit {
  detailForm: ModelForm<any>;
  dataUser: ModelForm<any>;
  detailAnnex: ModelForm<any>;

  constructor(private fb: FormBuilder, private bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.initDetailForm();
  }

  initDetailForm(): void {
    this.detailForm = this.fb.group({
      name: [null],
      position: [null],
      typeSign: [null],
    });
  }

  save(): void {}

  close(): void {
    this.bsModalRef.hide();
  }
}
