helm install spark-operator spark-operator/spark-operator \
    --namespace spark-operator --create-namespace --wait \
    -f custom-values.yaml
