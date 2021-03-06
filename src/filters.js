define(['angular', 'services', 'moment'], function (angular, services, moment) {
  'use strict';

  /* Filters */

  angular.module('app.filters', ['app.services'])
    .filter('parseTime', function() {
      return function(input) {
        var d = moment.duration(parseInt(input));
        var out = Math.floor(d.asHours()) + 'h ' + d.get('minutes') + 'm ' +
        d.get('seconds') + 's';
        return out;
      };
    })
    .filter('day', function() {
      return function(input) {
        return moment(input).format('DD.MM.YYYY');
      };
    });
});
