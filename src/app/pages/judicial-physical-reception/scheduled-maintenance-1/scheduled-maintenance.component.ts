import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import {
  IProceedingByGood,
  ProceedingsDeliveryReceptionService,
} from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-detail-delivery-reception.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { ACTAS_BY_GOOD_COLUMNS } from './../scheduled-maintenance/interfaces/columns';

import { Router } from '@angular/router';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ScheduledMaintenance } from '../scheduled-maintenance/scheduled-maintenance';

@Component({
  selector: 'app-scheduled-maintenance',
  templateUrl: './scheduled-maintenance.component.html',
  styleUrls: [
    'scheduled-maintenance.scss',
    './schedule-maintenance.component.scss',
  ],
})
export class ScheduledMaintenanceComponent
  extends ScheduledMaintenance
  implements OnInit
{
  selecteds: IProceedingDeliveryReception[];
  constructor(
    protected override fb: FormBuilder,
    protected override modalService: BsModalService,
    protected override delegationService: DelegationService,
    protected override service: ProceedingsDeliveryReceptionService,
    protected override detailService: ProceedingsDetailDeliveryReceptionService,
    protected override userService: UsersService,
    private router: Router
  ) {
    super(
      fb,
      modalService,
      delegationService,
      service,
      detailService,
      userService,
      'filtersActa'
    );
    this.settings1 = {
      ...this.settings1,
      selectMode: 'multi',
      actions: { ...this.settings1.actions, delete: true },
    };
    console.log(this.settings1);
  }

  deleteProgramations() {
    console.log(this.selecteds);
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar estos registros?'
    ).then(question => {
      if (question.isConfirmed) {
        this.service.deleteMasive(this.selecteds).subscribe({
          next: response => {
            let actas = '';
            this.selecteds.forEach((selected, index) => {
              actas +=
                selected.id + (index < this.selecteds.length - 1 ? ',' : '');
            });
            this.onLoadToast(
              'success',
              'Exito',
              `Se eliminaron las actas N° ${actas}`
            );
            this.getProceedingReception();
          },
          error: err => {
            let actas = '';
            this.selecteds.forEach((selected, index) => {
              actas +=
                selected.id + (index < this.selecteds.length - 1 ? ',' : '');
            });
            this.onLoadToast(
              'error',
              'ERROR',
              `No se pudieron eliminar las actas° ${actas}`
            );
          },
        });
      }
    });
  }

  redirectDetailMaintenance(item: IProceedingDeliveryReception) {
    console.log(item);
    window.localStorage.setItem('detailActa', JSON.stringify(item));
    this.saveForm();
    this.router.navigate([
      'pages/judicial-physical-reception/scheduled-maintenance-1/detail',
    ]);
  }

  showDeleteAlert(item: IProceedingDeliveryReception) {
    console.log(item);
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.service.deleteById(item).subscribe({
          next: response => {
            console.log(response);
            this.getProceedingReception();
            this.onLoadToast(
              'success',
              'Exito',
              `Se elimino la acta N° ${item.id}`
            );
          },
          error: err => {
            console.log(err);
            this.onLoadToast(
              'error',
              'ERROR',
              `No se pudo eliminar el Acta N° ${item.id}`
            );
          },
        });
      }
    });
  }

  rowsSelected(event: { selected: IProceedingDeliveryReception[] }) {
    console.log(event);
    this.selecteds = event.selected;
  }

  openModalActas() {
    this.openModalSelect(
      {
        title: 'Actas por Bien',
        columnsType: { ...ACTAS_BY_GOOD_COLUMNS },
        service: this.service,
        dataObservableId: this.service.getByGoodId,
        searchFilter: null,
        showError: false,
      },
      this.selectActa
    );
  }

  selectActa(acta: IProceedingByGood, self: ScheduledMaintenanceComponent) {
    const filterParams = new FilterParams();
    filterParams.addFilter('id', acta.proceedingnumber);
    self.service.getAll(filterParams.getParams()).subscribe({
      next: response => {
        console.log(response);
        if (response.data && response.data[0]) {
          self.redirectDetailMaintenance(response.data[0]);
        } else {
          self.onLoadToast('error', 'ERROR', `Data no encontrada`);
        }
      },
      error: err => {
        console.log(err);
        self.onLoadToast('error', 'ERROR', `Data no encontrada`);
      },
    });
  }

  fillElementsToExport() {}
}

const EXAMPLE_DATA = [
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'no ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'no ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'no ingresado',
  },
];
