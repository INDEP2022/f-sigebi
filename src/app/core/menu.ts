import { MenuItem } from "./models/menu.model";

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'Menu',
        isTitle: true
    },
    {
        id: 2,
        label: 'Dashboard',
        icon: 'bx-home-circle',
        badge: {
            variant: 'info',
            text: '11',
        },
        subItems: [
            {
                id: 3,
                label: 'Defecto',
                link: '/',
                parentId: 2
            },
            {
                id: 4,
                label: 'Sass',
                link: '/',
                parentId: 2
            },
            {
                id: 5,
                label: 'Cripto',
                link: '/',
                parentId: 2
            },
            {
                id: 6,
                label: 'Blog',
                link: '/',
                parentId: 2
            },
        ]
    },
    {
        id: 7,
        isLayout: true
    },
    {
        id: 8,
        label: 'Aplicaciones',
        isTitle: true
    },
    {
        id: 9,
        label: 'Calendario',
        icon: 'bx-calendar',
        link: '/',
    },
    {
        id: 10,
        label: 'Multi nivel',
        icon: 'bx-share-alt',
        subItems: [
            {
                id: 11,
                label: 'Nivel 1.1',
                link: '#',
                parentId: 10
            },
            {
                id: 13,
                label: 'Nivel 1.2',
                parentId: 10,
                subItems: [
                    {
                        id: 14,
                        label: 'Nivel 2.1',
                        parentId: 13,
                    },
                    {
                        id: 15,
                        label: 'Nivel 2.2',
                        parentId: 13,
                    }
                ]
            },
        ]
    }
];

