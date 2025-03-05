kubectl create secret generic azure-storage-secrets \
  --from-literal=connection-string="your-connection-string" \
  --namespace=spark-operator
