# HELIX-GR/Lab Hubs
How to deploy Jupyterhub for helix-lab

### Requirements

 You will need a VM with access to the helix-lab nfs.
  - Python3 > 3.5
  - Docker



### Steps

1.Installing Python3 (dependency of jupyterhub is on python3)

    $ sudo apt-get -y install python3-pip

2.Install nodejs/npm

    $ sudo apt-get -y install npm nodejs-legacy

3.Install proxy with npm

    $ npm install -g configurable-http-proxy

4.Install Jupyterhub

    $ pip3 install jupyterhub

5.Create Jupyterhub configuration file

    $ jupyterhub --generate-config

We will use Google OAuthentication as our Authenticator.
6.Install OAuthenticator and spawner:

    $ pip3 install oauthenticator
    $ pip3 install dockerspawner

7.Now Edit `jupyterhub_config.py`
  Dont forget to:
  - Setup Google OAuth2
  - Download the selected docker image
  - White-list an admin user
  - (Optional) Initiate the skeleton (Skel) file that is copied for new users
  - (Optional) Setup ssl keys

8.Get Jupyterhub api key for admin

    $ jupyterhub token *admin*

9.Now starting jupyterhub with above configuration

    $ jupyterhub

Go to https://your_ip_address:8000


10.Register Jupyterhub to Helix-Lab admin panel.

Enjoy start server and enjoy Jupyter Notebook.
