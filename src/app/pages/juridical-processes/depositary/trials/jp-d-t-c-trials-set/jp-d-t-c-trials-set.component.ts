import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-jp-d-t-c-trials-set',
  templateUrl: './jp-d-t-c-trials-set.component.html',
  styles: [],
})
export class JpDTCTrialsSetComponent extends BasePage implements OnInit {
  formTrials: FormGroup;

  get numberGood() {
    return this.formTrials.get('numberGood');
  }
  get descriptionGood() {
    return this.formTrials.get('descriptionGood');
  }
  get statusGood() {
    return this.formTrials.get('statusGood');
  }
  get fileGood() {
    return this.formTrials.get('fileGood');
  }
  get procedure() {
    return this.formTrials.get('procedure');
  }
  get numberFileReal() {
    return this.formTrials.get('numberFileReal');
  }
  get description() {
    return this.formTrials.get('description');
  }
  get author1() {
    return this.formTrials.get('author1');
  }
  get author2() {
    return this.formTrials.get('author2');
  }
  get site() {
    return this.formTrials.get('site');
  }
  get authority() {
    return this.formTrials.get('authority');
  }
  get nameAuthority() {
    return this.formTrials.get('nameAuthority');
  }
  get startDate() {
    return this.formTrials.get('startDate');
  }
  get endDate() {
    return this.formTrials.get('endDate');
  }
  get observing() {
    return this.formTrials.get('observing');
  }
  get lastUpdateDate() {
    return this.formTrials.get('lastUpdateDate');
  }
  get lastUpdate() {
    return this.formTrials.get('lastUpdate');
  }
  get nextUpdateDate() {
    return this.formTrials.get('nextUpdateDate');
  }
  get nextUpdate() {
    return this.formTrials.get('observing');
  }
  get date() {
    return this.formTrials.get('date');
  }
  get sentido() {
    return this.formTrials.get('sentido');
  }
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.buildFormTrials();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildFormTrials() {
    this.formTrials = this.fb.group({
      numberGood: [null, [Validators.required]],
      descriptionGood: [null, [Validators.required]],
      statusGood: [null, [Validators.required]],
      fileGood: [null, [Validators.required]],
      procedure: [null, [Validators.required]],
      numberFileReal: [null, [Validators.required]],
      description: [null, [Validators.required]],
      author1: [null, [Validators.required]],
      author2: [null, [Validators.required]],
      site: [null, [Validators.required]],
      authority: [null, [Validators.required]],
      nameAuthority: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      observing: [null, [Validators.required]],
      lastUpdateDate: [null, [Validators.required]],
      lastUpdate: [null, [Validators.required]],
      nextUpdateDate: [null, [Validators.required]],
      nextUpdate: [null, [Validators.required]],
      date: [null, [Validators.required]],
      sentido: [null, [Validators.required]],
    });
  }
}
