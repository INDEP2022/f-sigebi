import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_LAWYERS } from '../jp-d-t-c-trials/columns';

@Component({
  selector: 'app-jp-d-t-c-lawyers-set',
  templateUrl: './jp-d-t-c-lawyers-set.component.html',
  styles: [],
})
export class JpDTCLawyersSetComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any[];

  formLawyers: FormGroup;

  get office() {
    return this.formLawyers.get('office');
  }
  get descriptionOffice() {
    return this.formLawyers.get('descriptionOffice');
  }
  get expectations() {
    return this.formLawyers.get('expectations');
  }
  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = COLUMNS_LAWYERS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.buildFormLawyers();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildFormLawyers() {
    this.formLawyers = this.fb.group({
      office: [null, [Validators.required]],
      descriptionOffice: [null, [Validators.required]],
      expectations: [null, [Validators.required]],
    });
  }
}
