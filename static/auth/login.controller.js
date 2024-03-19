app.controller('LoginController', function ($scope, $http) {
    $scope.email = '';
    $scope.password = '';

    $scope.login = function () {
        let data = JSON.stringify({
            email: $scope.email,
            password: $scope.password,
        });

        let config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        $http
            .post('http://127.0.0.1:3009/api/v1/auth/login', data, config)
            .then(function (response) {
                console.log(response.data.data.access_token);

                localStorage.setItem('token', response.data.data.access_token);
                let token = localStorage.getItem('token');
                console.log(token);

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
                console.log(decodedToken.roles);

                if (
                    decodedToken.roles.some((role) => role.includes('ADMIN')) ||
                    decodedToken.roles.some((role) => role.includes('STAFF'))
                ) {
                    window.location.href = 'http://127.0.0.1:5500/templates/admin/index.html';
                } else {
                    window.location.href = 'http://127.0.0.1:5501/templates/customer/home/index.html#!/';
                }
            })
            .catch(function (error) {
                if (error.status === 500) {
                    Swal.fire({
                        icon: 'warning',
                        title: error.data.message,
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(function () {
                        sessionStorage.setItem('isConfirmed', true);
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: error.data.mess,
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(function () {
                        sessionStorage.setItem('isConfirmed', true);
                    });
                }
            });
    };

    $scope.returnDangKy = function () {
        window.location.href = 'http://127.0.0.1:5501/templates/auth/Register.html#!/';
    };
    $scope.quenMatKhau = function () {
        window.location.href = 'http://127.0.0.1:5501/templates/auth/ForgotPassword.html#!/';
    };
});
