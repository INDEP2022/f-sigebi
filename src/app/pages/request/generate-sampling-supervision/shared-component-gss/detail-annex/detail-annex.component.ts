import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from '../../../../../core/interfaces/model-form';

@Component({
  selector: 'app-detail-annex',
  templateUrl: './detail-annex.component.html',
  styles: [],
})
export class DetailAnnexComponent implements OnInit {
  @Input() annexData: any;
  @Input() idSample: number = 0;
  dataForm: ModelForm<any>;
  isReadOnly: boolean = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('idSample desde detalle anexo', this.idSample);
    this.initForm();
  }

  initForm(): void {
    this.dataForm = this.fb.group({
      warehouseManager: [null],
      relevantFacts: [null],
      dateReposition: [null],
      dateNoncompliance: [null],
      agreeds: [null],
      descriptionNoncompliance: [null],
    });
  }
}
