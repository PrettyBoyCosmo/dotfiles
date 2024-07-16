#!/bin/bash
# linux mint installer
# created by : bluecosmo

# i3 mirrors
cd $HOME
/usr/lib/apt/apt-helper download-file https://debian.sur5r.net/i3/pool/main/s/sur5r-keyring/sur5r-keyring_2024.03.04_all.deb keyring.deb SHA256:f9bb4340b5ce0ded29b7e014ee9ce788006e9bbfe31e96c09b2118ab91fca734
sudo apt install ./keyring.deb
echo "deb http://debian.sur5r.net/i3/ $(grep '^DISTRIB_CODENAME=' /etc/lsb-release | cut -f2 -d=) universe" | sudo tee /etc/apt/sources.list.d/sur5r-i3.list

# system updates
sudo apt-get update -y
sudo apt-get update --fix-missing -y
sudo apt upgrade -y
sudo apt autoremove -y

# packages
sudo apt-get install i3-wm polybar flameshot xonsh git feh lxappearance i3blocks mate-media gcc-mingw-w64-x86-64 htop wireshark brightnessctl nmap playerctl hashcat hydra gobuster dirb btop ffmpeg openjdk-17-jdk proxychains4 hexedit docker.io docker-compose stow fzf ripgrep tmux kitty exa gcc-multilib build-essential gdb gdbserver gcc nasm xclip ranger arandr rofi compton neovim spice-vdagent lua5.4 fonts-font-awesome -y --fix-missing

sudo systemctl enable spice-vdagentd.service

# removed packages : go-md2man device-tree-compiler
# theme : org.gtk.Gtk3theme.Adapta-Nokto

# flatpaks (built into mint)
flatpak install flathub md.obsidian.Obsidian com.brave.Browser com.obsproject.Studio org.kde.kdenlive com.discordapp.Discord org.gimp.GIMP im.riot.Riot com.obsproject.Studio.Plugin.waveform org.torproject.torbrowser-launcher net.werwolv.ImHex

# add flatpaks to dmenu
sudo ln -s /var/lib/flatpak/exports/bin/com.brave.Browser /usr/bin/brave
sudo ln -s /var/lib/flatpak/exports/bin/com.discordapp.Discord /usr/bin/discord
sudo ln -s /var/lib/flatpak/exports/bin/md.obsidian.Obsidian /usr/bin/obsidian
sudo ln -s /var/lib/flatpak/exports/bin/com.obsproject.Studio /usr/bin/obs
sudo ln -s /var/lib/flatpak/exports/bin/org.kde.kdenlive /usr/bin/kdenlive
sudo ln -s /var/lib/flatpak/exports/bin/org.gimp.GIMP /usr/bin/gimp
sudo ln -s /var/lib/flatpak/exports/bin/im.riot.Riot /usr/bin/element
sudo ln -s /var/lib/flatpak/exports/bin/ org.torproject.torbrowser-launcher /usr/bin/tor-browser
sudo ln -s /var/lib/flatpak/exports/bin/net.werwolv.ImHex /usr/bin/imhex

# tools
mkdir workflow/tools
curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim.appimage
chmod u+x nvim.appimage
mv nvim.appimage workflow/tools
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh
wget https://github.com/PowerShell/PowerShell/releases/download/v7.4.3/powershell_7.4.3-1.deb_amd64.deb
sudo dpkg -i powershell_7.4.3-1.deb_amd64.deb
rm -rf powershell_7.4.3-1.deb_amd64.deb
sudo ln -s /bin/pwsh /bin/powershell

# hacking
bash -c "$(wget https://gef.blah.cat/sh -O -)"
pip3 install -U --user shodan
sudo adduser $USER wireshark
sudo chmod +x /usr/bin/dumpcap
pip3 install pwntools 
xonsh -c "xpip install -U 'xonsh[full]'"
xonsh -c "xpip install xontrib-vox"

# qemu virtualization
sudo apt install qemu-kvm qemu-system qemu-utils python3 python3-pip libvirt-clients libvirt-daemon-system bridge-utils virtinst libvirt-daemon virt-manager -y
sudo virsh net-start default
sudo virsh net-autostart default
sudo usermod -aG libvirt $USER
sudo usermod -aG libvirt-qemu $USER
sudo usermod -aG kvm $USER
sudo usermod -aG input $USER
sudo usermod -aG disk $USER

# dotfiles
cd $HOME
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
git clone https://github.com/PrettyBoyCosmo/dotfiles
mv dotfiles .dotfiles
cd .dotfiles
stow . --adopt
cd $HOME

# NOTE: uncomment later
# tailscale
# curl -fsSL https://tailscale.com/install.sh | sh
# sudo tailscale up

# clean up
rm -rf mint-install.sh keyring.deb 
