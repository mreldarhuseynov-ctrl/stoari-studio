#!/bin/zsh
cd -- "$(dirname -- "$0")" || exit 1
python3 configure-smtp.py
printf '\nPremi Invio per chiudere questa finestra.'
read -r
