const app = angular.module('myApp', ['payload', 'ngRoute', 'ui.bootstrap']);

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

    $routeProvider.when('/create-user', {
        templateUrl: '/templates/admin/user/create.html',
        controller: 'CreateUserController',
    });

    $routeProvider.when('/profile', {
        templateUrl: '/templates/admin/user/profile.html',
        controller: 'ProfileUserController',
    });

    //Category
    $routeProvider.when('/list-category', {
        templateUrl: '/templates/admin/category/list.html',
        controller: 'CategoryController',
    });

    //Post
    $routeProvider.when('/list-post', {
        templateUrl: '/templates/admin/post/list.html',
        controller: 'PostController',
    });
});
