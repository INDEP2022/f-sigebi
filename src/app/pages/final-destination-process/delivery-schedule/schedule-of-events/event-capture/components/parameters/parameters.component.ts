import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CoordinationModalComponent } from 'src/app/@standalone/shared-forms/coordination/coordination-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { minDate } from 'src/app/common/validations/date.validators';
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

  ngOnInit(): void {
    console.log('xd');
  }

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
        this.transmitters = new DefaultSelect(response.data, response.count);
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
    _params.addFilter(
      'idStation',
      transmitter.value.join(','),
      SearchFilter.IN
    );

    this.authoritiesService.getAllFilter(_params.getParams()).subscribe({
      next: response => {
        this.authorities = new DefaultSelect(response.data, response.count);
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
    console.log(date);
    if (!date) {
      finalDate.clearValidators();
      return;
    }
    finalDate.addValidators(minDate(new Date(date)));
    finalDate.updateValueAndValidity();
    console.log(finalDate);
  }
}
