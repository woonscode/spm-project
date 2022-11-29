variable "role_managed_policies" {
  description = "List of policies to be attached to EC2 instances"
  type = list
  default = [
              "arn:aws:iam::aws:policy/AmazonRDSFullAccess", 
            ]
}

variable "rds_name" {
  description = "Name of RDS instance"
  type = string
  default = "ljps-db"
}

variable "db_subnet_group_name" {
  description = "Name of RDS subnet group"
  type = string
  default = "ljps-db-subnet-group"
}

variable "app_sg_name" {
  description = "Name of LJPS security group for API app"
  type = string
  default = "ljps-app-sg"
}

variable "rds_sg_name" {
  description = "Name of LJPS security group for RDS"
  type = string
  default = "ljps-rds-sg"
}

variable "staging_instance_name" {
  description = "Name of staging EC2 instance"
  type = string
  default = "ljps-staging"
}

variable "DB_USERNAME" {
  description = "Username of AWS RDS DB Instance"
  type = string
}

variable "DB_PASSWORD" {
  description = "Password of AWS RDS DB Instance"
  type = string
}

variable "DB_PORT" {
  description = "Port of AWS RDS DB Instance"
  type = string
}