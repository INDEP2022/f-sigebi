import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-review-technical-sheets',
  templateUrl: './review-technical-sheets.component.html',
  styles: [],
})
export class ReviewTechnicalSheetsComponent extends BasePage implements OnInit {
  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      initDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      proceedingsSiab: [null, [Validators.required]],
      initAct: [null, [Validators.required]],
      endAct: [null, [Validators.required]],
      userUploadAct: [null, [Validators.required]],
      regCoordination: [null, [Validators.required]],
      transf: [null, [Validators.required]],
      issuing: [null, [Validators.required]],
      authority: [null, [Validators.required]],
    });
  }

  onSubmit() {}

  settingsChange(event: any) {
    this.settings = event;
  }
}
