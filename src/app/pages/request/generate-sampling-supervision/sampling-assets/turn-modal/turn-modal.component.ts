import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-turn-modal',
  templateUrl: './turn-modal.component.html',
  styles: [],
})
export class TurnModalComponent implements OnInit {
  title: string = 'Confirmación Turnado';
  typeTurn: string = '';
  subtext: string = '';
  estatusMuestreo: string = '';

  private bsModalRef = inject(BsModalRef);

  constructor() {}

  ngOnInit(): void {
    if (this.typeTurn == 'popBienesCumplen') {
      this.subtext =
        'Todos los bienes cumplen con los resultados de evaluación y no ha seleccionado alguna deductiva.';
      this.estatusMuestreo = 'BIENES CUMPLEN';
    } else if (this.typeTurn == 'confirmacionTurnado') {
      this.subtext =
        'Todos los bienes cumplen con los resultados de evaluación y ha seleccionado alguna deductiva.';
      this.estatusMuestreo = 'BIENES NO CUMPLEN';
    } else if (this.typeTurn == 'popTurna') {
      this.estatusMuestreo = 'BIENES NO CUMPLEN';
      this.subtext = '';
    }
  }

  confirm() {
    if (this.typeTurn == 'popBienesCumplen') {
      /**
       * generarMuestreo()
       * Se tiene que guardar los datos
       * this.estatusMuestreo
       * IdDelegacionRegional
       * Usuario -> userName
       * UsuarioSAE -> userName
       * transferente -> IdTransferente
       */
    } else if (this.typeTurn == 'confirmacionTurnado') {
      /**
       * turnar()
       */
    } else if (this.typeTurn == 'popTurna') {
      /**
       * turnar()
       */
    }
  }

  close() {
    this.bsModalRef.hide();
  }
}
