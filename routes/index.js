var express = require('express');
var router = express.Router();
// #####I ADD#####
const { Client }= require("@notionhq/client")
// #####END ADD#####
/* GET home page. Sample by Default
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

/* GET home page. */
router.get('/', function(req, res) {
  res.render("index.ejs");
});

/* Notion Authentication */
router.post('/notion_authentication', function(req, res) {
  /* 1.  Initialise a client */
  const client = new Client({ auth: process.env.notion_token });
  (async () => {
    const response = await client.pages.retrieve({ page_id: process.env.notion_page_id });
    // print out the response
    console.log(response);
    req.session.authentication = "pass";
    res.redirect('/notion_display')
  })();
});

module.exports = router;
