## About

A GATT Client for listening and receiving data from BLE (Bluetooth Low Energy) peripherals (Weights, Thermometers, Blood Pressure Devices), also acts a GATT server for android devices.
[GATT and BLE!](https://learn.adafruit.com/introduction-to-bluetooth-low-energy/gatt)
## System Architecture

![Alt System Diagram](https://wellnessimagesdevelopment.s3.amazonaws.com/wellness-image/system_arch-v1.png)

## Testing Strategy

```sh
For a Feature or Implementation (e.g. "Search") endpoint

1. One "Acceptance tests", where you start the application, make an HTTP request to search for a given product name, and verify that expected products were returned. This verifies that all parts of the application are correctly wired together.

2. Few "Integration tests" where you invoke ProductController API, talk to a real database, and verify that the queries built by the controller work as expected by the database server.

3. Many "Unit tests" where you test Product Controller in isolation and verify that the controller handles all different situations, including error paths and edge cases.
```


## How to Run Migrations Locally

```sh
1. Use npm run knex:make <name_of_migration> --knexfile <path-to-file>
2. Install Knex globally (npm install knex -g), go to server/config then run knex:make <name_of_migration>

```
