﻿var EQUIPMENTPRODUCTS_LIST = "ProduktbezeichnungEquipment";

//DB model
//EquipmentProducts
var EquipmentProducts = persistence.define('EquipmentProducts', {
    equipmentId: "INT",
    productDescription: "TEXT",
    pieceNumber: "TEXT",
    price: "TEXT",
    cooling: "TEXT",
    variant: "TEXT",
    volume: "TEXT",
    pressure: "TEXT",
    performance: "TEXT",
    productFK: "INT"
});

EquipmentProducts.index(['equipmentId', 'piecenumber'], { unique: true });

//create mock data for equipment products
var equipmentproductsModel = {
    sharePointEquipmentproducts: function () {

        $('body').trigger('sync-start');
        $('#msgEquipmentProducts').toggleClass('in');

        SharePoint.sharePointRequest(EQUIPMENTPRODUCTS_LIST, equipmentproductsModel.mapSharePointData);
    },
    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        //data.d comes from sharepoint
        var spData = data.d;
        EquipmentProducts.all().destroyAll(function (ele) {
            utils.emptySearchIndex("EquipmentProducts");

            if (spData && spData.results.length) {
                $.each(spData.results, function (index, value) {

                    var equipmentproductsItem = {
                        equipmentId: value.ID,
                        productDescription: (value.ProduktbezeichnungEquipment) ? value.ProduktbezeichnungEquipment : "",
                        pieceNumber: (value.Teilenummer) ? value.Teilenummer : "",
                        price: (value.Listenpreis) ? value.Listenpreis : "",
                        cooling: (value.Kühlung) ? value.Kühlung : "",
                        variant: (value.AusstattungsvarianteValue) ? value.AusstattungsvarianteValue : "",
                        volume: (value.FADInMMinMaxDruck) ? value.FADInMMinMaxDruck : "",
                        pressure: (value.MaxDruckInBar) ? value.MaxDruckInBar : "",
                        performance: (value.MotorleistungInKW) ? value.MotorleistungInKW : "",
                        productFK: (value.ProduktId) ? value.ProduktId : ""
                    };


                    persistence.add(new EquipmentProducts(equipmentproductsItem));
                });

                persistence.flush(
                    function () {
                        SyncModel.addSync(EQUIPMENTPRODUCTS_LIST);
                        $('body').trigger('sync-end');
                        $('body').trigger('equipmentproducts-sync-ready');
                        $('#msgEquipmentProducts').removeClass('in');

                    }
                );
            }
        });
    },


    searchEquipmentproduct: function (key) {
        var equipmentproductSearch = $.Deferred();
   
        key = "%" + key.replace("*", "") + "%";
        key = key.replace(/ /g, '%'); //replace changes only first instance . thats why the global modifier "g" of a regular expression was used. find all whitepaces and change to %

        EquipmentProducts.all().filter("productDescription", "LIKE", key).or(new persistence.PropertyFilter("pieceNumber", "LIKE", key)).order('productDescription', true, false).list(function (res) {
            equipmentproductSearch.resolve(res);
        });

        return equipmentproductSearch.promise();
    }
};
