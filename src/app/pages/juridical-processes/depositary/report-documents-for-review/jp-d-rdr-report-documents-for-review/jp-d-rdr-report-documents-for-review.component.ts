import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-jp-d-rdr-report-documents-for-review',
  templateUrl: './jp-d-rdr-report-documents-for-review.component.html',
  styles: [],
})
export class JpDRdrReportDocumentsForReviewComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;

  get delegationNumber() {
    return this.form.get('delegationNumber');
  }
  get param1() {
    return this.form.get('param1');
  }
  get subdelegationNumber() {
    return this.form.get('subdelegationNumber');
  }
  get param2() {
    return this.form.get('param2');
  }
  get file() {
    return this.form.get('file');
  }
  get at() {
    return this.form.get('at');
  }

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
      delegationNumber: [null, [Validators.required]],
      param1: [null, [Validators.required]],
      subdelegationNumber: [null, [Validators.required]],
      param2: [null, [Validators.required]],
      file: [null, [Validators.required]],
      at: [null, [Validators.required]],
    });
  }

  print() {}
}
