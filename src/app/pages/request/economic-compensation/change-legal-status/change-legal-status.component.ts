import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { DELEGATION_COLUMNS_REPORT } from '../../../../../app/pages/siab-web/commercialization/report-unsold-goods/report-unsold-goods/columns';

@Component({
  selector: 'app-change-legal-status',
  templateUrl: './change-legal-status.component.html',
  styles: [],
})
export class ChangeLegalStatusComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
    this.settingsTwo = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...DELEGATION_COLUMNS_REPORT },
    };
  }

  @Input() isDelegationsVisible: boolean = true;

  isJuridicVisible: boolean = true;
  isSelected: boolean = false;

  settingsTwo: any;
  dataThree: LocalDataSource = new LocalDataSource();
  dataCheckDelegation: any[] = [];
  paramsDelegation = new BehaviorSubject(new ListParams());
  totalItemsDelegation: number = 0;

  ngOnInit(): void {
    if (this.isDelegationsVisible) {
      this.isJuridicVisible = false;
    }

    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      corporate: [null, [Validators.required]],
      executive: [null, [Validators.required]],
      receiver: [null, [Validators.required]],
      position: [null, [Validators.required]],
      affair: [null, [Validators.required]],
      protection: [null, [Validators.required]],
      justify: [null, [Validators.required]],
      dateProvide: [null, [Validators.required]],
      orderProvide: [null, [Validators.required]],
      status: [null, [Validators.required]],
      signed: [null],
    });
    if (this.allotment != null) {
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }

  checkAcceptDelegations(event: any) {
    if (event.isSelected) {
      this.dataCheckDelegation.push(event);
    } else {
      this.dataCheckDelegation = this.removeRow(
        this.dataCheckDelegation,
        event,
        'id'
      );
    }
  }

  removeRow(array: any[], register: any, id: any) {
    console.log('El array aca abajo: ', array[0]?.data);
    return array.filter(item => item?.data[id] !== register?.data[id]);
  }

  close() {
    this.modalRef.hide();
  }
}
