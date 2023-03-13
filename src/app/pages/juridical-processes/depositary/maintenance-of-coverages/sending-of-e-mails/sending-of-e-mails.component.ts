import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-sending-of-e-mails',
  templateUrl: './sending-of-e-mails.component.html',
  styles: [],
})
export class SendingOfEMailsComponent extends BasePage implements OnInit {
  @Output() refresh = new EventEmitter<true>();

  form: FormGroup;

  get flyerNumber() {
    return this.form.get('flyerNumber');
  }
  get fileNumber() {
    return this.form.get('fileNumber');
  }
  get dateReception() {
    return this.form.get('dateReception');
  }
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      flyerNumber: [null, [Validators.required]],
      fileNumber: [null, [Validators.required]],
      dateReception: [null, [Validators.required]],
    });
  }

  sending() {
    this.refresh.emit(this.form.value);
  }
}
