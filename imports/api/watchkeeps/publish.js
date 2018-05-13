import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Watchkeeps } from './collection';

if (Meteor.isServer) {
   Meteor.publish('watchkeeps', function(options, searchString) {
    var selector = {};

   if (typeof searchString === 'string' && searchString.length) {
    //selector.name = {
    //  $regex: `.*${searchString}.*`,
    //  $options : 'i'
    var search = {$regex: `.*${searchString}.*`, $options: 'i'};
    selector = {$or: [
      {time: search},
      {taskGroup: search},
      {task: search},
      {status: search}
    ]
    };
  }

   Counts.publish(this, 'numberOfWatchkeeps', Watchkeeps.find(selector), {
    noReady: true
  });

   return Watchkeeps.find(selector, options);
 });
}