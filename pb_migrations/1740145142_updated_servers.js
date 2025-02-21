/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3738798621")

  // update collection data
  unmarshal({
    "updateRule": "id = @collection.servers.id && \nprivateid = @request.body.privateid"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3738798621")

  // update collection data
  unmarshal({
    "updateRule": "id = @collection.servers.id && \n@collection.servers.privateid = @request.body.privateid"
  }, collection)

  return app.save(collection)
})
