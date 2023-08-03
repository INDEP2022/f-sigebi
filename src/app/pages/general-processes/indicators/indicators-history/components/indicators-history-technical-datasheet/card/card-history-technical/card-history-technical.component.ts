import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-card-history-technical',
  templateUrl: './card-history-technical.component.html',
  styleUrls: ['./card-history-technical.css'],
})
export class CardHistoryTechnicalComponent implements OnChanges {
  //

  form: FormGroup;
  @Input() statusEadmi: any;

  //

  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
    this.form = this.fb.group({
      status: [null],
      delegation: [null],
      year: [null],
      month: [null],
      stragy: [null],
      report: [null],
      stragyTwo: [null],
      reportTwo: [null],
    });

    // console.log("El estatus que numero trae? : ", this.statusEadmi?.statusEadmi, " --Y el objeto-- ", this.statusEadmi);
    if (this.statusEadmi != undefined) {
      if (this.statusEadmi?.statusEadmi == 1) {
        this.form.controls['status'].setValue('CERRADA');
      } else {
        this.form.controls['status'].setValue('ABIERTO');
      }
      this.form.controls['year'].setValue(this.statusEadmi?.yearEvaluateId);
      // console.log("El mes que viene es : ", this.statusEadmi?.monthEvaluateId);
      this.form.controls['month'].setValue(
        this.monthAssign(this.statusEadmi?.monthEvaluateId)
      );
      this.form.controls['stragy'].setValue(
        this.statusEadmi?.extraDevAmongNumber
      );
      this.form.controls['report'].setValue(
        this.statusEadmi?.reportDevAmongNumber
      );
      this.form.controls['stragyTwo'].setValue(
        this.statusEadmi?.straAWeatherNumber
      );
      this.form.controls['reportTwo'].setValue(
        this.statusEadmi?.reportAWeatherNumber
      );
    }
  }

  monthAssign(month: number) {
    // console.log("El mes que recibe el metodo", month)
    let num = Number(month);
    switch (num) {
      case 1:
        return 'Enero';
      case 2:
        return 'Febrero';
      case 3:
        return 'Marzo';
      case 4:
        return 'Abril';
      case 5:
        return 'Mayo';
      case 6:
        return 'Junio';
      case 7:
        return 'Julio';
      case 8:
        return 'Agosto';
      case 9:
        return 'Septiembre';
      case 10:
        return 'Octubre';
      case 11:
        return 'Noviembre';
      case 12:
        return 'Diciembre';
      default:
        return 'Mes no válido';
    }
  }

  //

  //
}
