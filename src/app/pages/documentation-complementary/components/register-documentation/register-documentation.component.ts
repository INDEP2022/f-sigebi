import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register-documentation',
  templateUrl: './register-documentation.component.html',
  styles: [],
})
export class RegisterDocumentationComponent implements OnInit {
  @Input() documentationRegisterForm: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
