import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from '../../../../../core/interfaces/model-form';

@Component({
  selector: 'app-annex-data',
  templateUrl: './annex-data.component.html',
  styles: [],
})
export class AnnexDataComponent implements OnInit {
  @Input() dataAnnex: any;
  annexForm: ModelForm<any>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.annexForm = this.fb.group({
      relevantFacts: [null],
      noncomplianceDescription: [null],
      datenoncompliance: [null],
      agreements: [null],
      dateRepositionServices: [null],
      warehouseManagement: [null],
    });
  }
}
