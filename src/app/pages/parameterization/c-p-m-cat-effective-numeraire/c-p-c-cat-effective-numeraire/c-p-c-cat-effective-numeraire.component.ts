import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPCCatEffectiveNumeraireModalComponent } from '../c-p-c-cat-effective-numeraire-modal/c-p-c-cat-effective-numeraire-modal.component';
import { CAT_EFFECTIVE_NUM_COLUMNS } from './cat-effective-num-columns';
@Component({
  selector: 'app-c-p-c-cat-effective-numeraire',
  templateUrl: './c-p-c-cat-effective-numeraire.component.html',
  styles: [],
})
export class CPCCatEffectiveNumeraireComponent
  extends BasePage
  implements OnInit
{
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...CAT_EFFECTIVE_NUM_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  openModal(context?: Partial<CPCCatEffectiveNumeraireModalComponent>) {
    const modalRef = this.modalService.show(
      CPCCatEffectiveNumeraireModalComponent,
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

  openForm(allotment?: any) {
    this.openModal({ allotment });
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

  data = [
    {
      category: 'ASEGURAMIENTO',
      description: 'ASEGURAMIENTO',
      entry: true,
      exit: true,
    },
    {
      category: 'DECOMISADO',
      description: 'DECOMISADO',
      entry: true,
      exit: false,
    },
    {
      category: 'FRUTO',
      description: 'FRUTO',
      entry: true,
      exit: false,
    },
    {
      category: 'CAMBIO_NUMERARIO',
      description: 'Cambio numerario',
      entry: false,
      exit: false,
    },
    {
      category: 'CN_DEC',
      description: 'CAMBIO A NUMERARIO DECOMISADO',
      entry: true,
      exit: true,
    },
    {
      category: 'SSP',
      description: 'SIN SITUACIÓN PRESENCIAL',
      entry: true,
      exit: false,
    },
  ];
}
