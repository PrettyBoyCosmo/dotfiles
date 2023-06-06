#!/bin/bash
# polybar executor
# created by : cosmo

# kill previous instances
killall -q polybar

# launch
echo "---" | tee -a /tmp/polybar1.log /tmp/polybar2.log
polybar main 2>&1 | tee -a /tmp/polybar1.log & disown
polybar left 2>&1 | tee -a /tmp/polybar1.log & disown
polybar right 2>&1 | tee -a /tmp/polybar1.log & disown
