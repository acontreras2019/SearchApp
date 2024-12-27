import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // conexiones http
import { importProvidersFrom } from '@angular/core'; // usar forms
import { FormsModule } from '@angular/forms'; // usar forms

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(),
    importProvidersFrom(FormsModule), // Importa el módulo de formularios
    provideClientHydration(withEventReplay())]
};
