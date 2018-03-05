import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Inventories } from './collection';

if (Meteor.isServer) {
   Meteor.publish('inventories', function(options, searchString) {
   const selector = {};

   if (typeof searchString === 'string' && searchString.length) {
    selector.name = {
      $regex: `.*${searchString}.*`,
      $options : 'i'
    };
  }

   Counts.publish(this, 'numberOfInventories', Inventories.find(selector), {
    noReady: true
  });

   return Inventories.find(selector, options);
 });
}