#!/bin/bash
# polybar executor
# created by : cosmo

# kill previous instances
killall -q polybar

# launch
echo "---" | tee -a /tmp/polybar1.log /tmp/polybar2.log
polybar --config=$HOME/.config/polybar/config.ini main 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini tv 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini left 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini right 2>&1 | tee -a /tmp/polybar1.log & disown
