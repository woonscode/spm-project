#!/bin/bash

set -e

# Install all needed packages for webapp into the EC2 instances
apt update
apt install -y unzip at