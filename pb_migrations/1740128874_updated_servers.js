/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3738798621")

  // update collection data
  unmarshal({
    "listRule": "@collection.servers.owner.id:lower = @request.auth.id:lower"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3738798621")

  // update collection data
  unmarshal({
    "listRule": "owner.servers_via_owner.owner = @request.auth.name:lower"
  }, collection)

  return app.save(collection)
})
