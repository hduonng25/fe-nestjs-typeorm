const app = angular.module('AuthApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/login',
    });
});
