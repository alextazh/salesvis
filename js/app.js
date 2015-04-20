var SalesApp = angular.module('SalesApp', ['ngRoute']);

SalesApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
      }).
      when('/', {
        redirectTo: '/login'
      }).
      when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'dashboardCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);

SalesApp.controller('dashboardCtrl', function() {});
SalesApp.controller('loginCtrl', function() {});


//Auth
var sessionId;
var SalesTotalPerSalesMan = [];

setTimeout( function() {
  $('#login-form').submit(function(e){
    e.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    $.getJSON('http://34de1a1c.ngrok.com/login', {'username' : username, 'password' : password}, function(data) {
      window.sessionId = data.sessionId;
      var loginSucceeded = data.loginSucceeded;
      if (sessionId != null) { //If login is successfull & sessionId is received, then:
        $.cookie('sessionCookie', sessionId); //save session ID as cookie
        window.location.href = '#/dashboard';

      } else {
        setTimeout( function () {
          $('#loginError').removeClass('hidden');
        }, 500);
      }
    });
  })
}, 500);


//Request Sales Total per Sales Man
function SalesTotalPerSalesManFn() {
  $.getJSON('http://34de1a1c.ngrok.com/salesmandata', {'sessionid' : $.cookie('sessionCookie')}, function(data) {
    SalesTotalPerSalesMan = data.data;
    for (var i in SalesTotalPerSalesMan) {SalesTotalPerSalesMan[i][1] = +SalesTotalPerSalesMan[i][1];} //convert strings to actual numbers
    //Build chart 1:
    $(function BuildSalesTotalPerSalesMan() {
      $('#SalesTotalPerSalesMan').highcharts({
          chart: {plotShadow: false},
          title: { text: ''},
          tooltip: {pointFormat: '{series.name}: ${point.y}</b>'},
          plotOptions: {pie: {allowPointSelect: true, cursor: 'pointer', dataLabels: {enabled: true, format: '<b>{point.name}</b>: ${point.y}', style: {color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'}}}},
          series: [{type: 'pie', name: 'Sales Total', data: SalesTotalPerSalesMan }] // Array from server
      });
    });
  });
};

//Request Sales Total per month
function SalesTotalPerMonthFn() {
  $.getJSON('http://34de1a1c.ngrok.com/lastyeardata', {'sessionid' : $.cookie('sessionCookie')}, function(data) {
    SalesTotalPerMonth = data.data;
    for (var i in SalesTotalPerMonth) { SalesTotalPerMonth[i][1] = +SalesTotalPerMonth[i][1]; } //convert strings to actual numbers
    //Build chart 2:
    $('#SalesTotalPerMonth').highcharts({
      chart: {plotShadow: false},
      title: {text: ''},
      tooltip: {pointFormat: '{series.name}: ${point.y}</b>'},
      xAxis: {categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],crosshair: true},
      plotOptions: {series: {borderWidth: 0, dataLabels: {enabled: true, format: '${point.y}'}}},
      series: [{type: 'column', name: 'Sales', data: SalesTotalPerMonth }] // Array from server
    });
  });
};

//Request Top 5 Sales Order
function Top5SalesOrdersFn() {
  $.getJSON('http://34de1a1c.ngrok.com/topsalesorders', {'sessionid' : $.cookie('sessionCookie')}, function(data) {
    Top5SalesOrders = data.data;
    console.log(Top5SalesOrders);
    jQuery.each(Top5SalesOrders , function(index, obj){
      $('.toporders').append('<li class="list-group-item">' + 'Order No.: ' + obj.orderNum + ' Who: ' + obj.userName + '<span class="pull-right">$'+ obj.value + '</span></li>'); // Create list item for each item in the array from server
    });
  });
};

//Request Top 5 Sales Men
function Top5SalesMenFn() {
  $.getJSON('http://34de1a1c.ngrok.com/topsalesmen', {'sessionid' : $.cookie('sessionCookie')}, function(data) {
    Top5SalesMen = data.data;
    console.log(Top5SalesMen);
    jQuery.each(Top5SalesMen , function(index, value){
      $('.topmen').append('<li class="list-group-item">' + value[0] + '<span class="pull-right">$' + value[1] + '</span></li>'); // Create list item for each item in the array from server
    });
  });
};

//Logout
setTimeout( function () {
  $('#logout_navItem').click(function() {
    $.getJSON('http://34de1a1c.ngrok.com/logout', {'sessionid' : $.cookie('sessionCookie')}, function(data){});
    setTimeout( function () {
      $('#loggedOut').removeClass('hidden');
      $.removeCookie('sessionCookie');
      $('#dashboard_navItem').addClass('hidden');
      $('#logout_navItem').addClass('hidden');
    }, 500);
  });
}, 500);

//Show 'dashboard' and 'logout' only when there is a session cookie
/*if (function () {$.Cookie('sessionCookie')!= null} ) {
  $('#dashboard_navItem').removeClass('hidden');
  $('#logout_navItem').removeClass('hidden');
}*/