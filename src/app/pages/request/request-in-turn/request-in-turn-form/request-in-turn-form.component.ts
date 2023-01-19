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
import { IAuthority } from '../../../../core/models/catalogs/authority.model';
import { IStateOfRepublic } from '../../../../core/models/catalogs/state-of-republic.model';
import { IStation } from '../../../../core/models/catalogs/station.model';
import { ITransferente } from '../../../../core/models/catalogs/transferente.model';
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
  showSearchForm: boolean = true;

  edit: boolean = false;
  title: string = 'SOliCITUD A TURNO';
  searchForm: ModelForm<any>;
  requestInTurn: IRequestInTurn;
  checked: string = 'checked';

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

  filters: any = [];

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
    this.getAuthority(new ListParams());
  }

  initialForm(): void {
    this.searchForm = this.fb.group({
      dateRequest: [null],
      dateJob: [null],
      stateOfRepublic: [null],
      transfer: [null],
      station: [null],
      authority: [null],
      expedient: [null, [Validators.pattern(STRING_PATTERN)]],
      affair: [null],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      acta: [null, [Validators.pattern(STRING_PATTERN)]],
      ascertainment: [null],
      cause: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    if (this.requestInTurn != null) {
      this.edit = true;
      this.searchForm.patchValue(this.searchForm);
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
    params.text = params.text == null ? '' : params.text;
    this.stateOfRepublic
      .getAll(params)
      .subscribe((data: IListResponse<IStateOfRepublic>) => {
        this.selectState = new DefaultSelect(data.data, data.count);
      });
  }

  getStation(params?: ListParams) {
    params.text = params.text == null ? '' : params.text;
    this.stationService
      .getAll(params)
      .subscribe((data: IListResponse<IStation>) => {
        this.selectStation = new DefaultSelect(data.data, data.count);
      });
  }

  getAuthority(params?: ListParams) {
    params.text = params.text == null ? '' : params.text;
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
    this.getFormChanges();
    let params: any = { page: 1, take: 20 };

    for (let i = 0; i < this.filters.length; i++) {
      let index = i.toString();
      params[`filters[${index}]`] = JSON.stringify(this.filters[i]);
    }
    console.log(params);

    this.sendSearchForm.emit(params);
  }

  reset(): void {
    this.searchForm.reset();
  }

  getFormChanges() {
    //filtro de la delegacion regional
    /*let reginalDelegationFiltro = {
      property: 'id_delegacion_regional',
      comparison: 'EQUAL',
      value: 12,
    };
    this.filters.push(reginalDelegationFiltro);*/

    //filtro estado solicitudes por tunar
    let porTurnarFiltro = {
      property: 'estatus_solicitud',
      comparison: 'EQUAL',
      value: 'POR_TURNAR',
    };
    this.filters.push(porTurnarFiltro);

    if (this.searchForm.controls['dateRequest'].value != null) {
      let dateStart = this.searchForm.controls['dateRequest'].value[0];
      let filtro = {
        property: 'fecha_solicitud',
        comparison: 'EQUAL',
        value: new Date(dateStart).toISOString(),
      };
      this.filters.push(filtro);
    }
    if (this.searchForm.controls['authority'].value != null) {
      let filtro = {
        property: 'id_autoridad',
        comparison: 'EQUAL',
        value: this.searchForm.controls['authority'].value,
      };
      this.filters.push(filtro);
    }
    if (this.searchForm.controls['ascertainment'].value != null) {
      let filtro = {
        property: 'averiguacion_previa',
        comparison: 'EQUAL',
        value: this.searchForm.controls['ascertainment'].value,
      };
      this.filters.push(filtro);
    }

    if (this.searchForm.controls['stateOfRepublic'].value != null) {
      let filtro = {
        property: 'cve_estado',
        comparison: 'EQUAL',
        value: this.searchForm.controls['ascertainment'].value,
      };
      this.filters.push(filtro);
    }

    if (this.searchForm.controls['contributor'].value != null) {
      let filtro = {
        property: 'contribuyente_indiciado',
        comparison: 'EQUAL',
        value: this.searchForm.controls['contributor'].value,
      };
      this.filters.push(filtro);
    }

    if (this.searchForm.controls['cause'].value != null) {
      let filtro = {
        property: 'causa_penal',
        comparison: 'EQUAL',
        value: this.searchForm.controls['cause'].value,
      };
      this.filters.push(filtro);
    }

    if (this.searchForm.controls['transfer'].value != null) {
      let filtro = {
        property: 'id_transferente',
        comparison: 'EQUAL',
        value: this.searchForm.controls['transfer'].value,
      };
      this.filters.push(filtro);
    }

    if (this.searchForm.controls['dateJob'].value != null) {
      let filtro = {
        property: 'fecha_oficio',
        comparison: 'EQUAL',
        value: this.searchForm.controls['dateJob'].value,
      };
      this.filters.push(filtro);
    }
    if (this.searchForm.controls['expedient'].value != null) {
      let filtro = {
        property: 'expediente_transferente',
        comparison: 'EQUAL',
        value: this.searchForm.controls['expedient'].value,
      };
      this.filters.push(filtro);
    }

    if (this.searchForm.controls['station'].value != null) {
      let filtro = {
        property: 'id_emisora',
        comparison: 'EQUAL',
        value: this.searchForm.controls['station'].value,
      };
      this.filters.push(filtro);
    }
    if (this.searchForm.controls['acta'].value != null) {
      let filtro = {
        property: 'acta_circunstanciada',
        comparison: 'EQUAL',
        value: this.searchForm.controls['acta'].value,
      };
      this.filters.push(filtro);
    }
    if (this.searchForm.controls['affair'].value != null) {
      let filtro = {
        property: 'asunto',
        comparison: 'EQUAL',
        value: this.searchForm.controls['affair'].value,
      };
      this.filters.push(filtro);
    }
  }
}
