
import express from 'express';

import {renderToString as renderToStringWidget} from 'component/widget';

const app = express();

app.set('view engine', 'pug');

app.set('views', 'app/views');


app.use(express.static('public'));

app.get('/:name', function (req, res) {
  const meData = {name: req.params.name || 'Alexander', age: 35};

  res.render('layout', {
    widgetSsrText: renderToStringWidget(meData),
    meData
  });
});

app.listen(3000, function () {
  console.log('http://localhost:3000/');
});