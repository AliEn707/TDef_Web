set -e #magic
echo "GRUB_RECORDFAIL_TIMEOUT=2" | sudo tee -a /etc/default/grub && sudo update-grub

sudo rm /var/lib/apt/lists/* -vf 
sudo apt-get clean 
sudo apt-get autoremove 
sudo apt-get update

sudo apt-get install python-software-properties
sudo add-apt-repository ppa:chris-lea/node.js
sudo add-apt-repository ppa:git-core/ppa
sudo apt-get update

sudo apt-get upgrade && sudo apt-get install curl htop screen gcc g++ git-core phoronix-test-suite nodejs libgd2-xpm-dev postgresql-client autossh build-essential sudo libpq-dev

touch ~/.rvmrc
echo -e "export rvm_max_time_flag=20\nCFLAGS=\"-march=native -O3 -ffast-math -pipe -fomit-frame-pointer\"\nrvm_configure_env=(CFLAGS=\"-march=native -O3 -ffast-math -pipe -fomit-frame-pointer\")" >> ~/.rvmrc
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 && \curl -L https://get.rvm.io | bash -s stable && source ~/.rvm/scripts/rvm && rvm requirements && rvm install ruby --patch railsexpress -n railsexpress && rvm use ruby-railsexpress --default && rvm cleanup all 

gem install bundler && bundle config --global --jobs 6
bundle install --path .bundle
#git clone http://github.com/AliEn707/TDef_Web.git

#cd /home/osuser/TDef_Web
sudo cp rails_server /usr/bin/
sudo chmod 755 /usr/bin/rails_server

scp osuser@master.wsstudio.tk:/home/osuser/TDef_Web/config/initializers/secret_key.rb config/initializers/

phoronix-test-suite detailed-system-info
phoronix-test-suite detailed-system-info > ~/sysinfo.txt
#phoronix-test-suite benchmark ebizzy
#phoronix-test-suite benchmark stockfish

#sudo hostname ubuntu-alcatel
#sudo nano /etc/hosts