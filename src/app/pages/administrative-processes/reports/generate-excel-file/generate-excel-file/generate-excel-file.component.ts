import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';

@Component({
  selector: 'app-generate-excel-file',
  templateUrl: './generate-excel-file.component.html',
  styles: [
  ]
})
export class GenerateExcelFileComponent implements OnInit {
  generateExcelFileForm: ModelForm<any>;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.generateExcelFileForm = this.fb.group({
      delegationReceives: [null, Validators.required],
      delegationAdministrator: [null, Validators.required],
      type: [null, Validators.required],
      area: [null, Validators.required],
      initialDate: [null, Validators.required],
      finalDate: [null, Validators.required],
      nameFileExcel: [null, Validators.required],
    });
  }
}
