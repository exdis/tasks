define(['angular', 'services', 'jquery', 'moment'], function (angular, services, $, moment) {
  'use strict';

  /* Controllers */
  var ctrl = angular.module('app.controllers', ['app.services']);
  ctrl.controller('ctrl', ['$scope', 'Tasks', 'TasksDate', '$http', '$route',
    '$document', function ($scope, Tasks, TasksDate, $http, $route, $document) {
      $document.bind('keypress', function(event) {
        if (event.keyCode === 110) {
          $('#new').modal('show');
        }
      });
      $scope.init = function(page, load) {
        $scope.page = page;
        if (typeof $scope.currentUser !== 'undefined') {
          if (typeof $scope.month === 'undefined' || $scope.month < 0) {
            $scope.month = moment().get('month');
          }
          if (typeof load === 'undefined') {
            Tasks.get({id : $scope.currentUser, page : page}, function(data) {
              $scope.count = data.count;
              $scope.tasks = data.tasks;
              $scope.pageTotal = Math.ceil(parseInt($scope.count) / 20);
              $scope.pagination = {
                cur: page,
                total: $scope.pageTotal,
                display: 10
              };
              $scope.loading = false;
            });
          }
          TasksDate.get({id : $scope.currentUser , year : moment().get('year'),
          month : $scope.month + 1}, function(data) {
            $scope.datedTasks = data;
            $scope.total($scope.month);
          });
          TasksDate.get({id : $scope.currentUser , year : moment().get('year'),
          month : moment().get('month') + 1}, function(data) {
            $scope.currentMonthData = data;
            $scope.today();
          });
        }
      };
      $scope.today = function() {
        var total = 0;
        angular.forEach($scope.currentMonthData, function(v, k) {
          if (moment(v.pubDate).isSame(moment(), 'day')) {
            total += parseInt(v.time);
          }
        });
        var d = moment.duration(total);
        var out;
        out = 'Today you have ';
        out += Math.floor(d.asHours()) + 'hours ' + d.get('minutes') +
        'minutes ' + d.get('seconds') + 'seconds';
        out += ' (' + (d.asHours() * $scope.settings.cost).toFixed(2) + ' rubles)';
        $scope.timeEntriesToday = out;
      };
      $scope.daySeparator = function(curr, prev) {
        if (prev === undefined) {
          return true;
        } else {
          return !moment(curr.pubDate).isSame(moment(prev.pubDate), 'day');
        }
      };
      $scope.total = function(month) {
        var total = 0;
        angular.forEach($scope.datedTasks, function(v, k) {
          total += parseInt(v.time);
        });
        var d = moment.duration(total);
        var out;
        out = 'In ' + moment({year : moment().get('year'),
        month : month}).format('MMMM') + ' you have ';
        out += Math.floor(d.asHours()) + 'hours ' + d.get('minutes') +
        'minutes ' + d.get('seconds') + 'seconds';
        out += ' (' + (d.asHours() * $scope.settings.cost).toFixed(2) + ' rubles)';
        $scope.timeEntries = out;
      };
      $scope.prevMonth = function() {
        $scope.month -= 1;
        $scope.init($scope.page, true);
      };
      $scope.currentMonth = function() {
        $scope.month = moment().get('month');
        $scope.init($scope.page, true);
      };
      $scope.submit = function() {
        var form = $scope.form;
        var validation = [false, false, false];

        $('#new form input').each(function(i) {
          if (!$(this).val()) {
            $(this).parent('.form-group').addClass('has-error');
            validation[i] = false;
          } else {
            if ($(this).hasClass('time')) {
              var val = $(this).val();
              if (val.match(/\d+[hms]/)) {
                $(this).parent('.form-group').removeClass('has-error');
                validation[i] = true;
              }
            } else {
              $(this).parent('.form-group').removeClass('has-error');
              validation[i] = true;
            }
          }
        });
        var go = true;
        for (var i = 0; i < validation.length; i++) {
          if (!validation[i]) {
            go = false;
          }
        }

        if (go) {
          var h = form.time.match(/\d+h/);
          var m = form.time.match(/\d+m/);
          var s = form.time.match(/\d+s/);
          var duration = moment.duration({
            hours: h ? parseInt(h[0].replace('h', '')) : 0,
            minutes: m ? parseInt(m[0].replace('m', '')) : 0,
            seconds: s ? parseInt(s[0].replace('s', '')) : 0
          });
          form.time = duration.asMilliseconds();
          form.userid = $scope.currentUser;
          $http.post('api/tasks', JSON.stringify(form)).success(function(data) {
            if (data.status === 'OK') {
              $('#new').modal('hide');
              if ($('.navbar-collapse').hasClass('in')) {
                $('.navbar-toggle').click();
              }
              $scope.init($scope.pagination.cur);
              $scope.form = {};
            }
          });
        }
      };
      $scope.submitSettings = function() {
        var settings = $scope.settings;

        var go = true;
        $('#settings form input').each(function(i) {
          if (!$(this).val()) {
            go = false;
            $(this).parent('.form-group').addClass('has-error');
          } else {
            $(this).parent('.form-group').removeClass('has-error');
          }
        });
        if (go) {
          $http.put('api/users/' + $scope.currentUser,
          JSON.stringify(settings)).success(function(data) {
            if (data.status === 'OK') {
              $('#settings').modal('hide');
              if ($('.navbar-collapse').hasClass('in')) {
                $('.navbar-toggle').click();
              }
              $scope.total($scope.month);
            }
          });
        }
      };
      $scope.taskDelete = function() {
        console.log($scope.tasktoremove);
        var id = (typeof $scope.tasktoremove !== 'undefined') ?
        $scope.tasktoremove : '';
        $http.delete('api/tasks/' + id).success(function() {
          $('#confirm').modal('hide');
          if ($('.navbar-collapse').hasClass('in')) {
            $('.navbar-toggle').click();
          }
          $scope.init($scope.pagination.cur);
        });
        //var index = $scope.tasks.indexOf(id);
        //$scope.tasks.splice(index,1);
      };
      $scope.ctrlEnter = function(e, func) {
        if (e.keyCode === 13 && e.ctrlKey) {
          func();
        }
      };
    }]);
  });
