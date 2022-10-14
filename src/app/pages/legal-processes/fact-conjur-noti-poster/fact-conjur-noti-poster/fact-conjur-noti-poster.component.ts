import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-fact-conjur-noti-poster',
  templateUrl: './fact-conjur-noti-poster.component.html',
  styleUrls: ['./fact-conjur-noti-poster.component.scss'],
})
export class FactConjurNotiPosterComponent {
  public form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      noBien: ['', [Validators.required]], //*
      nombramiento: ['', [Validators.required]], //*
      fecha: ['', [Validators.required]], //*
    });
  }

  /**
   * Formulario
   */
  public returnField(form, field) {
    return form.get(field);
  }
  public returnShowRequirements(form, field) {
    return (
      this.returnField(form, field)?.errors?.required &&
      this.returnField(form, field).touched
    );
  }
}
