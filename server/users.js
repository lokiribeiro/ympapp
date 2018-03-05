import _ from 'underscore';
import '../imports/api/users';

import { Meteor } from 'meteor/meteor';


   
   export function createUsers(username, password, email) {
    
     if (!this.userId) {
       throw new Meteor.Error(400, 'You have to be logged in!');
     }

     if (Meteor.isServer) {
        username = Accounts.createUser({username:username, password:password});
     }
     return username;
   }
   
   
   








   Meteor.methods({
       createUsers
   });