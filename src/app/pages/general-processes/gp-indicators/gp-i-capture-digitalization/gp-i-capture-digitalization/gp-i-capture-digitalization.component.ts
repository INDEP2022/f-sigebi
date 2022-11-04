import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_COLUNNS,
  GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_DATA,
} from './capture-digitalization-columns';

@Component({
  selector: 'app-gp-i-capture-digitalization',
  templateUrl: './gp-i-capture-digitalization.component.html',
  styles: [],
})
export class GpICaptureDigitalizationComponent
  extends BasePage
  implements OnInit
{
  data = GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_DATA;

  constructor(private fb: FormBuilder) {
    super();
    this.settings.actions = false;
    this.settings.columns = GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_COLUNNS;
  }

  ngOnInit(): void {}
}
