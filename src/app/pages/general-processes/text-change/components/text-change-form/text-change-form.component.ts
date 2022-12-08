import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
    volante: [null, [Validators.required]],
    remitente: [null, [Validators.required]],
    exp: [null, [Validators.required]],
    remitente1: [null, [Validators.required]],
    texto1: [null, [Validators.required]],
    texto2: [null, [Validators.required]],
    cve: [null, [Validators.required]],
    ofgest: [null, [Validators.required]],
    documento: [null, [Validators.required]],
    // dictaminacion
    expediente: [null, [Validators.required]],
    dicta: [null, [Validators.required]],
    volante1: [null, [Validators.required]],
    dictaminacion: [null, [Validators.required]],
    // dictamen
    noofdicta: [null, [Validators.required]],
    remitente2: [null, [Validators.required]],
    texto3: [null, [Validators.required]],
    texto4: [null, [Validators.required]],
    texto5: [null, [Validators.required]],
    destinatario: [null, [Validators.required]],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
