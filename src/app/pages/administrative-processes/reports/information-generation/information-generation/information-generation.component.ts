import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';

@Component({
  selector: 'app-information-generation',
  templateUrl: './information-generation.component.html',
  styles: [],
})
export class InformationGenerationComponent implements OnInit {
  informationGenerationForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.informationGenerationForm = this.fb.group({
      dateDe: [null, Validators.required],
      dateA: [null, Validators.required],
    });
  }
}
