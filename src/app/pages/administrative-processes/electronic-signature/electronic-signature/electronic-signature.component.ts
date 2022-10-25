import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { ELECTRONICSIGNATURE_COLUMNS } from './electronic-signature-columns';

@Component({
  selector: 'app-electronic-signature',
  templateUrl: './electronic-signature.component.html',
  styles: [],
})
export class ElectronicSignatureComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  electronicSignatureForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: ELECTRONICSIGNATURE_COLUMNS,
    };
  }
  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.electronicSignatureForm = this.fb.group({
      noRecord: [null, Validators.required],
      noSteeringWheel: [null, Validators.required],
    });
  }
}
