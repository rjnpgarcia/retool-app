import { Meteor } from "meteor/meteor";
import Server from "../imports/api/classes/server/Server";
import "../imports/api/server/methods";
import "../imports/api/startup";

Meteor.startup(async () => {
  Server.startup();
});
