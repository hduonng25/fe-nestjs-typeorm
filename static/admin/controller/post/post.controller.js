app.controller('PostController', function ($scope, $http, parseJwt) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        token: token,
    };

    let payload = parseJwt.decodeToken(token);

    $http
        .get('http://127.0.0.1:3009/api/v1/post/?page=1&size=20', {
            headers: headers,
        })
        .then(function (response) {
            const list_post = response.data.result;
            $scope.list_post = list_post;
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

    //Delete
    $scope.deleted = (post) => {
        const ids = [];
        ids.push(post.id);

        Swal.fire({
            title: 'Do you want to delete this post?',
            text: 'Do you want to delete this post?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                $http
                    .delete('http://127.0.0.1:3009/api/v1/post/', {
                        headers: headers,
                        data: { ids: ids },
                    })
                    .then(function (response) {
                        $http
                            .get('http://127.0.0.1:3009/api/v1/post/?page=1&size=20', {
                                headers: headers,
                            })
                            .then(function (response) {
                                Swal.fire('Deleted successfuly!', '', 'success');
                                const list_post = response.data.result;
                                $scope.list_post = list_post;
                            });
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: error.data.message,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    });
            }
        });
    };

    $scope.create_post = () => {
        window.location.href = '#!/create-post';
    };

    $scope.update = (post) => {
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
        let post_id = post.id;
        window.location.href = '#!/update-post?id=' + post_id;
    };
});
