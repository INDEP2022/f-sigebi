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
import { BehaviorSubject, takeUntil } from 'rxjs';
//Params
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { format } from 'date-fns';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';

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
  @Input() labelSubdelegation: string = 'Subdelegación';

  @Input() showSubdelegation: boolean = true;
  @Input() showDelegation: boolean = true;
  @Input() delegationChange: boolean = true;
  @Input() init: boolean = false;
  @Input() numDel: boolean = false;
  @Input() valPhaseEdo: boolean = false;
  @Output() emitSubdelegation = new EventEmitter<ISubdelegation>();
  @Output() emitDelegation = new EventEmitter<IDelegation>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();
  phaseEdo: number;
  resul: any;
  resul1: any;

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
    private render: Renderer2,
    private parametersService: ParametersService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.init) {
      if (this.valPhaseEdo) {
        this.getPhaseEdo();
      } else {
        this.getDelegations(new ListParams());
        this.getSubDelegations(new ListParams());

        setTimeout(() => {
          this.getDelegations(new ListParams());
        }, 1000);
      }
    }
    if (this.showSubdelegation) {
      this.form.get(this.delegationField).valueChanges.subscribe(res => {
        const sfield = document.getElementById('id');
        if (res != null) {
          this.render.removeClass(sfield, 'disabled');
          this.form.get(this.subdelegationField).setValue('');
        } else {
          this.render.addClass(sfield, 'disabled');
          this.form.get(this.subdelegationField).setValue('');
        }
      });
    } else {
      console.log('no');
      this.getDelegations(new ListParams());
    }
  }
  async getPhaseEdo() {
    this.phaseEdo = await this.paEtapaEdo();
    this.getDelegations(new ListParams());
  }
  getDelegations(params: ListParams) {
    params.limit = 100;
    params.take = 100;
    if (params.text) {
      if (!isNaN(parseInt(params.text))) {
        params['filter.id'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.description'] = `$ilike:${params.text}`;
      }
    }

    if (this.valPhaseEdo) params['filter.etapaEdo'] = `$eq:${this.phaseEdo}`;

    params['sortBy'] = 'id:DESC';
    this.service.getAll(params).subscribe({
      next: data => {
        this.resul = data.data.map(async (item: any) => {
          item['idDesc'] = item.id + ' - ' + item.description;
        });
        this.delegations = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.delegations = new DefaultSelect();
      },
    });
  }

  getSubDelegations(params: ListParams) {
    if (this.showDelegation) {
      const paramsF = new FilterParams();
      paramsF.addFilter(
        'delegationNumber',
        this.form.get(this.delegationField).value
      );
      if (this.valPhaseEdo)
        paramsF.addFilter('phaseEdo', this.phaseEdo, SearchFilter.EQ);
      this.printFlyersService.getSubdelegations(paramsF.getParams()).subscribe({
        next: data => {
          this.resul1 = data.data.map(async (item: any) => {
            item['idDesc1'] = item.id + ' - ' + item.description;
          });
          this.subdelegations = new DefaultSelect(data.data, data.count);
        },
        error: err => {
          this.subdelegations = new DefaultSelect();
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
          this.subdelegations = new DefaultSelect([], 0);
          this.alert('warning', 'No se encontraron registros', '');
        }
      );
    }
  }

  onDelegationsChange(type: any) {
    console.log(type);
    this.resetFields([this.subdelegation]);
    if (this.delegationChange) {
      this.subdelegations = new DefaultSelect();
      this.getSubDelegations(new ListParams());
    }
    this.emitDelegation.emit(type);
  }

  onSubDelegationsChange(subdelegation: any) {
    this.resetFields([this.delegation]);
    this.delegations = new DefaultSelect();
    // this.delegations = new DefaultSelect([subdelegation.delegation], 1);
    // this.delegation.setValue(subdelegation.delegation.id);
    console.log(subdelegation);
    this.emitSubdelegation.emit(subdelegation);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }

  async paEtapaEdo(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (this.delegation != null) {
        this.parametersService
          .getPhaseEdo(`date=${format(new Date(), 'yyyy-MM-dd')}`)
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(
            (res: any) => {
              console.log('REESS', res);
              if (!res.stagecreated) {
                resolve(2);
              } else {
                resolve(res.stagecreated);
              }
            },
            err => {
              resolve(2);
              console.log(err);
            }
          );
      }
    });
  }
}
