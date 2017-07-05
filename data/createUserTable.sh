#! /usr/bin/bash

# Copyright 2017 S & G Consulting - http://computingdreams.com/
# This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
#
# Version : 0.0.1

echo ""
aws dynamodb create-table --table-name UserInfo-AlexaSampler --attribute-definitions AttributeName=userId,AttributeType=S --key-schema AttributeName=userId,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
echo ""
