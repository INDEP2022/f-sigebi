import { Component, OnInit } from '@angular/core';
import { ModelForm } from 'src/app/core/interfaces/model-form';

@Component({
  selector: 'app-users-event-types-forms',
  templateUrl: './users-event-types-forms.component.html',
  styles: [],
})
export class UsersEventTypesFormsComponent implements OnInit {
  title: string = 'USUARIO POR TIPO DE EVENTO';
  edit: boolean = false;
  form: ModelForm<any>;
  constructor() {}

  ngOnInit(): void {}
}
