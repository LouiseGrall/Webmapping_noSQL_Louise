app.get('/geo-search-results', function(req, res){
 console.log(req.query);

 var latitude = parseFloat(req.query.latitude);
 var longitude = parseFloat(req.query.longitude);
 var radius = parseFloat(req.query.radius);

 var filter = {};
 if (Math.abs(longitude) > 0.00001 &&
     Math.abs(latitude) > 0.00001) {

   filter.geometry = { "$geoWithin": { "$center": [ [ longitude, latitude ] , radius ] } };
 }
 // console.log("filter", filter, [ longitude, latitude ]);

 mydb.collection('equip').find(filter).toArray(function(err, docs) {
   console.log("Found "+docs.length+" records");
   // console.dir(docs);
   res.render('geo-search-results', {
     results: docs
   });
 });
});
