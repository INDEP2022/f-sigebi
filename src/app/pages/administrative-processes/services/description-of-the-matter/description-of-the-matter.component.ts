import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';

@Component({
  selector: 'app-description-of-the-matter',
  templateUrl: './description-of-the-matter.component.html',
  styles: [
  ]
})
export class DescriptionOfTheMatterComponent implements OnInit {
  descripcionOfTheMatterForm: ModelForm<any>;
  constructor(private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.descripcionOfTheMatterForm = this.fb.group({
      delegation: [null, Validators.required],
      subDelegation: [null, Validators.required],
      type: [null, Validators.required],
      subtype: [null, Validators.required],
      dateDe: [null, Validators.required],
      dateAl: [null, Validators.required],
    });
  }
}
