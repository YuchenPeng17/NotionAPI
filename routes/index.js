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

/* 1. Notion Authentication */
router.post('/notion_authentication', function(req, res) {
  /* 1.  Initialise a client */
  global.client = new Client({ auth: process.env.notion_token });
  global.pageId = process.env.notion_page_id;
  (async () => {
    const response = await client.pages.retrieve({ page_id: pageId });
    // print out the response: console.log(response);
    if (response){
      req.session.authenticated = true;
    }
    res.redirect('/notion_display')
  })();
});

/* 2.1 Notion Content Display Sample */
async function get_sample_content() {
  const response = await client.blocks.children.list({
    block_id: pageId,
    page_size: 50,
  });

  let textBlocksInPage = [];
  for (let block of response.results) {
    // Get the plain text and append to the result
    let blockType = block.type;
    let richText = block[blockType].rich_text;
    let text = "";
    if (richText[0]){
      text = richText[0].plain_text;
    }
    textBlocksInPage.push(text);
  }
  textBlocksInPage = textBlocksInPage.join(' ');
  return textBlocksInPage;
}

/* 2. Notion Get Block Content Sample */
router.get('/notion_display', async function(req, res) {
  if (req.session.authenticated != true){
    res.redirect('/')
  }
  /* 1. Generate sample content */
  var sample_content = await get_sample_content();
  
  /* Render the page */
  res.render("notion_display.ejs", {content: sample_content});
});


module.exports = router;
