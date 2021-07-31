(
    function () {
        'use strict';
        angular.module('NarrowItDownApp', [])
            .controller('NarrowItDownController', NarrowItDownController)
            .service('MenuSearchService', MenuSearchService)
            .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
            .directive('foundItems', Items);
        
        function Items() {
            var ddo = {
                templateUrl: 'foundItems.html',
                Restrict: "E",
                scope: {
                    items: '<',
                    onRemove: '&',
                    isValid: '<'
                }
            };
            return ddo;
        }

        NarrowItDownController.$inject = ['MenuSearchService', '$http', 'ApiBasePath']
        function NarrowItDownController(MenuSearchService, $http, ApiBasePath) {
            function searchIsEmpty(search) {
                return search.replace(/\s/g, "").length === 0;
            };
            var menuSearch = this;
            menuSearch.searchTerm = "";
            menuSearch.found = [];
            menuSearch.valid = true;
            menuSearch.search = () => {
                if (searchIsEmpty(menuSearch.searchTerm)) {
                    menuSearch.found = [];
                    menuSearch.valid = false;
                    console.log(menuSearch.valid);
                    return;
                } else {
                    var searchForItems = MenuSearchService.getMatchedMenuItems(menuSearch.searchTerm);
                    searchForItems
                        .then((result) => {
                            menuSearch.found = result;
                            menuSearch.valid = (result.length) > 0;
                            
                        })
                        .catch((error) => {
                            console.log("Got error at MenuSearchService.getMatchedMenuItems in NarrowItDownController");
                        });
                }
            };
                menuSearch.removeItem = (index) => {
                    menuSearch.found.splice(index, 1);
                };
        }
        MenuSearchService.$inject = ['$http', 'ApiBasePath']
        function MenuSearchService($http, ApiBasePath) {
            var service = this;
            service.getMatchedMenuItems = function (st) {
                return $http({
                    method: "GET",
                    url: (ApiBasePath + "/menu_items.json")
                })
                    .then(function (response) {
                        var AllMenuItems = response.data.menu_items;
                        return AllMenuItems.filter((item) => {
                            return item.name.toLowerCase().includes(st.toLowerCase());
                        });
                    })
                    .catch(error => {
                        console.log("Got error in http response in service method"+error);
                    });
            };
        }
    }
)()
