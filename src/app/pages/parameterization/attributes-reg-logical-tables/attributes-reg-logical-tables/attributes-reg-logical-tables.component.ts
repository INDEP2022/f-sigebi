import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { AttributesRegLogicalTablesModalComponent } from '../attributes-reg-logical-tables-modal/attributes-reg-logical-tables-modal.component';
import { ATT_REG_LOG_TAB_COLUMNS } from './attributes-reg-logical-tables-columns';
//models
import { ITdescAtrib } from 'src/app/core/models/ms-parametergood/tdescatrib-model';
//Services
import { ParameterGoodService } from 'src/app/core/services/ms-parametergood/parametergood.service';

@Component({
  selector: 'app-attributes-reg-logical-tables',
  templateUrl: './attributes-reg-logical-tables.component.html',
  styles: [],
})
export class AttributesRegLogicalTablesComponent
  extends BasePage
  implements OnInit
{
  tdescAtrib: ITdescAtrib[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private parameterGoodService: ParameterGoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...ATT_REG_LOG_TAB_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRegisterAttribute());
  }

  getRegisterAttribute() {
    this.loading = true;
    this.parameterGoodService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.tdescAtrib = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(tdescAtrib?: ITdescAtrib) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      tdescAtrib,
      callback: (next: boolean) => {
        if (next) this.getRegisterAttribute();
      },
    };
    this.modalService.show(
      AttributesRegLogicalTablesModalComponent,
      modalConfig
    );
  }

  showDeleteAlert(tdescAtrib: ITdescAtrib) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(tdescAtrib.idNmTable);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.parameterGoodService.remove(id).subscribe({
      next: () => this.getRegisterAttribute(),
    });
  }
}
