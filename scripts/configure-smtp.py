#!/usr/bin/env python3
"""Owner-run setup: authenticate the existing mailbox and store its secret privately."""
import getpass
import json
import smtplib
import ssl
import subprocess
import sys

print("STOARI — collegamento sicuro della casella info@stoari.com")
print("Inserisci la password ESISTENTE della casella email, non quella di Hostinger.")
print("La password resta nascosta e non viene salvata sul Mac o nel repository.")
password = getpass.getpass("Password email: ")
if not password:
    sys.exit("Nessuna modifica: password vuota.")
try:
    with smtplib.SMTP_SSL("smtp.hostinger.com", 465, context=ssl.create_default_context(), timeout=15) as smtp:
        smtp.login("info@stoari.com", password)
except (smtplib.SMTPException, OSError):
    sys.exit("Accesso non riuscito. Nessuna modifica. Verifica la password della casella e riprova.")

# Secret travels only over the existing SSH connection's stdin, never command arguments.
config = json.dumps({"username": "info@stoari.com", "password": password})
remote = r'''$raw=stream_get_contents(STDIN); $data=json_decode($raw,true,512,JSON_THROW_ON_ERROR);
if (($data["username"]??"")!=="info@stoari.com" || !is_string($data["password"]??null) || $data["password"]==="") exit(2);
$dir=getenv("HOME")."/domains/stoari.com/private";
umask(0077); if (!is_dir($dir) && !mkdir($dir,0700,true)) exit(3);
$tmp=tempnam($dir,"smtp-"); if ($tmp===false) exit(4);
if (file_put_contents($tmp,$raw,LOCK_EX)!==strlen($raw)) {unlink($tmp);exit(5);}
chmod($tmp,0600); if (!rename($tmp,$dir."/smtp.json")) {unlink($tmp);exit(6);}
echo "Configurazione privata salvata.\n";'''
import shlex
result = subprocess.run([
    "ssh", "-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=yes", "-p", "65002",
    "u167132688@82.25.102.111", "php -r " + shlex.quote(remote),
], input=config, text=True, capture_output=True)
del password, config
if result.returncode:
    sys.exit("Accesso email verificato, ma salvataggio SSH non riuscito. Nessuna password mostrata.")
print("OK: accesso SMTP verificato e credenziale salvata fuori dalla cartella pubblica.")
print("Puoi tornare in Codex: ora completiamo il test di consegna.")
