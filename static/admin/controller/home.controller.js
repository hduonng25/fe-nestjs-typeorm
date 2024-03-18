const app = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);

app.config(function ($routeProvider) {
    //User
    $routeProvider.when('/list-user', {
        templateUrl: '/templates/admin/user/list.html',
        controller: 'UserController',
    });

    $routeProvider.when('/update-user', {
        templateUrl: '/templates/admin/user/update.html',
        controller: 'UpdateUserController',
    });
});
