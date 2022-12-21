import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
      relevantFacts: [null, [Validators.pattern(STRING_PATTERN)]],
      noncomplianceDescription: [null, [Validators.pattern(STRING_PATTERN)]],
      datenoncompliance: [null],
      agreements: [null, [Validators.pattern(STRING_PATTERN)]],
      dateRepositionServices: [null],
      warehouseManagement: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }
}
