"use strict";
var kid_cmp_1 = require("./kid/kid.cmp");
var main_component_1 = require("./main/main.component");
var kindergarden_cmp_1 = require("./kindergarden/kindergarden.cmp");
exports.app_routes = [
    { path: '', component: main_component_1.MainComponent, pathMatch: 'full' },
    { path: 'kid/:id/:kgId', component: kid_cmp_1.KidComponent, pathMatch: 'full' },
    { path: 'kindergarden/:id', component: kindergarden_cmp_1.KindergardenComponent, pathMatch: 'full' }
];
