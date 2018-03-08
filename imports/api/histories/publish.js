import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Histories } from './collection';

if (Meteor.isServer) {
  Meteor.publish('histories', function(options, searchString) {
    const selector = {};
 
    if (typeof searchString === 'string' && searchString.length) {
     selector.name = {
       $regex: `.*${searchString}.*`,
       $options : 'i'
     };
   }

  Counts.publish(this, 'numberOfHistories', Histories.find(selector), {
   noReady: true
 });

  return Histories.find(selector, options);
});
}