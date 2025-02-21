/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3738798621")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_rWXEgNxDGV` ON `servers` (\n  `id`,\n  `privateid`\n)"
    ]
  }, collection)

  // remove field
  collection.fields.removeById("text2625846583")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3738798621")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_rWXEgNxDGV` ON `servers` (\n  `publicid`,\n  `privateid`\n)"
    ]
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}",
    "hidden": false,
    "id": "text2625846583",
    "max": 36,
    "min": 36,
    "name": "publicid",
    "pattern": "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
