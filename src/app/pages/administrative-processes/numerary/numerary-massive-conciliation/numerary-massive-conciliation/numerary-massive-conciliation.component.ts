import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMERARY_MASSIVE_CONCILIATION_COLUMNS,
  NUMERARY_MASSIVE_CONCILIATION_COLUMNS2,
} from './numerary-massive-conciliation-columns';

@Component({
  selector: 'app-numerary-massive-conciliation',
  templateUrl: './numerary-massive-conciliation.component.html',
  styles: [],
})
export class NumeraryMassiveConciliationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  form2: FormGroup;

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columnFilters: any = [];

  public override settings: any = {
    columns: NUMERARY_MASSIVE_CONCILIATION_COLUMNS,
    hideSubHeader: false,
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
  };

  public settings2: any = {
    columns: NUMERARY_MASSIVE_CONCILIATION_COLUMNS2,
    hideSubHeader: false,
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
  };

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.prepareForm();
    this.prepareForm2();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      dateTesofe: [null, Validators.nullValidator],
      dateOf: [null, Validators.nullValidator],
      dateAt: [null, Validators.nullValidator],
    });
  }

  private prepareForm2(): void {
    this.form2 = this.fb.group({
      bank: [null, Validators.nullValidator],
      bankAccount: [null, Validators.nullValidator],
      deposit: [null, Validators.nullValidator],
      current: [null, Validators.nullValidator],
    });
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareForm2();
  }

  openModal() {
    const modalConfig = MODAL_CONFIG;
    console.log('modal');
  }
}
