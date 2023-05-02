import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from '../../../../../core/interfaces/model-form';

@Component({
  selector: 'app-sampling-detail',
  templateUrl: './sampling-detail.component.html',
  styleUrls: ['./sampling-detail.component.scss'],
})
export class SamplingDetailComponent implements OnInit {
  detailForm: ModelForm<any>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.detailForm = this.fb.group({
      noSampling: ['10025'],
      nameWarehouse: [
        'ALMACÉN DE CONTRATO SAE/001425 (DELEGACIÓN REGIONAL METROPOLITANA)',
      ],
      warehouseAddress: [null],
      delegaRegional: [null],
      initialDate: [null],
      finalDate: [null],
      dateSampling: ['17/10/2022'],
    });
  }
}
