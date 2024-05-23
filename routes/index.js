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

/* Notion Content Display */
async function parse_sample_content() {
  const response = await client.blocks.children.list({
    block_id: pageId,
    page_size: 50,
  });

  let textBlocksInPage = [];
  for (let block of response.results) {
    // console.log(block);
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
  console.log("1:");
  console.log(textBlocksInPage);
  return textBlocksInPage;
}

// Example usage
async function get_sample_content() {
  let content = await parse_sample_content();
  console.log("2:");
  console.log(content);  // This will display the fetched content in the console
  return content;
}

router.get('/notion_display', async function(req, res) {
  if (req.session.authenticated != true){
    res.redirect('/')
  }
  /* 1. Generate sample content */
  var sample_content = await get_sample_content();
  console.log("3:");
  console.log(sample_content);
  /* Render the page */
  // res.render("notion_display.ejs");
  res.render("notion_display.ejs", {content: sample_content});
});


module.exports = router;
