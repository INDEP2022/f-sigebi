import { Location } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { UsersSelectedToTurnComponent } from '../users-selected-to-turn/users-selected-to-turn.component';
//Provisional Data
import { BehaviorSubject } from 'rxjs';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import {
  FilterParams,
  ListParams,
} from '../../../../common/repository/interfaces/list-params';
import { IListResponse } from '../../../../core/interfaces/list-response.interface';
import { ITransferente } from '../../../../core/models/catalogs/transferente.model';
import { AuthorityService } from '../../../../core/services/catalogs/authority.service';
import { RegionalDelegationService } from '../../../../core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from '../../../../core/services/catalogs/state-of-republic.service';
import { StationService } from '../../../../core/services/catalogs/station.service';
import { TransferenteService } from '../../../../core/services/catalogs/transferente.service';
import { RequestService } from '../../../../core/services/requests/request.service';
import { issuesData } from './data';

@Component({
  selector: 'app-create-request',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
})
export class RequestFormComponent extends BasePage implements OnInit {
  @Input() op: number; // op con valor 1 = Recepción Manual, op con valor 2 = Documentación Complementaria
  @Input() edit: boolean = false;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  showSearchForm: boolean = true;
  bsValue = new Date();
  requestForm: ModelForm<any>;
  isReadOnly: boolean = true;

  bsModalRef: BsModalRef;
  checked: string = 'checked';
  userName: string = '';
  idsObject: any = {
    idTransferer: null,
    idStation: null,
  };

  selectRegionalDeleg = new DefaultSelect<any>();
  selectEntity = new DefaultSelect<any>();
  selectStation = new DefaultSelect<any>();

  selectAuthority = new DefaultSelect<any>();
  selectTransfe = new DefaultSelect<any>();
  selectState = new DefaultSelect<any>();
  selectIssue = new DefaultSelect<any>();

  issues = new DefaultSelect<any>();

  regionalDelegationService = inject(RegionalDelegationService);
  delegationStateService = inject(DelegationStateService);

  stateOfRepublicService = inject(StateOfRepublicService);
  stationService = inject(StationService);
  authorityService = inject(AuthorityService);
  transferentService = inject(TransferenteService);
  requestService = inject(RequestService);

  selectedRegDel: any = null;

  constructor(
    public fb: FormBuilder,
    public modalService: BsModalService,
    public location: Location
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getIssue();
    this.getRegionalDeleg(new ListParams());
    this.getTransferent(new ListParams());

    this.requestForm.controls['transferenceId'].valueChanges.subscribe(
      (data: any) => {
        if (data != null) {
          this.idsObject.idTransferer = Number(data);
          this.getStation(data);
        }
      }
    );

    this.requestForm.controls['stationId'].valueChanges.subscribe(
      (data: any) => {
        if (data != null) {
          this.idsObject.idStation = Number(data);
          this.getAuthority(new ListParams(), this.idsObject);
        }
      }
    );
  }

  prepareForm(): void {
    this.requestForm = this.fb.group({
      id: [null],
      applicationDate: [{ value: null, disabled: true }],
      paperNumber: [null, [Validators.required, Validators.maxLength(40)]],
      regionalDelegationId: [{ value: null, disabled: true }], // cargar la delegacion a la que pertence
      transferenceId: [null, Validators.required],
      keyStateOfRepublic: [null, Validators.required],
      stationId: [null, Validators.required],
      authorityId: [null, Validators.required],
      targetUserType: ['TE'],
      affair: [null],
      targetUser: [null],
      requestStatus: [null],
    });
    this.requestForm.controls['applicationDate'].patchValue(this.bsValue);

    //se agregan campos documentación complementaria según el valor del parametro OP
    if (this.op == 2) this.complementaryDocumentationField(this.requestForm);
  }

  complementaryDocumentationField(form: ModelForm<IRequest>) {
    // agregar nuevos campos al formulario para solicitudes de documentacion complementaria
    form.addControl('keyStateOfRepublic', this.fb.control('', []));
    form.addControl('affair', this.fb.control('', []));
  }

