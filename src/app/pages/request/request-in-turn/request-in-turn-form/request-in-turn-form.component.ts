import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequestInTurn } from 'src/app/core/models/catalogs/request-in-turn.model';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import { EventEmitter, Output } from '@angular/core';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-request-in-turn-form',
  templateUrl: './request-in-turn-form.component.html',
  styleUrls: ['./request-in-turn-form.component.scss'],
})
export class RequestInTurnFormComponent implements OnInit {
  @Output() sendSearchForm = new EventEmitter<ModelForm<IRequestInTurn>>();
  showSearchForm: boolean = true;

  edit: boolean = false;
  title: string = 'SOliCITUD A TURNO';
  requestForm: ModelForm<IRequestInTurn>;
  requestInTurn: IRequestInTurn;
  checked: string = 'checked';

  loading: boolean = false;

  selectTransmitter = new DefaultSelect<IRequestInTurn>();
  selectAuthority = new DefaultSelect<IRequestInTurn>();
  selectDeleRegional = new DefaultSelect<IRequestInTurn>();
  selectState = new DefaultSelect<IRequestInTurn>();
  selectSubject = new DefaultSelect<IRequestInTurn>();
  selectTransfer = new DefaultSelect<IRequestInTurn>();

  match: string = '';

  constructor(
    public modalRef: BsModalRef,
    public fb: FormBuilder //public requestService: ResquestService
  ) {}

  ngOnInit(): void {
    this.initialForm();
  }

  initialForm(): void {
    this.requestForm = this.fb.group({
      check: [null],
      noRequest: [null],
      dateRequest: [null],
      titularName: [null],
      senderCharger: [null],
      noJob: [null],
      dateJob: [null],
      deleRegional: [null],
      state: [null],
      transfer: [null],
      transmitter: [null],
      authority: [null],
      expedient: [null, [Validators.pattern(STRING_PATTERN)]],
      reception: [null],
      subject: [null],
      type: [null],
      appliStatus: [null],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      acta: [null, [Validators.pattern(STRING_PATTERN)]],
      ascertainment: [null, [Validators.pattern(STRING_PATTERN)]],
      cause: [null, [Validators.pattern(STRING_PATTERN)]],
      typeMach: ['all'],
    });
    if (this.requestInTurn != null) {
      this.edit = true;
      this.requestForm.patchValue(this.requestForm);
    }
  }

  getSubDelegations(params: ListParams) {
    /* this.requestService.getAll(params).subscribe(data => {
      this.station = new DefaultSelect(data.data, data.count);
    }); */
  }

  search(): void {
    /* console.log(this.requestForm.getRawValue());
    console.log(this.selectTransmitter); */

    if (this.match == 'all') {
      //retrieve all list
    } else {
      //retrieve data filtered
      this.sendSearchForm.emit(this.requestForm);
    }
  }

  reset(): void {
    this.requestForm.reset();
  }
}
