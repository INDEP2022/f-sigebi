import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequestInTurn } from 'src/app/core/models/catalogs/request-in-turn.model';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import { EventEmitter, Output } from '@angular/core';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { IListResponse } from '../../../../core/interfaces/list-response.interface';
import { IAffair } from '../../../../core/models/catalogs/affair.model';
import { IStateOfRepublic } from '../../../../core/models/catalogs/state-of-republic.model';
import { IStation } from '../../../../core/models/catalogs/station.model';
import { ITransferente } from '../../../../core/models/catalogs/transferente.model';
import { AffairService } from '../../../../core/services/catalogs/affair.service';
import { StateOfRepublicService } from '../../../../core/services/catalogs/state-of-republic.service';
import { StationService } from '../../../../core/services/catalogs/station.service';
import { TransferenteService } from '../../../../core/services/catalogs/transferente.service';

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

  selectStation = new DefaultSelect<any>();
  selectAuthority = new DefaultSelect<IRequestInTurn>();
  selectState = new DefaultSelect<any>();
  selectAffeir = new DefaultSelect<IRequestInTurn>();
  selectTransfer = new DefaultSelect<any>();

  match: string = '';
  transferenteSevice = inject(TransferenteService);
  stateOfRepublic = inject(StateOfRepublicService);
  stationService = inject(StationService);
  affairService = inject(AffairService);

  constructor(
    public modalRef: BsModalRef,
    public fb: FormBuilder //public requestService: ResquestService
  ) {}

  ngOnInit(): void {
    this.initialForm();
    this.getTransferente(new ListParams());
    this.getStateOfRepublic(new ListParams());
    this.getStation(new ListParams());
    this.getAffair(new ListParams());
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
      state: [null],
      transfer: [null],
      station: [null],
      authority: [null],
      expedient: [null, [Validators.pattern(STRING_PATTERN)]],
      reception: [null],
      affair: [null],
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

  getTransferente(params?: ListParams) {
    this.transferenteSevice
      .getAll(params)
      .subscribe((data: IListResponse<ITransferente>) => {
        this.selectTransfer = new DefaultSelect(data.data, data.count);
      });
  }

  getStateOfRepublic(params?: ListParams) {
    this.stateOfRepublic
      .getAll(params)
      .subscribe((data: IListResponse<IStateOfRepublic>) => {
        this.selectState = new DefaultSelect(data.data, data.count);
      });
  }

  //no funciona
  getStation(params?: ListParams) {
    this.stationService
      .getAll(params)
      .subscribe((data: IListResponse<IStation>) => {
        this.selectStation = new DefaultSelect(data.data, data.count);
      });
  }

  getAuthority(params?: ListParams) {}

  getAffair(params?: ListParams) {
    this.affairService
      .getAll(params)
      .subscribe((data: IListResponse<IAffair>) => {
        console.log(data);
        this.selectAffeir = new DefaultSelect(data.data, data.count);
      });
  }

  search(): void {
    //console.log(this.requestForm.getRawValue());
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
