app.controller('LogoutController', function ($scope, $http) {
    $scope.logOut = () => {
        Swal.fire({
            title: 'Do you want to log out?',
            text: 'Do you want to log out?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                Swal.fire('Deleted successfuly!', '', 'success');
                window.location.href = 'http://127.0.0.1:5500/templates/admin/auth/login.html';
            }
        });
    };
});
