#!/bin/bash
echo "Checking library versions..."
ldconfig -p | grep libz
ldconfig -p | grep libpng
