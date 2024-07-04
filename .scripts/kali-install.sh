#!/bin/bash
# kali linux installer
# created by : bluecosmo

# system updates
sudo apt-get update -y
sudo apt-get update --fix-missing -y
sudo apt upgrade -y
sudo apt autoremove -y
 
# packages
sudo apt-get install i3 xonsh git feh lxappearance i3blocks gcc-mingw-w64-x86-64 htop gobuster ffmpeg openjdk-17-jdk hexedit docker.io docker-compose stow fzf ripgrep tmux zoxide kitty eza gcc-multilib ranger spice-vdagent arandr rofi compton -y --fix-missing

# qemu tools
sudo systemctl enable spice-vdagentd.service

# hacking
sudo adduser $USER wireshark
sudo chmod +x /usr/bin/dumpcap
wget https://github.com/Giotino/stegsolve/releases/download/v.1.5/StegSolve-1.5-alpha1.jar

# pip
pip3 install pwntools 
xonsh -c "xpip install -U 'xonsh[full]'"
xonsh -c "xpip install xontrib-vox"

# dotfiles
cd $HOME
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
git clone https://github.com/PrettyBoyCosmo/dotfiles
mv dotfiles .dotfiles
cd .dotfiles
stow . --adopt
cd $HOME

rm kali-install.sh
