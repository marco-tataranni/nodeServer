var express = require('express');
var router = express.Router();
const sql = require('mssql');
var createError = require('http-errors');


const config = {
  user: 'tataranni.marco',  //Vostro user name
  password: 'xxx123#', //Vostra password
  server: "213.140.22.237",  //Stringa di connessione
  database: 'tataranni.marco', //(Nome del DB)
}

//Function to connect to database and execute query
let executeQuery = function (name ,res, query, next) {
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
      res.render(name , {ris: result.recordset}); //Il vettore con i dati è nel campo recordset (puoi loggare result per verificare)
      sql.close();
    });

  });
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  let sqlQuery = "select * from dbo.[cr-unit-attributes]";
  executeQuery('truppe', res, sqlQuery, next);
});

router.get('/search/:name', function (req, res, next) {
  let sqlQuery = `select * from dbo.[cr-unit-attributes] where Unit = '${req.params.name}'`;
  executeQuery('unita',res, sqlQuery, next);
  
});
router.get('/inserisci', function(req, res, next) {
    res.render('inserisci');
});


router.post('/', function (req, res, next) {
  let unit = req.body;
  if (!unit) {
    next(createError(400 , "Please provide a correct unit"));
  }
  sql.connect(config, err => {
    let sqlRequest = new sql.Request();
    let sqlInsert = `INSERT INTO dbo.[cr-unit-attributes] (Unit, Cost, Hit_Speed, Speed, Deploy_Time, Range, Target, Count, Transport, Type, Rarity) VALUES ('${unit.Unit}','${unit.Cost}','${unit.Hit_Speed}','${unit.Speed}', '${unit.Deploy_Time}', '${unit.Range}', '${unit.Target}', '${unit.Count}', '${unit.Transport}', '${unit.Type}', '${unit.Rarity}')`;
    sqlRequest.query(sqlInsert, (error, results) => {
        if (error) throw error;
        sqlRequest.query(`SELECT * FROM [cr-unit-attributes] WHERE Unit = '${unit.Unit}'`, (err, result) => {
            if (err) console.log(err);
            res.render('unita', { ris: result.recordset});
        });
    });
  })
});

module.exports = router;