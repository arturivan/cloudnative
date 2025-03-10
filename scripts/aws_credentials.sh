kubectl create secret generic aws-credentials \
  --from-literal=aws_access_key=YOUR_AWS_ACCESS_KEY \
  --from-literal=aws_secret_key=YOUR_AWS_SECRET_KEY \
  --from-literal=s3_bucket=YOUR_S3_BUCKET

