import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentsListComponent } from '../../../programming-request-components/execute-reception/documents-list/documents-list.component';
import { ElectronicSignatureListComponent } from '../../../shared-request/electronic-signature-list/electronic-signature-list.component';
import { ShowSignatureProgrammingComponent } from '../../../shared-request/show-signature-programming/show-signature-programming.component';
import { AssociateFileComponent } from '../associate-file/associate-file.component';
import { EXPEDIENT_DOC_GEN_COLUMNS } from '../registration-request-form/expedient-doc-columns';

@Component({
  selector: 'app-general-documents-form',
  templateUrl: './general-documents-form.component.html',
  styleUrls: ['../../styles/search-document-form.scss'],
})
export class GeneralDocumentsFormComponent extends BasePage implements OnInit {
  @Input() searchFileForm: FormGroup;
  searchForm: ModelForm<IRequest>;
  authorities = new DefaultSelect();
  regionalsDelegations = new DefaultSelect();
  states = new DefaultSelect();
  transferents = new DefaultSelect();
  stations = new DefaultSelect();
  showSearchForm: boolean = false;
  documentsGenData: any[] = [];
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  columns = EXPEDIENT_DOC_GEN_COLUMNS;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private authorityService: AuthorityService,
    private regionalDelegationService: RegionalDelegationService,
    //private delegationStateService: DelegationStateService,
    private stateOfRepublicServicio: StateOfRepublicService,
    private transferenteService: TransferenteService,
    private stationService: StationService,
    private requestService: RequestService,
    private bsModalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: EXPEDIENT_DOC_GEN_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.columns.associate = {
      ...this.columns.associate,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick.subscribe((data: any) => {
          console.log(data);
        });
      },
    };
    this.initSearchForm();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      id: [null],
      authorityId: [null],
      typeOfTransfer: [null],
      recordId: [null],
      indicatedTaxpayer: [null],
      domainExtinction: [null],
      regionalDelegationId: [null],
      transferenceFile: [null],
      trialType: [null], //tipo de juicio
      keyStateOfRepublic: [null],
      trial: [null],
      previousInquiry: [null],
      transferenceId: [null],
      lawsuit: [null],
      stationId: [null],
      protectNumber: [null],
    });
  }

  newExpedient() {
    /*const newExpedient = this.modalService.show(AssociateFileComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });*/
    this.openModal(AssociateFileComponent);
  }

  showDocsEst() {
    const showDoctsEst = this.modalService.show(DocumentsListComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  electronicSign() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          this.showSignProg();
        }
      },
    };

    const electronicSign = this.modalService.show(
      ElectronicSignatureListComponent,
      config
    );
  }

  showSignProg() {
    const showSignProg = this.modalService.show(
      ShowSignatureProgrammingComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  search() {
    var formFilter = this.searchForm.getRawValue();
    this.builtFilter(formFilter);

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
  }

  getData() {
    this.loading = true;
    var filter = this.params.getValue().getParams();
    this.requestService.getAll(filter).subscribe({
      next: (resp: any) => {
        this.totalItems = resp.count;
        for (let i = 0; i < resp.data.length; i++) {
          const element = resp.data[i];
          element['applicationDate'] = new Date(
            element.applicationDate
          ).toLocaleDateString();
          element['paperDate'] = new Date(
            element.paperDate
          ).toLocaleDateString();
          element['regionalDelegationName'] = element.delegation.description;
          element['stateName'] = element.state.descCondition;
          element['transferentName'] = element.transferent.name;
          element['stationName'] = element.emisora.stationName;
          element['authorityName'] = element.authority.authorityName;
        }

        this.documentsGenData = resp.data;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  builtFilter(form: any) {
    this.params.value.addFilter('requestStatus', 'A_TURNAR');
    this.params.value.addFilter('recordId', 0, SearchFilter.NOT);
    for (const key in form) {
      if (form[key] !== null) {
        this.params.value.addFilter(key, form[key]);
      }
    }
  }

  getAuthoritySelect(params: ListParams) {
    params.text = params.text == null ? '' : params.text;
    this.authorityService
      .search(params)
      .subscribe((data: IListResponse<IAuthority>) => {
        this.authorities = new DefaultSelect(data.data, data.count);
      });
  }

  getRegionalDelegationSelect(params: ListParams) {
    params.text = params.text == null ? '' : params.text;
    this.regionalDelegationService.search(params).subscribe({
      next: resp => {
        this.regionalsDelegations = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getStateSelect(params: ListParams, regDelegId?: Number) {
    // params['filter.regionalDelegation'] = `$eq:${regDelegId}`;
    this.stateOfRepublicServicio.search(params).subscribe({
      next: resp => {
        /*const stateCode = resp.data
          .map((x: any) => {
            if (x.stateCode != null) {
              return x.stateCode;
            }
          })
          .filter(x => x != undefined);*/
        this.states = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getTransferentSelect(params: ListParams) {
    params.text = params.text == null ? '' : params.text;
    this.transferenteService.search(params).subscribe({
      next: (resp: any) => {
        this.transferents = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getStationSelect(params: ListParams) {
    params.text = params.text == null ? '' : params.text;
    this.stationService.search(params).subscribe({
      next: resp => {
        this.stations = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  openModal(component: any) {
    let config: ModalOptions = {
      initialState: {
        parameter: '',
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);

    /*this.bsModalRef.content.event.subscribe((res: any) => {
      this.matchLevelFraction(res);
    });*/
  }
}
