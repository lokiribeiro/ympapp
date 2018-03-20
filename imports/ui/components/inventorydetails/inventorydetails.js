import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Inventories } from '../../../api/inventories';
import template from './inventorydetails.html';
 
class Inventorydetails {
  constructor($scope, $reactive, $stateParams, $state) {
    //'ngInject';
 
    $reactive(this).attach($scope);

    this.inventoryId = $stateParams.inventoryId;

    console.info('inventoryId', this.inventoryId);

    this.inventory = {};

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = '';

    this.options = [
      {name: 'Yes', value: true},
      {name: 'No', value: false}
    ];

    this.subscribe('inventories');

    this.subscribe('users');
 
    this.helpers({
      inventory() {
        return Inventories.findOne({
            _id: $stateParams.inventoryId
          });
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
    this.delete = function() {
      var inventoryId = $stateParams.inventoryId;
      var status = Inventories.remove(inventoryId);
      console.info('item removed', status);
      $state.go('inventory', {}, {reload: 'inventory'});
    }
  }

  isOwner(inventory) {
    return this.isLoggedIn && inventory.owner === this.currentUserId;
  }
   
  save() {
    Inventories.update({
      _id: this.inventory._id
    }, {
      $set: {
        name: this.inventory.name,
        category: this.inventory.category,
        manufacturer: this.inventory.manufacturer,
        modelNo: this.inventory.modelNo,
        partNo: this.inventory.partNo,
        totalAmount: this.inventory.totalAmount,
        minAmount: this.inventory.minAmount,
        department: this.inventory.department,
        critical: this.inventory.critical,
        price: this.inventory.price
      }
    }, (error) => {
        if (error) {
          console.log('Oops, unable to update the inventory...');
        } else {
          console.log('Done!');
        }
    });
  }
}
 
const name = 'inventorydetails';

//Inventorydetails.$inject = ['$scope', '$reactive', '$stateParams'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$stateParams', '$state', Inventorydetails]
})
.config(['$stateProvider',
function($stateProvider) {
    //'ngInject';
    $stateProvider
      .state('inventorydetails', {
        url: '/inventorydetails/:inventoryId',
        template: '<inventorydetails></inventorydetails>',
    
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

