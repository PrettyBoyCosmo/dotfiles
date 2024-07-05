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
sudo pacman -S xonsh python-pygments python-prompt_toolkit python-setproctitle python-netifaces python-pwntools neovim kitty firefox tmux p7zip git python3 python-pip python-pipx python-pwntools python-netifaces net-tools lua zoxide i3-wm i3blocks i3lock polybar flatpak xorg-xrandr arandr stow fzf flameshot feh lxappearance mate-media mingw-w64-gcc htop wireshark-cli nmap hashcat hydra gobuster dirb btop ffmpeg jdk21-openjdk proxychains-ng hexedit docker docker-compose stow fzf ripgrep exa gcc-multilib gdb gcc nasm xclip ranger rofi spice-vdagent noto-fonts-emoji --noconfirm
# removed packages (arch) : brightnessctl playerctl 

# yay
git clone https://aur.archlinux.org/yay-bin.git
cd yay-bin
makepkg -si
cd $HOME
yay -S picom-git ttf-font-awesome-5
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

rm -rf arch-install.sh strap.sh yay-bin

# styling
# wget https://github.com/ful1e5/Google_Cursor/releases/download/v2.0.0/GoogleDot-White.tar.gz

# brightness with "brillo"
# cd /home/$username/.config/i3/scripts/brillo
# make
# sudo make install
# sudo setfacl -m u:$username:rx /bin/brillo
# sudo chown $username /sys/class/backlight/intel_backlight/brightness

# virtual machines with "qemu" and "virtual machine manger"
# sudo pacman -Syy
# sudo pacman -S archlinux-keyring qemu virt-manager virt-viewer dnsmasq vde2 bridge-utils openbsd-netcat ebtables iptables libguestfs

# sudo systemctl enable libvirtd.service
# sudo systemctl start libvirtd.service

# check proper install in : /etc/libvirt/libvirtd.conf
# line 85 : unix_sock_group = "libvirt"
# line 108 : unix_sock_rw_perms = "0770"

# sudo usermod -a -G libvirt $(whoami)
# newgrp libvirt

# nested virtualization

### Intel Processor ###
# sudo modprobe -r kvm_intel
# sudo modprobe kvm_intel nested=1
# echo "options kvm-intel nested=1" | sudo tee /etc/modprobe.d/kvm-intel.conf
# systool -m kvm_intel -v | grep nested

### AMD Processor ###
#sudo modprobe -r kvm_amd
#sudo modprobe kvm_amd nested=1
#echo "options kvm-amd nested=1" | sudo tee /etc/modprobe.d/kvm-amd.conf
#systool -m kvm_amd -v | grep nested

# add virtual macine manager to dmenu
# sudo ln -s /usr/bin/virt-manager /usr/bin/virtual-machine-manager

# neovim
# sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
# pip3 install jedi

