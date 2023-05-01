import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequestInTurn } from 'src/app/core/models/catalogs/request-in-turn.model';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import { EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferentesSaeService } from 'src/app/core/services/catalogs/transferentes-sae.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { IListResponse } from '../../../../core/interfaces/list-response.interface';
import { IAffair } from '../../../../core/models/catalogs/affair.model';
import { IAuthority } from '../../../../core/models/catalogs/authority.model';
import { IStation } from '../../../../core/models/catalogs/station.model';
import { AffairService } from '../../../../core/services/catalogs/affair.service';
import { AuthorityService } from '../../../../core/services/catalogs/authority.service';
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
  deleRegionalId: number = null;
  stateId: number = null;
  transferenceId: number = null;
  stationId: number = null;

  loading: boolean = false;

  selectStation = new DefaultSelect<any>();
  selectAuthority = new DefaultSelect<any>();
  selectState = new DefaultSelect<any>();
  selectAffeir = new DefaultSelect<any>();
  selectTransfer = new DefaultSelect<any>();
  selectRegDele = new DefaultSelect<any>();

  transferenteSevice = inject(TransferenteService);
  delegationStateService = inject(DelegationStateService);
  stationService = inject(StationService);
  affairService = inject(AffairService);
  authorityService = inject(AuthorityService);
  authService = inject(AuthService);
  regDelegationService = inject(RegionalDelegationService);

  filters: any = [];

  constructor(
    public modalRef: BsModalRef,
    public fb: FormBuilder,
    private transferentesSaeService: TransferentesSaeService //public requestService: ResquestService
  ) {}

  ngOnInit(): void {
    this.initialForm();
    this.deleRegionalId = Number(this.authService.decodeToken().department);
    this.getRegionalDelegationId(new ListParams());
    this.getStateOfRepublic(new ListParams());
    this.getAffair(new ListParams());
  }

  initialForm(): void {
    this.searchForm = this.fb.group({
      dateRequest: [null],
      dateJob: [null],
      regionalDelegationId: [null],
      stateOfRepublic: [null],
      transfer: [null],
      station: [null],
      authority: [null],
      expedient: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      affair: [null],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      acta: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      ascertainment: [null, [Validators.maxLength(50)]],
      cause: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
    });

    if (this.requestInTurn != null) {
      this.edit = true;
      this.searchForm.patchValue(this.searchForm);
    }

    this.reactiveFormCalls();
  }

  reactiveFormCalls() {
    this.searchForm.controls['regionalDelegationId'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          this.selectTransfer = new DefaultSelect([], 0, true);

          this.selectStation = new DefaultSelect([], 0, true);
          this.selectAuthority = new DefaultSelect([], 0, true);

          this.searchForm.controls['stateOfRepublic'].reset();
          this.searchForm.controls['transfer'].reset();
          this.searchForm.controls['station'].reset();
          this.searchForm.controls['authority'].reset();
          this.deleRegionalId = data;
          this.getStateOfRepublic(new ListParams());
        }
      }
    );

    this.searchForm.controls['stateOfRepublic'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          this.selectStation = new DefaultSelect([], 0, true);
          this.selectAuthority = new DefaultSelect([], 0, true);
          this.selectTransfer = new DefaultSelect([], 0, true);
          this.searchForm.controls['transfer'].reset();
          this.searchForm.controls['station'].reset();
          this.searchForm.controls['authority'].reset();
          this.stateId = data;
          this.getTransferente(new ListParams());
        } else {
          this.selectStation = new DefaultSelect([], 0, true);
          this.selectAuthority = new DefaultSelect([], 0, true);
          this.selectTransfer = new DefaultSelect([], 0, true);
          this.searchForm.controls['transfer'].reset();
          this.searchForm.controls['station'].reset();
          this.searchForm.controls['authority'].reset();
        }
      }
    );
    this.searchForm.controls['transfer'].valueChanges.subscribe((data: any) => {
      if (data) {
        this.selectStation = new DefaultSelect([], 0, true);
        this.selectAuthority = new DefaultSelect([], 0, true);

        this.searchForm.controls['station'].reset();
        this.searchForm.controls['authority'].reset();
        this.transferenceId = data;
        this.getStation(new ListParams());
      } else {
        this.selectStation = new DefaultSelect([], 0, true);
        this.selectAuthority = new DefaultSelect([], 0, true);
        this.searchForm.controls['station'].reset();
        this.searchForm.controls['authority'].reset();
      }
    });
    this.searchForm.controls['station'].valueChanges.subscribe((data: any) => {
      if (data) {
        this.selectAuthority = new DefaultSelect([], 0, true);
        this.stationId = data;
        this.getAuthority(new ListParams());
      }
    });
  }

  getRegionalDelegationId(params: ListParams) {
    // const id = this.authService.decodeToken().department;
    // console.log(id);
    //return id;
    params['filter.description'] = `$ilike:${params.text}`;
    params['sortBy'] = 'description:ASC';
    this.regDelegationService.getAll(params).subscribe({
      next: resp => {
        this.selectRegDele = new DefaultSelect(resp.data, resp.count);
      },
      error: error => (this.selectRegDele = new DefaultSelect([], 0, true)),
    });
  }
  getAffair(params?: ListParams) {
    params['sortBy'] = 'description:ASC';
    this.affairService.getAll(params).subscribe(
      (data: IListResponse<IAffair>) => {
        this.selectAffeir = new DefaultSelect(data.data, data.count);
      },
      error => {
        this.selectAffeir = new DefaultSelect([], 0, true);
      }
    );
  }
  getTransferente(params?: ListParams) {
    params['filter.transferent.nameTransferent'] = `$ilike:${params.text}`;
    params['sortBy'] = 'nameTransferent:ASC';
    this.transferentesSaeService
      .getStateByTransferentKey(this.stateId, params)
      .subscribe({
        next: data => {
          data.data.map((data: any) => {
            data.nameAndId = `${data.idTransferee} - ${data.transferent.nameTransferent}`;
            return data;
          });
          this.selectTransfer = new DefaultSelect(data.data, data.count);
        },
        error: error => (this.selectTransfer = new DefaultSelect([], 0, true)),
      });
  }

  getStateOfRepublic(params?: ListParams) {
    params['filter.regionalDelegation'] = `$eq:${this.deleRegionalId}`;
    params['sortBy'] = 'keyState:ASC';
    this.delegationStateService.getAll(params).subscribe(
      (data: any) => {
        let result = data.data
          .map((x: any) => {
            return x.stateCode;
          })
          .filter((x: any) => x != undefined);

        this.selectState = new DefaultSelect(result, result.length);
      },
      error => {
        this.selectState = new DefaultSelect([], 0, true);
      }
    );
  }

  getStation(params?: ListParams) {
    params['filter.stationName'] = `$ilike:${params.text}`;
    params['filter.idTransferent'] = `$eq:${this.transferenceId}`;
    params['sortBy'] = 'stationName:ASC';
    delete params.limit;
    delete params.page;
    delete params['search'];
    delete params.text;
    this.stationService.getAll(params).subscribe(
      (data: IListResponse<IStation>) => {
        data.data.map((data: any) => {
          data.nameAndId = `${data.id} - ${data.stationName}`;
          return data;
        });
        this.selectStation = new DefaultSelect(data.data, data.count);
      },
      error => {
        this.selectStation = new DefaultSelect();
      }
    );
  }

  getAuthority(params?: ListParams) {
    this.selectAuthority = new DefaultSelect();
    params['filter.authorityName'] = `$ilike:${params.text}`;
    params['filter.idStation'] = `$eq:${this.stationId}`;
    params['filter.idTransferer'] = `$eq:${this.transferenceId}`;
    params['sortBy'] = 'authorityName:ASC';
    delete params.limit;
    delete params.page;
    delete params['search'];
    delete params.text;
    this.stationService;
    this.authorityService.getAll(params).subscribe(
      (data: IListResponse<IAuthority>) => {
        data.data.map((data: any) => {
          data.nameAndId = `${data.idAuthority} - ${data.authorityName}`;
          return data;
        });
        this.selectAuthority = new DefaultSelect(data.data, data.count);
      },
      error => {
        this.selectAuthority = new DefaultSelect();
      }
    );
  }

  search(): void {
    this.filters = [];
    const params = this.getFormChanges();

    params.page = 1;
    params.limit = 10;
    // delete params.inicio;
    // delete params.pageSize;
    // delete params.take;
    // delete params.text;

    this.sendSearchForm.emit(params);
  }

  reset(): void {
    this.selectTransfer = new DefaultSelect([], 0, true);
    this.selectAuthority = this.selectTransfer = new DefaultSelect([], 0, true);
    this.selectState = this.selectTransfer = new DefaultSelect([], 0, true);
    this.searchForm.reset();
    this.resetForm.emit(true);
    this.deleRegionalId = Number(this.authService.decodeToken().department);
  }

  getFormChanges() {
    var params = new FilterParams();
    params.removeAllFilters();
    //filtro de la delegacion regional
    this.deleRegionalId
      ? params.addFilter(
          'regionalDelegationId',
          this.deleRegionalId,
          SearchFilter.EQ
        )
      : null;

    //filtro estado solicitudes por tunar
    params.addFilter('requestStatus', 'POR_TURNAR', SearchFilter.EQ);

    params.sortBy = 'applicationDate:DESC';
    // //filtro ordenar desc
    // params.addFilter('sortBy', 'applicationDate:DESC',);
    // params.getParams().concat('&sortBy=applicationDate:DESC')
    // params['sortBy'] = 'applicationDate:DESC';

    if (this.searchForm.controls['dateRequest'].value != null) {
      let date = this.searchForm.controls['dateRequest'].value;
      let date1 = this.getDateFormat(date[0]);
      let date2 = this.getDateFormat(date[1]);
      params.addFilter(
        'applicationDate',
        `${date1},${date2}`,
        SearchFilter.BTW
      );
    }
    if (this.searchForm.controls['authority'].value != null) {
      const authority = this.searchForm.controls['authority'].value;
      params.addFilter('authorityId', authority, SearchFilter.EQ);
    }
    if (this.searchForm.controls['ascertainment'].value != null) {
      const ascertainment = this.searchForm.controls['ascertainment'].value;
      params.addFilter('previousInquiry', ascertainment, SearchFilter.ILIKE);
    }

    if (this.searchForm.controls['stateOfRepublic'].value != null) {
      const stateOfRepublic = this.searchForm.controls['stateOfRepublic'].value;
      params.addFilter('keyStateOfRepublic', stateOfRepublic, SearchFilter.EQ);
    }

    if (this.searchForm.controls['contributor'].value != null) {
      const contributor = this.searchForm.controls['contributor'].value;
      params.addFilter('indicatedTaxpayer', contributor, SearchFilter.ILIKE);
    }

    if (this.searchForm.controls['cause'].value != null) {
      const cause = this.searchForm.controls['cause'].value;
      params.addFilter('lawsuit', cause, SearchFilter.ILIKE);
    }

    if (this.searchForm.controls['transfer'].value != null) {
      const transfer = this.searchForm.controls['transfer'].value;
      params.addFilter('transferenceId', transfer, SearchFilter.EQ);
    }

    if (this.searchForm.controls['dateJob'].value != null) {
      const dateJob = this.searchForm.controls['dateJob'].value;
      const date1 = this.getDateFormat(dateJob[0]);
      const date2 = this.getDateFormat(dateJob[1]);
      params.addFilter('paperDate', `${date1},${date2}`, SearchFilter.BTW);
    }
    if (this.searchForm.controls['expedient'].value != null) {
      const expedient = this.searchForm.controls['expedient'].value;
      params.addFilter('transferenceFile', expedient, SearchFilter.ILIKE);
    }

    if (this.searchForm.controls['station'].value != null) {
      const station = this.searchForm.controls['station'].value;
      params.addFilter('stationId', station, SearchFilter.EQ);
    }
    if (this.searchForm.controls['acta'].value != null) {
      const acta = this.searchForm.controls['acta'].value;
      params.addFilter('circumstantialRecord', acta, SearchFilter.ILIKE);
    }
    if (this.searchForm.controls['affair'].value != null) {
      const affair = this.searchForm.controls['affair'].value;
      params.addFilter('affair', affair, SearchFilter.EQ);
    }

    return params;
  }

  getDateFormat(date: string): string {
    const newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = this.formarSingleNumber(newDate.getMonth() + 1);
    let day = this.formarSingleNumber(newDate.getDate());

    return year + '-' + month + '-' + day;
  }

  formarSingleNumber(value: number | string) {
    let result = value;
    if (value === 1) {
      result = `0${value}`;
    } else if (value === 2) {
      result = `0${value}`;
    } else if (value === 3) {
      result = `0${value}`;
    } else if (value === 4) {
      result = `0${value}`;
    } else if (value === 5) {
      result = `0${value}`;
    } else if (value === 6) {
      result = `0${value}`;
    } else if (value === 7) {
      result = `0${value}`;
    } else if (value === 8) {
      result = `0${value}`;
    } else if (value === 9) {
      result = `0${value}`;
    }
    return result.toString();
  }
}
