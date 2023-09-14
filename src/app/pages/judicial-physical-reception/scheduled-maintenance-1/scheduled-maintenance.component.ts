import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import {
  INotSucess,
  IProceedingByGood,
  ISucess,
  ProceedingsDeliveryReceptionService,
} from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-detail-delivery-reception.service';
import { ACTAS_BY_GOOD_COLUMNS } from './../scheduled-maintenance/interfaces/columns';

import { Router } from '@angular/router';
import { SelectListFilteredModalComponent } from 'src/app/@standalone/modals/select-list-filtered-modal/select-list-filtered-modal.component';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { AttribGoodBadService } from 'src/app/core/services/ms-good/attrib-good-bad.service';
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
    protected override deliveryService: ProceedingsDeliveryReceptionService,
    protected override detailService: ProceedingsDetailDeliveryReceptionService,
    private attribGoodBadService: AttribGoodBadService,
    private router: Router
  ) {
    super(
      fb,
      deliveryService,
      detailService,
      'filtersActa',
      'paramsActaProgramaciones'
    );

    // debugger;

    this.settings1 = {
      ...this.settings1,
      selectMode: 'multi',
      actions: {
        columnTitle: 'Acciones',
        position: 'left',
        add: false,
        edit: true,
        delete: true,
      },
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
      this.alert(
        'success',
        'Eliminación Acta',
        `Se eliminaron las actas No. ${proceedings} ` +
          this.showMessageProceedingsNotRemoved(notRemoveds)
      );
    } else {
      if (notRemoveds.length > 0) {
        this.alert(
          'error',
          'Eliminación Acta',
          `Elimine primero el detalle de las actas No. ${proceedings}`
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
      return `pero no se pudieron eliminar las actas No. ${proceedingsNotRemoveds} porque tienen detalles de acta`;
    } else {
      return '';
    }
  }

  deleteProgramations() {
    console.log(this.selecteds);
    this.alertQuestion(
      'question',
      'Eliminar',
      'Desea eliminar estos registros?'
    ).then(question => {
      if (question.isConfirmed) {
        this.deliveryService.deleteMasive(this.selecteds).subscribe({
          next: response => {
            console.log(response);
            const removeds: string[] = [];
            const notRemoveds: string[] = [];
            response.forEach(item => {
              const { sucess } = item as ISucess;
              const { error } = item as INotSucess;
              if (sucess) {
                removeds.push(sucess);
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
            this.alert(
              'error',
              'Eliminación de Actas',
              `No se pudieron eliminar las actas° ${actas}`
            );
          },
        });
      }
    });
  }

  redirectDetailMaintenance(item: IProceedingDeliveryReception) {
    console.log(item);
    window.localStorage.setItem('detailActa', item.id);
    this.saveForm();
    this.router.navigate([
      'pages/judicial-physical-reception/scheduled-maintenance-1/detail',
    ]);
  }

  showDeleteAlert(item: IProceedingDeliveryReception) {
    console.log(item);
    this.alertQuestion(
      'question',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.deliveryService.deleteById(item).subscribe({
          next: response => {
            console.log(response);
            this.getData(true);
            this.alert(
              'success',
              'Eliminación',
              `Se elimino el acta No. ${item.id}`
            );
          },
          error: err => {
            let message = `No se pudo eliminar`;
            if (err.error.message.includes('detalle_acta_ent_recep')) {
              message = message + ` porque tiene detalles de acta`;
            }
            this.alert('error', `Acta No. ${item.id}`, message);
          },
        });
      }
    });
  }

  rowsSelected(event: { selected: IProceedingDeliveryReception[] }) {
    console.log(event);
    this.selecteds = event.selected;
  }

  getNulls() {
    this.openModalSelect(
      {
        title: 'Listado de bienes con información requerida nula',
        columnsType: {
          id: {
            title: 'No. Bien',
            type: 'string',
            sort: false,
          },
          motive: {
            title: 'Motivo',
            type: 'string',
            sort: false,
          },
        },
        service: this.attribGoodBadService,
        dataObservableFn: this.attribGoodBadService.getAllModal,
        searchFilter: null,
        type: 'text',
        showError: false,
        widthButton: false,
        placeholder: 'Buscar',
      },
      this.selectGoodNull
    );
  }

  selectGoodNull(good: any, self: ScheduledMaintenanceComponent) {
    console.log(good);
    self.router.navigate(['pages/general-processes/good-photos'], {
      queryParams: {
        numberGood: good.id,
        origin: 'FMENTREC_0001',
      },
    });
    // localStorage.setItem('selectedBad', JSON.stringify(good));
    // self.router.navigate(['pages/general-processes/goods-characteristics']);
  }

  openModalActas() {
    this.openModalSelect(
      {
        title: 'Actas por Bien',
        columnsType: { ...ACTAS_BY_GOOD_COLUMNS },
        service: this.deliveryService,
        dataObservableId: this.deliveryService.getByGoodId,
        searchFilter: null,
        showError: false,
        initialCharge: false,
        widthButton: true,
        placeholder: 'No. Bien',
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
          self.alert('error', 'ERROR', `Data no encontrada`);
        }
      },
      error: err => {
        console.log(err);
        self.alert('error', 'ERROR', `Data no encontrada`);
      },
    });
  }

  fillElementsToExport() {}
}
