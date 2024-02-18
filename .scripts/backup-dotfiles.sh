#!/bin/bash
# back up dot files
# created by : cosmo

cp -r /home/$USER/.config/i3 /home/$USER/workflow/dotfiles/
cp -r /home/$USER/.config/terminator /home/$USER/workflow/dotfiles
cp -r /home/$USER/.config/nvim /home/$USER/workflow/dotfiles
cp -r /home/$USER/.xonshrc /home/$USER/workflow/dotfiles
cp -r /home/$USER/.bash_aliases /home/$USER/workflow/dotfiles
cp -r /home/$USER/.bashrc /home/$USER/workflow/dotfiles

