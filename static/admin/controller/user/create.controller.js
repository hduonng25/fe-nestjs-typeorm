app.controller('CreateUserController', function ($scope, $routeParams, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        token: token,
    };

    $scope.create = (create_user) => {
        if (create_user) {
            let data = {
                ...create_user,
                full_name: create_user.first_name + ' ' + create_user.last_name,
                roles: [create_user.roles],
            };

            if (!create_user.roles) {
                Swal.fire({
                    icon: 'error',
                    title: 'Vui long chon role',
                    showConfirmButton: false,
                    timer: 2000,
                });
            } else {
                $http
                    .post('http://127.0.0.1:3009/api/v1/user/', data, {
                        headers: headers,
                    })
                    .then(function (response) {
                        Swal.fire('Create successfuly!', '', 'success');
                        window.location.href = '#!/list-user';
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: error.data.errors[0].message,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    });
            }
        } 
    };

    $scope.back = () => {
        window.location.href = '#!/list-user';
    };
});
