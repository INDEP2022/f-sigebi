import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-procedural-history',
  templateUrl: './procedural-history.component.html',
  styles: [],
})
export class ProceduralHistoryComponent implements OnInit {
  proceduralHistoryForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.proceduralHistoryForm = this.fb.group({
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subdelegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      modificationDateOf: [null, Validators.required],
      modificationDateTo: [null, Validators.required],
      ofTheGood: [null, Validators.required],
      toGood: [null, Validators.required],
      users: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }
}
