/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3738798621")

  // update collection data
  unmarshal({
    "updateRule": "@collection.servers.id = @request.body.privateid"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3738798621")

  // update collection data
  unmarshal({
    "updateRule": "privateid:lower = @request.body.privateid:lower"
  }, collection)

  return app.save(collection)
})
