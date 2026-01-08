## Description

API written with nestjs.

## Installation

```bash
npm ci
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run with docker (prefered)

### Build

`docker compose build --no-cache`

### Run

`docker compose up -d --force-recreate`

## Endpoints

### /api/v1/servers

Method: GET

Description: Get a list of all servers

### /api/v1/servers/create

Method: POST
Description: Create a new server
Body:
```json
{
  "owner": "358154856046788609",
  "description": "blubserver"
}
```

### /api/v1/servers/data


Method: POST

Description: Sending game data from the asa mod to the webserver

Body:

```json
{
  "privateid": "b3db2542-c566-47e8-9579-1b2216c3fb47",
  "map": "TestMapArea",
  "servername": "Your Server Name",
  "serverclock": "Day 1, 12:00:00",
  "tribes": [
    {
      "tribeid": "1498930240",
      "x_pos": "50.290821",
      "y_pos": "51.248001",
      "x_ue4": "2326.530518",
      "y_ue4": "9983.979492",
      "z_ue4": "12.474365",
      "tribename": "TribeA",
      "decayDestructionTime": "345600.0",
      "lastInAllyRangeTime": "153.028500",
      "elapsedTime": "151"
    },
    {
      "tribeid": "1679572956",
      "x_pos": "49.856529",
      "y_pos": "51.260635",
      "x_ue4": "-1147.796631",
      "y_ue4": "10085.039063",
      "z_ue4": "12.47435",
      "tribename": "TribeB",
      "decayDestructionTime": "345600.0",
      "lastInAllyRangeTime": "153.028500",
      "elapsedTime": "151"
    }
  ],
  "dinos": [
    {
      "class": "Turtle_Character_BP_C",
      "x_pos": "7010.852539",
      "y_pos": "7261.916504",
      "x_ue4": "50.876362",
      "y_ue4": "50.907742",
      "z_ue4": "143.149994",
      "id": "380171864180120566",
      "level": "100"
    },
    {
      "class": "Turtle_Character_BP_C",
      "x_pos": "8380.356445",
      "y_pos": "4187.008789",
      "x_ue4": "51.04755",
      "y_ue4": "50.52338",
      "z_ue4": "143.149994",
      "id": "48647941310795262",
      "level": "100"
    },
    {
      "class": "Diplodocus_Character_BP_C",
      "x_pos": "9571.583984",
      "y_pos": "3900.792236",
      "x_ue4": "51.196453",
      "y_ue4": "50.487602",
      "z_ue4": "313.124359",
      "id": "29183907181083841",
      "level": "100"
    }
  ],
  "players": [
    {
      "steamid": "111111111",
      "x_pos": "50.176224",
      "y_pos": "51.147388",
      "x_ue4": "1409.789673",
      "y_ue4": "9179.100586",
      "z_ue4": "108.124367",
      "playername": "Survivor",
      "tribename": "TribeA"
    },
    {
      "steamid": "222222222",
      "x_pos": "50.0",
      "y_pos": "50.0",
      "x_ue4": "0.0",
      "y_ue4": "0.0",
      "z_ue4": "1.0",
      "playername": "Survivor",
      "tribename": "TribeB"
    }
  ]
}
```

### /api/v1/servers/data/<publicId>

Method: GET

Description: Get livemap data from one server

### /api/v1/servers/delete

Method: DELETE
Description: Delete a server config
Body:
```json
{
  "publicId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
}
```


## Mod breaking changes

- data structure from server to web players/dinos/tribes is no longer an object it is now an array on the webserver and will be validated as such. [LINK](#updated-structure)
- see also issue #124

### Updated Structure

```json
{
  "privateid": "b3db2542-c566-47e8-9579-1b2216c3fb47",
  "map": "TestMapArea",
  "servername": "Your Server Name",
  "serverclock": "Day 1, 12:00:00",
  "tribes": [
    {
      "tribeid": "1498930240",
      "x_pos": "50.290821",
      "y_pos": "51.248001",
      "x_ue4": "2326.530518",
      "y_ue4": "9983.979492",
      "z_ue4": "12.474365",
      "tribename": "TribeA",
      "decayDestructionTime": "345600.0",
      "lastInAllyRangeTime": "153.028500",
      "elapsedTime": "151"
    },
    {
      "tribeid": "1679572956",
      "x_pos": "49.856529",
      "y_pos": "51.260635",
      "x_ue4": "-1147.796631",
      "y_ue4": "10085.039063",
      "z_ue4": "12.47435",
      "tribename": "TribeB",
      "decayDestructionTime": "345600.0",
      "lastInAllyRangeTime": "153.028500",
      "elapsedTime": "151"
    }
  ],
  "dinos": [
    {
      "class": "Turtle_Character_BP_C",
      "x_pos": "7010.852539",
      "y_pos": "7261.916504",
      "x_ue4": "50.876362",
      "y_ue4": "50.907742",
      "z_ue4": "143.149994",
      "id": "380171864180120566",
      "level": "100"
    },
    {
      "class": "Turtle_Character_BP_C",
      "x_pos": "8380.356445",
      "y_pos": "4187.008789",
      "x_ue4": "51.04755",
      "y_ue4": "50.52338",
      "z_ue4": "143.149994",
      "id": "48647941310795262",
      "level": "100"
    },
    {
      "class": "Diplodocus_Character_BP_C",
      "x_pos": "9571.583984",
      "y_pos": "3900.792236",
      "x_ue4": "51.196453",
      "y_ue4": "50.487602",
      "z_ue4": "313.124359",
      "id": "29183907181083841",
      "level": "100"
    }
  ],
  "players": [
    {
      "steamid": "111111111",
      "x_pos": "50.176224",
      "y_pos": "51.147388",
      "x_ue4": "1409.789673",
      "y_ue4": "9179.100586",
      "z_ue4": "108.124367",
      "playername": "Survivor",
      "tribename": "TribeA"
    },
    {
      "steamid": "222222222",
      "x_pos": "50.0",
      "y_pos": "50.0",
      "x_ue4": "0.0",
      "y_ue4": "0.0",
      "z_ue4": "1.0",
      "playername": "Survivor",
      "tribename": "TribeB"
    }
  ]
}
```
