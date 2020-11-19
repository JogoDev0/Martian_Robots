var express = require('express');
var router = express.Router();
const main = require('../index');

let outputData = '';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Martian Robots' });
});

router.post('/', (req, res) => {
  const inputData = req.body.inputData;
  outputData = main('WEB', inputData);
  res.redirect('/result');
});

router.get('/result', function (req, res, next) {
  res.render('result', { title: 'Martian Robots', result: outputData });
});

module.exports = router;
