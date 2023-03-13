import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IFraction } from 'src/app/core/models/catalogs/fraction.model';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { FractionsFormComponent } from '../fractions-form/fractions-form.component';
import { FRACTIONS_COLUMNS } from './fractions-columns';

@Component({
  selector: 'app-fractions-list',
  templateUrl: './fractions-list.component.html',
  styles: [],
})
export class FractionsListComponent extends BasePage implements OnInit {
  paragraphs: IFraction[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private fractionService: FractionService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = FRACTIONS_COLUMNS;
    this.settings.actions.delete = false;
    this.settings.actions.edit = false;
    this.settings.actions.custom = [
      { name: 'add', title: '<i class="fa fa-plus text-success mx-2"></i>' },
    ];
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getFractions());
  }

  getFractions() {
    this.loading = true;
    this.fractionService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(fraction?: IFraction) {
    console.log(fraction);

    let config: ModalOptions = {
      initialState: {
        fraction,
        callback: (next: boolean) => {
          if (next) this.getFractions();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(FractionsFormComponent, config);
  }

  delete(fraction: IFraction) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.fractionService.remove(fraction.id).subscribe({
          next: data => this.getFractions(),
          error: error => (this.loading = false),
        });
      }
    });
  }
}
