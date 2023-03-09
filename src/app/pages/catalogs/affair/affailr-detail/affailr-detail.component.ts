import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-affailr-detail',
  templateUrl: './affailr-detail.component.html',
  styles: [],
})
export class AffailrDetailComponent extends BasePage implements OnInit {
  affairForm: ModelForm<IAffair>;
  affair: IAffair;

  title: string = 'Asunto';
  edit: boolean = false;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.affairForm = this.fb.group({
      id: [null, []],
      description: [null, []],
      processDetonate: [null, []],
    });
    if (this.affair != null) {
      this.edit = true;
      this.affairForm.patchValue(this.affair);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
