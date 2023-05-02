import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-text-change-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './text-change-form.component.html',
  styles: [],
})
export class TextChangeFormComponent implements OnInit {
  form = this.fb.group({
    volante: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    remitente: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    exp: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    remitente1: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    texto1: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    texto2: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    cve: [
      null,
      [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
    ],
    ofgest: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    documento: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    // dictaminacion
    expediente: [null, [Validators.required]],
    dicta: [null, [Validators.required]],
    volante1: [null, [Validators.required]],
    dictaminacion: [null, [Validators.required]],
    // dictamen
    noofdicta: [null, [Validators.required]],
    remitente2: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    texto3: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    texto4: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    texto5: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    destinatario: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
