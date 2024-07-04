#!/bin/bash
# arch installer
# created by : bluecosmo

# install black arch mirrors
curl -O https://blackarch.org/strap.sh
chmod +x strap.sh
sudo ./strap.sh
rm -rf strap.sh

# system updates
sudo pacman -Syu

# install packages
sudo pacman -S neovim kitty firefox tmux p7zip git python3 python-pip python-pipx python-pwntools python-netifaces net-tools lua zoxide i3-wm i3blocks i3lock polybar flatpak xorg-xrandr arandr stow rofi fzf

# yay
git clone https://aur.archlinux.org/yay-bin.git
cd yay-bin
makepkg -si

# clone dotfiles
git clone https://github.com/PrettyBoyCosmo/dotfiles
mv dotfiles .dotfiles
cd .dotfiles
stow . --adopt

# xonsh
# TODO: test this
TARGET_DIR=$HOME/.local/xonsh-env PYTHON_VER=3.11 XONSH_VER='xonsh[full]>=0.17.0' \
 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/anki-code/xonsh-install/main/mamba-install-xonsh.sh)"
xonsh -c "xpip install -U 'xonsh[full]'"
xonsh -c "xpip install xontrib-vox pwn netifaces"

# styling
wget https://github.com/ful1e5/Google_Cursor/releases/download/v2.0.0/GoogleDot-White.tar.gz



