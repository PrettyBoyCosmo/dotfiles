#!/bin/bash
# arch installer
# created by : bluecosmo

# archinstall

# install black arch mirrors
cd $HOME
curl -O https://blackarch.org/strap.sh
chmod +x strap.sh
sudo ./strap.sh

# system updates
sudo pacman -Syu --noconfirm

# install packages
sudo pacman -S xonsh python-pygments python-prompt_toolkit python-setproctitle python-netifaces python-pwntools neovim kitty firefox tmux p7zip git python3 python-pip python-pipx python-pwntools python-netifaces net-tools lua zoxide i3-wm i3blocks i3lock polybar flatpak xorg-xrandr arandr stow fzf flameshot feh lxappearance mate-media mingw-w64-gcc htop wireshark-cli nmap hashcat hydra gobuster btop ffmpeg jdk21-openjdk proxychains-ng hexedit docker docker-compose stow fzf ripgrep exa gcc-multilib gdb gcc nasm xclip ranger rofi spice-vdagent noto-fonts-emoji --noconfirm
# removed packages (arch) : brightnessctl playerctl 

# yay
git clone https://aur.archlinux.org/yay-bin.git
cd yay-bin
makepkg -si
cd $HOME
yay -S picom-git ttf-font-awesome-5 --noconfirm
# removed packages (aur) : nerd-fonts-git

# xonsh
# TODO: test this
pipx install xonsh[full] xontrib-vox --include-deps --force
pipx inject xonsh xontrib-vox
yay -S xontrib-vox-git --noconfirm

# clone dotfiles
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
git clone https://github.com/PrettyBoyCosmo/dotfiles
mv dotfiles .dotfiles
cd .dotfiles
stow . --adopt
cd $HOME

# virtual machines with "qemu" and "virtual machine manger"
sudo pacman -Syyu
sudo pacman -S qemu-full virt-manager virt-viewer dnsmasq bridge-utils libguestfs ebtables vde2 openbsd-netcat
sudo systemctl start libvirtd.service
sudo systemctl enable libvirtd.service
sudo systemctl status libvirtd.service
# unix_sock_group = "libvirt"
# unix_sock_rw_perms = "0770"
sudo vim /etc/libvirt/libvirtd.conf
sudo usermod -aG libvirt $USER
systemctl restart libvirtd.service

# clean up
rm -rf arch-install.sh strap.sh yay-bin
