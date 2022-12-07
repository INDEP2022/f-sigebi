import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-donation-processes',
  templateUrl: './donation-processes.component.html',
  styles: [],
})
export class DonationProcessesComponent implements OnInit {
  imgs1 = [
    {
      url: 'assets/images/verification-img.png',
      text: 'Selección de Inventario para Exportación a Excel',
    },
    {
      url: 'assets/images/profile-img.png',
      text: 'Asociación de Solicitudes',
    },
    {
      url: 'assets/images/verification-img.png',
      text: 'Propuestas e Inventario de Bienes para Donación',
    },
    {
      url: 'assets/images/profile-img.png',
      text: 'Contratos de Donación',
    },
  ];

  imgs2 = [
    {
      url: 'assets/images/laptop-img.png',
      text: 'Donaciones Directas',
    },
    {
      url: 'assets/images/error-img.png',
      text: 'Asociación de Propuestas e Inventario de Bienes para Donación',
    },
    {
      url: 'assets/images/laptop-img.png',
      text: 'Contratos o Convenios',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
