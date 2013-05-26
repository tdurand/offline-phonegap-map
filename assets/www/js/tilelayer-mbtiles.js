// inspired by: https://github.com/coomsie/topomap.co.nz/blob/master/Resources/leaflet/TileLayer.DB.js
L.TileLayer.MBTiles = L.TileLayer.extend({
    //db: SQLitePlugin
    mbTilesDB: null,

    initialize: function(url, options, db) {
        console.log("I pass here");
        this.mbTilesDB = db;

        L.Util.setOptions(this, options);
    },
    getTileUrl: function (tilePoint) {

        var z = 12;
        // var x = tilePoint.x;
        // var y = tilePoint.y;
        var x = 775;
        var y = 2554;

        var base64Prefix = 'data:image/gif;base64,';

        console.log("OFFLINEMAP  WHERE zoom_level = "+z+" AND tile_column = "+x+" AND tile_row = "+y);

        this.mbTilesDB.transaction(function(tx) {

            tx.executeSql("SELECT tile_data FROM images INNER JOIN map ON images.tile_id = map.tile_id WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?", [z, x, y], function (tx,res) {
                if(res.rows.length>0) {
                    console.log("response" +res.rows.item(0).tile_data);
                    var src = base64Prefix + res.rows.item(0).tile_data;
                    return src;
                }
                else {
                    console.log("response : no data");
                }

            }, function (er) {
                        console.log('error with executeSql', er);
                    });
        });

    },
    _loadTile: function (tile, tilePoint, zoom) {
        tile._layer = this;
        tile.onload = this._tileOnLoad;
        tile.onerror = this._tileOnError;
        this.getTileUrl(tilePoint, zoom, tile);
    }
});