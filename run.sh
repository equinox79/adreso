#!/bin/sh

start_server --port 5000 -- \
starman \
-p 5000 \
--workers 4 \
--error-log ~/var/log/adreso-error.log \
--access-log ~/var/log/adreso-access.log \
app.psgi &

