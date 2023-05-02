import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { SURVEILLANCE_CONCEPTS_COLUMNS } from './surveillance-concepts-columns';

@Component({
  selector: 'app-surveillance-concepts',
  templateUrl: './surveillance-concepts.component.html',
  styles: [],
})
export class SurveillanceConceptsComponent extends BasePage implements OnInit {
  form: FormGroup;

  concepts: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = SURVEILLANCE_CONCEPTS_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noContract: [null, Validators.required],
      provider: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      licitation: [null, Validators.required],
    });
  }
}
