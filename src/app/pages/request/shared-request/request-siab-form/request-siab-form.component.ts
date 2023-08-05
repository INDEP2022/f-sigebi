import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-request-siab-form',
  templateUrl: './request-siab-form.component.html',
  styles: [],
})
export class RequestSiabFormComponent extends BasePage implements OnInit {
  requestSiabForm: FormGroup = new FormGroup({});
  request: any = null;

  regionalsDelegations = new DefaultSelect();
  states = new DefaultSelect();
  transferents = new DefaultSelect();
  stations = new DefaultSelect();
  authorities = new DefaultSelect();
  typeRelevants = new DefaultSelect();

  delegaId: number = null;
  stateId: number = null;
  transferentId: number = null;
  stationId: number = null;
  authorityId: number = null;

  private regionalDelegationService = inject(RegionalDelegationService);
  private stateService = inject(DelegationStateService);
  private transferentService = inject(TransferenteService);
  private stationService = inject(StationService);
  private authorityService = inject(AuthorityService);
  private typeRelevanteService = inject(TypeRelevantService);

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.requestSiabForm.controls['delegationRegionalId'].setValue(
      this.request.regionalDelegationId
    );
    this.getRegionalDelegationSelect(new ListParams());
    this.getTypeRelevantSelect(new ListParams());
  }

  prepareForm() {
    this.requestSiabForm = this.fb.group({
      delegationRegionalId: [null],
      cve_estado: [null],
      transfereeId: [null],
      stationId: [null],
      authorityId: [null],
      relevantTypeId: [null],
      amountToReserve: [null, [Validators.required]],
      proceedingsType: [null],
      descriptionRequest: [null, [Validators.pattern(STRING_PATTERN)]],
      uniqueKey: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      descriptionGood: [null, [Validators.pattern(STRING_PATTERN)]],
      numberGoodSiab: [null],
      codeWarehouse: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      numberExpedient: [null],
    });
  }

  close() {
    this.modalRef.hide();
  }

  send() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea mandar busqueda a SIAB?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Solicitud de busqueda enviada correctamente',
          ''
        );

        this.close();
      }
    });
  }

  getDelegationById(id: number) {
    return new Promise((resolve, reject) => {
      this.regionalDelegationService.getById(id).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }

  async getRegionalDelegationSelect(params: ListParams) {
    /*let delegation:any = null;
     if(this.request.regionalDelegationId && params.page == 1){
        delegation = await this.getDelegationById(this.request.regionalDelegationId);
     }*/

    this.regionalDelegationService.getAll(params).subscribe({
      next: resp => {
        /*if(delegation != null){    
          const found = resp.data.filter(x => x.id == delegation.id)
          if(found.length == 0){
            resp.data.push(delegation)
          }
          this.getStateSelect(new ListParams(),this.request.regionalDelegationId)
        }*/

        this.regionalsDelegations = new DefaultSelect(resp.data, resp.count);
        this.getStateSelect(
          new ListParams(),
          this.request.regionalDelegationId
        );
      },
    });
  }
  changeDelegationReg(event: any) {
    console.log(event);
    if (event != undefined) {
      this.delegaId = event.id;
      this.getStateSelect(new ListParams(), this.delegaId);
    } else {
      this.states = new DefaultSelect(null);
      this.requestSiabForm.get('cve_estado').setValue(null);
      this.transferents = new DefaultSelect(null);
      this.requestSiabForm.get('transfereeId').setValue(null);
      this.stations = new DefaultSelect(null);
      this.requestSiabForm.get('stationId').setValue(null);
      this.getRegionalDelegationSelect(new ListParams());
    }
  }

  getStateSelect(params: ListParams, delegaId?: number) {
    params['filter.regionalDelegation'] = `$eq:${delegaId}`;
    delete params['search'];
    this.stateService.getAll(params).subscribe({
      next: resp => {
        const result = resp.data
          .map(x => {
            return x.stateCode;
          })
          .filter(x => x != null);

        this.states = new DefaultSelect(result, resp.count);
      },
    });
  }

  changeState(event: any) {
    console.log(event);
    if (event != undefined) {
      this.stateId = event.id;
      this.getTransferentSelect(new ListParams());
    } else {
      this.transferents = new DefaultSelect(null);
      this.requestSiabForm.get('transfereeId').setValue(null);
      this.stations = new DefaultSelect(null);
      this.requestSiabForm.get('stationId').setValue(null);
    }
  }

  getTransferentSelect(params: ListParams, id?: number) {
    params['sortBy'] = 'nameTransferent:ASC';
    params['filter.status'] = `$eq:${1}`;
    //params['filter.typeTransferent'] = `$eq:NO`;
    delete params['search'];
    this.transferentService.getAll(params).subscribe({
      next: resp => {
        this.transferents = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  changeTransferent(event: any) {
    console.log(event);
    if (event != undefined) {
      this.transferentId = event.id;
      this.getStationSelect(new ListParams());
    } else {
      this.stations = new DefaultSelect(null);
      this.requestSiabForm.get('stationId').setValue(null);
    }
  }

  getStationSelect(param: ListParams, id?: string) {
    const params = new ListParams();
    params['filter.idTransferent'] = `$eq:${this.transferentId}`;
    params['filter.stationName'] = `$ilike:${param.text}`;
    this.stationService.getAll(params).subscribe({
      next: resp => {
        this.stations = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  changeStation(event: any) {
    if (event != undefined) {
      this.stationId = event.id;
      this.getAuthoritySelect(new ListParams());
    } else {
      this.stations = new DefaultSelect(null);
      this.requestSiabForm.get('authorityId').setValue(null);
    }
  }
  getAuthoritySelect(param: ListParams) {
    param['filter.idStation'] = `$eq:${this.stationId}`;
    this.authorityService.getAll(param).subscribe({
      next: resp => {
        this.authorities = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getTypeRelevantSelect(param: ListParams) {
    const params = new ListParams();
    if (param.text != '') {
      params['filter.description'] = `$eq:${param.text}`;
    }
    this.typeRelevanteService.getAll(params).subscribe({
      next: response => {
        this.typeRelevants = new DefaultSelect(response.data, response.count);
      },
    });
  }
}
