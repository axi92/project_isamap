/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3738798621")

  // update collection data
  unmarshal({
    "updateRule": "@request.body.privateid:isset = true"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3738798621")

  // update collection data
  unmarshal({
    "updateRule": "@request.body.data.privateid:isset = true"
  }, collection)

  return app.save(collection)
})
