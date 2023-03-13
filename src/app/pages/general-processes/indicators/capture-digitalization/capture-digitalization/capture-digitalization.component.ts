import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_COLUNNS,
  GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_DATA,
} from './capture-digitalization-columns';

@Component({
  selector: 'app-capture-digitalization',
  templateUrl: './capture-digitalization.component.html',
  styles: [],
})
export class CaptureDigitalizationComponent extends BasePage implements OnInit {
  data = GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_DATA;

  constructor(private fb: FormBuilder) {
    super();
    this.settings.actions = false;
    this.settings.columns = GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_COLUNNS;
  }

  ngOnInit(): void {}
}
