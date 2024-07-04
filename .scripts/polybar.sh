#!/bin/bash
# polybar executor
# created by : cosmo

# kill previous instances
killall -q polybar

# launch
echo "---" | tee -a /tmp/polybar1.log /tmp/polybar2.log
polybar --config=$HOME/.config/polybar/config.ini eDP-1 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini DP-1 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini DP-2 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini DP-3 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini DP-4 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini DP-1-1 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini DP-1-2 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini DP-1-3 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini DP-1-4 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini DP-1-5 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini DP-1-6 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini HDMI-1 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini HDMI-2 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini HDMI-3 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini HDMI-4 2>&1 | tee -a /tmp/polybar1.log & disown
polybar --config=$HOME/.config/polybar/config.ini Virtual-1 2>&1 | tee -a /tmp/polybar1.log & disown
