import { IMenuItem } from "src/app/core/interfaces/menu.interface"

export const rutasJuridicalProcesses: any = 
{
    _1: { titulo: 'Dictaminaciones Juridicas', ruta: 'dictaminaciones-juridicas', },
    _2: { titulo: 'Actualización de Datos del Expediente', ruta: 'actualizacion-datos-expediente' },
    _3: { titulo: 'Actualización de Expedientes en Notificación', ruta: 'actualizacion-expedientes-notificacion' }
}

export const menuOpcionesProcesosJuridicos: IMenuItem[] = [
    
  // PROCESOS JURIDICOS
  {
    label: 'Procesos Jurídicos',
    icon: 'bx-share-alt',
    subItems: [
      {
        label: rutasJuridicalProcesses._1.titulo,
        link: rutasJuridicalProcesses._1.ruta
      },
      {
        label: rutasJuridicalProcesses._2.titulo,
        link: rutasJuridicalProcesses._2.ruta
      },
      {
        label: rutasJuridicalProcesses._3.titulo,
        link: rutasJuridicalProcesses._3.ruta
      },
      {
        label: 'Nivel 1.2',
        subItems: [
          {
            label: 'Nivel 2.1',
          },
          {
            label: 'Nivel 2.2',
          },
        ],
      },
    ],
  },
  // PROCESOS JURIDICOS

]

