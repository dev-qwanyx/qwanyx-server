# OVH Server Mail Configuration

This folder is for managing the OVH mail server via VS Code Remote-SSH.

## Connection Details

- **Server**: OVH Mail Server
- **Purpose**: Configure DKIM, SPF, DMARC for email delivery
- **IP**: 51.38.230.64
- **User**: root (or your username)
- **Port**: 22

## How to Connect

1. Open this folder in VS Code
2. Press `Ctrl+Shift+P`
3. Type: `Remote-SSH: Connect to Host`
4. Enter: `username@your-server-ip`
5. Enter password (careful - only 2 attempts!)

## Tasks

- [ ] Check mail server type (Postfix/Exim/etc)
- [ ] Configure DKIM
- [ ] Set up SPF records
- [ ] Configure DMARC
- [ ] Test email delivery

## Important Notes

- **Only 2 login attempts** before IP is blocked
- Make sure password is correct before attempting
- Use SSH keys if possible to avoid password issues