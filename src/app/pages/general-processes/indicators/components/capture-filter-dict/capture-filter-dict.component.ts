import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { TransferenteSharedComponent } from 'src/app/@standalone/shared-forms/transferents-shared/transferents-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'capture-filter-dict',
  templateUrl: './capture-filter-dict.component.html',
  standalone: true,
  imports: [
    SharedModule,
    TransferenteSharedComponent,
    UsersSharedComponent,
    DelegationSharedComponent,
  ],
  styles: [],
})
export class CaptureFilterDictComponent extends BasePage implements OnInit {
  @Input() isReceptionStrategies: boolean = false;
  @Output() consultEmmit = new EventEmitter<FormGroup>();
  @Output() reportEmmit = new EventEmitter<FormGroup>();
  @Output() exportEmmit = new EventEmitter<FormGroup>();
  @Output() cleanEmmit = new EventEmitter<FormGroup>();
  form: FormGroup;
  flyerTypes = [
    { label: 'A', value: 'A' },
    {
      label: 'AP',
      value: 'AP',
    },
    {
      label: 'AS',
      value: 'AS',
    },
    {
      label: 'AT',
      value: 'AT',
    },
    {
      label: 'OF',
      value: 'OF',
    },
    {
      label: 'P',
      value: 'P',
    },
    {
      label: 'PJ',
      value: 'PJ',
    },
    {
      label: 'T',
      value: 'T',
    },
  ];
  eventTypes = [
    'Entrega-Comercialización',
    'Entrega-Donación',
    'Entrega-Destrucción',
    'Entrega-Devolución',
    'Recepción Física',
    'Entrega',
  ];
  select = new DefaultSelect();
  autoritys = new DefaultSelect();
  stations = new DefaultSelect();
  dataSelect = new DefaultSelect(this.flyerTypes, this.flyerTypes.length);
  typesEvents = new DefaultSelect(this.flyerTypes, this.flyerTypes.length);
  constructor(
    private fb: FormBuilder,
    private authorityService: AuthorityService,
    private stationService: StationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  //Desahogo
  private prepareForm() {
    this.form = this.fb.group({
      fechaInicio: [null],
      fechaFin: [null],
      fechaTurno: [null],
      fechaDesahogo: [null],
      cordinador: [null],
      cordinadorName: [null],
      usuario: [null],
      transferente: [null],
      emisora: [null],
      autoridad: [null],
      tipoVolante: [null],
      tipoEvento: [null],
      numeroVolante: [null],
      fechaVolante: [null],
    });
  }

  getAutoritys(params?: ListParams) {
    this.authorityService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.autoritys = new DefaultSelect(resp.data);
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
  }

  getStations(params?: ListParams) {
    this.stationService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.stations = new DefaultSelect(resp.data, resp.count);
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
  }

  onAutoritysChange(event: any) {}
  onStationsChange(event: any) {}
  onChangeUser(event: any) {
    console.log(event);
    this.form.get('usuario').patchValue(event.id);
  }

  consult() {
    this.consultEmmit.emit(this.form);
  }

  report() {
    this.reportEmmit.emit(this.form);
  }

  export() {
    this.exportEmmit.emit(this.form);
  }

  changeDelegation(event: IDelegation) {
    console.log(event);
    this.form.get('cordinadorName').setValue(event.description);
  }

  clean() {
    this.form.reset();
    this.cleanEmmit.emit(this.form);
  }
}
