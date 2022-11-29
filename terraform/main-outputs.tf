output "rds_hostname" {
  description = "RDS instance hostname"
  value       = aws_db_instance.main.address
  sensitive   = true
}

output "instance_url" {
  description = "URL of EC2 instance"
  value       = aws_instance.staging.public_dns
  sensitive   = true
}