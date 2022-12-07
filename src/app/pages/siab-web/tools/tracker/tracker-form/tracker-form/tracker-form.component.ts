import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { TRACKER_COLUMNS, TRACKER_IMMOVABLE_COLUMNS } from './tracker-columns';

@Component({
  selector: 'app-tracker-form',
  templateUrl: './tracker-form.component.html',
  styles: [],
})
export class TrackerFormComponent extends BasePage implements OnInit {
  movables: any[] = [];
  immovables: any[] = [];
  settingsImmovable = {
    ...this.settings,
    actions: false,
    selectMode: 'multi',
    columns: TRACKER_IMMOVABLE_COLUMNS,
  };
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: TRACKER_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      numberGood: [null],
      keyUniqueSat: [null],
      expedient: [null],
      fileUpload: [null],
      description: [null],
      assetClassificationNumber: [null],
      minute: [null],
      foreignOfficeNumber: [null],
      noCourt: [null],
      causePenal: [null],
      expTrans: [null],
      publicMinistry: [null],
      serialNumber: [null],
      noWheel: [null],
      touchPenalty: [null],
      prelimiaryInvestigation: [null],
      receptionStartDate: [null],
      receptionEndDate: [null],
    });
  }
}
