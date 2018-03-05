import { Mongo } from 'meteor/mongo';

export const Profiles = new Mongo.Collection('profiles');

Profiles.allow({
 insert(userId, profile) {
   return userId;
 },
 update(userId, profile, fields, modifier) {
   return true;
 },
 remove(userId, profile) {
   return true;
 }
});