import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, tap, throwError } from 'rxjs';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';

import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-approval-delegation',
  templateUrl: './approval-delegation.component.html',
  styles: [
    `
      .bg-gray {
        background-color: #eee !important;
      }
    `,
  ],
})
export class ApprovalDelegationComponent extends BasePage implements OnInit {
  frmArea: FormGroup;

  @Output() onSave = new EventEmitter<any>();

  //no_Delegation_2: number = -1;
  area_d: number = -1;

  //Dlegations data
  delegations$ = new DefaultSelect<IDelegation>();
  //Id selected
  idDelegation: number = -1;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private delegationService: DelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  async initForm() {
    this.frmArea = this.fb.group({
      no_Delegation_2: [null, Validators.required],
    });
  }

  getDels($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    const area = this.frmArea.controls['no_Delegation_2'].value;
    params.search = $params.text;
    this.getDelegations(params).subscribe();
  }
  getDelegations(params: FilterParams) {
    return this.delegationService.getAll(params.getParams()).pipe(
      catchError(error => {
        this.delegations$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        if (response.count > 0) {
          const name = this.frmArea.get('no_Delegation_2').value;
          const data = response.data.filter(m => {
            return m.id == name;
          });
          this.frmArea.get('no_Delegation_2').patchValue(data[0]);
        }
        this.delegations$ = new DefaultSelect(response.data, response.count);
      })
    );
  }
  updateSelectedIds(event: any) {
    if (this.frmArea && this.frmArea.get('no_Delegation_2')) {
      this.idDelegation = this.frmArea.get('no_Delegation_2').value;
    }
    console.log('Area selected::' + this.idDelegation);
  }

  onSaveDelegation() {
    const name = this.frmArea.get('no_Delegation_2').value;
    if (name == -1 || name == null) {
      this.alert(
        'warning',
        'Para continuar, es necesario seleccionar una &aacute;rea.',
        ''
      );
      return;
    } else {
      this.onSave.emit(name);
      this.modalRef.hide();
    }
  }

  return() {
    this.modalRef.hide();
  }
}
