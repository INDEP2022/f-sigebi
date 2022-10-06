import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AbstractControl, FormGroup } from "@angular/forms";
//Rxjs
import { BehaviorSubject, takeUntil } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';

@Component({
  selector: 'app-delegation-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './delegation-shared.component.html',
  styles: [
  ]
})
export class DelegationSharedComponent extends BasePage implements OnInit {

  @Input() form: FormGroup;
  @Input() delegationField: string = "delegation";
  @Input() subdelegationField: string = "subdelegation";

  @Input() showSubdelegation: boolean = true;
  @Input() showDelegation: boolean = true;

  params = new BehaviorSubject<ListParams>(new ListParams());
  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();

  get delegation() {return this.form.get(this.delegationField);}
  get subdelegation() {return this.form.get(this.subdelegationField);}

  constructor(
    private service: DelegationService,
    private serviceSubDeleg: SubdelegationService){
    super();
  }

  ngOnInit(): void {
  }

  getDelegations(params: ListParams) { 
    this.service.getAll(params).subscribe(data => {
        this.delegations = new DefaultSelect(data.data,data.count);
    },err => {
      let error = '';
      if (err.status === 0) {
        error = 'Revise su conexión de Internet.';
      } else {
        error = err.message;
      }
      this.onLoadToast('error', 'Error', error);

    }, () => {});
  }

  getSubDelegations(params: ListParams) {
    this.serviceSubDeleg.getAll(params).subscribe(
      (data: any) => {
        this.subdelegations = new DefaultSelect(data.data,data.count);
      },err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);

      }, () => {});
  }

  onDelegationsChange(type: any) {
    this.resetFields([this.subdelegation]);
    this.subdelegations = new DefaultSelect();
  }

  onSubDelegationsChange(subdelegation: any) {
    this.resetFields([this.delegation]);
    this.delegations = new DefaultSelect();
    // this.delegations = new DefaultSelect([subdelegation.delegation], 1);
    // this.delegation.setValue(subdelegation.delegation.id);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach((field) => {
      //field.setValue(null);
      field=null;
    });
    this.form.updateValueAndValidity();
  }

}
