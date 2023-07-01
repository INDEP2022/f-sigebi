import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RangePickerModalComponent } from 'src/app/@standalone/modals/range-picker-modal/range-picker-modal.component';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { SharedModule } from 'src/app/shared/shared.module';
import { firstFormatDate } from 'src/app/shared/utils/date';

@Component({
  selector: 'app-update-dates-goods',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './update-dates-goods.component.html',
  styleUrls: ['./update-dates-goods.component.scss'],
})
export class UpdateDatesGoodsComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() data: any[];
  @Input() inicioColumn: string = 'approvedDateXAdmon';
  @Input() finColumn: string = 'dateIndicatesUserApproval';
  @Input() noActa: number;
  @Input() form: FormGroup;
  selectedsForUpdate: any[] = [];
  @Output() updateGoodEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private detailService: ProceedingsDetailDeliveryReceptionService
  ) {}

  get fechaInicio() {
    return this.form.get('inicio');
  }

  get fin() {
    return this.form.get('fin');
  }

  update() {
    const newData = this.data.map(x => {
      return {
        ...x,
        [this.inicioColumn]: firstFormatDate(new Date(this.fechaInicio.value)),
        [this.finColumn]: firstFormatDate(new Date(this.fin.value)),
      };
    });

    this.updateGoodEvent.emit(newData);
  }

  ngOnInit(): void {
    // this.form.valueChanges.subscribe(({ inicio, fin }) => {
    //   console.log(inicio, fin, this.form.valid);
    //   if (this.form.valid) {
    //     this.updateGoodEvent.emit(
    //       this.data.map(x => {
    //         return {
    //           ...x,
    //           [this.inicioColumn]: firstFormatDate(new Date(inicio)),
    //           [this.finColumn]: firstFormatDate(new Date(fin)),
    //         };
    //       })
    //     );
    //   }
    // });
  }

  private updateGoods() {
    const modalRef = this.modalService.show(RangePickerModalComponent, {
      class: 'modal-md modal-dialog-centered modal-not-top-padding',
      ignoreBackdropClick: true,
      backdrop: false,
    });
    modalRef.content.onSelect.subscribe(data => {
      if (data) {
        console.log(data);
        const { inicio, fin } = data;
        this.updateGoodEvent.emit(
          this.data.map(x => {
            return {
              ...x,
              [this.inicioColumn]: firstFormatDate(new Date(inicio)),
              [this.finColumn]: firstFormatDate(new Date(fin)),
            };
          })
        );
      }
    });
  }
}
