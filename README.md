# alexa-sampler
## by Computing Dreams


## Changelog

#### 0.0.1 - Initial version


## Project Description


> An Alexa skill that provides a sampler of potential behaviors.

* Multiple Greetings
* User Personalization
* API integration
* Multi-use vs Single-use sessions
* Confirmation example



> Configuration Notes

Personaliztion requires a DynamoDB which you can create from the command line using the data/createUserTable.sh.

If you wish you use a different name for this DB just modify the name in data/createUserTable.sh and in index.js.


Once the DB is created and you've created your role for the Skill, you'll need to update the Role with permissions to access the DB.

First, create a custom policy based on AmazonDynamoDBFullAccess, but which is limited to the DB you created above.  It should look something like this.


    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": [
                    "dynamodb:*",
                    "dax:*",
                    "application-autoscaling:DeleteScalingPolicy",
                    "application-autoscaling:DeregisterScalableTarget",
                    "application-autoscaling:DescribeScalableTargets",
                    "application-autoscaling:DescribeScalingActivities",
                    "application-autoscaling:DescribeScalingPolicies",
                    "application-autoscaling:PutScalingPolicy",
                    "application-autoscaling:RegisterScalableTarget",
                    "cloudwatch:DeleteAlarms",
                    "cloudwatch:DescribeAlarmHistory",
                    "cloudwatch:DescribeAlarms",
                    "cloudwatch:DescribeAlarmsForMetric",
                    "cloudwatch:GetMetricStatistics",
                    "cloudwatch:ListMetrics",
                    "cloudwatch:PutMetricAlarm",
                    "datapipeline:ActivatePipeline",
                    "datapipeline:CreatePipeline",
                    "datapipeline:DeletePipeline",
                    "datapipeline:DescribeObjects",
                    "datapipeline:DescribePipelines",
                    "datapipeline:GetPipelineDefinition",
                    "datapipeline:ListPipelines",
                    "datapipeline:PutPipelineDefinition",
                    "datapipeline:QueryObjects",
                    "ec2:DescribeVpcs",
                    "ec2:DescribeSubnets",
                    "ec2:DescribeSecurityGroups",
                    "iam:GetRole",
                    "iam:ListRoles",
                    "sns:CreateTopic",
                    "sns:DeleteTopic",
                    "sns:ListSubscriptions",
                    "sns:ListSubscriptionsByTopic",
                    "sns:ListTopics",
                    "sns:Subscribe",
                    "sns:Unsubscribe",
                    "sns:SetTopicAttributes",
                    "lambda:CreateFunction",
                    "lambda:ListFunctions",
                    "lambda:ListEventSourceMappings",
                    "lambda:CreateEventSourceMapping",
                    "lambda:DeleteEventSourceMapping",
                    "lambda:GetFunctionConfiguration",
                    "lambda:DeleteFunction"
                ],
                "Effect": "Allow",
                "Resource": "arn:aws:dynamodb:<region>:<id>:table/UserInfo-AlexaSampler"
            },
            {
                "Action": [
                    "iam:PassRole"
                ],
                "Effect": "Allow",
                "Resource": "*",
                "Condition": {
                    "StringLike": {
                        "iam:PassedToService": "application-autoscaling.amazonaws.com"
                    }
                }
            }
        ]
    }


Once the policy is created, attach it to the role used by your skill so that it can read and write the user's prefrences to your table.


## Copyright/License

Copyright 2017 [S & G Consulting](http://computingdreams.com/)

This project's Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this project, You can obtain one at https://mozilla.org/MPL/2.0/.

