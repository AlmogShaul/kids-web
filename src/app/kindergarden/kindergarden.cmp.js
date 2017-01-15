"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var KindergardenComponent = (function () {
    function KindergardenComponent(firebase, route, router, zone) {
        this.firebase = firebase;
        this.route = route;
        this.router = router;
        this.zone = zone;
        this.kids = [];
    }
    KindergardenComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            var kindergardenId = params['id'];
            if (kindergardenId !== '-1') {
                _this.firebase.completed.subscribe(function (c) {
                    if (c) {
                        _this.zone.run(function () {
                            _this.kindergarden = _this.firebase.getKindergardens().filter(function (kg) { return kg.$key === kindergardenId; })[0];
                            _this.getKindergardenKids();
                            _this.getReminderTime();
                        });
                    }
                });
            }
        });
    };
    KindergardenComponent.prototype.setArrived = function (item) {
        item.arrived = true;
    };
    KindergardenComponent.prototype.setNotArrived = function (item) {
        item.arrived = false;
    };
    KindergardenComponent.prototype.editKid = function (kidId, kgId) {
        this.router.navigateByUrl('kid/' + kidId + '/' + kgId);
    };
    KindergardenComponent.prototype.removeKid = function (kidId, kgId) {
        this.firebase.removeKidFromKindergarden(kidId, kgId);
    };
    KindergardenComponent.prototype.addKid = function (kgId) {
        this.router.navigateByUrl('kid/-1/' + kgId);
    };
    KindergardenComponent.prototype.getKindergardenKids = function () {
        var _this = this;
        if (!this.kindergarden)
            return;
        var temp = [];
        var _kids = this.firebase.getKids();
        var kidIds = this.kindergarden.kids;
        if (!kidIds)
            return;
        _kids.forEach(function (kid) {
            if (kidIds[kid.$key]) {
                temp.push(kid);
            }
        });
        this.zone.run(function () {
            _this.kids = temp;
        });
    };
    KindergardenComponent.prototype.getReminderTime = function () {
        var _this = this;
        this.firebase.getReminderTime().subscribe(function (time) {
            _this.reminderTime = time.$value;
        });
    };
    KindergardenComponent = __decorate([
        core_1.Component({
            selector: 'kindergarden',
            templateUrl: 'kindergarden.component.html',
            styleUrls: ['kindergarden.component.css']
        })
    ], KindergardenComponent);
    return KindergardenComponent;
}());
exports.KindergardenComponent = KindergardenComponent;
