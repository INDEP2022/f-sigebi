import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViewCell } from 'ng2-smart-table';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-check-permissions-non-winners',
  templateUrl: './check-permissions-non-winners.component.html',
  styles: [],
})
export class CheckPermissionsNonWinnersComponent
  extends BasePage
  implements ViewCell, OnInit, AfterViewInit
{
  checkForm: FormGroup = new FormGroup({});
  checkState: boolean = false;
  checkbox: any;
  checkId: string = 'checkbox';
  @Input() value: string | number;
  @Input() rowData: any;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.checkId = this.checkId + this.rowData.user.toString() + 'NonWinners';
  }

  ngAfterViewInit(): void {
    this.changeState();
  }

  private prepareForm(): void {
    this.checkForm = this.fb.group({
      type: [''],
    });
  }

  changeState() {
    this.checkbox = document.querySelector(
      '#' + this.checkId
    ) as HTMLInputElement;
    if (this.value == 'S') {
      this.checkState = true;
      this.checkbox.checked = this.checkState;
    } else {
      this.checkState = false;
      this.checkbox.checked = this.checkState;
    }
  }

  change(event: Event) {
    this.checkbox.checked = this.checkState;
    let action: string;
    this.checkState
      ? (action = 'Quitar Permiso')
      : (action = 'Otorgar Permiso');
    this.alertQuestion(
      'question',
      '¿Está seguro que desea cambiar los permisos de este usuario?',
      '',
      action
    ).then(question => {
      if (question.isConfirmed) {
        if (this.value == 'S') {
          // Llamar servicio para cambiar estado
          this.checkState = !this.checkState;
          this.checkbox.checked = this.checkState;
        } else {
          // Llamar servicio para cambiar estado
          this.checkState = !this.checkState;
          this.checkbox.checked = this.checkState;
        }
      }
    });
  }
}
