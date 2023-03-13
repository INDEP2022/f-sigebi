import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-generate-excel-file',
  templateUrl: './generate-excel-file.component.html',
  styles: [],
})
export class GenerateExcelFileComponent implements OnInit {
  generateExcelFileForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.generateExcelFileForm = this.fb.group({
      delegationReceives: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegationAdministrator: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      type: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      area: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      initialDate: [null, Validators.required],
      finalDate: [null, Validators.required],
      nameFileExcel: [null, Validators.required],
    });
  }
}
