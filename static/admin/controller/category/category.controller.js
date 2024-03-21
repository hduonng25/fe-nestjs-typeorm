app.controller('CategoryController', function ($scope, $http, parseJwt) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        token: token,
    };

    let payload = parseJwt.decodeToken(token);

    $http
        .get('http://127.0.0.1:3009/api/v1/category/?page=1&size=10', {
            headers: headers,
        })
        .then(function (response) {
            const list_category = response.data.result;
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

    $scope.create_category = () => {
        Swal.fire({
            title: 'Create category',
            html: `
        <label for="color-input">Name</label>
        <input type="text" id="name-category" class="form-control">
      `,
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancler',
            preConfirm: () => {
                const nameInput = document.getElementById('name-category').value;
                if (!nameInput) {
                    Swal.showValidationMessage('Name category is valid');
                } else {
                    let data = {
                        name: nameInput,
                    };

                    $http
                        .post('http://127.0.0.1:3009/api/v1/category/', data, { headers })
                        .then(function (response) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Create successfuly',
                                showConfirmButton: false,
                                timer: 2000,
                            });

                            $http
                                .get('http://127.0.0.1:3009/api/v1/category/?page=1&size=10', {
                                    headers: headers,
                                })
                                .then(function (response) {
                                    const list_category = response.data.result;
                                    $scope.list_category = list_category;
                                });
                        })
                        .catch(function (error) {
                            if (error.status === 400) {
                                const errorMessage = error.data.description.en;
                                Swal.fire({
                                    icon: 'error',
                                    title: errorMessage + '',
                                    showConfirmButton: false,
                                    timer: 2000,
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Invalid server',
                                    showConfirmButton: false,
                                    timer: 2000,
                                });
                            }
                        });
                }
            },
        });
    };

    $scope.deleted = (category) => {
        const ids = [];
        ids.push(category.id);

        Swal.fire({
            title: 'Do you want to delete this category?',
            text: 'Do you want to delete this category?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                $http
                    .delete('http://127.0.0.1:3009/api/v1/category/', {
                        headers: headers,
                        data: { ids: ids },
                    })
                    .then(function (response) {
                        $http
                            .get('http://127.0.0.1:3009/api/v1/category/?page=1&size=2', {
                                headers: headers,
                            })
                            .then(function (response) {
                                const list_category = response.data.result;
                                $scope.list_category = list_category;
                            });
                    });
                Swal.fire('Deleted successfuly!', '', 'success');
            }
        });
    };

    $scope.updateCategory = (category) => {
        Swal.fire({
            title: 'Change category',
            html: `
        <label for="color-input">Change name</label>
        <input type="text" id="name-category" class="form-control">
      `,
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancler',
            preConfirm: () => {
                const nameInput = document.getElementById('name-category').value;
                if (!nameInput) {
                    Swal.showValidationMessage('Name category is valid');
                } else {
                    let data = {
                        id: category.id,
                        name: nameInput,
                    };

                    $http
                        .put('http://127.0.0.1:3009/api/v1/category/', data, { headers })
                        .then(function (response) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Update successfuly',
                                showConfirmButton: false,
                                timer: 2000,
                            });

                            $http
                                .get('http://127.0.0.1:3009/api/v1/category/?page=1&size=2', {
                                    headers: headers,
                                })
                                .then(function (response) {
                                    const list_category = response.data.result;
                                    $scope.list_category = list_category;
                                });
                        })
                        .catch(function (error) {
                            if (error.status === 400) {
                                const errorMessage = error.data.message;
                                Swal.fire({
                                    icon: 'error',
                                    title: errorMessage + '',
                                    showConfirmButton: false,
                                    timer: 2000,
                                });
                            } else {
                                console.error(error);
                            }
                        });
                }
            },
        });
    };
});
