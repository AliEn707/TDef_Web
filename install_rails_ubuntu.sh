echo "GRUB_RECORDFAIL_TIMEOUT=2" | sudo tee -a /etc/default/grub && sudo update-grub

sudo rm /var/lib/apt/lists/* -vf 
sudo apt-get clean 
sudo apt-get autoremove 
sudo apt-get update
sudo apt-get upgrade && sudo apt-get install curl htop screen gcc g++ git-core phoronix-test-suite nodejs libgd2-xpm-dev postgresql-client autossh build-essential && gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 && \curl -L https://get.rvm.io | bash -s stable && source ~/.rvm/scripts/rvm && rvm requirements && rvm install ruby && rvm use ruby --default && rvm rubygems current && gem install bundler && rvm cleanup all && bundle config --global --jobs 6

phoronix-test-suite detailed-system-info
phoronix-test-suite detailed-system-info > ~/sysinfo.txt
phoronix-test-suite benchmark ebizzy
#phoronix-test-suite benchmark stockfish

