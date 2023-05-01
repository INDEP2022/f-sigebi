import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
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
import {
  NUMBERS_PATTERN,
  NUM_POSITIVE_LETTERS,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { DocumentsListComponent } from '../../../programming-request-components/execute-reception/documents-list/documents-list.component';
import { RequestHelperService } from '../../../request-helper-services/request-helper.service';
import { ShowSignatureProgrammingComponent } from '../../../shared-request/show-signature-programming/show-signature-programming.component';
import { AssociateFileComponent } from '../associate-file/associate-file.component';
import { EXPEDIENT_DOC_GEN_COLUMNS } from '../registration-request-form/expedient-doc-columns';

@Component({
  selector: 'app-general-documents-form',
  templateUrl: './general-documents-form.component.html',
  styleUrls: ['../../styles/search-document-form.scss'],
})
export class GeneralDocumentsFormComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() searchFileForm: FormGroup;
  @Input() requestForm: any;
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
  requestId: number = 0;
  columns = EXPEDIENT_DOC_GEN_COLUMNS;
  idDelegReg: number = null;
  idTransferent: number = null;
  idStation: number = null;
  rowSelected: any;

  private http = inject(HttpClient);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private authorityService: AuthorityService,
    private regionalDelegationService: RegionalDelegationService,
    //private delegationStateService: DelegationStateService,
    private stateOfRepublicService: StateOfRepublicService,
    private transferenteService: TransferenteService,
    private stationService: StationService,
    private requestService: RequestService,
    private bsParentModalRef: BsModalRef,
    private requestHelperService: RequestHelperService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: EXPEDIENT_DOC_GEN_COLUMNS,
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.requestForm.valueChanges.subscribe((data: any) => {
      //console.log(this.requestForm.getRawValue());
    });
  }

  ngOnInit(): void {
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.requestId === 0 || !this.requestId) {
      this.router.navigate(['pages/request/list']);
    }

    this.columns.associate = {
      ...this.columns.associate,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick.subscribe((data: any) => {
          this.associateRequestAndExpedient(data);
        });
      },
    };
    this.initSearchForm();
    this.getRegionalDelegationSelect(new ListParams());
    this.getTransferentSelect(new ListParams());
    this.getStateSelect(new ListParams());
    this.reactiveFormCalls();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      id: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      authorityId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      typeOfTransfer: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      recordId: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      indicatedTaxpayer: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(200)],
      ],
      domainExtinction: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      regionalDelegationId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      transferenceFile: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1250)],
      ],
      trialType: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ], //tipo de juicio
      keyStateOfRepublic: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      trial: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(200)],
      ],
      previousInquiry: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      transferenceId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      lawsuit: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      stationId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      protectNumber: [
        null,
        [Validators.pattern(NUM_POSITIVE_LETTERS), Validators.maxLength(100)],
      ],
    });
  }

  //seleccionar fila
  selectRow(event: any) {
    this.rowSelected = event.data;
  }

  //abrir nuevo expediente
  newExpedient() {
    this.openModal(AssociateFileComponent, 'doc-expediente', this.requestForm);
  }

  //abrir ver documentos
  showDocsEst() {
    if (!this.rowSelected) {
      this.message(
        'info',
        'Error',
        'Seleccione un data para poder ver sus documentos'
      );
      return;
    }
    this.openModal(DocumentsListComponent, 'doc-expediente', this.rowSelected);
  }

  /* electronicSign() {
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
  } */

  showSignProg() {
    const showSignProg = this.modalService.show(
      ShowSignatureProgrammingComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  resetForm() {
    this.searchForm.reset();
    this.documentsGenData = [];
    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    this.search();
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
          element['regionalDelegationName'] =
            element.regionalDelegation !== null
              ? element.regionalDelegation.description
              : '';
          element['stateName'] =
            element.state !== null ? element.state.descCondition : '';
          element['transferentName'] =
            element.transferent !== null ? element.transferent.name : '';
          element['stationName'] =
            element.emisora !== null ? element.emisora.stationName : '';
          element['authorityName'] =
            element.authority !== null ? element.authority.authorityName : '';
        }

        this.documentsGenData = resp.data;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  builtFilter(form: any) {
    //this.params.value.addFilter('requestStatus', 'A_TURNAR');
    this.params.value.addFilter('recordId', 0, SearchFilter.NOT);
    for (const key in form) {
      if (form[key] !== null) {
        this.params.value.addFilter(key, form[key]);
      }
    }
  }

  getAuthoritySelect(params: ListParams) {
    params.text = params.text == null ? '' : params.text;
    params['filter.idStation'] = `$eq:${this.idStation}`;
    params['filter.idTransferer'] = `$eq:${this.idTransferent}`;
    params['filter.authorityName'] = `$ilike:${params.text}`;
    this.authorityService
      .getAll(params)
      .subscribe((data: IListResponse<IAuthority>) => {
        this.authorities = new DefaultSelect(data.data, data.count);
      });
  }

  getRegionalDelegationSelect(params: ListParams) {
    params['filter.description'] = `$ilike:${params.text}`;
    this.regionalDelegationService.getAll(params).subscribe({
      next: resp => {
        this.regionalsDelegations = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getStateSelect(params: ListParams) {
    //const idDelegReg: any = regDelegId ? regDelegId : this.idDelegReg;
    params['filter.descCondition'] = `$ilike:${params.text}`;
    this.stateOfRepublicService.getAll(params).subscribe({
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
    params['filter.nameTransferent'] = `$ilike:${params.text}`;
    this.transferenteService.getAll(params).subscribe({
      next: (resp: any) => {
        this.transferents = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getStationSelect(params: ListParams, transferentId?: number) {
    const idTransfer = transferentId ? transferentId : this.idTransferent;
    params['filter.idTransferent'] = `$eq:${idTransfer}`;
    params.limit = 30;
    this.stationService.getAll(params).subscribe({
      next: resp => {
        this.stations = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  associateRequestAndExpedient(expedient: any) {
    var request = { id: this.requestId, recordId: expedient.recordId };
    if (this.requestId) {
      this.alertMessage(request);
    }
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
    /* this.searchForm.controls['regionalDelegationId'].valueChanges.subscribe(
      resp => {
        if (resp) {
          this.idDelegReg = Number(resp);
          this.getStateSelect(new ListParams(), Number(resp));
        }
      }
    );*/

    this.searchForm.controls['transferenceId'].valueChanges.subscribe(resp => {
      if (resp) {
        this.idTransferent = Number(resp);
        this.getStationSelect(new ListParams(), Number(resp));
      }
    });

    this.searchForm.controls['stationId'].valueChanges.subscribe(resp => {
      if (resp) {
        this.idStation = Number(resp);
        this.getAuthoritySelect(new ListParams());
      }
    });
  }

  updateStateRequestTab() {
    this.requestHelperService.associateExpedient(true);
  }

  alertMessage(request: any) {
    Swal.fire({
      title: 'Asociar Solicitud',
      text:
        '¿Está seguro de querer asociar la solicitud actual con el expediente Nº ' +
        request.recordId +
        '?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#B38E5D',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        this.onLoadToast(
          'success',
          'Expediente relacionado a la solicitud correctamente',
          ''
        );
        this.updateStateRequestTab();
        this.requestService.update(this.requestId, request).subscribe({
          next: resp => {
            if (resp.stateCode != null) {
              this.onLoadToast(
                'error',
                'Error',
                `Ocurrio un error al asociar la socitud con el expediente ${resp.message[0]}`
              );
            }

            if (resp.id != null) {
              Swal.fire({
                title: 'Solicitud asociada al expediente: ' + this.requestId,
                showDenyButton: false,
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
                denyButtonText: `Don't save`,
                confirmButtonColor: '#9D2449',
              }).then(result => {
                if (result.isConfirmed) {
                  this.onLoadToast(
                    'success',
                    'Expediente asociado a la solicitud correctamente',
                    ''
                  );
                  this.updateStateRequestTab();
                }
              });
            }
          },
        });
      }
    });
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }
}
