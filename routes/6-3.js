var express = require('express');
var router = express.Router();
const sql = require('mssql');
var createError = require('http-errors');


const config = {
  user: 'tataranni.marco',  //Vostro user name
  password: 'xxx123#', //Vostra password
  server: "213.140.22.23\\sqlexpress",  //Stringa di connessione
  database: 'fmClashRoyale', //(Nome del DB)
}

//Function to connect to database and execute query
let executeQuery = function (res, query, next) {
  sql.connect(config, function (err) {
    if (err) { //Display error page
      console.log("Error while connecting database :- " + err);
      res.status(500).json({success: false, message:'Error while connecting database', error:err});
      return;
    }
    var request = new sql.Request(); // create Request object
    request.query(query, function (err, result) { //Display error page
      if (err) {
        console.log("Error while querying database :- " + err);
        res.status(500).json({success: false, message:'Error while querying database', error:err});
        sql.close();
        return;
      }
      res.rander('6-3', result.recordset); //Il vettore con i dati è nel campo recordset (puoi loggare result per verificare)
      sql.close();
    });

  });
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  let sqlQuery = "select * from dbo.[cr-unit-attributes]";
  executeQuery(res, sqlQuery, next);
  res.render()
});

router.get('/search/:name', function (req, res, next) {
  let sqlQuery = `select * from dbo.[cr-unit-attributes] where Unit = '${req.params.name}'`;
  executeQuery(res, sqlQuery, next);
});

router.post('/', function (req, res, next) {
  // Add a new Unit  
  let unit = req.body;
  if (!unit) {  //Qui dovremmo testare tutti i campi della richiesta
    res.status(500).json({success: false, message:'Error while connecting database', error:err});
    return;
  }
  let sqlInsert = `INSERT INTO dbo.[cr-unit-attributes] (Unit,Cost,Hit_Speed) 
                     VALUES ('${unit.Unit}','${unit.Cost}','${unit.Hit_Speed}')`;
  executeQuery(res, sqlInsert, next);
  res.send({success:true, message: "unità inserita con successo", unit: unit})
});

module.exports = router;