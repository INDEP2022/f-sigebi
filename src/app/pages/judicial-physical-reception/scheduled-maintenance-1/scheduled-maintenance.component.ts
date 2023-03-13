import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import {
  IDeleted,
  INotDeleted,
  IProceedingByGood,
  ProceedingsDeliveryReceptionService,
} from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-detail-delivery-reception.service';
import { ACTAS_BY_GOOD_COLUMNS } from './../scheduled-maintenance/interfaces/columns';

import { Router } from '@angular/router';
import { SelectListFilteredModalComponent } from 'src/app/@standalone/modals/select-list-filtered-modal/select-list-filtered-modal.component';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ScheduledMaintenance } from '../scheduled-maintenance/scheduled-maintenance';

@Component({
  selector: 'app-scheduled-maintenance',
  templateUrl: './scheduled-maintenance.component.html',
  styleUrls: [
    'scheduled-maintenance.scss',
    './scheduled-maintenance.component.scss',
  ],
})
export class ScheduledMaintenanceComponent
  extends ScheduledMaintenance
  implements OnInit
{
  selecteds: IProceedingDeliveryReception[] = [];
  constructor(
    private modalService: BsModalService,
    protected override fb: FormBuilder,
    protected override service: ProceedingsDeliveryReceptionService,
    protected override detailService: ProceedingsDetailDeliveryReceptionService,
    private router: Router
  ) {
    super(fb, service, detailService, 'filtersActa');
    this.settings1 = {
      ...this.settings1,
      selectMode: 'multi',
      actions: { ...this.settings1.actions, delete: true },
    };
    // console.log(this.settings1);
  }

  private showMessageProceedingsRemoved(
    removeds: string[],
    notRemoveds: string[]
  ) {
    let proceedings = '';
    if (removeds.length > 0) {
      removeds.forEach((selected, index) => {
        proceedings +=
          selected + (index < this.selecteds.length - 1 ? ',' : '');
      });
      this.onLoadToast(
        'success',
        'Exito',
        `Se eliminaron las actas N° ${proceedings} ` +
          this.showMessageProceedingsNotRemoved(notRemoveds)
      );
    } else {
      if (notRemoveds.length > 0) {
        this.onLoadToast(
          'success',
          'Exito',
          `Elimine primero el detalle de las actas N° ${proceedings}`
        );
      }
    }
  }

  private showMessageProceedingsNotRemoved(notRemoveds: string[]) {
    let proceedingsNotRemoveds = '';
    if (notRemoveds.length > 0) {
      notRemoveds.forEach((selected, index) => {
        proceedingsNotRemoveds +=
          selected + (index < this.selecteds.length - 1 ? ',' : '');
      });
      return `pero no se pudieron eliminar las actas N° ${proceedingsNotRemoveds} porque tienen detalles de acta`;
    } else {
      return '';
    }
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
            console.log(response);
            const removeds: string[] = [];
            const notRemoveds: string[] = [];
            response.forEach(item => {
              const { deleted } = item as IDeleted;
              const { error } = item as INotDeleted;
              if (deleted) {
                removeds.push(deleted);
              }
              if (error) {
                notRemoveds.push(error);
              }
            });
            this.showMessageProceedingsRemoved(removeds, notRemoveds);
            this.getData();
          },
          error: err => {
            console.log(err);
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
            this.getData();
            this.onLoadToast(
              'success',
              'Exito',
              `Se elimino la acta N° ${item.id}`
            );
          },
          error: err => {
            console.log(err);
            let message = `No se pudo eliminar el Acta N° ${item.id}`;
            if (err.error.message.includes('detalle_acta_ent_recep')) {
              message = message + ` porque tiene detalles de acta`;
            }
            this.onLoadToast('error', 'ERROR', message);
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

  openModalSelect(
    context?: Partial<SelectListFilteredModalComponent>,
    callback?: Function
  ) {
    const modalRef = this.modalService.show(SelectListFilteredModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered modal-not-top-padding',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSelect.subscribe(data => {
      if (data) callback(data, this);
    });
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
