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
        price: this.inventory.price,
        amount: this.inventory.amount,
        minAmt: this.inventory.minAmt,
        note: this.inventory.note,
        serialNo: this.inventory.serialNo,
        usedFor: this.inventory.usedFor,
        manufacturer: this.inventory.manufacturer,
        supplier: this.inventory.supplier,
        barcode: this.inventory.barcode
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

