import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Component, TemplateRef } from '@angular/core';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class SessionGuard implements CanDeactivate<ComponentCanDeactivate> {

    constructor() {}

    canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
      
        // if there are no pending changes, just allow deactivation; else confirm first
        //Si no hay cambios pendientes permitir abandonar la página, sino, confirmar primero
      
        /*return component.canDeactivate() ?
            true :
            // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
            // when navigating away from your angular app, the browser will show a generic warning message
            // see http://stackoverflow.com/a/42207299/7307355
            
            confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.')*/

        if(component.canDeactivate()){
            return true;
        } else {

           if(confirm('ATENCIÓN: Aún no has terminado. Presiona Cancel para seguir aquí, u OK para salir.')) {
               return true;
           } else 
               return false;
        }
    }
}