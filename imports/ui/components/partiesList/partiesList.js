import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Parties } from '../../../api/parties';
import PartiesSort from '../partiesSort/partiesSort';
import template from './partiesList.html';
import PartyAdd from '../partyAdd/partyAdd';
import PartyRemove from '../partyRemove/partyRemove';
import PartyCreator from '../partyCreator/partyCreator';
import PartyRsvp from '../partyRsvp/partyRsvp';
import PartyRsvpsList from '../partyRsvpsList/partyRsvpsList';
 
class PartiesListCtrl {
  constructor($scope, $reactive) {
    'ngInject';
 
    $reactive(this).attach($scope);

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = '';

    this.subscribe('parties', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort')
    }, this.getReactively('searchText')
    ]);

    this.subscribe('users');
 
    this.helpers({
      parties() {
        return Parties.find({}, {
          sort : this.getReactively('sort')
        });
      },
      partiesCount() {
        return Counts.get('numberOfParties');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      }
    });
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
}
 
const name = 'partiesList';
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  PartyAdd.name,
  PartyRemove.name,
  PartiesSort.name,
  PartyCreator.name,
  PartyRsvp.name,
  PartyRsvpsList.name,
]).component(name, {
  template,
  controllerAs: name,
  controller: PartiesListCtrl
})
.config(config);

function config($stateProvider) {
'ngInject';
$stateProvider
  .state('parties', {
    url: '/parties',
    template: '<parties-list></parties-list>'
  });
}