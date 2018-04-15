import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import {pleaseWait} from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Profiles } from '../../../api/profiles';
import { Logbooks } from '../../../api/logbooks';
import { Groups } from '../../../api/groups';
import { Subgroups } from '../../../api/subgroups';

import template from './sealog.html';
 
class Sealog {
  constructor($scope, $reactive, $state) {
    //'ngInject';
 
    $reactive(this).attach($scope);

    this.port = {};
    this.engineer = {};
    this.sort = {
      name: 1
    };
    this.sort2 = {
      itemName: 1
    };
    this.selectedUnitC = 'C';
    this.selectedUnitKpa = 'Kpa';
    this.selectedUnitRPM = 'RPM';
    this.selectedUnitV = 'V';
    this.selectedUnitHours = 'Hours';
    this.selectedUnitI = 'I';
    this.selectedUnitIH = 'IH';
    this.selectedUnit = ' ';
    this.selectedUnitA = 'A';
    this.selectedUnitkW = 'kW';
    this.selectedUnitHz = 'Hz';
    this.selectedUnitkVA = 'kVA';
    this.selectedUnitPercent = '%';
    this.selectedUnitm2 = 'm2';
    this.selectedUnit5 = '5';
    this.selectedUnitKPM = 'KPM';

    $scope.doneSearching = false;
    $scope.uploadSuccess = false;

    this.subscribe('users');

    this.subscribe('profiles', () => [{
    }, this.getReactively('searchText')
    ]);

    this.subscribe('logbooks', () => [{
    }, this.getReactively('searchText')
    ]);

    this.subscribe('groups');
    
    this.subscribe('subgroups');
 
    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      },
      profiles() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        console.info('boats', boats);
        if(boats){
          $scope.userBoatID = boats.boatID;
          var boatID = $scope.userBoatID;
          var selector = {boatID: boatID};
        } else {
          var selector = {};
        } 
        return Profiles.find(selector);
      },
      logbooks() {
        return Logbooks.find({});
      },
      groups() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        console.info('boats', boats);
        if(boats){
          $scope.userBoatID = boats.boatID;
          var boatID = $scope.userBoatID;
          var selector = {boatID: boatID};
        } else {
          var selector = {};
        } 
        return Groups.find(selector, {
          sort : this.getReactively('sort')
        });
      },
      subgroups() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        console.info('boats', boats);
        if(boats){
          $scope.userBoatID = boats.boatID;
          var boatID = $scope.userBoatID;
          var selector = {boatID: boatID};
        } else {
          var selector = {};
        } 
        return Subgroups.find(selector, {
          sort : this.getReactively('sort2')
        });
      }
    });

    this.logout = function() {
      window.loading_screen = pleaseWait({
        logo: "../assets/global/images/logo/logo-white.png",
        backgroundColor: '#8c9093',
        loadingHtml: "<div class='sk-spinner sk-spinner-wave'><div class='sk-rect1'></div><div class='sk-rect2'></div><div class='sk-rect3'></div><div class='sk-rect4'></div><div class='sk-rect5'></div></div>"
      });
      Accounts.logout();
      window.setTimeout(function(){
        window.loading_screen.finish();
        $state.go('login', {}, {reload: 'login'});
      },2000);
    }

    this.gotoDashboard = function() {
      $state.go('dashboard', {}, {reload: 'dashboard'});
    }
    this.gotoInventory = function() {
      $state.go('inventory', {}, {reload: 'inventory'});
    }
    this.gotoLogbook = function() {
      $state.go('logbook', {}, {reload: 'logbook'});
    }
    this.gotoEmployees = function() {
      $state.go('employees', {}, {reload: 'employees'});
    }
    this.gotoSettings = function() {
      $state.go('settings', {}, {reload: 'settings'});
    }
    this.gotoAdminPanel = function() {
      $state.go('adminpanel', {}, {reload: 'adminpanel'});
    }

    this.notification = function() {
      
      this.showNotif = false;
      console.info('notif daan', this.showNotif);
    }

    this.save = function() {
      this.port.date = new Date();
      this.port.dateTime = this.port.date.getTime();
      this.port.userID = this.engineer.doneBy.userID;
      this.port.name = this.engineer.doneBy.firstName + ' ' + this.engineer.doneBy.lastName;
      this.port.type = 'sea';
      this.port.boatID = $scope.userBoatID;
      console.info('port details', this.port);
      Logbooks.insert(this.port, (error) => {
          if (error) {
            console.log('Oops, unable to insert...');
          } else {
            console.log('Done!');
            $state.go('logbook', {}, {reload: 'logbook'});
          }
      });
    }

}

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.currentUserId;
  }

}
 
const name = 'sealog';

//Jobdetails.$inject = ['$scope', '$reactive', '$stateParams'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Sealog]
})
.config(['$stateProvider',
function($stateProvider) {
    //'ngInject';
    $stateProvider
      .state('sealog', {
        url: '/sealog',
        template: '<sealog></sealog>',
        resolve: {
            currentUser($q, $state) {
                if (Meteor.userId() === null) {
                    return $q.reject('AUTH_REQUIRED');
                } else {
                  return $q.resolve();
                };
            }
        }
      });
    }
]);

