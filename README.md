
# Google Cloud / Jenkins / Docker - All As Code

Every tool has its own complexity to use but it get worse when many tools are related. This project implements some services to help developers to publish their development in seconds in a Google Cloud infrastructure. Aditionally this infraestructure uses Jenkins as a CI/CD tool for pipeline automatization.

This project was developed under many principles of DevOps as the ones described on: https://www.amazon.com/DevOps-Handbook-World-Class-Reliability-Organizations/dp/1942788002

To help the understood of DevOps I implemented some aditionall tools:

* React: UI/UX
* Node: Google Cloud Api services (https://googleapis.dev/nodejs/compute/latest/index.html)
* Docker: To create the enviroment for the developments
* Bash scripts: To manage all de installation and configuration of the other tools
* Git: becouse it provide easy acces for some steps of this proyect


![Arquitectura](https://github.com/nistalhelmuth/all-as-code/blob/master/Arquitectura.png "Architecture")

![Flujo](https://github.com/nistalhelmuth/all-as-code/blob/master/Flujo.png "Flujo")


# Live demo

A working demo can be found here: [http://selfservicedesk.appspot.com/](http://selfservicedesk.appspot.com/)

# 1. Create a Google Cloud Service Account

1. Create a Google Account
2. Go to Service Accounts under IAM & Admin
3. Asign Compute Admin permission to service account
4. Download de .json key

More info at: https://cloud.google.com/iam/docs/creating-managing-service-accounts


# 2. Setup Local Environment

## 1. Get a Node.js environment

1. `apt-get install nodejs -y`

2. `apt-get npm`

## 2. Clone Repo and set credentials

3. `git clone https://github.com/nistalhelmuth/all-as-code`

4. Set the PROJECT_ID enviroment variable: export PROJECT_KEY=[.../dir/YourGoogleKey.json]

## 3. Dependencies Installation
### 3.1 Node Dependencies


### 3.2 React Dependencies 



This is not an official Google product.
