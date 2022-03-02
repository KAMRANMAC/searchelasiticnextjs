// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: process.env.ES_NODE, ssl: {
    rejectUnauthorized: false
  }, maxRetries: 5,
  requestTimeout: 60000, auth: {
    username: process.env.ES_USER,
    password: process.env.ES_PASS
  }
})

export default async function searchES(req, res) {
  try {



    const result = await client.search({
      index: 'courses',
      body: {
        query: {
          
          "bool": {
            "must": [
              {
                "multi_match": {
                  "fields": [
                    "title"
                  ],
                  "operator": "OR",
                  "query": req.query.value,
                  "boost": 10
                }
              },
              {
                "multi_match": {
                  "fields": [
                    "description"
                  ],
                  "operator": "OR",
                  "query": req.query.value,
                  "boost": 5
                }
              },
              {
                "multi_match": {
                  "fields": [
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "h5",
                    "h6"
                  ],
                  "operator": "OR",
                  "query": req.query.value,
                }
              }
            ],
            "should": [
              {
                "multi_match": {
                  "fields": [
                    "title^10",
                    "description"
                  ],
                  "operator": "AND",
                  "query": req.query.value,
                  "boost": 20
                }
              },
              {
                "multi_match": {
                  "fields": [
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "h5",
                    "h6"
                  ],
                  "query": req.query.value,
                  "operator": "AND",
                  "boost": 5
                }
              }
            ]
          }
        },
        "highlight": {
          "fields": {
            // "body" : { "pre_tags" : ["<em>"], "post_tags" : ["</em>"] },
            "title": {},
            "description": {}
          }
        }
      }
    })
    console.log('request : result ', result);

    res.status(200).send(result)
  } catch (error) {
    res.status(400).send(error)
  }
}

