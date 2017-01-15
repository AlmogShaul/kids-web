import { Routes} from '@angular/router';
import {KidComponent} from "./kid/kid.cmp";
import {MainComponent} from "./main/main.component";
import {KindergardenComponent} from "./kindergarden/kindergarden.cmp";
import {SettingsComponent} from "./setttings/settings-component";


export const app_routes: Routes = [
    { path: '',component: MainComponent , pathMatch: 'full'},
    { path: 'settings',component: SettingsComponent , pathMatch: 'full'},
    { path: 'kid/:id/:kgId',component: KidComponent , pathMatch: 'full'},
    { path: 'kindergarden/:id',component: KindergardenComponent , pathMatch: 'full'}
];
