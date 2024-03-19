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

    $scope.uploading = false;
    $scope.imageUrl = '';

    $scope.uploadImage = function () {
        let fileInput = document.getElementById('fileInput');
        let file = fileInput.files[0];
        console.log(file);
        if (file) {
            $scope.uploading = true;

            let formData = new FormData();
            formData.append('avatar', file);

            $http
                .post('http://127.0.0.1:3009/api/v1/user/upload-avatar', formData, {
                    headers: headers,
                })
                .then(function (response) {
                    Swal.fire('Update successfuly!', '', 'success');
                    window.location.href = '#!/list-user';
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };
});
