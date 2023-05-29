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
    private service: PartializeGeneralGoodService // private serviceTab2: PartializeGeneralGoodTab2Service,
  ) // private service2: PartializeGeneralGoodV2Service
  {
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
  // get pagedBienesPar() {

  //   const final = (this.page * 10) - 1;
  //   if (this.bienesPar && this.bienesPar.length > 0) {
  //     // debugger;
  //     const bienesNotTotal = this.bienesPar.slice(0, this.bienesPar.length - 1);
  //     return bienesNotTotal
  //       .slice(
  //         (this.page - 1) * 10,
  //         final
  //       )
  //       .concat(this.bienesPar[this.bienesPar.length - 1]);
  //   } else {
  //     return this.service.bienesPar;
  //   }

  // }

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
    if (this.formGood?.valid && this.bienesPar.length > 0) {
      return 'active';
    }
    return 'disabled';
  }

  pressed(state: number) {
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

  get form() {
    return this.service.formControl;
  }

  deleteRow(row: { data: IBienesPar; index: number }) {
    console.log(row);
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
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
        this.filledRow();
        this.service.savePartializeds();
      }
    });
  }
}
