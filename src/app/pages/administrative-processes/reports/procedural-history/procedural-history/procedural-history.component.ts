import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';

@Component({
  selector: 'app-procedural-history',
  templateUrl: './procedural-history.component.html',
  styles: [
  ]
})
export class ProceduralHistoryComponent implements OnInit {
  proceduralHistoryForm: ModelForm<any>;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.proceduralHistoryForm = this.fb.group({
      delegation: [null, Validators.required],
      subdelegation: [null, Validators.required],
      modificationDateOf: [null, Validators.required],
      modificationDateTo: [null, Validators.required],
      ofTheGood: [null, Validators.required],
      toGood: [null, Validators.required],
      users: [null, Validators.required],
    });
  }
}
