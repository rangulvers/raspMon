var raspMon = angular.module('raspMon', ['Services', 'angles']);
raspMon.controller('raspCtrl', ['$scope', 'Socket',
    function($scope, Socket) {

        var minAvg = []
        var fiveAvg = [];
        var fTAvg = [];
        Socket.on('serverData', function(data) {
            $scope.hostname = data.hostname;
            $scope.type = data.type;
            $scope.platform = data.platform;
            $scope.release = data.release;
            $scope.network = data.network;
        })

        Socket.on('liveData', function(data) {
            $scope.uptime = data.uptime;
            var tMem = Math.round(data.totalmem / 1024 / 1024);
            var fMem = Math.round(data.freemem / 1024 / 1024);
            $scope.totalmem = tMem;
            $scope.freemem = fMem;
            $scope.usedmem = tMem - fMem;
            $scope.cpus = data.cpus;
            $scope.fMemPro = Math.round((fMem * 100) / tMem);
        })

        Socket.on('loadAvg', function(data) {
            minAvg = data.loadavg[0];
            fiveAvg = data.loadavg[1];
            fTAvg = data.loadavg[2];


            $scope.chart = {
                labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                datasets: [{
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    data: minAvg
                }, {
                    fillColor: "rgba(151,187,205,0.5)",
                    strokeColor: "rgba(151,187,205,1)",
                    data: fiveAvg
                }, {
                    fillColor: "rgba(180,187,155,0.5)",
                    strokeColor: "rgba(180,187,155,1)",
                    data: fTAvg
                }]
            }
        })
        $scope.options = {
            animation: false,
        }
    }
])