#!/bin/bash
# install arch depencdencies
# created by : cosmo

# variables
$username = "bluecosmo"

# black arch mirrors
curl -O https://blackarch.org/strap.sh
chmod +x strap.sh
sudo ./strap.sh
rm -rf strap.sh
sudo pacman -Syu

# brightness with "brillo"
cd /home/$username/.config/i3/scripts/brillo
make
sudo make install
sudo setfacl -m u:$username:rx /bin/brillo
sudo chown $username /sys/class/backlight/intel_backlight/brightness

# packages
sudo pacman -S xclip discord flatpak caja flameshot python3 python-pip git feh arandr acpi breeze nodejs npm yarn lxappearance materia-gtk-theme xonsh eom net-tools nim mesa 

# flatpaks
flatpak install flathub md.obsidian.Obsidian com.obsproject.Studio com.brave.Browser com.spotify.Client org.kde.kdenlive org.gimp.GIMP im.riot.Riot

# add flatpaks to dmenu
sudo ln -s /var/lib/flatpak/exports/bin/com.brave.Browser /usr/bin/brave
sudo ln -s /var/lib/flatpak/exports/bin/md.obsidian.Obsidian /usr/bin/obsidian
sudo ln -s /var/lib/flatpak/exports/bin/com.obsproject.Studio /usr/bin/obs
sudo ln -s /var/lib/flatpak/exports/bin/com.spotify.Client /usr/bin/spotify
sudo ln -s /var/lib/flatpak/exports/bin/org.kde.kdenlive /usr/bin/kdenlive
sudo ln -s /var/lib/flatpak/exports/bin/org.gimp.GIMP /usr/bin/gimp
sudo ln -s /var/lib/flatpak/exports/bin/im.riot.Riot /usr/bin/element

# virtual machines with "qemu" and "virtual machine manger"
sudo pacman -Syy
sudo pacman -S archlinux-keyring qemu virt-manager virt-viewer dnsmasq vde2 bridge-utils openbsd-netcat ebtables iptables libguestfs

sudo systemctl enable libvirtd.service
sudo systemctl start libvirtd.service

# check proper install in : /etc/libvirt/libvirtd.conf
# line 85 : unix_sock_group = "libvirt"
# line 108 : unix_sock_rw_perms = "0770"

sudo usermod -a -G libvirt $(whoami)
newgrp libvirt

# nested virtualization

### Intel Processor ###
sudo modprobe -r kvm_intel
sudo modprobe kvm_intel nested=1
echo "options kvm-intel nested=1" | sudo tee /etc/modprobe.d/kvm-intel.conf
systool -m kvm_intel -v | grep nested

### AMD Processor ###
#sudo modprobe -r kvm_amd
#sudo modprobe kvm_amd nested=1
#echo "options kvm-amd nested=1" | sudo tee /etc/modprobe.d/kvm-amd.conf
#systool -m kvm_amd -v | grep nested

# add virtual macine manager to dmenu
sudo ln -s /usr/bin/virt-manager /usr/bin/virtual-machine-manager

# neovim
sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
pip3 install jedi
