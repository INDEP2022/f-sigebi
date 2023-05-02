import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  map,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { SharedModule } from 'src/app/shared/shared.module';
import { COORDINATION_COLUMNS } from './coordination-modal-columns';

@Component({
  selector: 'coordination-modal',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './coordination-modal.component.html',
  styles: [],
})
export class CoordinationModalComponent extends BasePage implements OnInit {
  delegations: IDelegation[] = [];
  totalItems = 0;
  params = new BehaviorSubject(new FilterParams());
  delegationsSelected: IDelegation[] = [];
  constructor(
    private delegationService: DelegationService,
    private goodParameterService: GoodParametersService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        ...COORDINATION_COLUMNS,
        name: {
          title: 'Seleccion volante',
          sort: false,
          type: 'custom',
          valuePrepareFunction: (value: boolean, delegation: IDelegation) =>
            this.isDelegationSelected(delegation),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectDelegation(instance),
        },
      },
    };
  }

  isDelegationSelected(delegation: IDelegation) {
    const exists = this.delegationsSelected.find(
      del => del.id == delegation.id && del.etapaEdo == delegation.etapaEdo
    );
    return exists ? true : false;
  }

  onSelectDelegation(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.selectDelegation(data.row, data.toggle),
    });
  }

  selectDelegation(delegation: IDelegation, selected: boolean) {
    if (selected) {
      this.delegationsSelected.push(delegation);
    } else {
      this.delegationsSelected = this.delegationsSelected.filter(
        del => del.id == delegation.id && del.etapaEdo == delegation.etapaEdo
      );
    }
  }

  ngOnInit(): void {
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        switchMap(params => this.getDelegations(params))
      )
      .subscribe();
  }

  getDelegations(params: FilterParams) {
    this.loading = true;
    params.removeAllFilters();
    return this.getPhaseEdo().pipe(
      tap(phase => params.addFilter('etapaEdo', phase)),
      switchMap(() =>
        this.delegationService.getAllFiltered(params.getParams()).pipe(
          catchError(error => {
            this.loading = false;
            this.onLoadToast(
              'error',
              'Error',
              'Ocurrio un error al obtener las delegaciones'
            );
            return throwError(() => error);
          }),
          tap(response => {
            this.loading = false;
            this.delegations = response.data;
            this.totalItems = response.count;
          })
        )
      )
    );
  }

  getPhaseEdo() {
    return this.goodParameterService.getPhaseEdo().pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener la Etapa Edo'
        );
        return throwError(() => error);
      }),
      map(response => response.stagecreated)
    );
  }

  confirm() {
    this.modalRef.content.callback(this.delegationsSelected);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
