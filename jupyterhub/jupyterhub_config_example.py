import subprocess
import os
import errno
import stat

c = get_config()
pwd = os.path.dirname(__file__)


#c.JupyterHub.ssl_key = pwd+'/keys/server.key'
#c.JupyterHub.ssl_cert = pwd+'/keys/server.crt'

c.Authenticator.whitelist = {'george'}
c.Authenticator.admin_users = {'george'}

c.JupyterHub.allow_named_servers = True
c.LocalAuthenticator.create_system_users = False
c.Authenticator.delete_invalid_users = True


from oauthenticator.google import GoogleOAuthenticator
c.JupyterHub.authenticator_class = GoogleOAuthenticator

c.GoogleOAuthenticator.client_id = ###########
c.GoogleOAuthenticator.client_secret = ########





from jupyter_client.localinterfaces import public_ips
print(public_ips())
first_ip = public_ips()[0]
c.JupyterHub.hub_ip = first_ip
c.DockerSpawner.hub_ip_connect = first_ip


from dockerspawner import DockerSpawner



root_dir = '/tmp/helix-lab/users' #os.path.dirname() The path of NFS
skeleton_home_dir = os.path.join(root_dir, 'skel')
import shutil

# uid, gid of docker user
uid = 1000
gid = 1000

c.DockerSpawner.remove_containers = True
class LocalDockerSpawner(DockerSpawner):
    def start(self):
        work_dir = os.path.join(root_dir, 'data', self.user.name)
        if not os.path.exists(work_dir):
            shutil.copytree(skeleton_home_dir, work_dir)
            os.chown(work_dir, uid, gid)
        return super().start()

c.JupyterHub.spawner_class = LocalDockerSpawner

# Chose the image. Must be already installed
#c.DockerSpawner.image = 'jupyterhub/singleuser'
c.LocalDockerSpawner.image = 'jupyter/minimal-notebook'

c.DockerSpawner.volumes = {
    os.path.join(root_dir, 'data/{username}'): '/home/jovyan',
}

c.Spawner.default_url = '/lab'


# Limits

c.Spawner.cpu_guarantee = 0.5
c.Spawner.cpu_limit = 1

c.Spawner.mem_guarantee = "512 M"
c.Spawner.mem_limit = "1 G"
c.Spawner.http_timeout = 60


# Other configs

c.JupyterHub.logo_file = 'Lab-logo.svg'


