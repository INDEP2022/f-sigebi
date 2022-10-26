import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-detail-assets-tab-component',
  templateUrl: './detail-assets-tab-component.component.html',
  styleUrls: ['./detail-assets-tab-component.component.scss'],
})
export class DetailAssetsTabComponentComponent implements OnInit {
  @Input() detailAssets: any;
  @Input() typeDoc: any;
  assetsForm: ModelForm<any>;
  selectSae = new DefaultSelect<any>();
  selectConservationState = new DefaultSelect<any>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    console.log('atributos de bienes');
    console.log(this.typeDoc);
  }

  initForm() {
    this.assetsForm = this.fb.group({
      sae: [null],
      physicalState: [null],
      conservationState: [null],
    });
  }

  getSae(event: any) {}

  getConservationState(event: any): void {}

  save(): void {
    console.log('guardar los atributos de bien');
  }
}
