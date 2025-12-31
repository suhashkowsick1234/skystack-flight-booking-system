#!/bin/bash

for port in {8081..8085}; do
    $env:PORT=${port}; npm run dev &
done