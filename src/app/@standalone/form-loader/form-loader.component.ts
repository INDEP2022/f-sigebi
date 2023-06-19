import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'form-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-loader.component.html',
  styleUrls: ['./form-loader.component.scss'],
})
export class FormLoaderComponent implements OnInit {
  //private database: Database = inject(Database);

  @Input() text: string = 'Cargando... por favor espere...';
  @Input() greater = false;
  constructor() {}

  ngOnInit(): void {
    //firebase.child('massive-charge')
  }
}
