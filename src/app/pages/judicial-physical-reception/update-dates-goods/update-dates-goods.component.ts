import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RangePickerModalComponent } from 'src/app/@standalone/modals/range-picker-modal/range-picker-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { firstFormatDate } from 'src/app/shared/utils/date';

@Component({
  selector: 'app-update-dates-goods',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './update-dates-goods.component.html',
  styles: [],
})
export class UpdateDatesGoodsComponent implements OnInit {
  @Input() statusActaValue: string;
  @Input() data: any[];
  selectedsForUpdate: any[] = [];
  @Output() updateGoodEvent = new EventEmitter();
  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {}

  updateGoods() {
    const modalRef = this.modalService.show(RangePickerModalComponent, {
      class: 'modal-md modal-dialog-centered modal-not-top-padding',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSelect.subscribe(data => {
      if (data) {
        console.log(data);
        const { rangoFecha } = data;
        this.updateGoodEvent.emit(
          this.data.map(x => {
            return {
              ...x,
              approvedDateXAdmon: firstFormatDate(new Date(rangoFecha[0])),
              dateIndicatesUserApproval: firstFormatDate(
                new Date(rangoFecha[1])
              ),
            };
          })
        );
      }
    });
  }
}
