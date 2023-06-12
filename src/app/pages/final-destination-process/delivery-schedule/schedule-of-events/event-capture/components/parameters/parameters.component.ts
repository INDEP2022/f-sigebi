import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CoordinationModalComponent } from 'src/app/@standalone/shared-forms/coordination/coordination-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { maxDate, minDate } from 'src/app/common/validations/date.validators';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  CaptureEventRegisterForm,
  CaptureEventSiabForm,
} from '../../utils/capture-events-forms';

@Component({
  selector: 'app-capture-event-parameters',
  templateUrl: './parameters.component.html',
  styles: [
    `
      .form-group {
        max-width: 100%;
      }
    `,
  ],
})
export class ParametersComponent extends BasePage implements OnInit {
  programedOptions = new DefaultSelect([
    { value: 0, label: 'Día a Día' },
    { value: 1, label: 'Desalojo' },
  ]);

  delegations = new DefaultSelect();
  transferents = new DefaultSelect();
  transmitters = new DefaultSelect();
  authorities = new DefaultSelect();
  users = new DefaultSelect();

  get registerControls() {
    return this.form.controls;
  }

  get siabControls() {
    return this.formSiab.controls;
  }

  @Input() formSiab: FormGroup<CaptureEventSiabForm>;
  @Input() form: FormGroup<CaptureEventRegisterForm>;

  @Output() submit = new EventEmitter();
  constructor(
    private modalService: BsModalService,
    private transferentService: TransferenteService,
    private stationService: StationService,
    private authoritiesService: AuthorityService
  ) {
    super();
  }

  ngOnInit(): void {}

  openCoordination() {
    const { delegation } = this.siabControls;
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-lg modal-dialog-centered',
    };
    modalConfig.initialState = {
      delegationsSelected: delegation.value,
      callback: (delegations: IDelegation[]) => {
        this.delegations = new DefaultSelect(delegations);
        delegation.setValue(delegations);
      },
    };
    this.modalService.show(CoordinationModalComponent, modalConfig);
  }

  transferChange() {
    const { transfer, transmitter, authority } = this.siabControls;

    if (transfer.value?.length == 0) {
      this.transmitters = new DefaultSelect();
      this.authorities = new DefaultSelect();
      transmitter.setValue([]);
      authority.setValue([]);
      return;
    }

    const filterT = transmitter.value.filter(t =>
      transfer.value.includes(t.split(',')[0])
    );
    transmitter.setValue(filterT);
    const filterAuth = authority.value.filter(t =>
      transmitter.value.includes(`${t.split(',')[0]},${t.split(',')[1]}`)
    );
    authority.setValue(filterAuth);

    this.getTransmitters();
  }

  transmitterChange() {
    const { transmitter, authority } = this.siabControls;
    if (transmitter.value?.length == 0) {
      this.authorities = new DefaultSelect();
      authority.setValue([]);
      return;
    }
    const filterAuth = authority.value.filter(t =>
      transmitter.value.includes(`${t.split(',')[0]},${t.split(',')[1]}`)
    );
    console.log(filterAuth);
    authority.setValue(filterAuth);

    this.getAuthorities();
  }

  getTransfers(params: FilterParams) {
    this.transferentService.getAllWithFilter(params.getParams()).subscribe({
      next: response => {
        this.transferents = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.transferents = new DefaultSelect();
      },
    });
  }

  getTransmitters(params?: FilterParams) {
    const _params = params ?? new FilterParams();
    const { transfer } = this.siabControls;
    if (transfer.value.length < 1) {
      this.transmitters = new DefaultSelect();
      return;
    }
    _params.removeAllFilters();
    _params.addFilter(
      'idTransferent',
      transfer.value.join(','),
      SearchFilter.IN
    );

    this.stationService.getAllFilter(_params.getParams()).subscribe({
      next: response => {
        const modTran = response.data.map((t: any) => {
          return { value: `${t.idTransferent},${t.id}`, ...t };
        });
        console.log({ modTran });
        this.transmitters = new DefaultSelect(modTran, response.count);
      },
      error: error => {
        this.transmitters = new DefaultSelect();
      },
    });
  }

  getAuthorities(params?: FilterParams) {
    const _params = params ?? new FilterParams();
    const { transfer, transmitter } = this.siabControls;
    if (transfer.value.length < 1 || transmitter.value.length < 1) {
      this.transmitters = new DefaultSelect();
      return;
    }
    _params.removeAllFilters();
    _params.addFilter(
      'idTransferer',
      transfer.value.join(','),
      SearchFilter.IN
    );
    const stations = transmitter.value.map(t => t.split(',')[1]);

    console.log({ stations });
    _params.addFilter('idStation', stations.join(','), SearchFilter.IN);

    this.authoritiesService.getAllFilter(_params.getParams()).subscribe({
      next: response => {
        const modAuth = response.data.map((a: any) => {
          return {
            value: `${a.idTransferer},${a.idStation},${a.idAuthority}`,
            ...a,
          };
        });
        this.authorities = new DefaultSelect(modAuth, response.count);
      },
      error: error => {
        this.authorities = new DefaultSelect();
      },
    });
  }

  onSubmit() {
    this.submit.emit();
  }

  initialDateChange(date: Date) {
    const { finalDate } = this.siabControls;
    if (!date) {
      finalDate.clearValidators();
      return;
    }
    finalDate.addValidators(minDate(new Date(date)));
    finalDate.updateValueAndValidity();
  }

  finalDateChange(date: Date) {
    const { initialDate } = this.siabControls;
    if (!date) {
      initialDate.clearValidators();
      return;
    }
    initialDate.addValidators(maxDate(new Date(date)));
    initialDate.updateValueAndValidity();
  }

  sliceLongName(value: string) {
    if (!value) {
      return '';
    }
    if (value.length <= 25) {
      return value;
    }
    return value.slice(0, 25) + '...';
  }
}
