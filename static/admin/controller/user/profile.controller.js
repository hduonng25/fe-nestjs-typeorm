app.controller('ProfileUserController', function ($scope, $routeParams, $http, parseJwt) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        token: token,
    };

    let payload = parseJwt.decodeToken(token);

    $http
        .get(`http://127.0.0.1:3009/api/v1/user/id=${payload.id}`, {
            headers: headers,
        })
        .then(function (response) {
            const user = response.data;
            $scope.avatarSrc = `http://127.0.0.1:3009/${user.avatar}`;
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

    $scope.change = (user) => {
        const check = payload.roles.some((roles) => roles.includes('ADMIN'));
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

    $scope.file = '';

    $scope.fileChanged = function (input) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.avatarSrc = e.target.result;
                });
            };
            reader.readAsDataURL(input.files[0]);
            $scope.file = input.files[0];
        }
    };

    $scope.uploadImage = function () {
        let inputFile = document.getElementById('fileInput');
        inputFile.click();
    };

    $scope.avatar = () => {
        let formData = new FormData();
        formData.append('avatar', $scope.file);

        $http
            .post('http://127.0.0.1:3009/api/v1/user/upload-avatar', formData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    token: token,
                },
            })
            .then(function (response) {
                Swal.fire('Set avatar successfuly!', '', 'success');
                window.location.href = '#!/list-user';
            })
            .catch(function (error) {
                console.log(error.data.message);
            });
    };
});
