import { Component, Input, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { IBienesPar } from '../../models/bienesPar.model';
import { PartializeGeneralGoodTab2Service } from '../../services/partialize-general-good-tab2.service';
import { PartializeGeneralGoodService } from '../../services/partialize-general-good.service';

@Component({
  selector: 'app-partialize-view',
  templateUrl: './partialize-view.component.html',
  styleUrls: ['./partialize-view.component.scss'],
})
export class PartializeViewComponent extends BasePage implements OnInit {
  @Input() firstCase: boolean = null;
  v_numerario: any;
  vfactor: any;
  statePresed = 0;
  pressPartialize = false;
  pressApply = false;
  constructor(
    private serviceTab1: PartializeGeneralGoodService,
    private serviceTab2: PartializeGeneralGoodTab2Service
  ) {
    super();
  }

  get service() {
    return this.firstCase === true ? this.serviceTab1 : this.serviceTab2;
  }

  get formGood() {
    return this.service.formGood;
  }

  get bienesPar() {
    return this.service.bienesPar;
  }
  set bienesPar(value) {
    this.service.bienesPar = value;
  }

  get settingsGoods() {
    return this.service.settingsGoods;
  }

  get vimporte() {
    return this.service.vimporte;
  }
  get vsum() {
    return this.service.vsum;
  }

  get statePartialize() {
    if (
      this.form.invalid ||
      this.formGood.invalid ||
      this.vsum > this.vimporte
    ) {
      return 'disabled';
    }
    if (this.statePresed === 1 && this.vsum === this.vimporte) {
      return 'complete';
    } else {
      return 'active';
    }
  }

  get stateApply() {
    if (this.formGood.invalid || this.bienesPar.length === 0) {
      return 'disabled';
    }
    return 'active';
  }

  pressed(state: number) {
    this.statePresed = state;
    if (state === 1) {
      this.pressPartialize = !this.pressPartialize;
    }
    if (state === 2) {
      this.pressApply = !this.pressApply;
    }
  }

  // get isFirstCase() {
  //   return this.service.isFirstCase;
  // }

  ngOnInit(): void {
    if (this.firstCase === null) {
      return;
    }
    this.service.initFormControl();
    this.bienesPar = [...this.service.getSavedPartializedGoods()];
  }

  get form() {
    return this.service.formControl;
  }

  deleteRow(row: { data: IBienesPar; index: number }) {
    console.log(row);
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'info',
          'Parcialización',
          'Eliminada la parcialización ' + row.data.id
        );
        if (row.index === 0) {
          this.bienesPar.shift();
        } else {
          this.bienesPar = this.bienesPar
            .slice(0, row.index)
            .concat(this.bienesPar[this.bienesPar.length - 1]);
        }
        this.bienesPar[this.bienesPar.length - 1].cantidad -= row.data.cantidad;
        this.service.sumCant -= row.data.cantidad;
        this.service.sumVal14 -= row.data.importe;
        // this.bienesPar[this.bienesPar.length - 1].avaluo -= row.data.avaluo;
        this.bienesPar[this.bienesPar.length - 1].importe -= row.data.importe;
        if (this.bienesPar[this.bienesPar.length - 1].cantidad === 0) {
          this.bienesPar.pop();
        }
        this.bienesPar = [...this.bienesPar];
        this.service.savePartializeds();
      }
    });
  }
}
