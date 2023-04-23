import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { GoodDomiciliesService } from 'src/app/core/services/good/good-domicilies.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentsListComponent } from '../../../programming-request-components/execute-reception/documents-list/documents-list.component';
import { EXPEDIENT_DOC_REQ_COLUMNS } from '../registration-request-form/expedient-doc-columns';

@Component({
  selector: 'app-request-document-form',
  templateUrl: './request-document-form.component.html',
  styleUrls: ['../../styles/search-document-form.scss'],
})
export class RequestDocumentFormComponent extends BasePage implements OnInit {
  @Output() changeTab: EventEmitter<any> = new EventEmitter();
  searchForm: ModelForm<any>;
  regionalsDelegations = new DefaultSelect();
  states = new DefaultSelect();
  documentsReqData: any[] = [];
  showSearchForm: boolean = false;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  idDelegReg: number = 0;
  columns = EXPEDIENT_DOC_REQ_COLUMNS;
  rowSelected: any = null;

  constructor(
    private modalService: BsModalService,
    private bsParentModalRef: BsModalRef,
    private fb: FormBuilder,
    private regionalDelegationService: RegionalDelegationService,
    private delegationStateService: DelegationStateService,
    private requestService: RequestService,
    private goodDomiciliesService: GoodDomiciliesService,
    private municipeService: MunicipalityService,
    private stationService: StationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: EXPEDIENT_DOC_REQ_COLUMNS,
      actions: false,
    };

    this.initForm();
    this.getRegionalDelegationSelect(new ListParams());
    this.reactiveFormCalls();
  }

  ngOnInit(): void {
    this.columns.associate = {
      ...this.columns.associate,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick.subscribe((data: any) => {
          this.showGoods(data);
        });
      },
    };
  }

  initForm() {
    this.searchForm = this.fb.group({
      id: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      recordId: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      regionalDelegationId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      keyStateOfRepublic: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      lawsuit: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
    });
  }

  showGoods(data: any) {
    const object = { changeTab: true, requestId: data.id };
    this.changeTab.emit(object);
  }

  //abrir ver documetnos
  showDocsEst() {
    if (!this.rowSelected) {
      this.message(
        'info',
        'Error',
        'Seleccione un data para poder ver sus documentos'
      );
      return;
    }
    this.openModal(DocumentsListComponent, 'doc-solicitud', this.rowSelected);
  }

  getRegionalDelegationSelect(params: ListParams) {
    params['filter.description'] = `$ilike:${params.text}`;
    this.regionalDelegationService.getAll(params).subscribe({
      next: resp => {
        this.regionalsDelegations = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getStateSelect(params: ListParams, regDelegId?: number) {
    const idDelegReg: any = regDelegId ? regDelegId : this.idDelegReg;
    params['filter.regionalDelegation'] = `$eq:${idDelegReg}`;
    params.limit = 20;
    this.delegationStateService.getAll(params).subscribe({
      next: resp => {
        const stateCode = resp.data
          .map((x: any) => {
            if (x.stateCode != null) {
              return x.stateCode;
            }
          })
          .filter(x => x != undefined);
        this.states = new DefaultSelect(stateCode, stateCode.length);
      },
    });
  }

  resetForm() {
    this.searchForm.reset();
    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    this.search();
    this.documentsReqData = [];
  }

  search() {
    var formFilter = this.searchForm.getRawValue();
    this.builtFilter(formFilter);

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
  }

  builtFilter(formFilter: any) {
    //this.params.value.addFilter('requestStatus', 'A_TURNAR');
    this.params.value.addFilter('id', 0, SearchFilter.GT);
    this.params.value.addFilter(
      'requestStatus',
      'A_TURNAR',
      SearchFilter.ILIKE
    );

    for (const key in formFilter) {
      if (formFilter[key] !== null) {
        this.params.value.addFilter(key, formFilter[key]);
      }
    }
  }

  getData() {
    this.loading = true;
    var filter = this.params.getValue().getParams();
    this.requestService.getAll(filter).subscribe({
      next: (resp: any) => {
        console.log(resp);

        const result = resp.data.map(async (item: any) => {
          item['applicationDate'] = new Date(
            item.applicationDate
          ).toLocaleDateString();
          item['paperDate'] = new Date(item.paperDate).toLocaleDateString();
          item['regionalDelegationName'] =
            item.regionalDelegation.description ?? '';
          item['stateName'] = item.state.descCondition;
          item['transferentName'] = item.transferent.name;

          if (item.stationId) {
            const stationName = await this.getStation(item.stationId);
            item['stationName'] = stationName;
          } else {
            item['stationName'] = '';
          }
          item['authorityName'] = item.authority.authorityName;
          let domicilie: any = {};
          if (item.idAddress !== null) {
            domicilie = await this.getDomicilie(item.idAddress);
          }
          item['municipalityName'] = domicilie.municipalityName ?? '';
          item['exteriorNumber'] = domicilie.exteriorNumber ?? '';
          item['interiorNumber'] = domicilie.interiorNumber ?? '';
          item['description'] = domicilie.description ?? '';
          item['latitude'] = domicilie.latitude ?? '';
          item['length'] = domicilie.length ?? '';
        });

        Promise.all(result).then(data => {
          this.documentsReqData = resp.data;
          this.totalItems = resp.count;
          this.loading = false;
        });
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  getDomicilie(addressId: number) {
    return new Promise((resolve, reject) => {
      var response: any = {};
      this.goodDomiciliesService.getById(addressId).subscribe({
        next: async (resp: any) => {
          response = {
            exteriorNumber: resp.exteriorNumber,
            interiorNumber: resp.interiorNumber,
            code: resp.code,
            description: resp.description,
            latitude: resp.latitude,
            length: resp.length,
            municipalityName: '',
          };
          if (resp.municipalityKey && resp.statusKey) {
            const value = await this.getMunicipe(
              resp.municipalityKey,
              resp.statusKey
            );
            response['municipalityName'] = value;
            resolve(response);
          } else {
            resolve(response);
          }
        },
      });
    });
  }

  getMunicipe(munipaliId: string, stateId: string) {
    return new Promise((resolve, reject) => {
      var params = new ListParams();
      params['municipalityId.'] = munipaliId;
      params['stateKey.'] = stateId;
      this.municipeService.getAll(params).subscribe({
        next: resp => {
          const municipaly = resp.data[0].nameMunicipality;
          resolve(municipaly);
        },
      });
    });
  }

  getStation(stationId: string) {
    return new Promise((resolve, reject) => {
      this.stationService.getById(stationId).subscribe({
        next: resp => {
          resolve(resp.stationName);
        },
        error: error => {
          resolve('');
        },
      });
    });
  }

  selectRow(event: any) {
    this.rowSelected = event.data;
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }

  openModal(component: any, typeDoc: string, parameters?: any) {
    let config: ModalOptions = {
      initialState: {
        parameter: parameters,
        typeDoc: typeDoc,
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsParentModalRef = this.modalService.show(component, config);

    /*this.bsModalRef.content.event.subscribe((res: any) => {
      this.matchLevelFraction(res);
    });*/
  }

  reactiveFormCalls() {
    this.searchForm.controls['regionalDelegationId'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          this.idDelegReg = Number(data);
          this.getStateSelect(new ListParams(), Number(data));
        }
      }
    );
  }
}
