import { Component, Input, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { IndicatorsHistoryTechnicalDatasheetComponent } from '../indicators-history-technical-datasheet/indicators-history-technical-datasheet.component';

@Component({
  selector: 'app-event-emitter-two',
  templateUrl: './event-emitter-two.component.html',
  styles: [],
})
export class EventEmitterTwoComponent implements OnInit {
  //

  @Input() value: string | number;
  @Input() rowData: any;

  //

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {}

  //

  find() {
    return 'Hola Mundo';
  }

  openModal(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {
          if (next) this.find();
        },
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    console.log('Config: ', config);
    this.modalService.show(
      IndicatorsHistoryTechnicalDatasheetComponent,
      config
    );
  }

  //
}
