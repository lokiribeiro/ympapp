import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Watchkeeplogs } from './collection';

if (Meteor.isServer) {
    Meteor.publish('watchkeeplogs', function(options, dateFrom, dateTo, searchString) {
        var selector = {};
     
        if (typeof dateFrom === 'number' && typeof dateTo === 'number') {
            var selector = {dateTime: {
                $gte: dateFrom,
                $lte: dateTo
              }};
       } else if (typeof searchString === 'string' && searchString.length) {
        var search = {$regex: `.*${searchString}.*`, $options: 'i'};
        selector = {$or: [
            {task: search},
            {taskGroup: search},
            {name: search}
          ]};
        }

  Counts.publish(this, 'numberOfWatchkeeplogs', Watchkeeplogs.find(selector), {
   noReady: true
 });

  return Watchkeeplogs.find(selector, options);
});
}