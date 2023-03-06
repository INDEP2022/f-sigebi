import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cants',
  templateUrl: './cants.component.html',
  styles: [],
})
export class CantsComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      goods: [0],
      files: [0],
      dictamenes: [0],
    });
  }

  ngOnInit(): void {}
}
