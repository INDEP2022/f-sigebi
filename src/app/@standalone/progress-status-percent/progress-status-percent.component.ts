import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-status-percent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-status-percent.component.html',
  styleUrls: ['./progress-status-percent.scss'],
})
export class ProgressStatusPercentComponent implements OnInit {
  @Input() text: string = 'Cargando... por favor espere...';
  @Input() greater = false;
  constructor() {}

  ngOnInit(): void {}
}
