import { MenuItem } from "./models/menu.model";

export const MENU: MenuItem[] = [
    {
        label: 'Menu',
        isTitle: true
    },
    {
        label: 'Inicio',
        icon: 'bx-home-circle',
        link: '/admin/home'
    },
    {
        isLayout: true
    },
    {
        label: 'Aplicaciones',
        isTitle: true
    },
    {
        label: 'Calendario',
        icon: 'bx-calendar',
        link: '/',
    },
    {
        label: 'Multi nivel',
        icon: 'bx-share-alt',
        subItems: [
            {
                label: 'Nivel 1.1',
                link: '#',
            },
            {
                label: 'Nivel 1.2',
                subItems: [
                    {
                        label: 'Nivel 2.1',
                    },
                    {
                        label: 'Nivel 2.2',
                    }
                ]
            },
        ]
    },
    {
        label: 'Multi nivel',
        icon: 'bx-share-alt',
        subItems: [
            {
                label: 'Nivel 1.1',
                link: '#',
            },
            {
                label: 'Nivel 1.2',
                subItems: [
                    {
                        label: 'Nivel 2.1',
                    },
                    {
                        label: 'Nivel 2.2',
                    }
                ]
            },
        ]
    }
];

