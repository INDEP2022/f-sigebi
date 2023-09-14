import { BsModalService } from 'ngx-bootstrap/modal';
import { SelectListFilteredModalComponent } from 'src/app/@standalone/modals/select-list-filtered-modal/select-list-filtered-modal.component';

export abstract class OpenModalListFiltered {
  haveSelectColumns = false;
  haveColumnFilters = false;
  ilikeFilters: string[] = ['description'];
  dateFilters: string[] = [];
  constructor(protected modalService: BsModalService) {}
  openModalSelect(
    context?: Partial<SelectListFilteredModalComponent>,
    callback?: Function
  ) {
    const modalRef = this.modalService.show(SelectListFilteredModalComponent, {
      initialState: {
        ...context,
        type: 'text',
        haveSelectColumns: this.haveSelectColumns,
        haveColumnFilters: this.haveColumnFilters,
        ilikeFilters: this.ilikeFilters,
        dateFilters: this.dateFilters,
      },
      class: 'modal-lg modal-dialog-centered modal-not-top-padding',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSelect.subscribe(data => {
      if (data) callback(data, this);
    });
  }

  abstract openModal(): void;
}
