import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-generation-files-opinion',
  templateUrl: './generation-files-opinion.component.html',
  styles: [],
})
export class GenerationFilesOpinionComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;

  get numberFlyer() {
    return this.form.get('numberFlyer');
  }
  get numberFile() {
    return this.form.get('numberFile');
  }
  get numberOpinion() {
    return this.form.get('numberOpinion');
  }
  get typeDictamination() {
    return this.form.get('typeDictamination');
  }
  get dateDictamination() {
    return this.form.get('dateDictamination');
  }
  get status() {
    return this.form.get('status');
  }
  get keyOficcioArmy() {
    return this.form.get('keyOficcioArmy');
  }
  get dateInstructor() {
    return this.form.get('dateInstructor');
  }
  get userDictates() {
    return this.form.get('userDictates');
  }

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      numberFlyer: [null, [Validators.required]],
      numberFile: [null, [Validators.required]],
      numberOpinion: [null, [Validators.required]],
      typeDictamination: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dateDictamination: [null, [Validators.required]],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      keyOficcioArmy: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      dateInstructor: [null, [Validators.required]],
      userDictates: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  generateReportFile() {}
}
