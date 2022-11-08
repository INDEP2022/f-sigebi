import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPMaCMaintenanceOfAreasModalComponent } from '../c-p-ma-c-maintenance-of-areas-modal/c-p-ma-c-maintenance-of-areas-modal.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-c-p-ma-c-maintenance-of-areas',
  templateUrl: './c-p-ma-c-maintenance-of-areas.component.html',
  styles: [],
})
export class CPMaCMaintenanceOfAreasComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...COLUMNS },
    };
  }

  data = [
    {
      keyAdmi: '0',
      area: 'DAB',
      description: 'Descripcion 1',
    },
    {
      keyAdmi: '0',
      area: 'DAB',
      description: 'Descripcion 1',
    },
    {
      keyAdmi: '0',
      area: 'DAB',
      description: 'Descripcion 1',
    },
    {
      keyAdmi: '0',
      area: 'DAB',
      description: 'Descripcion 1',
    },
  ];

  ngOnInit(): void {
    this.buildForm();
    this.getPagination();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
    });
  }
  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  openModal(context?: Partial<CPMaCMaintenanceOfAreasModalComponent>) {
    const modalRef = this.modalService.show(
      CPMaCMaintenanceOfAreasModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }
}
