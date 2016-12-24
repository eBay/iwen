'use strict';

/**
 * @ngdoc function
 * @name iwenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the iwenApp
 */
angular.module('iwenApp')
  .controller('MainCtrl', function($scope, $http, $timeout) {

    $scope.colors = [];
    $scope.styles = [];
    $scope.bgStyles = [];
    $scope.nestedStyles = [];
    $scope.colorInfo = [];

    $scope.$watchCollection('colors', function(newValues, oldValues) {
      updateColorInfo();
      $scope.updateUI();
    });

    $scope.colors = [
      'dd1e31',
      'f18ecc',
      'f18e00',
      '178c17',
      '666666',
      '999999',
      'ffffff',
      'f1f1f1',
      '000000'
    ];

    function updateColorInfo() {
      var len = $scope.colors.length;
      while (len--) {
        //Clean up input
        $scope.colors[len] = $scope.colors[len].replace(/[\s#]/g, '');
        if ($scope.colors[len].length === 6) {
          $scope.colorInfo[len] = hexToRgb($scope.colors[len]);
          $scope.colorInfo[len].L = relativeLuminanceW3C(
            $scope.colorInfo[len].r,
            $scope.colorInfo[len].g,
            $scope.colorInfo[len].b
          );
          $scope.bgStyles[len] = {
            'background-color': '#'+$scope.colors[len]
          }
          $scope.styles[len] = {
            'background-color': '#'+$scope.colors[len],
            'width': (100 / $scope.colors.length)+'%'
          }
          $scope.nestedStyles[len] = {
            'color': '#'+$scope.colors[len]
          }
        }
      }
    }

    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
    }

    function rgbToHex(r, g, b) {
      return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // from http://www.w3.org/TR/WCAG20/#relativeluminancedef
    function relativeLuminanceW3C(R8bit, G8bit, B8bit) {

      var RsRGB = R8bit/255;
      var GsRGB = G8bit/255;
      var BsRGB = B8bit/255;

      var R = (RsRGB <= 0.03928) ? RsRGB/12.92 : Math.pow((RsRGB+0.055)/1.055, 2.4);
      var G = (GsRGB <= 0.03928) ? GsRGB/12.92 : Math.pow((GsRGB+0.055)/1.055, 2.4);
      var B = (BsRGB <= 0.03928) ? BsRGB/12.92 : Math.pow((BsRGB+0.055)/1.055, 2.4);

      // For the sRGB colorspace, the relative luminance of a color is defined as:
      var L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

      return L;
    }

    $scope.getContrastRatio = function(L1, L2) {
      return ((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2);
    };

    $scope.addColor = function() {
      $scope.colors.push('ffffff');
    };

    $scope.deleteColor = function(key) {
      $scope.colors.splice(key,1);
    };

    $scope.increaseLum = function(key) {
      var thisColor = hexToRgb($scope.colors[key]);
      if (thisColor.r !== 255 && thisColor.g !== 255 && thisColor.b !== 255) {
        $scope.colors[key] = rgbToHex(thisColor.r + 1, thisColor.g + 1, thisColor.b + 1);
      }
    };

    $scope.decreaseLum = function(key) {
      var thisColor = hexToRgb($scope.colors[key]);
      if (thisColor.r !== 0 && thisColor.g !== 0 && thisColor.b !== 0) {
        $scope.colors[key] = rgbToHex(thisColor.r - 1, thisColor.g - 1, thisColor.b - 1);
      }
    };

    $scope.updateUI = function(){

      // This will only run after the ng-repeat has rendered its things to the DOM
      $timeout(function(){
        var now = new Date();
        console.log('UI Updated', $scope.colors.length+' colors rendered', now.getTime());

        var i = $scope.colors.length;

        while (i--) {
          //Clean up input

          var element = angular.element('#color__'+$scope.colors[i]+i);
          var contrast = element.find(' .contrast');
          console.log($scope.colors[i].length);

          var contrastValue;
          var colorPairing;

          contrast.each(function() {
            colorPairing = $(this).parent().prev('.color__pairing').html();
            $(this).nextAll().find('.fa-font').each(function() {
              $(this).removeClass('pass').removeClass('fail');
            });
            if ($scope.colors[i].length === 6 && colorPairing.length === 6) {
              contrastValue = $(this).html();
              if (contrastValue < 3) {
                $(this).nextAll().find('.fa-font').each(function() {
                  $(this).addClass('fail');
                })
              } else if ( contrastValue < 4.5) {
                $(this).nextAll().find('.text__small').each(function() {
                  $(this).addClass('fail');
                })
                $(this).nextAll().find('.text__large').each(function() {
                  $(this).addClass('pass');
                })
              } else if ( contrastValue >= 4.5) {
                //console.log('both pass');
                $(this).nextAll().find('.fa-font').each(function() {
                  $(this).addClass('pass');
                })
              }
            } else {
              $(this).html('');
            }
            console.log($scope.colors[i], colorPairing, contrastValue);
          });

        }
      }, 0);

    };
  });
