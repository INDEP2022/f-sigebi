import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequestInTurn } from 'src/app/core/models/catalogs/request-in-turn.model';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import { EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { IListResponse } from '../../../../core/interfaces/list-response.interface';
import { IAffair } from '../../../../core/models/catalogs/affair.model';
import { IAuthority } from '../../../../core/models/catalogs/authority.model';
import { IStateOfRepublic } from '../../../../core/models/catalogs/state-of-republic.model';
import { IStation } from '../../../../core/models/catalogs/station.model';
import { AffairService } from '../../../../core/services/catalogs/affair.service';
import { AuthorityService } from '../../../../core/services/catalogs/authority.service';
import { StateOfRepublicService } from '../../../../core/services/catalogs/state-of-republic.service';
import { StationService } from '../../../../core/services/catalogs/station.service';
import { TransferenteService } from '../../../../core/services/catalogs/transferente.service';

@Component({
  selector: 'app-request-in-turn-form',
  templateUrl: './request-in-turn-form.component.html',
  styleUrls: ['./request-in-turn-form.component.scss'],
})
export class RequestInTurnFormComponent implements OnInit {
  @Output() sendSearchForm = new EventEmitter<any>();
  @Output() resetForm = new EventEmitter<boolean>();
  showSearchForm: boolean = true;

  edit: boolean = false;
  title: string = 'SOliCITUD A TURNO';
  searchForm: ModelForm<any>;
  requestInTurn: IRequestInTurn;
  checked: string = 'checked';
  stateId: number = null;
  transferenceId: number = null;
  stationId: number = null;

  loading: boolean = false;

  selectStation = new DefaultSelect<any>();
  selectAuthority = new DefaultSelect<any>();
  selectState = new DefaultSelect<any>();
  selectAffeir = new DefaultSelect<any>();
  selectTransfer = new DefaultSelect<any>();

  transferenteSevice = inject(TransferenteService);
  stateOfRepublic = inject(StateOfRepublicService);
  stationService = inject(StationService);
  affairService = inject(AffairService);
  authorityService = inject(AuthorityService);
  authService = inject(AuthService);

  filters: any = [];

  constructor(
    public modalRef: BsModalRef,
    public fb: FormBuilder //public requestService: ResquestService
  ) {}

  ngOnInit(): void {
    this.initialForm();
    this.getStateOfRepublic(new ListParams());
    this.getAffair(new ListParams());
  }

  initialForm(): void {
    this.searchForm = this.fb.group({
      dateRequest: [null],
      dateJob: [null],
      stateOfRepublic: [null],
      transfer: [null],
      station: [null],
      authority: [null],
      expedient: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      affair: [null],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      acta: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      ascertainment: [null, [Validators.maxLength(40)]],
      cause: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    if (this.requestInTurn != null) {
      this.edit = true;
      this.searchForm.patchValue(this.searchForm);
    }

    this.reactiveFormCalls();
  }

  reactiveFormCalls() {
    this.searchForm.controls['stateOfRepublic'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          this.stateId = data;
          this.getTransferente(new ListParams());
        }
      }
    );
    this.searchForm.controls['transfer'].valueChanges.subscribe((data: any) => {
      if (data) {
        this.transferenceId = data;
        this.getStation(new ListParams());
      }
    });
    this.searchForm.controls['station'].valueChanges.subscribe((data: any) => {
      if (data) {
        this.stationId = data;
        this.getAuthority(new ListParams());
      }
    });
  }

  getRegionalDelegationId() {
    const id = this.authService.decodeToken().department;
    return id;
  }

  getTransferente(params?: ListParams) {
    this.transferenteSevice
      .getByIdState(this.stateId)
      .subscribe((data: any) => {
        this.selectTransfer = new DefaultSelect(data.data, data.count);
      });
  }

  getStateOfRepublic(params?: ListParams) {
    params.text = params.text == null ? '' : params.text;
    this.stateOfRepublic
      .getAll(params)
      .subscribe((data: IListResponse<IStateOfRepublic>) => {
        this.selectState = new DefaultSelect(data.data, data.count);
      });
  }

  getStation(params?: ListParams) {
    params['filter.stationName'] = `$ilike:${params.text}`;
    params['filter.idTransferent'] = `$eq:${this.transferenceId}`;
    this.stationService
      .getAll(params)
      .subscribe((data: IListResponse<IStation>) => {
        this.selectStation = new DefaultSelect(data.data, data.count);
      });
  }

  getAuthority(params?: ListParams) {
    params['filter.authorityName'] = `$ilike:${params.text}`;
    params['filter.idStation'] = `$eq:${this.stationId}`;
    params['filter.idTransferer'] = `$eq:${this.transferenceId}`;
    debugger;
    this.authorityService
      .getAll(params)
      .subscribe((data: IListResponse<IAuthority>) => {
        this.selectAuthority = new DefaultSelect(data.data, data.count);
      });
  }

  getAffair(params?: ListParams) {
    this.affairService
      .getAll(params)
      .subscribe((data: IListResponse<IAffair>) => {
        this.selectAffeir = new DefaultSelect(data.data, data.count);
      });
  }

  search(): void {
    this.filters = [];
    const params = this.getFormChanges();
    params.page = 1;
    params.limit = 10;
    delete params.inicio;
    delete params.pageSize;
    delete params.take;
    delete params.text;
    this.sendSearchForm.emit(params);
  }

  reset(): void {
    this.searchForm.reset();
    this.resetForm.emit(true);
  }

  getFormChanges() {
    var params = new ListParams();

    //filtro de la delegacion regional
    const delegationId = this.getRegionalDelegationId();
    params['filter.regionalDelegationId'] = `$eq:${delegationId}`;

    //filtro estado solicitudes por tunar
    params['filter.requestStatus'] = '$eq:POR_TURNAR';

    if (this.searchForm.controls['dateRequest'].value != null) {
      let date = this.searchForm.controls['dateRequest'].value;
      let date1 = this.getDateFormat(date[0]);
      let date2 = this.getDateFormat(date[1]);

      params['filter.applicationDate'] = `$btw:${date1},${date2}`;
    }
    if (this.searchForm.controls['authority'].value != null) {
      const authority = this.searchForm.controls['authority'].value;
      params['filter.authorityId'] = `$eq:${authority}`;
    }
    if (this.searchForm.controls['ascertainment'].value != null) {
      const ascertainment = this.searchForm.controls['ascertainment'].value;
      params['filter.previousInquiry'] = `$eq:${ascertainment}`;
    }

    if (this.searchForm.controls['stateOfRepublic'].value != null) {
      const stateOfRepublic = this.searchForm.controls['stateOfRepublic'].value;
      params['filter.keyStateOfRepublic'] = `$eq:${stateOfRepublic}`;
    }

    if (this.searchForm.controls['contributor'].value != null) {
      const contributor = this.searchForm.controls['contributor'].value;
      params['filter.indicatedTaxpayer'] = `$eq:${contributor}`;
    }

    if (this.searchForm.controls['cause'].value != null) {
      const cause = this.searchForm.controls['cause'].value;
      params['filter.lawsuit'] = `$eq:${cause}`;
    }

    if (this.searchForm.controls['transfer'].value != null) {
      const transfer = this.searchForm.controls['transfer'].value;
      params['filter.transferenceId'] = `$eq:${transfer}`;
    }

    if (this.searchForm.controls['dateJob'].value != null) {
      const dateJob = this.searchForm.controls['dateJob'].value;
      const date1 = this.getDateFormat(dateJob[0]);
      const date2 = this.getDateFormat(dateJob[1]);
      params['filter.paperDate'] = `$btw:${date1},${date2}`;
    }
    if (this.searchForm.controls['expedient'].value != null) {
      const expedient = this.searchForm.controls['expedient'].value;
      params['filter.transferenceFile'] = `$eq:${expedient}`;
    }

    if (this.searchForm.controls['station'].value != null) {
      const station = this.searchForm.controls['station'].value;
      params['filter.stationId'] = `$eq:${station}`;
    }
    if (this.searchForm.controls['acta'].value != null) {
      const acta = this.searchForm.controls['acta'].value;
      params['filter.circumstantialRecord'] = `$eq:${acta}`;
    }
    if (this.searchForm.controls['affair'].value != null) {
      const affair = this.searchForm.controls['affair'].value;
      params['filter.affair'] = `$eq:${affair}`;
    }

    return params;
  }

  getDateFormat(date: string): string {
    const newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();

    return year + '-' + month + '-' + day;
  }
}
