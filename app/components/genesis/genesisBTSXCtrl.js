angular.module('app')

.controller('genesisBTSXCtrl', ['$scope', '$rootScope', 'Translate', 'Charts', 'api',
	function($scope, $rootScope, Translate, Charts, api) {

		$scope.balanceLimit = 100;

		var Size = {
			height: 250
		};
		var scrollBar = {
			enabled: false
		};

		var series = [];
		series.push(new Charts.serie({
			name: '',
			tooltip: {
				valueDecimals: 2,
				valueSuffix: '%'
			}
		}));

		$scope.genesisPercentChart = new Charts.chartConfig({
			type: 'line',
			useHighStocks: false,
			series: series,
			size: Size,
			yAxis: {
				min: 0,
				title: {
					text: ''
				},
				labels: {
					format: '{value}'
				},
				allowDecimals: false
			}
		});

		var pieSeries = [new Charts.serie({
			name: '',
			tooltip: {
				valueDecimals: 2,
				valueSuffix: '%'
			}
		})];

		$scope.genesisPieChart = new Charts.chartConfig({
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %'
					}
				}
			},
			type: 'pie',
			useHighStocks: false,
			series: pieSeries,
			size: {
				height: 300
			},
			yAxis: {
				min: 0,
				title: {
					text: ''
				},
				labels: {
					format: '{value}'
				},
				allowDecimals: false
			}
		});

		function getTranslations() {
			Translate.genesis().then(function(result) {
				$scope.translations = result;
				$scope.genesisPercentChart.series[0].name = result.tooltip;
				$scope.genesisPercentChart.xAxis.title.text = result.xlabel;
				$scope.genesisPercentChart.yAxis.title.text = result.ylabel;

				updatePieChart();
			});
		}

		getTranslations();

		api.getGenesisBTSX().success(function(genesis) {
			$scope.genesis = genesis[0];
			$scope.genesisPercentChart.series[0].data = $scope.genesis.cumulativePercentPlot;

			updatePieChart();
		});

		function updatePieChart() {
			var temp = [];
			if ($scope.translations && $scope.genesis) {
				$scope.genesis.percentAddressCount2.forEach(function(entry) {
					temp.push([entry[0] + ' ' + $scope.translations.addresses, entry[1]]);
				});
				$scope.genesisPieChart.series[0].data = temp;

			}
		}

		$rootScope.$on('$translateLoadingSuccess', function() {
			getTranslations();
		});

		$rootScope.$on('languageChange', function() {
			getTranslations();
		});

	}
]);