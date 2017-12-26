const router = require('express').Router();
const url = require('./url');


router.get('/:hash', async (req, res, next) => {

  const source = await url.getUrl(req.params.hash);

  if(!source){
    let notFound = new Error('Not Found');
    notFound.status = 404
    return next(notFound);
  }

  // TODO: Hide fields that shouldn't be public


  // Behave based on the requested format using the 'Accept' header.
  // If header is not provided or is */* redirect instead.
  const accepts = req.get('Accept');

  switch (accepts) {
    case 'text/plain':
      res.end(source.url);
      break;
    case 'application/json':
      res.json(source);
      break;
    default:
      await url.incrementVisit(source); 
      res.redirect(source.url);
      break;
  }
});


router.post('/', async (req, res, next) => {

  if(!req.body.url){
    let badRequest = new Error('Bad Request');
    badRequest.status = 400
    return next(badRequest);
  }

  try {
    let shortUrl = await url.shorten(req.body.url, url.generateHash());
    res.json(shortUrl);
  } catch (e) {
    // TODO: Personalized Error Messages
    next(e);
  }
});


router.delete('/:hash/remove/:removeToken', async (req, res, next) => {
  const source = await url.getUrl(req.params.hash);

  if(!source  || (source.removeToken !== req.params.removeToken)){
    let notFound = new Error('Not Found');
    notFound.status = 404
    return next(notFound);
  }
  
  let updated = await url.softDelete(source);
  if(!updated.active){
    return res.status(202).end();
  }
  let err = new Error('Failed Operation')
  err.status = 500;
  return next(err);
    
});

module.exports = router;
