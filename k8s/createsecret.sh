kubectl create secret docker-registry acr-secret \
  --docker-server=<YOUR.azurecr.io> \
  --docker-username=<YOUR_ACR_USERNAME> \
  --docker-password=<YOUR_ACR_PASSWORD> \
  --namespace=<NAMESPACE>
