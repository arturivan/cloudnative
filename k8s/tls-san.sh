#add your Tailscale IP (100.127.34.10) to the Subject Alternative Names (SANs) for your RKE2 Kubernetes cluster's API server, you'll need to modify the configuration of the RKE2 server. 
#SANs are used in the TLS certificate of the Kubernetes API server to allow secure connections using additional IPs or hostnames.
sudo nano /etc/rancher/rke2/config.yaml

#modify
tls-san:
  - "Tailscale IP"
  - "your-existing-hostname"

#After updating the configuration, restart the RKE2 server to regenerate the API server certificate with the new SANs.
sudo systemctl restart rke2-server


