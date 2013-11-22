﻿var equipmentproducts_SYNC_URL = "content/equipmentproducts.json";

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
    sharePointSync: function (callback) {

        //TODO: replace with sharepoint connection
        $.getJSON(equipmentproducts_SYNC_URL, function (data) {

            $.each(data, function (index, value) {
                var equipmentproductsItem;

                equipmentproductsItem = new EquipmentProducts(value);
                persistence.add(equipmentproductsItem);
            });

            persistence.flush(
                function () {
                    //DB is updated - trigger custom event
                    if (typeof callback === "function") {
                        callback();
                    }

                    $('body').trigger('equipmentproducts-sync-ready');
                }
            );
        }).fail(
            function () {
                //TODO: error handling if necessary
                alert("MPL Equipmentproducts: Mock data read error.");

                if (typeof callback === "function") {
                    callback();
                }
            }
        );
    }
}