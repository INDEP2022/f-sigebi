import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
import { BehaviorSubject } from 'rxjs';
//Params
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';

@Component({
  selector: 'app-delegation-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './delegation-shared.component.html',
  styles: [],
})
export class DelegationSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() delegationField: string = 'delegation';
  @Input() subdelegationField: string = 'subdelegation';

  @Input() labelDelegation: string = 'Delegación';
  @Input() labelSubdelegation: string = 'Sub Delegación';

  @Input() showSubdelegation: boolean = true;
  @Input() showDelegation: boolean = true;
  @Output() emitSubdelegation = new EventEmitter<ISubdelegation>();
  @Output() emitDelegation = new EventEmitter<IDelegation>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();
  phaseEdo: number;

  get delegation() {
    return this.form.get(this.delegationField);
  }
  get subdelegation() {
    return this.form.get(this.subdelegationField);
  }

  constructor(
    private service: DelegationService,
    private serviceSubDeleg: SubdelegationService,
    private printFlyersService: PrintFlyersService,
    private render: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.showSubdelegation) {
      this.form.get(this.delegationField).valueChanges.subscribe(res => {
        const sfield = document.getElementById('sdele');
        if (res != null) {
          this.render.removeClass(sfield, 'disabled');
        } else {
          this.render.addClass(sfield, 'disabled');
          this.form.get(this.subdelegationField).setValue(null);
        }
      });
    } else {
      console.log('no');
    }
  }

  getDelegations(params: ListParams) {
    this.service.getAll(params).subscribe(
      data => {
        this.delegations = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  getSubDelegations(params: ListParams) {
    if (this.showDelegation) {
      const paramsF = new FilterParams();
      paramsF.addFilter(
        'delegationNumber',
        this.form.get(this.delegationField).value
      );

      this.printFlyersService.getSubdelegations(paramsF.getParams()).subscribe({
        next: data => {
          this.subdelegations = new DefaultSelect(data.data, data.count);
        },
        error: err => {
          let error = '';
          if (err.status === 0) {
            error = 'Revise su conexión de Internet.';
          } else {
            error = err.message;
          }

          this.onLoadToast('error', 'Error', error);
        },
      });
    } else {
      this.serviceSubDeleg.getAll(params).subscribe(
        res => {
          this.subdelegations = new DefaultSelect(res.data, res.count);
        },
        err => {
          let error = '';
          if (err.status === 0) {
            error = 'Revise su conexión de Internet.';
          } else {
            error = err.message;
          }

          this.onLoadToast('error', 'Error', error);
        }
      );
    }
  }

  onDelegationsChange(type: any) {
    this.resetFields([this.subdelegation]);
    this.subdelegations = new DefaultSelect();
    this.emitDelegation.emit(type);
  }

  onSubDelegationsChange(subdelegation: any) {
    this.resetFields([this.delegation]);
    this.delegations = new DefaultSelect();
    // this.delegations = new DefaultSelect([subdelegation.delegation], 1);
    // this.delegation.setValue(subdelegation.delegation.id);
    this.emitSubdelegation.emit(subdelegation);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
