"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var FirebaseService = (function () {
    function FirebaseService(firebase) {
        this.firebase = firebase;
        this.kids = [];
        this.kindergardens = [];
        this.completed = new rxjs_1.BehaviorSubject(null);
        this.kidsObservable = this.firebase.database.list('/kids');
        this.kindergardenObservable = this.firebase.database.list('/kindergardens');
        this.init();
    }
    FirebaseService.prototype.init = function () {
        var _this = this;
        this.kidsObservable.subscribe(function (kids) {
            _this.kids = kids;
            _this.kindergardenObservable.subscribe(function (kindergardens) {
                _this.kindergardens = kindergardens;
                _this.completed.next(true);
            });
        });
    };
    FirebaseService.prototype.getReminderTime = function () {
        return this.firebase.database.object('/reminderTime');
    };
    FirebaseService.prototype.getKids = function () {
        return this.kids;
    };
    FirebaseService.prototype.addKid = function (kid, kindergardenId) {
        var _this = this;
        this.kidsObservable.push(kid).then(function (resolve) {
            kid.$key = resolve.key;
            var data = _this.getKindergarden(kindergardenId).kids;
            if (!data)
                data = {};
            data[kid.$key] = true;
            _this.kindergardenObservable.update(kindergardenId, { kids: data }).catch(function (c) {
                console.log(c);
            });
        });
    };
    FirebaseService.prototype.updateKid = function (kid) {
        var data = {};
        data.name = kid.name;
        data.father = kid.father;
        data.mother = kid.mother;
        data.fatherPhone = kid.fatherPhone;
        data.motherPhone = kid.motherPhone;
        this.kidsObservable.update(kid.$key, data);
    };
    FirebaseService.prototype.getKindergardens = function () {
        return this.kindergardens;
    };
    FirebaseService.prototype.getKid = function (kidId) {
        var _kid;
        this.kids.forEach(function (kid) {
            if (kid.$key === kidId) {
                _kid = kid;
            }
        });
        return _kid;
    };
    FirebaseService.prototype.getKindergarden = function (kindergardenId) {
        var _kindergarden;
        this.kindergardens.forEach(function (kindergarden) {
            if (kindergarden.$key === kindergardenId) {
                _kindergarden = kindergarden;
            }
        });
        return _kindergarden;
    };
    FirebaseService.prototype.addKindergarden = function (item) {
        this.kindergardenObservable.push({ name: item.name });
    };
    FirebaseService.prototype.updateKindergarden = function (item) {
        this.kindergardenObservable.update(item.$key, { name: item.name });
    };
    FirebaseService.prototype.removeKidFromKindergarden = function (kidId, kindergardenId) {
        var kids = this.getKindergarden(kindergardenId).kids;
        delete kids[kidId];
        this.kindergardenObservable.update(kindergardenId, { kids: kids });
    };
    FirebaseService = __decorate([
        core_1.Injectable()
    ], FirebaseService);
    return FirebaseService;
}());
exports.FirebaseService = FirebaseService;
