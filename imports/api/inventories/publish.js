import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Inventories } from './collection';

if (Meteor.isServer) {
   Meteor.publish('inventories', function(options, searchString) {
    var selector = {};

   if (typeof searchString === 'string' && searchString.length) {
    //selector.name = {
    //  $regex: `.*${searchString}.*`,
    //  $options : 'i'
    var search = {$regex: `.*${searchString}.*`, $options: 'i'};
    selector = {$or: [
      {name: search},
      {category: search},
      {manufacturer: search},
      {modelNo: search},
      {partNo: search},
      {totalAmount: search},
      {minAmount: search},
      {department: search},
      {critical:search}
    ]
    };
  }

   Counts.publish(this, 'numberOfInventories', Inventories.find(selector), {
    noReady: true
  });

   return Inventories.find(selector, options);
 });
}