app.controller('UserController', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        token: token,
    };
    function parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(''),
        );

        let payload = JSON.parse(jsonPayload);
        return payload;
    }
    let decodedToken = parseJwt(token);

    $http
        .get('http://127.0.0.1:3009/api/v1/user/?page=1&size=2', {
            headers: headers,
        })
        .then(function (response) {
            const listUser = response.data.data.result;
            $scope.listUser = listUser;
        })
        .catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: 'No token',
                showConfirmButton: false,
                timer: 2000,
            }).then(function () {
                setTimeout(function () {
                    window.location.href =
                        'http://127.0.0.1:5500/templates/admin/auth/login.html';
                }, 2000);
            });
        });

    //TODO: Delete user
    $scope.deleted = function (user) {
        const ids = [];
        ids.push(user.id);

        Swal.fire({
            title: 'Do you want to delete this user?',
            text: 'Do you want to delete this user?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                $http
                    .delete('http://127.0.0.1:3009/api/v1/user/', {
                        headers: headers,
                        data: { ids: ids },
                    })
                    .then(function (response) {
                        $http
                            .get('http://127.0.0.1:3009/api/v1/user/?page=1&size=2', {
                                headers: headers,
                            })
                            .then(function (response) {
                                const listUser = response.data.data.result;
                                $scope.listUser = listUser;
                            });
                    });
                Swal.fire('Deleted successfuly!', '', 'success');
            }
        });
    };

    //TODO: Chuyen huong sang trang update
    $scope.updateUser = function (user) {
        const check = decodedToken.roles.some((roles) => roles.includes('ADMIN'));
        if (!check) {
            Swal.fire({
                icon: 'warning',
                title: 'You do not have permission to operate',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let user_id = user.id;
        window.location.href = '#!/update-user?id=' + user_id;
    };

    $scope.reLoad = function () {
        $http
            .get('http://127.0.0.1:3009/api/v1/user/?page=1&size=2', {
                headers: headers,
            })
            .then(function (response) {
                const listUser = response.data.data.result;
                $scope.listUser = listUser;
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'No token',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    setTimeout(function () {
                        window.location.href =
                            'http://127.0.0.1:5500/templates/admin/auth/login.html';
                    }, 2000);
                });
            });
    };
});
