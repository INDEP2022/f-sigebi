import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-reports-assets-declared-abandoned',
  templateUrl: './reports-assets-declared-abandoned.component.html',
  styles: [],
})
export class ReportsAssetsDeclaredAbandonedComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  /*   get numberDelegation() {
    return this.form.get('numberDelegation');
  }
  get delegationDescription() {
    return this.form.get('delegationDescription');
  }
  get numberSubdelegation() {
    return this.form.get('numberSubdelegation');
  }
  get delegationSubdelegation() {
    return this.form.get('delegationSubdelegation');
  }
  get dateInitRatification() {
    return this.form.get('dateInitRatification');
  }
  get dateFinish() {
    return this.form.get('dateFinish');
  }
  get ofFile() {
    return this.form.get('ofFile');
  }
  get atFile() {
    return this.form.get('atFile');
  }
  get capturingUser() {
    return this.form.get('capturingUser');
  } */
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
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      dateInitRatification: [null, [Validators.required]],
      dateFinish: [null, [Validators.required]],
      ofFile: [null, [Validators.required]],
      atFile: [null, [Validators.required]],
      ofgood: [null, [Validators.required]],
      atgood: [null, [Validators.required]],
      capturingUser: [null, [Validators.required]],
    });
  }

  confirm() {
    this.loading = true;
    //console.log(this.checkedListFA,this.checkedListFI)
    console.log(this.form.value);
    setTimeout((st: any) => {
      this.loading = false;
    }, 5000);
  }
}
