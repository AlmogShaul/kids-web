"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var MainComponent = (function () {
    function MainComponent(firebase, router, zone) {
        this.firebase = firebase;
        this.router = router;
        this.zone = zone;
        this.title = 'Kindergarden Anafa';
        this.kids = [];
        this.kindergardens = [];
    }
    MainComponent.prototype.save = function (item) {
        item.editMode = false;
        if (item.$key) {
            this.firebase.updateKindergarden(item);
        }
        else {
            this.firebase.addKindergarden(item);
        }
    };
    MainComponent.prototype.edit = function (item, event) {
        event.stopPropagation();
        item.editMode = true;
    };
    MainComponent.prototype.delete = function (item, event) {
        event.stopPropagation();
        this.firebase.kindergardenObservable.remove(item);
    };
    MainComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.firebase.completed.subscribe(function (c) {
            if (c) {
                _this.zone.run(function () {
                    _this.kindergardens = _this.firebase.kindergardens;
                });
            }
        });
    };
    MainComponent.prototype.add = function () {
        this.kindergardens.push({ name: 'new', editMode: true });
    };
    MainComponent.prototype.getKindergardens = function () {
        this.kindergardens = this.firebase.getKindergardens();
    };
    MainComponent.prototype.selectKindergarden = function (item) {
        this.router.navigateByUrl('kindergarden/' + item.$key);
    };
    MainComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: 'main.component.html',
            styleUrls: ['main.component.css']
        })
    ], MainComponent);
    return MainComponent;
}());
exports.MainComponent = MainComponent;
