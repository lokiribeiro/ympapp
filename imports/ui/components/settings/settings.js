import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Groups } from '../../../api/groups';
import { Subgroups } from '../../../api/subgroups';

import template from './settings.html';
 
class Settings {
  constructor($scope, $reactive, $state) {
    //'ngInject';
 
    $reactive(this).attach($scope);

    this.group = {};
    this.subgroup = {};
    this.units = [
        {unit: 'C', value: "C'"},
        {unit: 'Kpa', value: 'Kpa'},
        {unit: 'F', value: "F'"},
        {unit: 'RPM', value: 'RPM'},
        {unit: 'V', value: 'V'},
        {unit: 'Hours', value: 'Hours'},
        {unit: 'I', value: 'I'},
        {unit: 'IH', value: 'I/H'},
        {unit: 'A', value: 'A'},
        {unit: 'kW', value: 'kW'},
        {unit: 'Hz', value: 'Hz'},
        {unit: 'kVA', value: 'kVA'},
        {unit: 'percent', value: '%'},
        {unit: 'm2', value: 'm2'},
        {unit: 'five', value: '5'},
        {unit: 'KPM', value: 'KPM'},
        {unit: 'Others', value: ' '}
    ];

    this.inputs = [];
    this.option = {};
    this.withoutOptions = true;

    this.subscribe('users');

    this.subscribe('groups');

    this.subscribe('subgroups');
 
    this.helpers({
      groups() {
        return Groups.find({});
      },
      subgroups() {
        return Subgroups.find({});
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      }
    });

    this.logout = function() {
      Accounts.logout();
      window.setTimeout(function(){
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
    this.addField = function () {
        this.inputs.push({});
    }
  }

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.currentUserId;
  }
   
  pageChanged(newPage) {
    this.page = newPage;
    console.info('new page', this.page);
  }

  sortChanged(sort) {
    this.sort = sort;
  }

  save() {
    console.info('group value', this.group)
    this.group.owner = Meteor.userId();
    this.group.date = new Date();
    var status = Groups.insert(this.group);
    this.group = {};
  }

  addRow(passedGroup, unit) {
    console.info('array value', unit);
    console.info('inputs value', this.inputs);
    console.info('passed group', passedGroup);
    var inputs = this.inputs;
    var lenth = inputs.length;
    var optionArray = [];
    for(x=0;x<lenth;x++){
        optionArray[x] = this.inputs[x].option;
        this.withoutOptions = false;
    }
    this.subgroup.optionItems = optionArray;
    this.subgroup.groupID = passedGroup._id;
    this.subgroup.unit = unit;
    this.subgroup.withoutOptions = this.withoutOptions;
    console.info('subgroup items', this.subgroup.optionItems);
    var status = Subgroups.insert(this.subgroup);
    this.subgroup = {};
    this.inputs = [];
  }

  updatePort(group) {
      console.info('value upon entrance', group.atPort);
      Groups.update({
        _id: group._id
      }, {
        $set: {
          atPort: group.atPort
        }
      }, (error) => {
          if (error) {
            console.log('Oops, unable to update the party...');
          } else {
            console.log('Done!');
          }
      });
      
  }

  updateSea(group) {
    console.info('value upon entrance', group.atSea);
    Groups.update({
      _id: group._id
    }, {
      $set: {
        atSea: group.atSea
      }
    }, (error) => {
        if (error) {
          console.log('Oops, unable to update the party...');
        } else {
          console.log('Done!');
        }
    });
    
}

  removeGroup(group) {
      console.info('remove group', group);
      Groups.remove(group._id);
  }

  reset() {
    this.searchText = '';
    this.dateFrom2 = '';
    this.dateTo2 = '';
    
  }

  filterNow() {
    console.info('searchText', this.searchText);
    this.dateFrom2 = this.dateFrom.getTime();
    this.dateTo2 = this.dateTo.getTime();
  }
}
 
const name = 'settings';

//Dashboard.$inject = ['$scope', '$reactive'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Settings]
})
.config(['$stateProvider', 
function($stateProvider) {
  //'ngInject';
  $stateProvider
    .state('settings', {
      url: '/settings',
      template: '<settings></settings>',
      resolve: {
        currentUser($q, $state) {
            if (!Meteor.userId()) {
                return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            };
        }
    }
    });
  } 
]);

