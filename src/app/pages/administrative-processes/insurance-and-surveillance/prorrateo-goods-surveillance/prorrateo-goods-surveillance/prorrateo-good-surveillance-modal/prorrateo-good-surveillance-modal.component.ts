import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IPolicyXBien } from 'src/app/core/models/ms-policy/policy.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { PolicyService } from 'src/app/core/services/ms-policy/policy.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-prorrateo-good-surveillance-modal',
  templateUrl: './prorrateo-good-surveillance-modal.component.html',
  styles: [],
})
export class ProrrateoGoodSurveillanceModalComponent
  extends BasePage
  implements OnInit
{
  selectedRow: IPolicyXBien;
  form: FormGroup;
  newOrEdit: boolean;
  data: any;
  keyA: any;
  dateIni: any;
  id: number;
  title = 'bien';
  user: any;
  constructor(
    private fb: FormBuilder,
    private modal: BsModalRef,
    private usersService: UsersService,
    private policyService: PolicyService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('id: ', this.id);
    this.prepareForm();
    this.newOrEdit;
    if (this.newOrEdit) {
      const start = this.data.shortDate;
      const formattedstart = this.formatDate(start);
      this.form.patchValue({
        noGood: this.data.goodNumberId,
        description: this.data.description,
        sumAssured: this.data.additionInsured,
        premiumAmount: this.data.amountCousin,
        location: this.data.location,
        shortDate: formattedstart,
        statusGood: this.data.statusGood,
        factorCostDaily: this.data.factorCostDaily,
        amountNoteCredit: this.data.amountNoteCredit,
        responsibleShort: this.data.responsibleShort,
      });
    }
  }

  users$ = new DefaultSelect<ISegUsers>();

  filterForm: FormGroup = this.fb.group({
    user: [null],
  });

  close() {
    this.modal.hide();
  }

  formatDate(inputDate: string): string {
    if (!inputDate) {
      return '';
    }
    const dateParts = inputDate.split('-');
    if (dateParts.length !== 3) {
      return '';
    }

    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];

    return `${year}/${month}/${day}`;
  }

  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.addFilter('name', $params.text, SearchFilter.LIKE);
    this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: data => {
        data.data.map(user => {
          user.userAndName = `${user.id}- ${user.name}`;
          this.user = user.name;
          user.id = user.id;
          return user;
        });

        this.users$ = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.users$ = new DefaultSelect();
      },
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      noGood: [null, Validators.required],
      sumAssured: [null, Validators.required],
      premiumAmount: [null, Validators.required],
      shortDate: [null],
      statusGood: [null, Validators.required],
      factorCostDaily: [null],
      amountNoteCredit: [null],
    });
  }
  confirm() {
    if (this.form.invalid) return;
    if (this.newOrEdit) {
      this.putGood();
    } else {
      this.insertGood();
    }
  }

  putGood() {
    this.newOrEdit = true;
    const model = {} as IPolicyXBien;
    model.goodNumberId = this.data.goodNumberId;
    model.id = this.id;
    model.additionInsured = this.form.get('sumAssured').value;
    model.amountCousin = this.form.get('premiumAmount').value;
    model.shortDate = this.form.get('shortDate').value;
    model.factorCostDaily = this.form.get('factorCostDaily').value;
    model.amountNoteCredit = this.form.get('amountNoteCredit').value;
    model.responsibleShort = this.user;
    model.policyKeyId = this.keyA;
    model.beginningDateId = this.dateIni;
    model.entryDate = new Date();
    this.policyService.putPolicyGood(model).subscribe({
      next: () => {
        this.handleSuccess();
        this.onLoadToast('success', 'Bien actualizado con exito', '');
      },
      error: error => {
        this.onLoadToast(
          'error',
          'Ha ocurrido un error, por favor intentelo de nuevo',
          ''
        );
      },
    });
  }

  handleSuccess() {
    this.modal.content.callback(true);
    this.modal.hide();
  }

  insertGood() {
    this.newOrEdit = false;
    const model = {} as IPolicyXBien;
    model.goodNumberId = this.form.get('noGood').value;
    model.id = this.id;
    model.additionInsured = this.form.get('sumAssured').value;
    model.amountCousin = this.form.get('premiumAmount').value;
    model.shortDate = this.form.get('shortDate').value;
    model.factorCostDaily = this.form.get('factorCostDaily').value;
    model.amountNoteCredit = this.form.get('amountNoteCredit').value;
    model.responsibleShort = this.user;
    model.policyKeyId = this.keyA;
    model.beginningDateId = String(this.dateIni);
    model.entryDate = new Date();
    console.log('MODEL: ', model);
    this.policyService.postPolicyGood(model).subscribe({
      next: () => {
        this.handleSuccess();
        this.onLoadToast('success', 'Bien creado con exito', '');
      },
      error: error => {
        this.onLoadToast(
          'error',
          'Ha ocurrido un error, por favor intentelo de nuevo',
          ''
        );
      },
    });
  }
}
