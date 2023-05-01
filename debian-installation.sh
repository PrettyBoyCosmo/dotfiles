# debian installer
# created by : cosmo

# system updates
sudo apt update && sudo apt upgrade && sudo apt autoremove
 
# tailscale
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# packages
sudo apt-get install neofetch terminator spotify-client vlc neovim i3 flameshot xonsh git feh lxappearance go-md2man i3blocks mate-media gcc-mingw-w64-x86-64 htop wireshark brightnessctl

# flatpaks
flatpak install flathub md.obsidian.Obsidian com.brave.Browser com.obsproject.Studio org.kde.kdenlive com.discordapp.Discord de.shorsh.discord-screenaudio com.visualstudio.code org.gimp.GIMP im.riot.Riot com.obsproject.Studio.Plugin.waveform

# add flatpaks to dmenu
sudo ln -s /var/lib/flatpak/exports/bin/com.brave.Browser /usr/bin/brave
sudo ln -s /var/lib/flatpak/exports/bin/com.discordapp.Discord /usr/bin/discord
sudo ln -s /var/lib/flatpak/exports/bin/md.obsidian.Obsidian /usr/bin/obsidian
sudo ln -s /var/lib/flatpak/exports/bin/com.obsproject.Studio /usr/bin/obs
sudo ln -s /var/lib/flatpak/exports/bin/org.kde.kdenlive /usr/bin/kdenlive
sudo ln -s /var/lib/flatpak/exports/bin/org.gimp.GIMP /usr/bin/gimp
sudo ln -s /var/lib/flatpak/exports/bin/im.riot.Riot /usr/bin/element
sudo ln -s /var/lib/flatpak/exports/bin/de.shorsh.discord-screenaudio /usr/bin/discord-screenaudio
sudo ln -s /var/lib/flatpak/exports/bin/com.visualstudio.code /usr/bin/code

# powershell
wget https://github.com/PowerShell/PowerShell/releases/download/v7.3.3/powershell_7.3.3-1.deb_amd64.deb
sudo dpkg -i powershell_7.3.3-1.deb_amd64.deb
rm -rf powershell_7.3.3-1.deb_amd64.deb
sudo ln -s /bin/pwsh /bin/powershell

# shodan
pip install -U --user shodan
sudo adduser $USER wireshark
sudo chmod +x /usr/bin/dumpcap

# neovim pluginstall
sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
       https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'

# qemu virtualization
sudo apt install qemu-kvm qemu-system qemu-utils python3 python3-pip libvirt-clients libvirt-daemon-system bridge-utils virtinst libvirt-daemon virt-manager -y
sudo virsh net-start default
sudo virsh net-autostart default
sudo usermod -aG libvirt $USER
sudo usermod -aG libvirt-qemu $USER
sudo usermod -aG kvm $USER
sudo usermod -aG input $USER
sudo usermod -aG disk $USER