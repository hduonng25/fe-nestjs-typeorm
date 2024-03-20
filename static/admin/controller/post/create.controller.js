app.controller('CreatePostController', function ($scope, $http, parseJwt) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        token: token,
    };

    let payload = parseJwt.decodeToken(token);
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

    //Get category
    $http
        .get('http://127.0.0.1:3009/api/v1/category/?page=1&size=20', {
            headers: headers,
        })
        .then(function (response) {
            const list_category = response.data.data.result;
            $scope.list_category = list_category;
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

    $scope.save = function (create) {
        let formData = new FormData();

        formData.append('thumbnail', $scope.file);

        formData.append('content', create.content);
        formData.append('category_id', create.category_id);

        $http
            .post('http://127.0.0.1:3009/api/v1/post/', formData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    token: token,
                },
            })
            .then(function (response) {
                Swal.fire('Create successfuly!', '', 'success');
                window.location.href = '#!/list-post';
            })
            .catch(function (error) {
                console.log(error.data);
            });
    };
});
