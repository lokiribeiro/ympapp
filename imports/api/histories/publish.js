import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Histories } from './collection';

if (Meteor.isServer) {
  Meteor.publish('histories', function(options, searchString) {
    var selector = {};
 
    if (typeof searchString === 'string' && searchString.length) {
      var search = {$regex: `.*${searchString}.*`, $options: 'i'};
      selector = {$or: [
        {title: search},
        {group: search},
        {workHistory: search}
      ]};
   }

  Counts.publish(this, 'numberOfHistories', Histories.find(selector), {
   noReady: true
 });

  return Histories.find(selector, options);
});
}