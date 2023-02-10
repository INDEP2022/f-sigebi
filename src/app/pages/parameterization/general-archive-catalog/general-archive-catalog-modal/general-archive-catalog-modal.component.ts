import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
//models
import { ISaveValue } from 'src/app/core/models/catalogs/save-value.model';
import { BasePage } from 'src/app/core/shared/base-page';
//services

@Component({
  selector: 'app-general-archive-catalog-modal',
  templateUrl: './general-archive-catalog-modal.component.html',
  styles: [],
})
export class GeneralArchiveCatalogModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Archivo General';
  edit: boolean = false;

  saveValueForm: ModelForm<ISaveValue>;
  saveValue: ISaveValue;
  form: FormGroup = new FormGroup({});

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm;
  }

  private prepareForm() {
    this.form = this.fb.group({
      description: [null, []],
    });
  }

  close() {
    this.modalRef.hide();
  }
}
