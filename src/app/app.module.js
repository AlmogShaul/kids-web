"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var platform_browser_1 = require('@angular/platform-browser');
var core_1 = require('@angular/core');
var main_component_1 = require('./main/main.component');
var angularfire2_1 = require('angularfire2');
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var app_routing_1 = require("./app.routing");
var kid_cmp_1 = require("./kid/kid.cmp");
var common_1 = require("@angular/common");
var app_cmp_1 = require("./app.cmp");
var firebase_service_1 = require("./services/firebase.service");
var kindergarden_cmp_1 = require("./kindergarden/kindergarden.cmp");
// Must export the config
exports.firebaseConfig = {
    apiKey: "AIzaSyACoSaSPuxvYz16ZE2-9myZrN0e4RBbY7o",
    authDomain: "kids-f5aa3.firebaseapp.com",
    databaseURL: "https://kids-f5aa3.firebaseio.com",
    storageBucket: "kids-f5aa3.appspot.com",
    messagingSenderId: "16965481247"
};
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forRoot(app_routing_1.app_routes),
                material_1.MaterialModule.forRoot(),
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                angularfire2_1.AngularFireModule.initializeApp(exports.firebaseConfig)
            ],
            providers: [
                firebase_service_1.FirebaseService,
                { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy },
            ],
            declarations: [app_cmp_1.AppComponent, main_component_1.MainComponent, kid_cmp_1.KidComponent, kindergarden_cmp_1.KindergardenComponent],
            bootstrap: [app_cmp_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
