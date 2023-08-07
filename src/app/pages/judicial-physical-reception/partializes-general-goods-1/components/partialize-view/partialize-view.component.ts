import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { IBienesPar } from '../../models/bienesPar.model';
import { PartializeGeneralGoodService } from '../../services/partialize-general-good.service';

@Component({
  selector: 'app-partialize-view',
  templateUrl: './partialize-view.component.html',
  styleUrls: ['./partialize-view.component.scss'],
})
export class PartializeViewComponent extends BasePage implements OnInit {
  // @Input() firstCase: boolean = null;
  version = 1;
  params = new BehaviorSubject<ListParams>(new ListParams());
  v_numerario: any;
  vfactor: any;
  statePresed = 0;
  pressPartialize = false;
  pressApply = false;
  page = 1;

  constructor(
    private service: PartializeGeneralGoodService // private serviceTab2: PartializeGeneralGoodTab2Service, // private service2: PartializeGeneralGoodV2Service
  ) {
    super();
    // this.params.value.limit = 11;
  }

  // get service() {
  //   return this.version === 1 ? this.service1 : this.service2;
  //   // return this.version === 1
  //   //   ? this.firstCase === true
  //   //     ? this.serviceTab1
  //   //     : this.serviceTab2
  //   //   : this.firstCase === true
  //   //   ? this.service2Tab1
  //   //   : this.service2Tab2;
  // }

  get saldo() {
    return this.form.get('saldo') ? this.form.get('saldo').value : 0;
  }

  get formGood() {
    return this.service.formGood;
  }

  get pagedBienesPar() {
    return this.service.pagedBienesPar;
  }

  get bienesPar() {
    return this.service.bienesPar;
  }
  set bienesPar(value) {
    this.service.bienesPar = value;
  }

  get form() {
    return this.service.formControl;
  }

  get firtsCase() {
    return this.service.firstCase;
  }

  get settingsGoddFirstCase() {
    return this.service.settingsGoodsFirstCase;
  }

  get settingsGoodsSecondCase() {
    return this.service.settingsGoodsSecondCase;
  }

  get vimporte() {
    return this.service.vimporte;
  }
  get vsum() {
    return this.service.vsum;
  }

  get firstCase() {
    return this.service.firstCase;
  }

  filledRow() {
    // debugger;
    const final = this.page * this.params.value.limit;
    if (this.bienesPar && this.bienesPar.length > 0) {
      // debugger;
      const bienesNotTotal = this.bienesPar.slice(0, this.bienesPar.length - 1);
      this.service.pagedBienesPar = [
        ...bienesNotTotal
          .slice((this.page - 1) * this.params.value.limit, final)
          .concat(this.bienesPar[this.bienesPar.length - 1]),
      ];
    } else {
      this.service.pagedBienesPar = [...this.service.bienesPar];
    }
    this.loading = false;
  }

  get statePartialize() {
    if (
      this.form.invalid ||
      this.vsum > this.vimporte ||
      +(this.saldo + '') === 0
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
    if (
      this.bienesPar.length > 0 &&
      +(this.saldo + '') >= 0 &&
      this.service.haveAply
    ) {
      return 'active';
    }
    return 'disabled';
  }

  pressed(e: Event, state: number) {
    e.stopPropagation();
    this.statePresed = state;
    if (state === 1) {
      this.loading = true;
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
    // if (this.version === null) {
    //   return;
    // }
    // console.log(this.firtsCase === true ? { ...this.service.settingsGoods, columns: columnsFirstCase } : { ...this.service.settingsGoods, columns: columnsSecondCase });

    this.service.initFormControl();
    // this.bienesPar = [...this.service.getSavedPartializedGoods()];
    this.params.pipe().subscribe({
      next: resp => {
        this.page = resp.page;
        this.loading = true;
        this.filledRow();
      },
    });
  }

  deleteRow(row: { data: IBienesPar; index: number }) {
    console.log(row);
    this.alertQuestion(
      'question',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.alert('success', 'Parcialización', 'Eliminada Correctamente');
        if (row.index === 0) {
          this.bienesPar.shift();
        } else {
          this.bienesPar = this.bienesPar
            .slice(0, row.index)
            .concat(this.bienesPar[this.bienesPar.length - 1]);
        }
        // debugger;
        if (row.data.cantidad) {
          this.bienesPar[this.bienesPar.length - 1].cantidad -= +(
            row.data.cantidad + ''
          );
          this.bienesPar[this.bienesPar.length - 1].cantidad =
            +this.bienesPar[this.bienesPar.length - 1].cantidad.toFixed(2);
          this.service.sumCant -= +(row.data.cantidad + '');
          this.service.sumCant = +this.service.sumCant.toFixed(2);
        }
        if (row.data.importe) {
          this.bienesPar[this.bienesPar.length - 1].importe -= +(
            row.data.importe + ''
          );
          this.bienesPar[this.bienesPar.length - 1].importe =
            +this.bienesPar[this.bienesPar.length - 1].importe.toFixed(2);
          this.service.sumVal14 -= +(row.data.importe + '');
          this.service.sumVal14 = +this.service.sumVal14.toFixed(2);
        }
        if (row.data.avaluo) {
          this.bienesPar[this.bienesPar.length - 1].avaluo -= +(
            row.data.avaluo + ''
          );
          this.bienesPar[this.bienesPar.length - 1].avaluo =
            +this.bienesPar[this.bienesPar.length - 1].avaluo.toFixed(2);
          this.service.sumAvaluo -= +(row.data.avaluo + '');
          this.service.sumAvaluo = +this.service.sumAvaluo.toFixed(2);
        }

        let saldo = +this.form.get('saldo').value;
        if (!this.firstCase) {
          saldo += +(row.data.cantidad + '');
          this.form.get('saldo').setValue(saldo);
        } else {
          saldo += +(row.data.importe + '');
          this.form.get('saldo').setValue(saldo);
        }

        // this.bienesPar[this.bienesPar.length - 1].avaluo -= row.data.avaluo;

        if (this.bienesPar[this.bienesPar.length - 1].cantidad === 0) {
          this.bienesPar.pop();
        }
        this.bienesPar = [...this.bienesPar];
        this.filledRow();
        this.service.savePartializeds();
      }
    });
  }
}
