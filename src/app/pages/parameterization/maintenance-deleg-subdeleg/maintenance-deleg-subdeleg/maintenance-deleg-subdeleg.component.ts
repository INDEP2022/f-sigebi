import { Component, OnInit, Renderer2 } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { MaintenanceDelegSubdelegModalComponent } from '../maintenance-deleg-subdeleg-modal/maintenance-deleg-subdeleg-modal.component';
import {
  DELEGATION_COLUMNS,
  SUBDELEGATION_COLUMNS,
} from './maintenance-deleg-sub-columns';
//models
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
//services
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SubDelegationService } from 'src/app/core/services/maintenance-delegations/subdelegation.service';
import Swal from 'sweetalert2';
import { DelegationModalComponent } from '../delegation-modal/delegation-modal.component';

@Component({
  selector: 'app-maintenance-deleg-subdeleg',
  templateUrl: './maintenance-deleg-subdeleg.component.html',
  styles: [],
})
export class MaintenanceDelegSubdelegComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  totalItems2: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  delegationList: IDelegation[] = [];
  subDelegationList: ISubdelegation[] = [];
  delegations: IDelegation;
  dataId: any;

  settings2;

  loading1 = this.loading;
  loading2 = this.loading;

  constructor(
    private modalService: BsModalService,
    private delegationService: DelegationService,
    private subDelegationService: SubDelegationService,
    private r2: Renderer2
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...DELEGATION_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      hideSubHeader: true,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...SUBDELEGATION_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDelegationAll());
  }

  //Trae lista de delegaciones
  getDelegationAll() {
    this.loading1 = true;

    this.delegationService.getAll2(this.params.getValue()).subscribe({
      next: response => {
        this.delegationList = response.data;
        this.totalItems = response.count;
        this.loading1 = false;
      },
      error: error => {
        this.loading1 = false;
        console.log(error);
      },
    });
  }

  //Abre formulario para actualizar delegaciones
  openForm(delegationM?: IDelegation) {
    let config: ModalOptions = {
      initialState: {
        delegationM,
        callback: (next: boolean) => {
          if (next) this.getDelegationAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DelegationModalComponent, config);
  }

  //Msj de alerta para borrar Delegaciones
  showDeleteAlert(delegation?: IDelegation) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(delegation.id, delegation.etapaEdo);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  //método para borrar delegaciones
  delete(id: number, etapaEdo: number) {
    this.delegationService.remove2(id, etapaEdo).subscribe({
      next: () => this.getDelegationAll(),
    });
  }

  //Método para seleccionar un registro de Delegaciones
  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.subDelegationList = [];
    this.delegations = event.data;
    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getSubDelegations(this.delegations);
      const btn = document.getElementById('new-sd');
      this.r2.removeClass(btn, 'disabled');
      this.dataId = this.delegations;
    });
  }

  //Con el id seleccionado de delegaciones se obtienen sus subdelegaciones
  getSubDelegations(delegation: IDelegation) {
    this.loading2 = true;
    this.subDelegationService
      .getById(delegation.id, this.params2.getValue())
      .subscribe({
        next: response => {
          this.subDelegationList = response.data;
          this.totalItems2 = response.count;
          this.loading2 = false;
        },
        error: error => (this.loading2 = false),
      });
  }

  //Abre formulario de subdelegaciones para actualizar
  openForm2(subDelegation?: ISubdelegation) {
    console.log(subDelegation);
    const idD = { ...this.delegations };
    let delegation = this.delegations;
    let config: ModalOptions = {
      initialState: {
        subDelegation,
        delegation,
        idD,
        callback: (next: boolean) => {
          if (next) this.getSubDelegations(this.dataId);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MaintenanceDelegSubdelegModalComponent, config);
  }

  //Msj de alerta para borrar SubDelegaciones
  showDeleteAlert2(subDelegation?: ISubdelegation) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete2(subDelegation);
      }
    });
  }

  //método para borrar Sub Delegaciones
  delete2(subDelegation?: ISubdelegation) {
    const idDelegation = { ...this.delegations };
    const formData: Object = {
      id: Number(subDelegation.id),
      phaseEdo: Number(subDelegation.phaseEdo),
      delegationNumber: Number(idDelegation.id),
    };
    console.log('datos a eliminar:', formData);
    this.subDelegationService.remove(formData).subscribe({
      next: () => (
        Swal.fire('Borrado', '', 'success'), this.getSubDelegations(this.dataId)
      ),
      error: err =>
        this.onLoadToast(
          'warning',
          'No se puede eliminar',
          'Contactar con administrador'
        ),
    });
  }
}
