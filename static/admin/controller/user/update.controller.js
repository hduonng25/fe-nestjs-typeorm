app.controller('UpdateUserController', function ($scope, $routeParams, $http) {
    const user_id = $routeParams.id;

    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        token: token,
    };

    $http
        .get(`http://127.0.0.1:3009/api/v1/user/id=${user_id}`, {
            headers: headers,
        })
        .then(function (response) {
            const user = response.data;
            $scope.user = user;
        })
        .catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: 'No token',
                showConfirmButton: false,
                timer: 2000,
            }).then(function () {
                setTimeout(function () {
                    window.location.href = 'http://127.0.0.1:5500/templates/admin/auth/login.html';
                }, 2000);
            });
        });

    $scope.saveUpdate = function (user) {
        user = {
            ...user,
            roles: [user.roles],
        };
        $http
            .put('http://127.0.0.1:3009/api/v1/user/', user, {
                headers: headers,
            })
            .then(function (response) {
                Swal.fire('Update successfuly!', '', 'success');
                window.location.href = '#!/list-user';
            });
    };

    $scope.back = () => {
        window.location.href = '#!/list-user';
    };
});
