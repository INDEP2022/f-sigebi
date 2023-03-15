import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatEffectiveNumeraireModalComponent } from '../cat-effective-numeraire-modal/cat-effective-numeraire-modal.component';
import { CAT_EFFECTIVE_NUM_COLUMNS } from './cat-effective-num-columns';
//models
import { INumeraryCategories } from 'src/app/core/models/catalogs/numerary-categories-model';
//Services
import { NumeraryCategoriesService } from 'src/app/core/services/catalogs/numerary-categories.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cat-effective-numeraire',
  templateUrl: './cat-effective-numeraire.component.html',
  styles: [],
})
export class CatEffectiveNumeraireComponent extends BasePage implements OnInit {
  numeraryCategories: INumeraryCategories[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private numeraryCategoriesService: NumeraryCategoriesService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...CAT_EFFECTIVE_NUM_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAttributesFinancialInfo());
  }

  getAttributesFinancialInfo() {
    this.loading = true;
    this.numeraryCategoriesService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.numeraryCategories = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(numeraryCategories?: INumeraryCategories) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      numeraryCategories,
      callback: (next: boolean) => {
        if (next) this.getAttributesFinancialInfo();
      },
    };
    this.modalService.show(CatEffectiveNumeraireModalComponent, modalConfig);
  }

  showDeleteAlert(numeraryCategories: INumeraryCategories) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(numeraryCategories.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string) {
    this.numeraryCategoriesService.remove(id).subscribe({
      next: () => this.getAttributesFinancialInfo(),
    });
  }
}
