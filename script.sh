sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update
sudo apt-get install -y openjdk-8-jdk jenkins
sudo systemctl start jenkins
while $(sleep 1); do
  echo "waiting jenkins to start..."
  if systemctl is-active --quiet jenkins; then
    echo "running"
    break
  fi
done

echo "more waiting..."
sleep 60

sudo sed -i '/JAVA_ARGS=\"-Djava.awt.headless=true\"/c\JAVA_ARGS=\"-Djava.awt.headless=true-Djenkins.install.runSetupWizard=false\"' /etc/default/jenkins
sudo mkdir /var/lib/jenkins/init.groovy.d
sudo chmod -R 777 /var/lib/jenkins/init.groovy.d
sudo echo -e '#!groovy\nimport jenkins.model.*\nimport hudson.util.*;\nimport jenkins.install.*;\nimport hudson.security.*\ndef instance = Jenkins.getInstance()\ndef hudsonRealm = new HudsonPrivateSecurityRealm(false)\nhudsonRealm.createAccount("admin","admin123")\ninstance.setSecurityRealm(hudsonRealm)\ninstance.setInstallState(InstallState.INITIAL_SETUP_COMPLETED)\ninstance.save()' > /var/lib/jenkins/init.groovy.d/basic-security.groovy
sudo systemctl restart jenkins
while $(sleep 1); do
  echo "waiting jenkins to restart..."
  if systemctl is-active --quiet jenkins; then
    echo "running"
    break
  fi
done

echo "more waiting..."
sleep 60

sudo echo "downloading"
sudo wget -P /home http://127.0.0.1:8080/jnlpJars/jenkins-cli.jar
sudo java -jar /home/jenkins-cli.jar -s http://localhost:8080/ -auth admin:admin123 install-plugin configuration-as-code job-dsl git blueocean -deploy
sudo wget -P /var/lib/jenkins/ https://raw.githubusercontent.com/nistalhelmuth/all-as-code/master/jenkins.yaml
sudo sed -i '/JAVA_ARGS=\"-Djava.awt.headless=true\"/c\JAVA_ARGS=\"-Djava.awt.headless=true-Djenkins.install.runSetupWizard=false\"' /etc/default/jenkins
sudo sed -i "s/HERE/$1/g" /var/lib/jenkins/jenkins.yaml
sudo usermod -a -G docker jenkins
sudo systemctl restart jenkins
sudo echo 'DONE!'
