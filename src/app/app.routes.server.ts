import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    {
        path: 'checkout/:id',
        renderMode: RenderMode.Server, // Renders the page on the server for each request
    },
    {
        path: 'details/:id',
        renderMode: RenderMode.Server, // Renders the page on the server for each request
    },
    {
        path: '**',
        renderMode: RenderMode.Prerender,
    },
];
