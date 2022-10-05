import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IFraction } from 'src/app/core/models/catalogs/fraction.model';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { FractionsFormComponent } from '../fractions-form/fractions-form.component';
import { FRACTIONS_COLUMNS } from './fractions-columns';

@Component({
  selector: 'app-fractions-list',
  templateUrl: './fractions-list.component.html',
  styles: [
  ]
})
export class FractionsListComponent extends BasePage implements OnInit {

  settings = TABLE_SETTINGS;
  paragraphs: IFraction[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fractionService: FractionService,
    private modalService: BsModalService
  ) { 
    super();
    this.settings.columns = FRACTIONS_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getFractions());
  }

  getFractions(){
    this.loading = true;
    this.fractionService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<FractionsFormComponent>) {
    const modalRef = this.modalService.show(FractionsFormComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getFractions();
    });
  }

  openForm(fraction?: IFraction){
    this.openModal({fraction});
  }

  delete(fraction: IFraction){
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if(question.isConfirmed){
        this.fractionService.remove(fraction.id).subscribe({
          next: data => this.getFractions(),
          error: error => (this.loading = false),
        });
      }
    })
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalService.hide();
  }
}
