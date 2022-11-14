import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-c-p-mpm-c-maintenance-of-public-ministries',
  templateUrl: './c-p-mpm-c-maintenance-of-public-ministries.component.html',
  styles: [],
})
export class CPMpmCMaintenanceOfPublicMinistriesComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
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
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      dateInitRatification: [null, [Validators.required]],
      dateFinish: [null, [Validators.required]],
      ofFile: [null, [Validators.required]],
      atFile: [null, [Validators.required]],
      ofgood: [null, [Validators.required]],
      atgood: [null, [Validators.required]],
      city: [null, [Validators.required]],
    });
  }
  saved() {}
}
