'use strict';

/**
 * @ngdoc function
 * @name iwenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the iwenApp
 */
angular.module('iwenApp')
    .controller('MainCtrl', function($scope, $http, $timeout, $cookies) {
        $scope.colorArray = ['#111820', '#006efc', '#ff5151', '#71c63e', '#ffdb0d'];
        $scope.colors = [];
        for (var i = 0; i < $scope.colorArray.length; i++) {
            var obj = {
                hex: $scope.colorArray[i],
                bg: {},
                bgl: {},
                header: {},
                subHeader: {},
                paragraph: {}

            }
            $scope.colors.push(obj);
        }



        $scope.util = {
            defaultBg: '#ffffff',
            checkCookie: checkCookie(),
            updateColorInfo: updateColorInfo(),
            updateUI: updateUI(),
            activateSidebarInfo: 1,
            cardClicked: 0,
            currColorSelected: 0,
            currHeader: 'bg',
            deleteColor: function(key) {
                return getDeleteColor(key)
            },
            addColor: function() {
                return getAddColor();
            },
            colorSelected: function(color, index) {
                return getColorSelected(color, index);
            },
            // fontSelected : function(font){
            //     return getFontSelected(font);
            // },
            handlers: handlers(),
            increaseLum: function(key) {
                var thisColor = hexToRgb($scope.colors[key].hex);
                
                $scope.colors[key].bgl.r = thisColor.r
                $scope.colors[key].bgl.g = thisColor.g
                $scope.colors[key].bgl.b = thisColor.b

                if (thisColor.r !== 255 && thisColor.g !== 255 && thisColor.b !== 255) {
                    $scope.colors[key].hex = '#' + rgbToHex(thisColor.r + 1, thisColor.g + 1, thisColor.b + 1);
                }
            },
            decreaseLum: function(key) {
                
                var thisColor = hexToRgb($scope.colors[key].hex);
                $scope.colors[key].bgl.r = thisColor.r
                $scope.colors[key].bgl.g = thisColor.g
                $scope.colors[key].bgl.b = thisColor.b

                if (thisColor.r !== 0 && thisColor.g !== 0 && thisColor.b !== 0) {
                    $scope.colors[key].hex = '#' + rgbToHex(thisColor.r - 1, thisColor.g - 1, thisColor.b - 1);
                }
            },
            cleanHash: function(color) {
                return color.replace('#', '');
            }

        };

        function rgbToHex(r, g, b) {
            return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        function updateColorInfo() {
            for (var i = 0; i < $scope.colors.length; i++) {
                var color = $scope.colors;
                //$scope.colors[i].hex = $scope.colors[i].hex.replace(/[\s#]/g, '');
                if ($scope.colors[i].hex.length === 6) {
                    $scope.colors[i].rgbl = hexToRgb($scope.colors[i].hex);
                    $scope.colors[i].rgbl.l = relativeLuminanceW3C(
                        $scope.colors[i].rgbl.r,
                        $scope.colors[i].rgbl.g,
                        $scope.colors[i].rgbl.b
                    )
                }
            }
        }


        function updateUI() {
            var i = $scope.colors.length;
            for (var i = 0; i < $scope.colors.length; i++) {
                $scope.colors[i].id = i;
                if (!$scope.colors[i].bg) {
                    $scope.colors[i].bg.hex = 'ffffff';
                }
                if ($scope.colors[i].bg.hex) {
                                    alert('test');

                    $scope.colors[i].bgl = getBgl($scope.colors[i].bg.hex);
                    $scope.colors[i].contrastRatio = getContrastRatio($scope.colors[i].bgl, $scope.colors[i].rgbl.l);
                    var contrast_value = $scope.colors[i].contrastRatio;
                    if (contrast_value < 3) {
                        $scope.colors[i].smallText = 0;
                        $scope.colors[i].largeText = 0;
                    } else if (contrast_value < 4.5) {
                        $scope.colors[i].smallText = 0;
                        $scope.colors[i].largeText = 1;
                    } else if (contrast_value >= 4.5) {
                        $scope.colors[i].smallText = 1;
                        $scope.colors[i].largeText = 1;
                    }
                }
            }
        };



        function checkCookie() {
            if ($cookies.get('colors') == undefined) {
                return;
            } else {
                // var colors_str = $cookies.get('colors'); 
                // $scope.colors = JSON.parse($cookies.get('colors'));
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


        // // from http://www.w3.org/TR/WCAG20/#relativeluminancedef
        function relativeLuminanceW3C(R8bit, G8bit, B8bit) {

            var RsRGB = R8bit / 255;
            var GsRGB = G8bit / 255;
            var BsRGB = B8bit / 255;

            var R = (RsRGB <= 0.03928) ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
            var G = (GsRGB <= 0.03928) ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
            var B = (BsRGB <= 0.03928) ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

            // For the sRGB colorspace, the relative luminance of a color is defined as:
            var L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

            return L;
        }



        function getContrastRatio(L1, L2) {

            return ((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2);
        };


        function getBgl(bghex) {
            var rgb = hexToRgb(bghex);
            var l = relativeLuminanceW3C(rgb.r, rgb.g, rgb.b)

            return l;
        }

        function getAddColor() {
            var color = {
                id: $scope.colors.length,
                hex: $scope.newColor,
                header: {},
                subHeader: {},
                paragraph: {},
                bg: {}
            }
            $scope.colors.push(color);
            var colors_str = JSON.stringify($scope.colors);

            $cookies.put('colors', colors_str);

            $('.add__color__input').val('#ffffff');
            $('.palette__actions i').attr('style', 'color:#000000');
        }


        function getDeleteColor(key) {
            for (var i = 0; i < $scope.colors.length; i++) {
                if ($scope.colors[i].id == key) {
                    $scope.colors.splice(i, 1);
                }

                var colors_str = JSON.stringify($scope.colors);
                $cookies.put('colors', colors_str);

                //            return false;
            }
        }



        function getColorSelected(color, index) {
            
            $scope.util.currColorSelected = index;
            if (!$scope.colors[$scope.util.cardClicked]) {
                $scope.colors[$scope.util.cardClicked] = 0;
            }


            var types_array = ['bg', 'header', 'subHeader', 'paragraph'];

            var cur_selection = $scope.colors[$scope.util.cardClicked][$scope.util.currHeader];
            
            for (var i = 0; i < types_array.length; i++) {
              var x = types_array[i];
              console.log('ssdsdsdssxxxxx', x);
              var cur_selection_ = $scope.colors[$scope.util.cardClicked][types_array[i]];
              console.log('sdsdsdsd', cur_selection_);
              
            }

            cur_selection.hex = $scope.colors[index].hex;
            cur_selection.rgbl = hexToRgb(cur_selection.hex);
            cur_selection.rgbl.l = relativeLuminanceW3C(
                cur_selection.rgbl.r,
                cur_selection.rgbl.g,
                cur_selection.rgbl.b
            )

            

            var cur_color = $scope.colors[$scope.util.cardClicked];
            if (!cur_color.bg.hex) {
                cur_color.bg.hex = 'ffffff';
            }

            

            cur_color.bgl = hexToRgb(cur_color.hex);
            
            cur_color.bgl.l = relativeLuminanceW3C(
                cur_color.bgl.r,
                cur_color.bgl.g,
                cur_color.bgl.b
            )







            cur_selection.contrastRatio = getContrastRatio($scope.colors[$scope.util.cardClicked].bg.rgbl.l, cur_selection.rgbl.l);
            
            var contrast_value = cur_selection.contrastRatio;


            if (contrast_value < 3) {
                cur_selection.smallText = 0;
                cur_selection.largeText = 0;
            } else if (contrast_value < 4.5) {
                cur_selection.smallText = 0;
                cur_selection.largeText = 1;
            } else if (contrast_value >= 4.5) {
                cur_selection.smallText = 1;
                cur_selection.largeText = 1;
            }

            //console.log($scope.colors);
        }


        // function getFontSelected(){
        //   if($scope.util.currHeader == 'bg'){
        //       return false;
        //     }
        //     if($scope.util.currHeader != 'bg'){
        //       $scope.colors[$scope.util.cardClicked][$scope.util.currHeader].font = font;  
        //     }
        //     $scope.$apply()
        // }


        function handlers() {
            $('aside li').on('click', function() {
                $('aside li').removeClass('active');
                $(this).addClass('active');
            });

            $('#font').fontselect().change(function() {
                var font = $(this).val().replace(/\+/g, ' ');
                font = font.split(':');
                $scope.util.fontSelected(font[0]);
            });

            $('.palette__pairings').on('click', '.card', function() {
                $('.palette__pairings .card').removeClass('active');
                $(this).addClass('active');
            })


            
        }




        $scope.$watchCollection('colors', function(newValues, oldValues) {
            
            $scope.util.updateColorInfo;
            $scope.util.updateUI;
        });

        $scope.$watch('colors', function() {
          //alert($scope.util.currColorSelected);
            
            
            var setRgbl = hexToRgb($scope.colors[$scope.util.currColorSelected].hex);
            setRgbl.l = getBgl($scope.colors[$scope.util.currColorSelected].hex);              
            $scope.colors[$scope.util.currColorSelected].bgl = setRgbl;
            
            $scope.colors[$scope.util.cardClicked][$scope.util.currHeader].hex =  $scope.colors[$scope.util.currColorSelected].hex;
            var hex = $scope.colors[$scope.util.cardClicked][$scope.util.currHeader].hex;
            var index = $scope.util.currColorSelected;

            getColorSelected(hex, index);


        }, true);



        for (var i = 0; i < $scope.colors.length; i++) {
          var setRgbl = hexToRgb($scope.colors[i].hex);
              setRgbl.l = getBgl($scope.colors[i].hex);
              $scope.colors[i].bgl = setRgbl;          
        }

        $scope.util.checkCookie;

    });




// $scope.styles = [];
// $scope.bgStyles = [];
// $scope.nestedStyles = [];
// $scope.colorInfo = [];
// $scope.colorsMaster = [];
// $scope.currentColor = 0;
// $scope.isOpen = true;
// $scope.sortableOptions = {
//   handle: '.myHandle'
// };



// $scope.showLegend = function(){      
//   $('.legend').addClass('active');
// }


// $scope.hideLegend = function(){
//   $('.legend').removeClass('active');
// }