  getRegionalDeleg(params?: ListParams) {
    this.regionalDelegationService.getById(11).subscribe((data: any) => {
      this.requestForm.controls['regionalDelegationId'].setValue(data.id);
      this.selectRegionalDeleg = new DefaultSelect([data], data.count);

      this.getEntity(new ListParams(), 11);
    });
  }

  getEntity(params: ListParams, id?: number | string): void {
    params.page = 1;
    params.limit = 10;
    params['filter.regionalDelegation'] = `$eq:${id}`;
    this.delegationStateService.getAll(params).subscribe({
      next: data => {
        const stateCode = data.data
          .map((x: any) => {
            if (x.stateCode != null) {
              return x.stateCode;
            }
          })
          .filter(x => x != undefined);

        this.selectEntity = new DefaultSelect(stateCode, stateCode.length);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getStation(id: any) {
    const params = new ListParams();
    params['filter.idTransferent'] = `$eq:${id}`;
    params.limit = 30;
    this.stationService.getAll(params).subscribe((data: IListResponse<any>) => {
      this.selectStation = new DefaultSelect(data.data, data.count);
    });
  }

  getAuthority(params: ListParams, paramsObject?: any) {
    params.limit = 30;
    this.authorityService
      .postByColumns(params, paramsObject)
      .subscribe((data: IListResponse<IAuthority>) => {
        this.selectAuthority = new DefaultSelect(data.data, data.count);
      });
  }

  getTransferent(params?: ListParams) {
    this.transferentService
      .search(params)
      .subscribe((data: IListResponse<ITransferente>) => {
        this.selectTransfe = new DefaultSelect(data.data, data.count);
      });
  }

  getState(event: any): void {}

  getIssue(event?: any): void {
    //Provisional data
    let data = issuesData;
    let count = data.length;
    this.issues = new DefaultSelect(data, count);
  }

  openModalSelectUser() {
    let config: ModalOptions = {
      initialState: {
        request: this.requestForm.value,
        /*callback: (next: boolean) => {
          if (next) this.getExample();
        },*/
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      UsersSelectedToTurnComponent,
      config
    );
    this.bsModalRef.content.event.subscribe((res: any) => {
      this.userName = res.firstName;
      this.requestForm.controls['targetUser'].setValue(res.id);
    });
  }

  save() {
    this.requestForm.get('requestStatus').patchValue('POR_TURNAR');
    this.requestForm.controls['applicationDate'].setValue(
      new Date().toISOString().toString()
    );
    let form = this.requestForm.getRawValue();
    this.loading = true;
    this.requestService.create(form).subscribe(
      (data: any) => {
        this.msgModal(
          'Se guardo la solicitud con el Folio Nº '.concat(
            `<strong>${data.id}</strong>`
          ),
          'Solicitud Guardada',
          'success'
        );
      },
      error => {
        this.loading = false;
      }
    );
  }

  turnRequest(): void {
    if (this.requestForm.controls['targetUser'].value === null) {
      this.onLoadToast(
        'info',
        'Información',
        `Seleccione un usuario para poder turnar la solicitud!`
      );
      return;
    }

    this.requestForm.get('requestStatus').patchValue('A_TURNAR');
    this.requestForm.controls['applicationDate'].setValue(
      new Date().toISOString().toString()
    );

    this.loading = true;
    let form = this.requestForm.getRawValue();

    let action = null;
    if (form.id === null) {
      action = this.requestService.create(form);
    } else {
      action = this.requestService.update(form.id, form);
    }

    action.subscribe(
      (data: any) => {
        this.msgModal(
          'Se turnar la solicitud con el Folio Nº '
            .concat(`<strong>${data.id}</strong>`)
            .concat(` al usuario ${this.userName}`),
          'Solicitud Creada',
          'success'
        );
      },
      error => {
        this.loading = false;
      }
    );
  }

  msgModal(message: string, title: string, typeMsg: any) {
    Swal.fire({
      title: title,
      html: message,
      icon: typeMsg,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        this.requestForm.reset();
        this.requestForm.controls['applicationDate'].patchValue(this.bsValue);
        this.getRegionalDeleg(new ListParams());
        this.userName = '';
        this.loading = false;
      }
    });
  }
}
