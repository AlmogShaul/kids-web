"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var KidComponent = (function () {
    function KidComponent(firebaseService, route, zone, location) {
        this.firebaseService = firebaseService;
        this.route = route;
        this.zone = zone;
        this.location = location;
        this.kid = {};
    }
    KidComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            var kidId = params['id'];
            _this.kindergardenId = params['kgId'];
            if (kidId !== '-1') {
                _this.zone.run(function () {
                    _this.kid = _this.firebaseService.getKid(kidId);
                });
            }
            else {
                _this.kid = { name: '', father: '', mother: '', fatherPhone: '', motherPhone: '', arrived: false };
            }
        });
    };
    KidComponent.prototype.save = function () {
        if (this.kid.$key)
            this.firebaseService.updateKid(this.kid);
        else {
            this.kid.arrived = false;
            this.firebaseService.addKid(this.kid, this.kindergardenId);
        }
        this.location.back();
    };
    KidComponent = __decorate([
        core_1.Component({
            selector: 'kid',
            templateUrl: './kid.component.html',
            styleUrls: ['kid.component.css']
        })
    ], KidComponent);
    return KidComponent;
}());
exports.KidComponent = KidComponent;
