import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { IssuingInstitutionService } from 'src/app/core/services/catalogs/issuing-institution.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'capture-filter',
  templateUrl: './capture-filter.component.html',
  standalone: true,
  imports: [SharedModule],
  styles: [],
})
export class CaptureFilterComponent implements OnInit {
  @Input() isReceptionAndDelivery: boolean = false;
  @Input() isReceptionStrategies: boolean = false;
  @Input() isConsolidated: boolean = false;
  @Output() consultEmmit = new EventEmitter<FormGroup>();
  delegations = new DefaultSelect();
  affairName = new DefaultSelect();
  station = new DefaultSelect();
  authority = new DefaultSelect();
  transference = new DefaultSelect();
  users$ = new DefaultSelect<ISegUsers>();
  dictNumber: string | number = undefined;
  maxDate = new Date();

  form = this.fb.group({
    de: [null, [Validators.required]],
    a: [null, [Validators.required]],
    fecha: [null, [Validators.required]],
    cordinador: [null, [Validators.required]],
    usuario: [null, [Validators.required]],
    transference: [null, Validators.required],
    station: [null, Validators.required],
    authority: [null, Validators.required],
    clave: [null, [Validators.required]],
    tipoVolante: [null, [Validators.required]],
    tipoEvento: [null],
  });
  flyerTypes = ['A', 'AP', 'AS', 'AT', 'OF', 'P', 'PJ', 'T  '];
  eventTypes = [
    'Entrega-Comercialización',
    'Entrega-Donación',
    'Entrega-Destrucción',
    'Entrega-Devolución',
    'Recepción Física',
    'Entrega',
  ];

  select = new DefaultSelect();
  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private affairService: AffairService,
    private stationService: StationService,
    private issuingInstitutionService: IssuingInstitutionService,
    private authorityService: AuthorityService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {}

  cleanForm() {
    this.form.reset();
  }

  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe({
      next: res => (this.delegations = new DefaultSelect(res.data, res.count)),
      error: () => {
        this.delegations = new DefaultSelect([], 0);
      },
    });
  }

  getSubjects(params: ListParams) {
    this.affairService.getAll(params).subscribe({
      next: data => {
        this.affairName = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.affairName = new DefaultSelect();
      },
    });
  }

  getTransference(params: ListParams) {
    this.issuingInstitutionService.getTransfers(params).subscribe({
      next: data => {
        this.transference = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.transference = new DefaultSelect();
      },
    });
  }

  getStation(params: ListParams) {
    this.stationService.getAll(params).subscribe({
      next: data => {
        this.station = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.station = new DefaultSelect();
      },
    });
  }
  getAuthority(params: ListParams) {
    this.authorityService.getAll(params).subscribe({
      next: data => {
        this.authority = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.authority = new DefaultSelect();
      },
    });
  }

  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    const area = this.form.controls['usuario'].value;
    params.search = $params.text;
    this.getAllUsers(params).subscribe();
  }

  getAllUsers(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        if (response.count > 0) {
          const name = this.form.get('usuario').value;
          const data = response.data.filter(m => m.id == name);
          console.log(data);
          this.form.get('usuario').patchValue(data[0]);
        }
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }

  consult() {
    this.consultEmmit.emit(this.form);
  }
}
