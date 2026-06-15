#!/bin/bash
set -e

if [ -z "$SSH_KEY" ]; then
  echo "SSH_KEY env not set, skipping submodule setup"
  exit 0
fi

mkdir -p ~/.ssh
echo "$SSH_KEY" > ~/.ssh/deploy_key
chmod 600 ~/.ssh/deploy_key

cat > ~/.ssh/config << 'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/deploy_key
  StrictHostKeyChecking no
  IdentitiesOnly yes
EOF

chmod 600 ~/.ssh/config

# Add github.com to known_hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null

echo "Fetching private submodule..."
git submodule update --init --recursive
echo "Submodule ready."
