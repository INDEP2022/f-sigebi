import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { RESUMEN_COLUMNS } from './resumen-columns';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styles: [],
})
export class ResumeComponent extends BasePage implements OnInit {
  form: FormGroup;
  resumens: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = RESUMEN_COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      order: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      amount: [null, Validators.required],
      iva: [null, Validators.required],
      total: [null, Validators.required],
      importe: [null],
      ivaa: [null],
      totals: [null],
    });
  }

  // save() {
  //   console.log(this.form.value);
  // }
}
